from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from transformers import pipeline
import os
import uuid

app = Flask(__name__)

# Allow React frontend to communicate with Flask backend
CORS(app)

# ==============================
# CONFIGURATION
# ==============================

UPLOAD_FOLDER = "uploads"

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

# ==============================
# LOAD AI DETECTION MODEL
# ==============================

MODEL_NAME = "Modotte/AIRealNet"

print("Loading AI detection model...")

detector = pipeline(
    "image-classification",
    model=MODEL_NAME
)

print("AI detection model loaded successfully!")


# ==============================
# HELPER FUNCTION
# ==============================

def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


# ==============================
# HOME API
# ==============================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "DeepFake Detection API is running successfully!",
        "model": MODEL_NAME
    })


# ==============================
# PREDICT API
# ==============================

@app.route("/predict", methods=["POST"])
def predict():

    # Check whether image exists
    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "No image file was provided."
        }), 400

    file = request.files["image"]

    # Check whether a file was selected
    if file.filename == "":
        return jsonify({
            "success": False,
            "message": "No image was selected."
        }), 400

    # Check allowed extension
    if not allowed_file(file.filename):
        return jsonify({
            "success": False,
            "message": "Please upload PNG, JPG, JPEG, or WEBP images only."
        }), 400

    file_path = None

    try:
        # Create a unique filename
        file_extension = file.filename.rsplit(".", 1)[1].lower()

        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        file_path = os.path.join(
            app.config["UPLOAD_FOLDER"],
            unique_filename
        )

        # Save image temporarily
        file.save(file_path)

        # Open image
        image = Image.open(file_path).convert("RGB")

        # ==============================
        # RUN AI MODEL
        # ==============================

        predictions = detector(image)

        print("\n===================================")
        print("MODEL PREDICTIONS:")
        print(predictions)
        print("===================================\n")

        ai_probability = 0.0
        real_probability = 0.0

        # Read prediction labels
        for item in predictions:

            model_label = item["label"].lower().strip()
            score = float(item["score"]) * 100

            # AIRealNet labels
            if model_label == "artificial":
                ai_probability = score

            elif model_label == "real":
                real_probability = score

        # ==============================
        # FINAL DECISION
        # ==============================

        AI_THRESHOLD = 70.0
        REAL_THRESHOLD = 70.0

        if ai_probability >= AI_THRESHOLD:

            prediction = "AI Generated Image"
            label = "AI_GENERATED"
            confidence = ai_probability

            message = (
                "This image is likely AI-generated. "
                "The AI detector found strong artificial-image signals."
            )

        elif real_probability >= REAL_THRESHOLD:

            prediction = "Likely Real Image"
            label = "LIKELY_REAL"
            confidence = real_probability

            message = (
                "This image is likely a real photograph based on the "
                "AI detection model."
            )

        else:

            prediction = "Uncertain"
            label = "UNCERTAIN"
            confidence = max(ai_probability, real_probability)

            message = (
                "The detector could not confidently determine whether "
                "this image is AI-generated or real."
            )

        # ==============================
        # SEND RESULT TO REACT
        # ==============================

        return jsonify({
            "success": True,
            "prediction": prediction,
            "label": label,
            "confidence": round(confidence, 2),
            "ai_probability": round(ai_probability, 2),
            "real_probability": round(real_probability, 2),
            "message": message
        }), 200

    except Exception as error:

        print("\nERROR:", str(error), "\n")

        return jsonify({
            "success": False,
            "message": f"Error analyzing image: {str(error)}"
        }), 500

    finally:

        # Delete uploaded image after analysis
        if file_path and os.path.exists(file_path):
            os.remove(file_path)


# ==============================
# START FLASK SERVER
# ==============================

if __name__ == "__main__":
    app.run(debug=True, port=5000)
import { useState } from "react";

function ImageUpload({ setResult }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        // Validate image
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        // Optional size validation: 10 MB
        if (file.size > 10 * 1024 * 1024) {
            alert("Image size must be less than 10 MB.");
            return;
        }

        setSelectedImage(file);
        setPreview(URL.createObjectURL(file));

        // Clear old result
        setResult(null);
    };

    const handleAnalyze = async () => {
        if (!selectedImage) {
            alert("Please upload an image first.");
            return;
        }

        setLoading(true);

        // Display loading result
        setResult({
            loading: true
        });

        try {
            const formData = new FormData();

            // Must match Flask: request.files["image"]
            formData.append("image", selectedImage);

            const response = await fetch(
                "http://127.0.0.1:5000/predict",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to analyze the image."
                );
            }

            // Send backend result to App
            setResult(data);

        } catch (error) {

            console.error("Analysis error:", error);

            setResult({
                success: false,
                message:
                    error.message ||
                    "Unable to connect to the Flask backend."
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="upload-section" id="detector">
            <div className="upload-card">

                <h2>Upload an Image</h2>

                <p className="upload-description">
                    Upload a JPG, JPEG, PNG, or WEBP image for analysis.
                </p>

                {!preview ? (

                    <label className="upload-box">

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleImageChange}
                            hidden
                        />

                        <div className="upload-icon">↑</div>

                        <h3>Choose an Image</h3>

                        <p>
                            Click here to browse and upload your image
                        </p>

                        <span>
                            PNG • JPG • JPEG • WEBP
                        </span>

                    </label>

                ) : (

                    <div className="preview-container">

                        <img
                            src={preview}
                            alt="Uploaded preview"
                            className="image-preview"
                        />

                        <label className="change-image-btn">

                            Change Image

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                onChange={handleImageChange}
                                hidden
                            />

                        </label>

                    </div>

                )}

                <button
                    className="analyze-btn"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? "Analyzing Image..." : "Analyze Image"}
                </button>

            </div>
        </section>
    );
}

export default ImageUpload;
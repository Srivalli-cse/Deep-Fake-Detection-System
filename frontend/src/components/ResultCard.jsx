function ResultCard({ result }) {

    // =========================
    // NO RESULT
    // =========================

    if (!result) {
        return (
            <section className="result-section">
                <div className="result-card">

                    <div className="result-icon">🔍</div>

                    <h2>Analysis Result</h2>

                    <p className="waiting-text">
                        Upload an image and click "Analyze Image"
                        to get the detection result.
                    </p>

                    <div className="result-info">

                        <div className="result-row">
                            <span>Prediction</span>
                            <strong>Waiting for Image</strong>
                        </div>

                        <div className="result-row">
                            <span>Confidence</span>
                            <strong>-- %</strong>
                        </div>

                    </div>
                </div>
            </section>
        );
    }

    // =========================
    // LOADING
    // =========================

    if (result.loading) {
        return (
            <section className="result-section">
                <div className="result-card">

                    <div className="result-icon">⏳</div>

                    <h2>Analyzing Image...</h2>

                    <p className="waiting-text">
                        Please wait while the AI model scans the image.
                    </p>

                </div>
            </section>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (!result.success) {
        return (
            <section className="result-section">
                <div className="result-card error-card">

                    <div className="result-icon">❌</div>

                    <h2>Analysis Failed</h2>

                    <p className="waiting-text">
                        {result.message}
                    </p>

                </div>
            </section>
        );
    }

    // =========================
    // SUCCESS RESULT
    // =========================

    let resultIcon = "🔍";

    if (result.label === "AI_GENERATED") {
        resultIcon = "🤖";
    }

    if (result.label === "LIKELY_REAL") {
        resultIcon = "📷";
    }

    if (result.label === "UNCERTAIN") {
        resultIcon = "⚠️";
    }

    return (
        <section className="result-section">
            <div className="result-card">

                <div className="result-icon">
                    {resultIcon}
                </div>

                <h2>Analysis Result</h2>

                <p className="waiting-text">
                    {result.message}
                </p>

                <div className="result-info">

                    <div className="result-row">
                        <span>Prediction</span>
                        <strong>{result.prediction}</strong>
                    </div>

                    <div className="result-row">
                        <span>Status</span>
                        <strong>{result.label}</strong>
                    </div>

                    <div className="result-row">
                        <span>Confidence</span>
                        <strong>{result.confidence}%</strong>
                    </div>

                    <div className="result-row">
                        <span>AI Generated Probability</span>
                        <strong>{result.ai_probability}%</strong>
                    </div>

                    <div className="result-row">
                        <span>Real Image Probability</span>
                        <strong>{result.real_probability}%</strong>
                    </div>

                </div>

            </div>
        </section>
    );
}

export default ResultCard;
import { useState } from "react";
import Header from "./components/Header";
import ImageUpload from "./components/ImageUpload";
import ResultCard from "./components/ResultCard";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="app">
      <Header />

      <main className="main-container">
        <section className="hero-section" id="home">
          <h1>
            Detect <span>AI Generated</span> Images
          </h1>

          <p>
            Upload an image and our AI detection system will analyze whether
            the image is likely AI-generated or a real photograph.
          </p>
        </section>

        <ImageUpload setResult={setResult} />

        <ResultCard result={result} />
      </main>

      <footer>
        <p>© 2026 DeepFake Detection System | AI Image Analysis</p>
      </footer>
    </div>
  );
}

export default App;
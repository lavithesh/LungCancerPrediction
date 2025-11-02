import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ onLogout }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Sync with localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handlePredictClick = () => {
    if (isLoggedIn) {
      navigate("/predict");
    } else {
      alert("⚠️ Please log in first to use the prediction feature.");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    if (onLogout) onLogout();
    alert("You have been logged out.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center shadow">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 8H9L12 2Z" fill="currentColor" />
              <path d="M4 22H20V20C20 16 16 14 12 14C8 14 4 16 4 20V22Z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Ensemble Lung AI</h1>
            <p className="text-sm text-slate-500">
              Ensemble-based lung X-ray classification — Xception · ResNet · VGG
            </p>
          </div>
        </div>

        <nav className="flex gap-3">
          <button
            onClick={handlePredictClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          >
            Start Prediction
          </button>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="border border-slate-200 px-4 py-2 rounded-md text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="border border-slate-200 px-4 py-2 rounded-md text-slate-700 hover:bg-slate-100"
            >
              Login
            </button>
          )}
        </nav>
      </header>

      {/* ✅ Content */}
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-slate-800">
            Early detection with ensemble deep learning
          </h2>
          <p className="text-lg text-slate-600">
            This project uses an ensemble of deep-learning models to classify chest X-rays into:
            <span className="font-medium text-slate-800">
              {" "}Adenocarcinoma, Squamous, Large Cell, Normal.
            </span>{" "}
            Early and accurate predictions help clinicians prioritize follow-ups.
          </p>

          <ul className="grid gap-3 mt-4">
            <li className="flex items-start gap-3">
              <span className="w-3 h-3 bg-blue-600 rounded-full mt-2" />
              <div>
                <div className="font-semibold text-slate-800">Ensemble models</div>
                <div className="text-sm text-slate-600">
                  Combines strengths of multiple architectures for robust predictions.
                </div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="w-3 h-3 bg-emerald-500 rounded-full mt-2" />
              <div>
                <div className="font-semibold text-slate-800">Designed for reliability</div>
                <div className="text-sm text-slate-600">
                  Calibrated outputs and clear UI for quick interpretation.
                </div>
              </div>
            </li>
          </ul>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handlePredictClick}
              className="bg-blue-600 text-white px-5 py-3 rounded-md shadow hover:scale-[1.01] transition"
            >
              Upload X-ray
            </button>
            <button
              onClick={() => navigate("/result")}
              className="px-5 py-3 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              View Last Result
            </button>
          </div>
        </section>

        <aside className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-slate-800 mb-3">How it works</h3>
          <ol className="list-decimal ml-5 text-slate-600 space-y-2">
            <li>Upload a chest X-ray (PNG/JPG/DICOM converted).</li>
            <li>Server runs pre-processing + ensemble inference.</li>
            <li>Receive predicted class and confidence scores.</li>
          </ol>

          <div className="mt-6">
            <h4 className="text-sm text-slate-500">Tip</h4>
            <p className="text-sm text-slate-600">Use high-quality frontal X-rays for best accuracy.</p>
          </div>
        </aside>
      </main>

      <footer className="max-w-6xl mx-auto p-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Ensemble Lung AI — For educational / portfolio use only.
      </footer>
    </div>
  );
}

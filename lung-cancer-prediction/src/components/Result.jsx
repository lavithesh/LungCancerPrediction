import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state?.data;
  const uploadedPreview = location.state?.uploadedPreview;

  const label = data?.label || "N/A";
  const confidence = data?.confidence || "N/A";

  const [aiResponse, setAiResponse] = useState("Analyzing your result...");
  const [loading, setLoading] = useState(true);

  // Metrics state
  const [metrics, setMetrics] = useState({
    label: "N/A",
    confidence: 0,
    accuracy: 0,
    roc_auc: 0,
    features: {},
    tumor_segmentation: {},
  });

  useEffect(() => {
    async function getAIResponse() {
      if (!label || label === "N/A") {
        setAiResponse("No valid prediction available to analyze.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label, confidence }),
        });
        const data = await res.json();
        setAiResponse(data.message || "⚠️ Unable to generate AI explanation.");
      } catch (error) {
        console.error("AI fetch error:", error);
        setAiResponse("⚠️ Unable to connect to AI service.");
      } finally {
        setLoading(false);
      }
    }

    async function fetchMetrics() {
      try {
        const res = await fetch("http://localhost:5000/metrics");
        const data = await res.json();
        setMetrics(data);
      } catch (error) {
        console.error("Metrics fetch error:", error);
      }
    }

    getAIResponse();
    fetchMetrics();
  }, [label, confidence]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex justify-center items-start py-10 px-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-8 grid lg:grid-cols-2 gap-8">
        
        {/* LEFT PANEL */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Prediction Result
          </h2>

          {/* Image Preview */}
          <div className="w-full flex justify-center mb-4">
            {uploadedPreview ? (
              <img
                src={uploadedPreview}
                alt="Uploaded X-ray"
                className="w-72 h-72 object-contain rounded-xl border border-gray-200 shadow-md"
              />
            ) : (
              <div className="w-72 h-72 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-xl">
                No Image Available
              </div>
            )}
          </div>

          {/* Prediction Summary */}
          <div className="bg-gray-50 w-full p-5 rounded-lg border border-gray-100 text-center shadow-inner">
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Model:</span> Ensemble (Xception + ResNet + VGG)
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Confidence:</span> {metrics.confidence}
            </p>
            <p className="text-lg mt-3 font-semibold">
              Predicted Class:{" "}
              <span
                className={`${
                  (metrics.label || "").toLowerCase().includes("cancer")
                    ? "text-red-600"
                    : "text-green-600"
                } font-bold`}
              >
                {metrics.label}
              </span>
            </p>
          </div>

          {/* 📊 Metrics Table */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4 shadow-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
              📈 Model Metrics
            </h3>
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr>
                  <td className="py-2 px-3 font-medium">Accuracy</td>
                  <td className="py-2 px-3">{metrics.accuracy}%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">ROC-AUC</td>
                  <td className="py-2 px-3">{metrics.roc_auc}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 🧬 Feature Extraction */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
              🧬 Extracted Features
            </h3>
            <table className="w-full text-sm border-collapse">
              <tbody>
                {Object.entries(metrics.features || {}).map(([key, value]) => (
                  <tr key={key}>
                    <td className="py-2 px-3 font-medium">{key}</td>
                    <td className="py-2 px-3">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🧠 Tumor Segmentation Info */}
          {metrics.tumor_segmentation && (
            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4 w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                🧩 Tumor Segmentation
              </h3>
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr>
                    <td className="py-2 px-3 font-medium">Detected</td>
                    <td className="py-2 px-3">
                      {metrics.tumor_segmentation.detected ? "✅ Yes" : "❌ No"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Segmented Area</td>
                    <td className="py-2 px-3">
                      {metrics.tumor_segmentation.segmented_area}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Mask Resolution</td>
                    <td className="py-2 px-3">
                      {metrics.tumor_segmentation.mask_resolution}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              Back
            </button>
            <button
              onClick={() => navigate("/predict")}
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              New Prediction
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: AI Assistant */}
        <div className="bg-blue-50/60 rounded-xl p-6 border border-blue-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2 mb-3">
              🤖 AI Assistant
            </h3>
            {loading ? (
              <p className="text-gray-500 italic text-sm">🧠 Thinking...</p>
            ) : (
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {aiResponse}
              </p>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            ⚠️ AI-generated insights. Not a substitute for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}

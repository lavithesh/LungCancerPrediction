import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Predict() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle file upload and create preview
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("⚠️ Please upload an X-ray image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Check if response contains valid prediction data
      if (res.data && res.data.label) {
        // Navigate to Result.jsx with prediction and image preview
        navigate("/result", {
          state: {
            data: {
              label: res.data.label || "Unknown",
              confidence: res.data.confidence || "N/A",
              details: res.data.details || "",
              scores: res.data.scores || {},
            },
            uploadedPreview: preview, // pass preview to show image in result page
          },
        });
      } else {
        alert(res.data?.error || "Unexpected server response. Please try again.");
      }
    } catch (err) {
      console.error("Prediction error:", err);
      alert("🚫 Server error: " + (err?.message || "Unknown issue."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 flex items-start justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-slate-800">Upload Chest X-ray</h2>
        <p className="text-sm text-slate-600 mt-1">
          Supported formats: <span className="font-medium">PNG, JPG</span> (frontal X-ray recommended)
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
        >
          {/* File Upload Section */}
          <div className="col-span-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-slate-700">Select image</span>
              <input
                accept="image/*"
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-600 file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 rounded-md"
              />
            </label>

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Predicting…" : "Run Prediction"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="col-span-1">
            <div className="h-full bg-slate-50 rounded-md p-3 flex flex-col items-center justify-center border border-dashed border-slate-300 shadow-inner">
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="X-ray preview"
                    className="max-h-44 object-contain rounded-md"
                  />
                  <div className="mt-3 text-sm text-slate-600 font-medium">
                    Image Preview
                  </div>
                </>
              ) : (
                <div className="text-sm text-slate-400">No image selected</div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

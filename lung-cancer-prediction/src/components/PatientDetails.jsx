import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PatientDetails() {
  const { state } = useLocation();
  const userDetails = state?.userDetails;
  const navigate = useNavigate();

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">
          <h3 className="text-lg font-semibold text-slate-800">No Patient Data</h3>
          <p className="text-sm text-slate-600 mt-2">Upload an X-ray and run prediction to view details.</p>
          <button onClick={() => navigate("/predict")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Patient Details</h2>
          <span className="text-sm text-slate-500">{userDetails.date || "-"}</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Name</span>
            <span className="font-medium text-slate-800">{userDetails.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Age</span>
            <span className="font-medium text-slate-800">{userDetails.age}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Sex</span>
            <span className="font-medium text-slate-800">{userDetails.sex}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Notes</span>
            <span className="font-medium text-slate-800">{userDetails.notes || "-"}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-md border border-slate-200">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home.jsx";
import Predict from "./components/Predict.jsx";
import Result from "./components/Result.jsx";
import Login from "./components/Login.jsx";
import PatientDetails from "./components/PatientDetails.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Check authentication on first render
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="font-sans text-slate-800 bg-sky-50 min-h-screen">
        <Routes>
          {/* 🔐 Login Page */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />

          {/* 🏠 Home Page */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 🧠 Prediction Page */}
          <Route
            path="/predict"
            element={
              isAuthenticated ? <Predict /> : <Navigate to="/login" replace />
            }
          />

          {/* 📊 Result Page */}
          <Route
            path="/result"
            element={
              isAuthenticated ? <Result /> : <Navigate to="/login" replace />
            }
          />

          {/* 👤 Patient Details Page */}
          <Route
            path="/patient-details"
            element={
              isAuthenticated ? (
                <PatientDetails />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 🌐 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

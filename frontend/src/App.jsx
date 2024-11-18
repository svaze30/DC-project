import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import RegisterCandidate from "./RegisterCandidate";
import RegisterRecruiter from "./RegisterRecruiter";
import LoginCandidate from "./LoginCandidate";
import LoginRecruiter from "./LoginRecruiter";
import RecruiterDashboard from "./RecruiterDashboard";
import CandidateDashboard from "./CandidateDashboard";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="App"
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div style={{ flex: 1, textAlign: "center" }}>
        <img
          src="random.png"
          alt="Hiring"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Welcome to Job Portal</h1>
        <p
          style={{
            marginBottom: "20px",
            color: "#555",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          Our hiring management system helps recruiters and candidates connect
          seamlessly. Recruiters can post job openings, review applications, and
          manage hiring processes. Candidates can apply for jobs, track their
          applications, and manage their profiles.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            onClick={() => navigate("/login-candidate")}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              transition: "background-color 0.3s ease",
            }}
          >
            Candidate Login
          </button>
          <button
            onClick={() => navigate("/login-recruiter")}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              transition: "background-color 0.3s ease",
            }}
          >
            Recruiter Login
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-candidate" element={<LoginCandidate />} />
        <Route path="/login-recruiter" element={<LoginRecruiter />} />
        <Route path="/register-candidate" element={<RegisterCandidate />} />
        <Route path="/register-recruiter" element={<RegisterRecruiter />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

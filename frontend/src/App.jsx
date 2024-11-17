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
    <div className="App" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome to Job Portal</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <button
          onClick={() => navigate("/login-candidate")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
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
          }}
        >
          Recruiter Login
        </button>
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

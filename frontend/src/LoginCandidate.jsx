import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginCandidate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reset

    try {
      const response = await axios.post(
        "http://localhost:3000/login-candidate",
        formData
      );

      if (response.data.candidateId) {
        // Store candidateId in localStorage
        localStorage.setItem("candidateId", response.data.candidateId);

        // Navigate immediately without setTimeout
        navigate("/candidate-dashboard");
      } else {
        alert("Login failed - no candidate ID received");
      }
    } catch (error) {
      console.error("Error logging in candidate:", error);
      alert(error.response?.data || "Error logging in candidate");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            color: "#333",
            marginBottom: "30px",
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          Login as Candidate
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#555",
                fontSize: "14px",
              }}
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
                outline: "none",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#555",
                fontSize: "14px",
              }}
            >
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Login
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <button
            onClick={() => navigate("/login-recruiter")}
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
            Go to Recruiter Login
          </button>
          <button
            onClick={() => navigate("/register-candidate")}
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
            Register as Candidate
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginCandidate;

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
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/login-candidate",
        formData
      );
      if (response.status === 200) {
        const { candidateId } = response.data;

        localStorage.setItem("candidateId", candidateId);
        alert("Login successful!");
        setTimeout(() => {
          navigate("/candidate-dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Error logging in candidate:", error);
      alert("Error logging in candidate");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
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
          }}
        >
          Register as Candidate
        </button>
      </div>
    </div>
  );
};

export default LoginCandidate;

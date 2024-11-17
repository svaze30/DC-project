import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginRecruiter = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/login-recruiter",
        formData
      );

      if (response.data.recruiterId) {
        localStorage.setItem("recruiterId", response.data.recruiterId);
        console.log("recruiterId:", response.data.recruiterId);
        navigate("/recruiter-dashboard");
      } else {
        throw new Error("Recruiter data not found in response");
      }
    } catch (error) {
      console.error("Error logging in recruiter:", error);
      alert("Error logging in recruiter");
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
          onClick={() => navigate("/login-candidate")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Go to Candidate Login
        </button>
        <button
          onClick={() => navigate("/register-recruiter")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Register as Recruiter
        </button>
      </div>
    </div>
  );
};

export default LoginRecruiter;

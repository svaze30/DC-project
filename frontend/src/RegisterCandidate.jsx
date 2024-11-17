import React, { useState } from "react";
import axios from "axios";

const RegisterCandidate = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    resumeUrl: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/register-candidate",
        {
          ...formData,
          skills: formData.skills.split(",").map((skill) => skill.trim()),
        }
      );
      alert(response.data);
    } catch (error) {
      console.error("Error registering candidate:", error);
      alert("Error registering candidate");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
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
      <div>
        <label>Contact Number:</label>
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Resume URL:</label>
        <input
          type="text"
          name="resumeUrl"
          value={formData.resumeUrl}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Skills (comma separated):</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterCandidate;

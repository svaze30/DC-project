import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const recruiterId = localStorage.getItem("recruiterId");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/recruiter/${recruiterId}/jobs`
        );
        console.log("Jobs response:", response.data); // Log the response data
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (recruiterId) {
      fetchJobs();
    }
  }, [recruiterId]);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          color: "#333",
          marginBottom: "20px",
        }}
      >
        Recruiter Dashboard
      </h1>

      <h3>Your Posted Jobs:</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Title</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Description</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Location</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Employment Type</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{job.title}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{job.description}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{job.location}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{job.employmentType}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => {
          localStorage.removeItem("recruiterId");
          navigate("/");
        }}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#ff4444",
          color: "white",
          border: "none",
          borderRadius: "4px",
          marginTop: "20px",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default RecruiterDashboard;

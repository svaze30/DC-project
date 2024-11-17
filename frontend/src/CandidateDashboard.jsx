import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CandidateDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumeUrl, setResumeUrl] = useState("");
  const [skills, setSkills] = useState("");
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const candidateId = localStorage.getItem("candidateId"); // Retrieve candidateId from localStorage

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/jobs");
        console.log("Jobs response:", response.data); // Log the response data
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/candidate/${candidateId}/applications`);
        console.log("Applications response:", response.data); // Log the response data
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    const fetchCandidateProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/candidate/${candidateId}`);
        const { resumeUrl, skills, ...profileData } = response.data;
        setResumeUrl(resumeUrl);
        setSkills(skills.join(", "));
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching candidate profile:", error);
      }
    };

    fetchJobs();
    fetchApplications();
    fetchCandidateProfile();
  }, [candidateId]);

  const handleApply = async (jobId, recruiterId) => {
    try {
      const response = await axios.post("http://localhost:3000/apply", {
        candidateId,
        jobId,
        recruiterId,
        notes: "Looking forward to this opportunity.",
      });
      alert("Application submitted successfully");
      // Refresh applications after applying
      fetchApplications();
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Error applying for job");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/candidate/${candidateId}`, {
        resumeUrl,
        skills: skills.split(",").map(skill => skill.trim()),
      });
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  // Filter out jobs that the candidate has already applied for
  const appliedJobIds = applications.map(application => application.jobId._id);
  const availableJobs = jobs.filter(job => !appliedJobIds.includes(job._id));

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
        Candidate Dashboard
      </h1>

      <h3>Profile Details</h3>
      <div style={{ marginBottom: "20px" }}>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Contact Number:</strong> {profile.contactNumber}</p>
        <p><strong>Resume URL:</strong> {resumeUrl}</p>
        <p><strong>Skills:</strong> {skills}</p>
      </div>

      <h3>Update Profile</h3>
      <form onSubmit={handleProfileUpdate} style={{ marginBottom: "20px" }}>
        <div>
          <label>Resume URL:</label>
          <input
            type="text"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            required
            style={{ marginLeft: "10px", padding: "5px", width: "300px" }}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Skills (comma separated):</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
            style={{ marginLeft: "10px", padding: "5px", width: "300px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            fontSize: "14px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Update Profile
        </button>
      </form>

      <h3>Available Jobs:</h3>
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
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {availableJobs.map((job) => (
            <tr key={job._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{job.title}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{job.description}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{job.location}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{job.employmentType}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{job.status}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {job.status === "Open" ? (
                  <button
                    onClick={() => handleApply(job._id, job.recruiterId)}
                    style={{
                      padding: "5px 10px",
                      fontSize: "14px",
                      cursor: "pointer",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Apply
                  </button>
                ) : (
                  "Closed"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Jobs You Have Applied For:</h3>
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
          {applications.map((application) => (
            <tr key={application._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{application.jobId.title}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{application.jobId.description}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{application.jobId.location}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{application.jobId.employmentType}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{application.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#ff4444",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default CandidateDashboard;
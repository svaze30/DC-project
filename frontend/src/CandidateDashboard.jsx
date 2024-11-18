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
  const candidateId = localStorage.getItem("candidateId");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/candidate/${candidateId}/applications`
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    const fetchCandidateProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/candidate/${candidateId}`
        );
        const { resumeUrl, skills, ...profileData } = response.data;
        setResumeUrl(resumeUrl);
        setSkills(skills.join(", "));
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching candidate profile:", error);
      }
    };

    if (candidateId) {
      fetchJobs();
      fetchApplications();
      fetchCandidateProfile();
    } else {
      navigate("/login-candidate");
    }
  }, [candidateId, navigate]);

  const handleApply = async (jobId, recruiterId) => {
    try {
      await axios.post("http://localhost:3000/apply", {
        candidateId,
        jobId,
        recruiterId,
        notes: "Looking forward to this opportunity.",
      });
      alert("Application submitted successfully");
      const response = await axios.get(
        `http://localhost:3000/candidate/${candidateId}/applications`
      );
      setApplications(response.data);
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
        skills: skills.split(",").map((skill) => skill.trim()),
      });
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const appliedJobIds = applications.map(
    (application) => application.jobId._id
  );
  const availableJobs = jobs.filter((job) => !appliedJobIds.includes(job._id));

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
    padding: "24px",
    marginBottom: "32px",
  };

  const buttonStyle = {
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#4299e1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: "#2d3748", marginBottom: "24px" }}>
          Profile Details
        </h2>
        <div style={{ marginBottom: "20px" }}>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Contact Number:</strong> {profile.contactNumber}
          </p>
          <p>
            <strong>Resume URL:</strong> {resumeUrl}
          </p>
          <p>
            <strong>Skills:</strong> {skills}
          </p>
        </div>

        <h3 style={{ color: "#4a5568", marginBottom: "16px" }}>
          Update Profile
        </h3>
        <form onSubmit={handleProfileUpdate}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Resume URL:
            </label>
            <input
              type="text"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Skills (comma separated):
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
              }}
            />
          </div>
          <button type="submit" style={buttonStyle}>
            Update Profile
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: "#2d3748", marginBottom: "24px" }}>
          Available Jobs
        </h3>
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {availableJobs.map((job) => (
            <div
              key={job._id}
              style={{
                padding: "20px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            >
              <h4 style={{ marginBottom: "12px" }}>{job.title}</h4>
              <p>{job.description}</p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Type:</strong> {job.employmentType}
              </p>
              <p>
                <strong>Skills Required:</strong>{" "}
                {job.skillsRequired.join(", ")}
              </p>
              <button
                onClick={() => handleApply(job._id, job.recruiterId)}
                style={{
                  ...buttonStyle,
                  backgroundColor: "#48bb78",
                  marginTop: "12px",
                }}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: "#2d3748", marginBottom: "24px" }}>Applied Jobs</h3>
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {applications.map((application) => (
            <div
              key={application._id}
              style={{
                padding: "20px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            >
              <h4 style={{ marginBottom: "12px" }}>
                {application.jobId.title}
              </h4>
              <p>{application.jobId.description}</p>
              <p>
                <strong>Location:</strong> {application.jobId.location}
              </p>
              <p>
                <strong>Type:</strong> {application.jobId.employmentType}
              </p>
              <p>
                <strong>Status:</strong> {application.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("candidateId");
          navigate("/");
        }}
        style={{
          ...buttonStyle,
          backgroundColor: "#f56565",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default CandidateDashboard;

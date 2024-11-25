import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const navigate = useNavigate();
  const recruiterId = localStorage.getItem("recruiterId");
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    employmentType: "Full-time",
    skillsRequired: "",
    salaryRange: {
      min: "",
      max: "",
    },
  });

  // Styles
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
    },
    header: {
      fontSize: "2rem",
      color: "#2d3748",
      marginBottom: "2rem",
      textAlign: "center",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "24px",
      marginBottom: "24px",
      transition: "transform 0.2s ease",
      "&:hover": {
        transform: "translateY(-2px)",
      },
    },
    form: {
      display: "grid",
      gap: "20px",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "16px",
      transition: "border-color 0.3s ease",
      "&:focus": {
        outline: "none",
        borderColor: "#4299e1",
      },
    },
    button: {
      padding: "12px 24px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      backgroundColor: "#4299e1",
      color: "white",
      border: "none",
      borderRadius: "8px",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#3182ce",
        transform: "translateY(-1px)",
      },
      "&:disabled": {
        backgroundColor: "#cbd5e0",
        cursor: "not-allowed",
      },
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
    },
    applicationCard: {
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    jobTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#2d3748",
      marginBottom: "12px",
    },
    text: {
      color: "#4a5568",
      marginBottom: "8px",
    },
    acceptButton: {
      backgroundColor: "#48bb78",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      marginRight: "8px",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#38a169",
      },
    },
    rejectButton: {
      backgroundColor: "#f56565",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#e53e3e",
      },
    },
    logoutButton: {
      backgroundColor: "#f56565",
      marginTop: "24px",
      width: "100%",
    },
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/recruiter/${recruiterId}/jobs`
        );
        setJobs(response.data);

        // Fetch applications for each job
        for (const job of response.data) {
          const applicationsResponse = await axios.get(
            `http://localhost:3000/job/${job._id}/candidates`
          );
          setApplications((prev) => ({
            ...prev,
            [job._id]: applicationsResponse.data,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (recruiterId) {
      fetchJobs();
    }
  }, [recruiterId]);

  const handleApplicationStatus = async (applicationId, jobId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/application/${applicationId}/status`,
        {
          status,
          jobId,
        }
      );

      if (response.status === 200) {
        alert(`Application ${status.toLowerCase()} successfully`);

        // Refresh jobs and applications
        const jobsResponse = await axios.get(
          `http://localhost:3000/recruiter/${recruiterId}/jobs`
        );
        setJobs(jobsResponse.data);

        // Update applications for the specific job
        const applicationsResponse = await axios.get(
          `http://localhost:3000/job/${jobId}/candidates`
        );
        setApplications((prev) => ({
          ...prev,
          [jobId]: applicationsResponse.data,
        }));
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Error updating application status");
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/jobs", {
        ...newJob,
        recruiterId,
        skillsRequired: newJob.skillsRequired
          .split(",")
          .map((skill) => skill.trim()),
      });
      alert("Job posted successfully!");
      setJobs([...jobs, response.data]);
      setNewJob({
        title: "",
        description: "",
        location: "",
        employmentType: "Full-time",
        skillsRequired: "",
        salaryRange: {
          min: "",
          max: "",
        },
      });
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Error posting job");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Recruiter Dashboard</h1>

      <div style={styles.card}>
        <h2 style={styles.jobTitle}>Post New Job</h2>
        <form onSubmit={handleJobSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Job Title"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            required
            style={styles.input}
          />
          <textarea
            placeholder="Job Description"
            value={newJob.description}
            onChange={(e) =>
              setNewJob({ ...newJob, description: e.target.value })
            }
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Location"
            value={newJob.location}
            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
            required
            style={styles.input}
          />
          <select
            value={newJob.employmentType}
            onChange={(e) =>
              setNewJob({ ...newJob, employmentType: e.target.value })
            }
            style={styles.input}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
          <input
            type="text"
            placeholder="Required Skills (comma-separated)"
            value={newJob.skillsRequired}
            onChange={(e) =>
              setNewJob({ ...newJob, skillsRequired: e.target.value })
            }
            required
            style={styles.input}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <input
              type="number"
              placeholder="Min Salary"
              value={newJob.salaryRange.min}
              onChange={(e) =>
                setNewJob({
                  ...newJob,
                  salaryRange: { ...newJob.salaryRange, min: e.target.value },
                })
              }
              required
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Max Salary"
              value={newJob.salaryRange.max}
              onChange={(e) =>
                setNewJob({
                  ...newJob,
                  salaryRange: { ...newJob.salaryRange, max: e.target.value },
                })
              }
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Post Job
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.jobTitle}>Posted Jobs and Applications</h2>
        {jobs.map((job) => (
          <div key={job._id} style={styles.applicationCard}>
            <h3 style={styles.jobTitle}>{job.title}</h3>
            <p style={styles.text}>{job.description}</p>
            <p style={styles.text}>Location: {job.location}</p>
            <p style={styles.text}>Type: {job.employmentType}</p>
            <p style={styles.text}>Skills: {job.skillsRequired.join(", ")}</p>
            <p style={styles.text}>
              Salary: ${job.salaryRange.min} - ${job.salaryRange.max}
            </p>

            <div style={{ marginTop: "20px" }}>
              <h4 style={styles.text}>Applications:</h4>
              {console.log(applications[job._id])}
              {applications[job._id]?.map((application) => (
                <div key={application._id} style={styles.applicationCard}>
                  <p style={styles.text}>
                    Name: {application.candidateId.name}
                  </p>
                  <p style={styles.text}>
                    Email: {application.candidateId.email}
                  </p>
                  <p style={styles.text}>
                    Resume
                    <a href={application.candidateId.resumeUrl}>: Here</a>
                  </p>
                  <p style={styles.text}>
                    Status: {application.status || "Pending"}
                  </p>
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() =>
                        handleApplicationStatus(
                          application._id,
                          job._id,
                          "Hired"
                        )
                      }
                      style={styles.acceptButton}
                      disabled={application.status === "Hired"}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleApplicationStatus(
                          application._id,
                          job._id,
                          "Rejected"
                        )
                      }
                      style={styles.rejectButton}
                      disabled={application.status === "Rejected"}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("recruiterId");
          navigate("/");
        }}
        style={{ ...styles.button, ...styles.logoutButton }}
      >
        Logout
      </button>
    </div>
  );
};

export default RecruiterDashboard;

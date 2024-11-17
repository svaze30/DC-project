const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Use a hashing library for secure storage
    contactNumber: { type: String },
    resumeUrl: { type: String },
    skills: [{ type: String }],
    appliedJobs: [
      {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
        applicationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Application",
        },
        status: {
          type: String,
          enum: ["Applied", "Interviewing", "Hired", "Rejected"],
          default: "Applied",
        },
      },
    ],
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;

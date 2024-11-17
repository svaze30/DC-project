const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Use a hashing library for secure storage
    company: { type: String, required: true },
    contactNumber: { type: String },
    jobsPosted: [
      {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
        title: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Recruiter = mongoose.model("Recruiter", recruiterSchema);
module.exports = Recruiter;

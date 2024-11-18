const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const { addTempDocument } = require("./tempCollection");
const Candidate = require("./models/Candidate");
const Recruiter = require("./models/Recruiter");
const Job = require("./models/Job");
const Application = require("./models/Application");

// Simulation configuration
const serverId = Math.floor(Math.random() * 1000);
let lastHeartbeat = Date.now();
let clockOffset = Math.random() * 100;
let currentLoad = Math.random() * 100;
let activeConnections = 0;
const peers = new Map();

// Berkeley Algorithm Implementation
const berkeleySyncInterval = 10000;
let masterClock = Date.now();

const calculateClockDifference = () => {
  const peers_differences = Array.from(peers.values()).map(
    (peer) => peer.clock - masterClock
  );
  const avg_difference =
    peers_differences.reduce((a, b) => a + b, 0) / peers_differences.length;
  console.log(
    `[Berkeley Algorithm] Clock differences from peers: ${peers_differences.join(
      ", "
    )}ms`
  );
  console.log(
    `[Berkeley Algorithm] Average difference: ${avg_difference.toFixed(2)}ms`
  );
  return avg_difference;
};

// Load Balancing Algorithms
const loadBalancingStrategy = {
  ROUND_ROBIN: "round-robin",
  LEAST_CONNECTIONS: "least-connections",
};

let currentStrategy = loadBalancingStrategy.ROUND_ROBIN;
let roundRobinCounter = 0;

// Middleware for load balancer simulation
app.use((req, res, next) => {
  const loadBalancerIp = "10.0.0." + Math.floor(Math.random() * 255);
  activeConnections++;

  console.log(`
[Load Balancer ${loadBalancerIp}] New request received
├── Strategy: ${currentStrategy}
├── Server #${serverId} selected
├── Current load: ${currentLoad.toFixed(2)}%
├── Active connections: ${activeConnections}
└── Time offset: ${clockOffset.toFixed(2)}ms
  `);

  next();
});

// Simulated cluster heartbeat and synchronization
setInterval(() => {
  const now = Date.now();
  const timeSinceLastHeartbeat = now - lastHeartbeat;
  lastHeartbeat = now;
  currentLoad = Math.random() * 100;

  console.log(`
[Clock Synchronization - Berkeley Algorithm]
├── Master: Server #${serverId}
├── Current offset: ${clockOffset.toFixed(2)}ms
├── Steps:
│   ├── 1. Request time from peers
│   ├── 2. Calculate differences
│   ├── 3. Average differences
│   └── 4. Adjust local clock
└── Synchronized time: ${new Date(now + clockOffset).toISOString()}
  `);

  console.log(`
[Load Balancing Metrics]
├── Algorithm: ${currentStrategy}
├── Server #${serverId} status
│   ├── Load: ${currentLoad.toFixed(2)}%
│   ├── Connections: ${activeConnections}
│   └── Health: ${currentLoad < 80 ? "Healthy" : "Overloaded"}
└── Round Robin position: ${roundRobinCounter}
  `);

  const drift = (Math.random() - 0.5) * 10;
  clockOffset += drift;
  console.log(`
[Clock Drift Correction]
├── Previous offset: ${(clockOffset - drift).toFixed(2)}ms
├── Drift amount: ${drift.toFixed(2)}ms
└── New offset: ${clockOffset.toFixed(2)}ms
  `);

  activeConnections = Math.max(
    0,
    activeConnections - Math.floor(Math.random() * 3)
  );
  roundRobinCounter = (roundRobinCounter + 1) % 3;
}, 5000);

// Switch load balancing strategy periodically
setInterval(() => {
  currentStrategy =
    currentStrategy === loadBalancingStrategy.ROUND_ROBIN
      ? loadBalancingStrategy.LEAST_CONNECTIONS
      : loadBalancingStrategy.ROUND_ROBIN;

  console.log(`
[Load Balancer Configuration]
├── Strategy changed to: ${currentStrategy}
└── Reason: Periodic algorithm rotation
  `);
}, 15000);

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://vazeswaroop:kwW4OBxGWYCvW8N1@dc-cluster.9ylpk.mongodb.net/?retryWrites=true&w=majority&appName=dc-cluster",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Routes
app.post("/register-candidate", async (req, res) => {
  const { name, email, password, contactNumber, resumeUrl, skills } = req.body;
  try {
    const newCandidate = new Candidate({
      name,
      email,
      password,
      contactNumber,
      resumeUrl,
      skills,
    });
    await newCandidate.save();
    res.status(201).send("Candidate registered successfully");
  } catch (error) {
    console.error("Error registering candidate:", error);
    res.status(500).send("Error registering candidate");
  }
});

app.post("/register-recruiter", async (req, res) => {
  const { name, email, password, company, contactNumber } = req.body;
  try {
    const newRecruiter = new Recruiter({
      name,
      email,
      password,
      company,
      contactNumber,
    });
    await newRecruiter.save();
    res.status(201).send("Recruiter registered successfully");
  } catch (error) {
    console.error("Error registering recruiter:", error);
    res.status(500).send("Error registering recruiter");
  }
});

app.post("/login-candidate", async (req, res) => {
  const { email, password } = req.body;
  try {
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(404).send("Candidate not found");
    }
    if (candidate.password !== password) {
      return res.status(401).send("Invalid password");
    }
    res.status(200).json({ candidateId: candidate._id });
  } catch (error) {
    console.error("Error logging in candidate:", error);
    res.status(500).send("Error logging in candidate");
  }
});

app.post("/login-recruiter", async (req, res) => {
  const { email, password } = req.body;
  try {
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(404).send("Recruiter not found");
    }
    if (recruiter.password !== password) {
      return res.status(401).send("Invalid password");
    }
    res.status(200).json({ recruiterId: recruiter._id });
  } catch (error) {
    console.error("Error logging in recruiter:", error);
    res.status(500).send("Error logging in recruiter");
  }
});

app.post("/jobs", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).send("Error creating job");
  }
});

app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).send("Error fetching jobs");
  }
});

app.get("/recruiter/:recruiterId/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.params.recruiterId });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    res.status(500).send("Error fetching recruiter jobs");
  }
});

app.get("/candidate/:candidateId", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.candidateId);
    res.status(200).json(candidate);
  } catch (error) {
    console.error("Error fetching candidate:", error);
    res.status(500).send("Error fetching candidate");
  }
});

app.put("/candidate/:candidateId", async (req, res) => {
  try {
    await Candidate.findByIdAndUpdate(req.params.candidateId, req.body);
    res.status(200).send("Candidate updated successfully");
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).send("Error updating candidate");
  }
});

app.post("/apply", async (req, res) => {
  try {
    const newApplication = new Application(req.body);
    await newApplication.save();
    res.status(201).send("Application submitted successfully");
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).send("Error submitting application");
  }
});

app.get("/candidate/:candidateId/applications", async (req, res) => {
  try {
    const applications = await Application.find({
      candidateId: req.params.candidateId,
    }).populate("jobId");
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).send("Error fetching applications");
  }
});

app.get("/job/:jobId/candidates", async (req, res) => {
  try {
    const applications = await Application.find({
      jobId: req.params.jobId,
    }).populate("candidateId");
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).send("Error fetching job applications");
  }
});

app.put("/application/:applicationId/status", async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(application);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).send("Error updating application status");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;

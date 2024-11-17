const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const { addTempDocument } = require("./tempCollection");
const Candidate = require("./models/Candidate");
const Recruiter = require("./models/Recruiter");

// Middleware
app.use(express.json());

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

  // Add a temporary document
  addTempDocument("exampleName", "exampleValue");
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

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

    res.status(200).send("Candidate logged in successfully");
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

    res.status(200).send("Recruiter logged in successfully");
  } catch (error) {
    console.error("Error logging in recruiter:", error);
    res.status(500).send("Error logging in recruiter");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

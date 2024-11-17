const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const { addTempDocument } = require("./tempCollection");
const Candidate = require("./models/Candidate");

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

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

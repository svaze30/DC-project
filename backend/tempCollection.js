const mongoose = require("mongoose");

// Define a temporary schema
const tempSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

// Create a model for the temporary collection
const Temp = mongoose.model("Temp", tempSchema);

// Function to add a document to the temporary collection
const addTempDocument = async (name, value) => {
  try {
    const tempDoc = new Temp({ name, value });
    await tempDoc.save();
    console.log("Temporary document added:", tempDoc);
  } catch (error) {
    console.error("Error adding temporary document:", error);
  }
};

module.exports = { addTempDocument };

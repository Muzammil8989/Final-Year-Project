const mongoose = require("mongoose");

// Job Schema
const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    logo: { type: String },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "Remote", // Default location
    },
    salary: {
      type: String, // Can be a string for flexible formats like "$120,000 - $140,000"
      required: false,
    },
    type: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"], // Allowed values
      default: "Remote", // Default to Remote
    },
    applicants: {
      type: Number, // Number of applicants
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to recruiter
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "jobs",
  }
);

// Model Name: "Job"
const Job = mongoose.model("Job", JobSchema);

module.exports = Job;

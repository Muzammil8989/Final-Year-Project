const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the candidate
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Reference to the job posting
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume", // Reference to the candidate's resume
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Hired", "Rejected"],
      default: "Applied",
    },
    matchScore: {
      type: Number, // The match score will be a numeric value between 0 and 100
      min: 0,
      max: 100,
      default: 0, // Default match score if not provided
    },
    interviewScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    quizScore: {
      type: Number, // The quiz score will also be a numeric value between 0 and 100
      min: 0,
      max: 100,
      default: 0, // Default quiz score if not provided
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "applications",
  }
);

module.exports = mongoose.model("Application", JobApplicationSchema);

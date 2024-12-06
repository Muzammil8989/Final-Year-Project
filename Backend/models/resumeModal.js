const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (the candidate)
      required: true,
    },
    filePath: {
      type: String,
      required: false, 
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
      required: true,
    },
    contact_number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    skills: {
      type: [String], // Array of strings for skills
      default: [],
    },
    education: {
      type: [String], // Array of strings for education
      required: true,
    },
    colleges: {
      type: [String], // Array of strings for colleges
      default: [],
    },
    work_experience: {
      type: String,
      default: "",
    },
    certifications: {
      type: [String], // Array of strings for certifications
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "resumes",
  }
);

module.exports = mongoose.model("Resume", ResumeSchema);

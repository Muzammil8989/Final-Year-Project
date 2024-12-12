const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questions: [String],
    answers: [{ type: String }], // Ensure answers are stored as strings
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;

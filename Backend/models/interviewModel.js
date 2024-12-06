const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the User collection
  questions: [{ type: String, required: true }], // Questions for the interview
  answers: [
    {
      question: { type: String }, // The interview question
      answer: { type: String }, // Candidate's answer
      timeTaken: { type: Number }, // Time taken to answer in seconds
    },
  ],
  score: { type: Number }, // Overall score for the interview
  createdAt: { type: Date, default: Date.now }, // Date the interview record was created
});

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;

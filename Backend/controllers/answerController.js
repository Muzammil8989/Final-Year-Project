const CandidateAnswer = require("../models/CandidateAnswer");
const Question = require("../models/QuestionModel");
const Candidate = require("../models/userModel"); // Assuming you have a Candidate model for candidate info
const mongoose = require("mongoose");

// Submit an answer
const submitAnswer = async (req, res) => {
    try {
      // Destructure jobId and selectedAnswer from the request body
      const { jobId, questionId, selectedAnswerId, isCorrect } = req.body;
  
      // Validate that the required fields are provided
      if (!questionId || selectedAnswerId === undefined) {
        return res.status(400).send({ error: "Question ID and selected answer ID are required." });
      }
  
      // Ensure the user is authenticated
      const candidateId = req.user?.id;
      if (!candidateId) {
        return res.status(400).send({ error: "User not authenticated." });
      }
  
      // Save the selected answer
      const answer = new CandidateAnswer({
        candidateId,
        jobId, // Include jobId if necessary
        questionId,
        selectedAnswerId,
        isCorrect: isCorrect || false, // Default to false if isCorrect is not provided
      });
  
      await answer.save();
  
      // Success response
      res.status(201).send({ message: "Answer submitted successfully." });
  
    } catch (error) {
      console.error("Error during submission:", error); // Log error for debugging
      res.status(500).send({ error: "Internal server error" });
    }
  };
  
  

// Get candidate performance
const getPerformance = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;

    // Validate candidateId existence
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).send({ error: "Candidate not found" });
    }

    // Aggregate candidate performance data
    const results = await CandidateAnswer.aggregate([
      { $match: { candidateId: mongoose.Types.ObjectId(candidateId) } },
      {
        $group: {
          _id: "$candidateId",
          totalQuestions: { $sum: 1 },
          correctAnswers: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        },
      },
    ]);

    res
      .status(200)
      .send(results[0] || { totalQuestions: 0, correctAnswers: 0 });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Export destructured functions
module.exports = {
  submitAnswer,
  getPerformance,
};

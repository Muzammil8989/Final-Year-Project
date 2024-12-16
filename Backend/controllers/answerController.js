const CandidateAnswer = require("../models/CandidateAnswer");
const JobApplication = require("../models/jobapplicationModel");
const mongoose = require("mongoose");

// Submit an answer
const submitAnswer = async (req, res) => {
  try {
    // Destructure questionId, selectedAnswerId, and isCorrect from the request body
    const { questionId, selectedAnswerId, isCorrect } = req.body;

    // Validate that the required fields are provided
    if (!questionId || selectedAnswerId === undefined) {
      return res
        .status(400)
        .send({ error: "Question ID and selected answer ID are required." });
    }

    console.log("Request body:", req.body);

    // Ensure the user is authenticated
    const candidateId = req.user?.id;
    if (!candidateId) {
      return res.status(400).send({ error: "User not authenticated." });
    }
    console.log("Candidate ID:", candidateId);

    // Save the selected answer
    const answer = new CandidateAnswer({
      candidateId,
      questionId,
      selectedAnswerId,
      isCorrect: isCorrect || false, // Default to false if isCorrect is not provided
    });

    await answer.save();

    // Now, calculate the candidate's quiz score
    const candidateAnswers = await CandidateAnswer.aggregate([
      {
        $match: {
          candidateId: new mongoose.Types.ObjectId(candidateId), // Ensure ObjectId type
        },
      },
      {
        $group: {
          _id: "$candidateId",
          totalQuestions: { $sum: 1 },
          correctAnswers: {
            $sum: {
              $cond: [{ $eq: ["$isCorrect", true] }, 1, 0],
            },
          },
        },
      },
    ]);

    console.log("Candidate Answers:", candidateAnswers);

    const quizScore =
      (candidateAnswers[0]?.correctAnswers /
        candidateAnswers[0]?.totalQuestions) *
        100 || 0;

    // Find the JobApplication and update quizScore
    const application = await JobApplication.findOne({
      candidate: new mongoose.Types.ObjectId(candidateId),
    });

    if (application) {
      // Update the quizScore in the application
      application.quizScore = quizScore; // Update the quiz score
      await application.save();
      console.log("Application quiz score updated:", application);
    } else {
      console.log("No application found for the candidate.");
    }

    // Success response
    res
      .status(201)
      .send({ message: "Answer submitted successfully.", quizScore });
  } catch (error) {
    console.error("Error during submission:", error); // Log error for debugging
    res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = {
  submitAnswer,
};

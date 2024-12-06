const Question = require("../models/QuestionModel");
const Job = require("../models/jobpostedModel"); // Assuming you have a Job model

// Add 20 questions for a specific job
exports.addQuestionsForJob = async (req, res) => {
  const { jobId } = req.params; // Assume the jobId is passed as a URL parameter
  const { questions } = req.body; // HR posts the questions in the body of the request

  try {
    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).send({ error: "Job not found" });
    }

    // Validate the questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .send({ error: "Questions array must be provided" });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const { question, answers, correctAnswerId } = questions[i];

      // Ensure each question has answers and a valid correctAnswerId
      if (
        !question ||
        !Array.isArray(answers) ||
        answers.length < 2 ||
        !correctAnswerId
      ) {
        return res
          .status(400)
          .send({ error: `Invalid question data at index ${i}` });
      }

      // Ensure correctAnswerId is within the valid range of answer IDs
      if (!answers.some((answer) => answer.id === correctAnswerId)) {
        return res
          .status(400)
          .send({
            error: `Correct answer ID does not match any answer for question at index ${i}`,
          });
      }
    }

    // Create the questions dynamically from the HR input
    const questionDocuments = questions.map((q) => {
      return new Question({
        job: jobId, // Associate with the specific job
        hrId: req.user.id, // Assuming user ID comes from authentication middleware
        question: q.question,
        answers: q.answers,
        correctAnswerId: q.correctAnswerId,
      });
    });

    // Save all questions to the database
    await Question.insertMany(questionDocuments);

    res
      .status(201)
      .send({
        message: "Questions created successfully",
        questions: questionDocuments,
      });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
};
exports.getQuestionsForJob = async (req, res) => {
    const { jobId } = req.params; // Job ID passed as a URL parameter
  
    try {
      // Fetch the job from the database to ensure it exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).send({ error: "Job not found" });
      }
  
      // Retrieve the questions for the specific job, without populating hrId
      const questions = await Question.find({ job: jobId })
        .select("question answers correctAnswerId job") // Return only relevant fields
        .lean(); // Use .lean() to get a plain JavaScript object
  
      // If no questions found, return an appropriate message
      if (questions.length === 0) {
        return res.status(404).send({ error: "No questions found for this job" });
      }
  
      // Optionally, you can include additional job details (e.g., job title) by using jobId
      const jobDetails = {
        title: job.title,  // Assuming your Job model has a `title` field
        description: job.description, // Similarly, a description field
        // Add any other fields you need here
      };
  
      // Return the retrieved questions and job details
      res.status(200).send({ questions, jobDetails });
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: error.message });
    }
  };


  exports.getQuestionsForJobById = async (req, res) => {
    const { jobId } = req.body; // Job ID passed in the request body
  
    try {
      // Fetch the job from the database to ensure it exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).send({ error: "Job not found" });
      }
  
      // Return only the jobId
      res.status(200).send({ jobId: job._id });
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: error.message });
    }
  };
  
  
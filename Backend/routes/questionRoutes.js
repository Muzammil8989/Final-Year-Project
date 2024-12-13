const express = require("express");
const router = express.Router();
const {
  generateMCQ,
  getQuestionsForJob,
  getQuestionsForJobById,
} = require("../controllers/questionController");

const authMiddleware = require("../middleware/auth");

// Route to add 20 questions for a specific job
router.post("/jobs/:jobId/questions", authMiddleware, generateMCQ);
router.get("/jobs/:jobId/questions", getQuestionsForJob);
router.get("/jobs/questions", getQuestionsForJobById);

module.exports = router;

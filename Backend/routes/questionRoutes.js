const express = require('express');
const router = express.Router();
const { addQuestionsForJob, getQuestionsForJob , getQuestionsForJobById} = require('../controllers/questionController');

const authMiddleware = require('../middleware/auth');

// Route to add 20 questions for a specific job
router.post('/jobs/:jobId/questions', authMiddleware, addQuestionsForJob);
router.get('/jobs/:jobId/questions',  getQuestionsForJob);
router.get('/jobs/questions',  getQuestionsForJobById);

module.exports = router;

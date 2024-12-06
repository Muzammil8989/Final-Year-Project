const express = require('express');
const { submitAnswer, getPerformance } = require('../controllers/answerController');
const auth = require('../middleware/auth');
const router = express.Router();

// Route to submit an answer
router.post('/answers', auth, submitAnswer);

// Route to get candidate performance
router.get('/performance/:candidateId', getPerformance);

module.exports = router;

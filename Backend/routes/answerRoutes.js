const express = require('express');
const { submitAnswer } = require('../controllers/answerController');
const auth = require('../middleware/auth');
const router = express.Router();

// Route to submit an answer
router.post('/answers', auth, submitAnswer);



module.exports = router;

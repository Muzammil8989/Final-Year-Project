const mongoose = require('mongoose');

const candidateAnswerSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedAnswerId: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CandidateAnswer', candidateAnswerSchema);

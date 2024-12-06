const mongoose = require('mongoose');

// Question Schema
const questionSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',  // Reference to the Job model
    required: true,
  },
  hrId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  question: { 
    type: String, 
    required: true 
  },
  answers: [
    {
      id: { type: Number, required: true },
      text: { type: String, required: true }
    }
  ],
  correctAnswerId: { 
    type: Number, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Question', questionSchema);

// models/TestLink.js
const mongoose = require('mongoose');

const testLinkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  testLink: {
    type: String,
    required: true,
  },
  isLinkSent: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

const TestLink = mongoose.model('TestLink', testLinkSchema);

module.exports = TestLink;

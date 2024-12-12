const mongoose = require("mongoose");

const testLinkSchema = new mongoose.Schema({
  candidateEmail: {
    type: String,
    required: true,
    unique: true,
  },
  testLink: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TestLink = mongoose.model("TestLink", testLinkSchema);

module.exports = TestLink;

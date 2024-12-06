const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
      // Index to automatically delete documents after 'verificationTokenExpires'
      expires: 0, // This sets the TTL index in seconds
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpires: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["Candidate", "Recruiter"],
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Define TTL indexes
UserSchema.index({ verificationTokenExpires: 1 }, { expireAfterSeconds: 0 });
UserSchema.index({ resetPasswordTokenExpires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("User", UserSchema);

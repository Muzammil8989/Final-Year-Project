const transporter = require("../config/nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");

const sendVerificationEmail = async (user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: user.email, // Recipient address
      subject: "Verify Your Email", // Subject line
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; font-size: 24px;">
            AI Recruiter - Verify Your Email
          </div>
          <div style="padding: 20px; line-height: 1.6; color: #333;">
            <p>Hello ${user.name},</p>
            <p>Thank you for signing up with AI Recruiter. To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
            <a href="${process.env.CLIENT_URL}/verify/${user.verificationToken}" 
              style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-size: 16px; text-align: center;">Verify Email</a>
            <p>If you did not sign up for this account, please ignore this email.</p>
            <p>The verification link is valid for 1 hour.</p>
          </div>
          <div style="text-align: center; font-size: 12px; color: #777777; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
            &copy; ${new Date().getFullYear()} AI Recruiter. All rights reserved.
          </div>
        </div>
      </body>
      </html>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Register a new user
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Password validation regex
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordPattern.test(password)) {
    return res.status(400).json({
      msg: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const verificationToken = crypto.randomBytes(20).toString("hex");
    const tokenExpires = new Date(Date.now() + 3600000); // Token should be valid for 1 hour

    user = new User({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires: tokenExpires,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    await sendVerificationEmail(user);

    res.json({ msg: "User registered. Verification email sent." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Verify email

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }, // Token should be valid (not expired)
    });

    if (!user) {
      return res
        .status(404)
        .json({ msg: "Invalid or expired verification token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ msg: "Email verified. You can now log in." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login a user
const login = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  const { email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password does not match" });
    }

    if (!user.verified) {
      return res.status(400).json({ msg: "Please verify your email" });
    }
    let roleAssigned = false;
    if (!user.role) {
      user.role = role;
      await user.save();
      roleAssigned = true;
    } else if (user.role !== role) {
      return res.status(400).json({ msg: "Role does not match" });
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 24 * 60 * 60 * 24 * 60, // 24 hours
      },
      (err, token) => {
        if (err) throw err;
        res.json({ msg: "Login successful", token, roleAssigned });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Send verification email
const sendVerificationPasswordEmail = async (user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL, // Sender address
      to: user.email, // Recipient address
      subject: "Reset Your Password", // Updated subject line
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <div style="background-color: #007BFF; color: white; text-align: center; padding: 20px; font-size: 24px;">
            Reset Your Password
          </div>
          <div style="padding: 20px; font-size: 16px; color: #333; line-height: 1.6;">
            <p>Hello ${user.name},</p>
            <p>We received a request to reset your password. To proceed, please click the button below:</p>
            <a href="${process.env.CLIENT_URL}/reset-password/${user.resetPasswordToken}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #007BFF; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;">Reset Password</a>
            <p>If you did not request a password reset, you can safely ignore this email.</p>
            <p>The link is valid for 1 hour.</p>
          </div>
          <div style="text-align: center; font-size: 12px; color: #777; padding: 10px; border-top: 1px solid #e0e0e0;">
            &copy; ${new Date().getFullYear()} AI Recruiter. All rights reserved.
          </div>
        </div>
      </body>
      </html>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${user.email}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};



// Forget Password
const forgetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordTokenExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    await sendVerificationPasswordEmail(user);

    res.json({ msg: "Password reset email sent" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password } = req.body;
  const { resetPasswordToken } = req.params;

  try {
    let user = await User.findOne({
      resetPasswordToken,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Invalid or expired reset password token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;

    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  forgetPassword,
  resetPassword,
};

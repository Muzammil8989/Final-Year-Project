const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  register,
  verifyEmail,
  login,
  forgetPassword,
  resetPassword,
} = require("../controllers/authController");
const { } = require("../controllers/jobpostedController");
const auth = require("../middleware/auth");

// @route POST api/auth/register
// @desc Register user
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 8,
    }),
  ],
  register
);

// @route POST api/auth/verify
// @desc Verify user
router.get("/verify/:token", verifyEmail);

// @route POST api/auth/login
// @desc Login user

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
    check("role", "Role is required").exists(),
  ],
  login
);

router.post(
  "/forgetPassword",
  [check("email", "Please include a valid email").isEmail()],
  forgetPassword
);

// @route POST api/auth/resetPassword/:resetPasswordToken
// @desc Reset user password
router.post(
  "/resetPassword/:resetPasswordToken",
  [
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 8,
    }),
  ],
  resetPassword
);

router.get("/user", auth, async (req, res) => {
  try {
    const user = await req.user;
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

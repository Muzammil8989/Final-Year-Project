const express = require("express");
const router = express.Router();
const { simulateInterview } = require("../controllers/interviewController");

// Middlewares (if necessary)
const authMiddleware = require("../middleware/auth");

// Route to handle interview simulation
router.post("/simulate", authMiddleware, simulateInterview);

module.exports = router;

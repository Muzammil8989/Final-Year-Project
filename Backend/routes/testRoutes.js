const express = require("express");
const router = express.Router();
const {
  sendTestLink,
  verifyTestLink,
} = require("../controllers/TestLinkController");

// Route to send the test link to the candidate email
// This route expects a POST request with a body containing the candidate's email
router.post("/send-test-link", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Candidate email is required" });
  }

  try {
    // Call the function to send the test link to the candidate's email
    await sendTestLink(email);
    res.status(200).json({ message: "Test link sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error sending test link" });
  }
});

// Route to verify the test link when the candidate clicks on it
// This route expects the test link as a URL parameter
router.get("/verify-test-link/:testLink", async (req, res) => {
  const { testLink } = req.params;
  try {
    await verifyTestLink(req, res); // Or directly use the testLink variable
  } catch (error) {
    console.error("Error in route handler:", error);
    res.status(500).json({ error: "Error verifying test link" });
  }
});

module.exports = router;

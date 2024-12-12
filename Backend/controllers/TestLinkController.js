const crypto = require("crypto");
const TestLink = require("../models/TestLink");
const transporter = require("../config/nodemailer");

// Function to generate a unique test link
function generateTestLink() {
  return `http://localhost:5001/api/verify-test-link/${crypto
    .randomBytes(20)
    .toString("hex")}`;
}

// Send the test link to the candidate email
async function sendTestLink(candidateEmail) {
  const testLink = generateTestLink();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Link expires in 24 hours

  // Save the link and expiration info to the database
  const existingLink = await TestLink.findOne({
    candidateEmail,
    isUsed: false,
    expiresAt: { $gt: new Date() }, // Ensure the link hasn't expired
  });

  if (existingLink) {
    console.log("Candidate already has a valid test link.");
    return; // Exit the function if there's already a valid link
  }

  // If no valid link exists, create a new test link and save it
  const testLinkEntry = new TestLink({
    candidateEmail,
    testLink,
    expiresAt,
    isUsed: false, // Initialize as unused
  });

  await testLinkEntry.save();

  const emailTemplate = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="width: 100%; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; font-size: 24px; color: #333; margin-bottom: 20px;">
            <h2>Test Instructions</h2>
          </div>
          <div style="font-size: 16px; color: #555; line-height: 1.6;">
            <p>Please read the following instructions carefully before proceeding with the test:</p>
            <ul style="margin-top: 20px; padding-left: 20px; list-style-type: disc;">
              <li>The test is timed. You have a limited amount of time to complete it.</li>
              <li>Do not switch tabs or leave the test screen, or the test will not be considered valid.</li>
              <li>Make sure you have a stable internet connection.</li>
              <li>If you encounter any issues, contact support immediately.</li>
            </ul>
            <p>Click the button below to start your test:</p>
            <a href="${testLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 6px; margin-top: 20px;">Start Test</a>
            <p><em>This link will expire in 24 hours and can only be used once.</em></p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Mail options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: candidateEmail,
    subject: "Your Test Instructions and Link",
    html: emailTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Test link sent successfully!");
  } catch (error) {
    console.error("Error sending test link:", error);
  }
}

// Handle when candidate clicks the test link
async function verifyTestLink(req, res) {
  const { testLink } = req.params; // Get the testLink from URL parameter
  console.log("Test link received:", testLink); // Log the received testLink for debugging

  try {
    // Trim the testLink from the request parameter and extract only the token part
    const cleanedTestLink = testLink.trim(); // Remove any extra spaces
    console.log("Trimmed test link:", cleanedTestLink);

    // Find the test link entry in the database where the testLink field contains the token part
    const testLinkEntry = await TestLink.findOne({
      testLink: { $regex: cleanedTestLink, $options: "i" }, // Case-insensitive regex match
    });

    if (!testLinkEntry) {
      console.log("No entry found for the test link:", cleanedTestLink);
      return res
        .status(404)
        .json({ error: "Test link is invalid or has expired." });
    }

    console.log("Test link entry found:", testLinkEntry);

    // Check if the test link has expired
    const now = new Date();
    if (testLinkEntry.expiresAt < now) {
      return res.status(400).json({ error: "Test link has expired." });
    }

    // Check if the test link has already been used
    if (testLinkEntry.isUsed) {
      console.log("Test link has already been used.");
      // Redirect to a page indicating that the test has already been completed
      return res.redirect("http://localhost:5173/ThankYou"); // Redirect to a "Thank You" or "Test Already Taken" page
    }

    // Mark the test link as used and save it
    testLinkEntry.isUsed = true;
    await testLinkEntry.save();

    // Success: Test link is valid and has been marked as used
    // Redirect the user to the CandidateTest page
    return res.redirect("http://localhost:5173/CandidateTest");
  } catch (error) {
    console.error("Error in route handler:", error);
    res.status(500).json({ error: "Error verifying test link" });
  }
}

module.exports = { sendTestLink, verifyTestLink };

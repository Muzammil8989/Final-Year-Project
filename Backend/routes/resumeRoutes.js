// routes/resumeRoutes.js
const express = require("express");
const router = express.Router();
const {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");  // Import Multer config

// POST route for creating a resume with a file upload (PDF or MS Word)
router.post("/upload_resume", auth, upload.single("resumes"), createResume);

// GET all resumes
router.get("/get_resumes", getAllResumes);

// GET a single resume by ID
router.get("/get_resume/:id", getResumeById);

// PUT route for updating a resume by ID
router.put("/update_resume/:id", updateResume);

// DELETE route for deleting a resume by ID
router.delete("/delete_resume/:id", deleteResume);

module.exports = router;

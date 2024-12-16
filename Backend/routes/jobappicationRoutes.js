const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../middleware/auth"); // Adjust the path as needed
const {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getStatusCounts,
  updateApplicationStatus,
  sendReportToCandidate
} = require("../controllers/jobapplicationController");

// @route   GET /api/applications/status-counts
// @desc    Get total count of each application status
// @access  Private
router.get("/statusCounts", auth, getStatusCounts);

// Validation middleware
const validateApplication = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules
const applicationValidation = [
  body("candidate", "Candidate ID is required").notEmpty().isMongoId(),
  body("job", "Job ID is required").notEmpty().isMongoId(),
  body("resume", "Resume ID is required").notEmpty().isMongoId(),
  body("status")
    .optional()
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Invalid status value"),
];

// @route   POST /api/applications
// @desc    Create a new application
// @access  Private
router.post(
  "/applications",
  auth, // Protecting the route
  applicationValidation,
  validateApplication,
  createApplication
);
router.post("/send-report", sendReportToCandidate);

// @route   GET /api/applications
// @desc    Get all applications
// @access  Public (or Private based on requirements)
router.get("/get_application", getAllApplications);

// @route   GET /api/applications/:id
// @desc    Get a single application by ID
// @access  Public (or Private based on requirements)
router.get("/:id", getApplicationById);

// @route   PUT /api/applications/:id
// @desc    Update an application
// @access  Private
router.put(
  "/:id",
  auth, // Protecting the route
  applicationValidation,
  validateApplication,
  updateApplication
);

// @route   DELETE /api/applications/:id
// @desc    Delete an application
// @access  Private
router.delete("/:id", auth, deleteApplication);

router.put("/update-status/:candidateId", auth, updateApplicationStatus);


module.exports = router;

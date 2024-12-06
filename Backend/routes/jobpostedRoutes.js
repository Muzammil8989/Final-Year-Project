const express = require("express");
const { check } = require("express-validator");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  countTotalApplications,
} = require("../controllers/jobpostedController");
const auth = require("../middleware/auth");

const router = express.Router();
const upload = require("../middleware/upload");

// @route POST api/jobs/jobspost
// @desc Create a new job
// @access Private
router.post(
  "/jobspost",
  upload.single("logo"),
  auth,
  [
    // Validation for required fields
    check("title", "Title is required").notEmpty(),
    check("company", "Company name is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
    check("location", "Location is required").notEmpty(),
    check("salary", "Salary must be a number").notEmpty().isNumeric(),
    check("type", "Type must be one of 'Remote', 'On-site', or 'Hybrid'").isIn([
      "Remote",
      "On-site",
      "Hybrid",
    ]),
  ],
  createJob
);

// @route GET api/jobs/getJobs
// @desc Get all jobs
// @access Public
router.get("/getJobs", getAllJobs);

// @route GET api/jobs/getJobById/:id
// @desc Get a job by ID
// @access Public
router.get("/getJobById/:id", getJobById);

// @route PUT api/jobs/updateJob/:id
// @desc Update a job by ID
// @access Private
router.put(
  "/updateJob/:id",
  auth,
  upload.single("logo"),
  [
    // Validation for fields during update
    check("title", "Title is required").notEmpty(),
    check("company", "Company name is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
    check("location", "Location is required").notEmpty(),
    check("salary", "Salary must be a number").isNumeric(),
    check("type", "Type must be one of 'Remote', 'On-site', or 'Hybrid'").isIn([
      "Remote",
      "On-site",
      "Hybrid",
    ]),
  ],
  updateJob
);

// @route DELETE api/jobs/deleteJob/:id
// @desc Delete a job by ID
// @access Private
router.delete("/deleteJob/:id", auth, deleteJob);

// @route GET api/jobs/countTotalApplications
// @desc Count total applications across all jobs
// @access Private
router.get("/countTotalApplications", auth, countTotalApplications);

module.exports = router;

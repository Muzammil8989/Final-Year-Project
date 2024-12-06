const Job = require("../models/jobpostedModel");
const path = require("path");

// Create a new job posting
const createJob = async (req, res) => {
  const { title, company, description, location, salary, type } = req.body;

  // Validate the input fields
  if (!title || !company || !description || !location || !salary || !type) {
    return res.status(400).json({ msg: "Please fill in all required fields" });
  }

  try {
    // Initialize logoUrl
    let logoUrl = "";

    // Handle the uploaded logo
    if (req.file) {
      logoUrl = path
        .join("uploads", "company_logos", req.file.filename)
        .replace(/\\/g, "/"); // Ensure forward slashes in URLs
    }

    // Create a new job posting
    const newJob = new Job({
      title,
      company,
      logo: logoUrl,
      description,
      location,
      salary,
      type, // Include the type field
      createdBy: req.user.id,
    });

    // Save the job posting to the database
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    console.error("Error creating job:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the job." });
  }
};

// Fetch all job postings
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({})
      .populate("createdBy", "name email")
      .select("-__v"); // Exclude unnecessary fields if needed
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "An error occurred while fetching jobs." });
  }
};

// Fetch a single job posting by ID
const getJobById = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findById(id).populate("createdBy", "name email");
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    res.status(200).json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the job." });
  }
};

// Update a job posting
const updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, company, logo, description, location, salary, type } =
    req.body;

  // Validate required fields for update
  if (!title || !company || !description || !location || !salary || !type) {
    return res.status(400).json({ msg: "Please fill in all required fields" });
  }

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { title, company, logo, description, location, salary, type },
      { new: true } // Return the updated document
    );

    if (!updatedJob) {
      return res.status(404).json({ msg: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (err) {
    console.error("Error updating job:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the job." });
  }
};

// Delete a job posting
const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      return res.status(404).json({ msg: "Job not found" });
    }
    res.status(200).json({ msg: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the job." });
  }
};

// Count total applications across all jobs
const countTotalApplications = async (req, res) => {
  try {
    const result = await Job.aggregate([
      {
        $group: {
          _id: null, // Group all documents together
          totalApplicants: { $sum: "$applicants" }, // Sum the 'applicants' field
        },
      },
    ]);

    // Extract the total applicants count
    const totalApplications = result.length > 0 ? result[0].totalApplicants : 0;

    res.status(200).json({ totalApplications });
  } catch (err) {
    console.error("Error counting total applications:", err);
    res
      .status(500)
      .json({ error: "An error occurred while counting total applications." });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  countTotalApplications,
};

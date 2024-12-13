const { matchJobWithResume } = require("../services/jobResumeService"); // Assuming you have this function
const Application = require("../models/jobapplicationModel");
const Job = require("../models/jobpostedModel");
const Resume = require("../models/resumeModal");

const createApplication = async (req, res) => {
  const { job, resume, status } = req.body;

  // Validate the input fields
  if (!job || !resume) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  try {
    const candidate = req.user.id; // Assume authenticated user is the candidate

    // Check if the user has already applied for the same job
    const existingApplication = await Application.findOne({ candidate, job });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job." });
    }

    // Fetch the job and resume details
    const jobDetails = await Job.findById(job);
    const resumeDetails = await Resume.findById(resume);

    // If either job or resume does not exist, return an error
    if (!jobDetails || !resumeDetails) {
      return res.status(404).json({ message: "Job or Resume not found." });
    }

    // Calculate the match score based on job description and resume content
    const matchScore = await matchJobWithResume(job, resume);

    // Create a new application
    const newApplication = new Application({
      candidate, // Derived from authenticated user
      job,
      resume,
      status: status || "Applied", // Default status is 'Applied'
      matchScore, // Add match score to the application
    });

    // Save the application to the database
    const savedApplication = await newApplication.save();

    // Increment the applicants count in the Job document
    const updatedJob = await Job.findByIdAndUpdate(
      job,
      { $inc: { applicants: 1 } },
      { new: true } // Return the updated document
    );

    if (!updatedJob) {
      // If the Job document wasn't found, you might want to handle it
      // For example, you could delete the created application to maintain consistency
      await Application.findByIdAndDelete(savedApplication._id);
      return res
        .status(404)
        .json({ message: "Job not found. Application not saved." });
    }

    res.status(201).json({
      application: savedApplication,
      job: updatedJob,
      message: "Application created successfully.",
    });
  } catch (err) {
    console.error("Error creating application:", err);
    res
      .status(500)
      .json({ message: "An error occurred while creating the application." });
  }
};

// Get all applications
const getAllApplications = async (req, res) => {
  try {
    // Get the jobId from the query string
    const jobId = req.query.job;

    // Ensure jobId is provided
    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    // Find the job by ID to ensure it's valid (optional step)
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Fetch applications for this job
    const applications = await Application.find({ job: jobId })
      .populate("candidate") // Assuming 'candidate' is a reference to a User model
      .populate("resume") // Assuming 'resume' is a reference to a Resume model
      .exec();

    // Return the applications as a response
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single application by ID
const getApplicationById = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await Application.findById(id).populate(
      "candidate job"
    );
    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }
    res.status(200).json(application);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the application." });
  }
};

// Update an application
const updateApplication = async (req, res) => {
  const { id } = req.params;
  const { resume, status } = req.body;

  try {
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }

    // Update the application fields
    if (resume) application.resume = resume;
    if (status) application.status = status;

    const updatedApplication = await application.save();
    res.status(200).json(updatedApplication);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the application." });
  }
};

// Delete an application
const deleteApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await Application.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the application." });
  }
};

// Get total count of each application status
const getStatusCounts = async (req, res) => {
  try {
    // Perform the aggregation to get counts for each status
    const statusCounts = await Application.aggregate([
      {
        $group: {
          _id: "$status", // Group by the 'status' field
          count: { $sum: 1 }, // Count the number of applications for each status
        },
      },
    ]);

    // Calculate the total count of all applications
    const totalApplications = statusCounts.reduce(
      (acc, item) => acc + item.count,
      0
    );

    // Convert the aggregation result into a more readable format and calculate percentages
    const formattedCounts = statusCounts.reduce((acc, item) => {
      const percentage =
        totalApplications > 0 ? (item.count / totalApplications) * 100 : 0;
      acc[item._id] = {
        count: item.count,
        percentage: parseFloat(percentage.toFixed(2)),
      };
      return acc;
    }, {});

    // Send the response with both counts and percentages
    res.status(200).json(formattedCounts);
  } catch (err) {
    console.error("Error fetching status counts:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching status counts." });
  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getStatusCounts,
};

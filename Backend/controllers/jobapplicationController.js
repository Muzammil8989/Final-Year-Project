const { matchJobWithResume } = require("../services/jobResumeService"); // Assuming you have this function
const Application = require("../models/jobapplicationModel");
const Job = require("../models/jobpostedModel");
const Resume = require("../models/resumeModal");
const transporter = require("../config/nodemailer");

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

// Update the status of an application based on job and candidate
const updateApplicationStatus = async (req, res) => {
  const { _id, status } = req.body; // Get job, candidate, and status from request body

  // Ensure all required fields are provided
  if (!status || !_id) {
    return res
      .status(400)
      .json({ message: "Please provide both _id and status." });
  }

  // Validate ObjectId format
  const mongoose = require("mongoose");
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  // Define valid statuses
  const validStatuses = ["Applied", "Interview", "Hired", "Rejected"];
  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ message: "Invalid status. Please provide a valid status." });
  }

  try {
    // Log to verify the input
    console.log("Finding application with ID:", _id);

    // Find the application based on _id
    const application = await Application.findOne({ _id });

    // If no application found, return error
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Log the application found (for debugging purposes)
    console.log("Found application:", application);

    // Update the application's status
    application.status = status;

    // Save the updated application
    const updatedApplication = await application.save();

    // Return success message with updated application data
    res.status(200).json({
      message: "Application status updated successfully.",
      application: updatedApplication,
    });
  } catch (err) {
    // Handle error and log it for debugging
    console.error("Error updating application status:", err);
    res.status(500).json({
      message: "An error occurred while updating the application status.",
    });
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

const sendReportToCandidate = async (req, res) => {
  const { applicationId } = req.body; // Get the application _id from the request body

  try {
    // Find the application by _id and populate job and resume details
    const application = await Application.findById(applicationId)
      .populate("candidate")
      .populate("job");

    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found for the given ID" });
    }

    // Extract the candidate's email and other application data
    const candidateEmail = application.candidate.email;
    const { matchScore, interviewScore, quizScore, status } = application;
    const { title, description } = application.job;
    const candidateName = application.candidate.name;

    // Create the email content with inline CSS for better styling
    const emailContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
            <div style="background-color: #007bff; color: white; padding: 10px; border-radius: 5px; text-align: center;">
              <h1 style="font-size: 24px;">Application Report</h1>
            </div>
            <div style="margin-top: 20px;">
              <p>Dear <strong>${candidateName}</strong>,</p>
              <p>Here is the report for your application to the job: <strong>${title}</strong>.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">Status:</th>
                  <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; color: #555; font-weight: bold;">${status}</td>
                </tr>
                <tr>
                  <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">Job Title:</th>
                  <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; color: #555;">${title}</td>
                </tr>
                <tr>
                  <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">Job Description:</th>
                  <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; color: #555;">${description}</td>
                </tr>
                <tr>
                  <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">Resume Match Score:</th>
                  <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; color: #555;">${matchScore}</td>
                </tr>
                <tr>
                  <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">Interview Score:</th>
                  <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; color: #555;">${interviewScore}</td>
                </tr>
                <tr>
                  <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; background-color: #f2f2f2;">Quiz Score:</th>
                  <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd; color: #555;">${quizScore}</td>
                </tr>
              </table>
            </div>
            <div style="font-size: 14px; text-align: center; color: #777; margin-top: 30px;">
              <p>Thank you for applying!</p>
              <p>Best regards,<br/>AIRA Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL, // Sender email address
      to: candidateEmail, // Recipient email address
      subject: "Your Application Report",
      html: emailContent, // HTML content of the email
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res
      .status(200)
      .json({ message: "Report sent to the candidate successfully." });
  } catch (err) {
    console.error("Error sending report:", err);
    res
      .status(500)
      .json({ message: "An error occurred while sending the report." });
  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getStatusCounts,
  updateApplicationStatus,
  sendReportToCandidate,
};

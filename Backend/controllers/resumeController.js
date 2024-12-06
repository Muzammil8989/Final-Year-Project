const Resume = require("../models/resumeModal");

const createResume = async (req, res) => {
  try {
    const userId = req.user.id; // Use req.user.id based on the decoded output
    console.log("User ID (candidate):", userId); // Log to confirm it's defined

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request." });
    }

    const {
      name,
      contact_number,
      email,
      linkedin,
      address,
      skills,
      education,
      colleges,
      work_experience,
      certifications,
    } = req.body;

    // Handle file path if a file was uploaded
    let filePath = "";
    if (req.file) {
      filePath = req.file.path;
    }

    // Safely handle array creation, check if the field exists
    const handleArrayField = (field) => {
      return field && Array.isArray(field)
        ? field
        : field && field.split(",").map((item) => item.trim());
    };

    // Create the resume with the candidate's ID
    const resume = new Resume({
      candidate: userId, // Use the authenticated user's ID
      filePath,
      name,
      contact_number,
      email,
      linkedin,
      address,
      skills: handleArrayField(skills),
      education: handleArrayField(education),
      colleges: handleArrayField(colleges),
      work_experience,
      certifications: handleArrayField(certifications),
    });

    await resume.save();
    res.status(201).json({ message: "Resume created successfully", resume });
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all resumes
const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().populate("candidate");
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes", error });
  }
};

// Get a single resume by ID
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).populate("candidate");
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resume", error });
  }
};

// Update a resume by ID
const updateResume = async (req, res) => {
  try {
    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(200).json(updatedResume);
  } catch (error) {
    res.status(500).json({ message: "Error updating resume", error });
  }
};

// Delete a resume by ID
const deleteResume = async (req, res) => {
  try {
    const deletedResume = await Resume.findByIdAndDelete(req.params.id);
    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resume", error });
  }
};

module.exports = {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
};

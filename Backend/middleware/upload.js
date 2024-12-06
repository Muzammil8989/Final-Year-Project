const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Helper function to ensure directory existence
const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Define storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";

    // Determine the destination folder based on file type
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      // If it's an image (company logo), save it in 'company_logos/'
      uploadPath = path.join(__dirname, "../uploads/company_logos/");
    } else if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // If it's a PDF or DOC/DOCX (resume), save it in 'resumes/'
      uploadPath = path.join(__dirname, "../uploads/resumes/");
    } else {
      // Reject other file types
      return cb(
        new Error(
          "Invalid file type! Only images, PDF, and DOC/DOCX are allowed."
        ),
        false
      );
    }

    // Ensure the directory exists
    try {
      ensureDirectoryExistence(uploadPath);
      cb(null, uploadPath);
    } catch (err) {
      cb(err, false);
    }
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with a timestamp and the original name
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to allow only images (JPEG, PNG, JPG), PDFs, DOC, and DOCX files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf", // For PDFs
    "application/msword", // For DOC files
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // For DOCX files
    "image/jpeg", // For JPEG images
    "image/jpg", // For JPG images
    "image/png", // For PNG images
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error("Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed!"),
      false
    ); // Reject the file
  }
};

// Apply the storage and file filter to Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;

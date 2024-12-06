const express = require("express");
const connectDB = require("./config/dbConfig");
const path = require("path");
const userRoutes = require("./routes/jobpostedRoutes");
const applicationRoutes = require("./routes/jobappicationRoutes");
const jobRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// CORS
app.use(cors());

// Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use(
  "/api",
  jobRoutes,
  userRoutes,
  applicationRoutes,
  resumeRoutes,
  questionRoutes,
  answerRoutes,
  interviewRoutes
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

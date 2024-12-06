const Job = require("../models/jobpostedModel");
const Resume = require("../models/resumeModal");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to fetch job and resume by their IDs
async function getJobAndResume(jobId, resumeId) {
  const job = await Job.findById(jobId);
  const resume = await Resume.findById(resumeId);
  return { job, resume };
}

// Function to match the job description with the resume text using OpenAI's API
async function matchJobDescriptionWithResume(jobDescription, resumeText) {
  try {
    // Ensure both job description and resume text are not empty
    if (!jobDescription || !resumeText) {
      throw new Error("Job description or resume text is missing.");
    }

    // Use OpenAI's chat API for comparison
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Ensure to use the correct model
      messages: [
        {
          role: "system",
          content:
            "You are a job matching assistant that compares job descriptions with resumes.",
        },
        {
          role: "user",
          content: `Compare the following job description with this resume. Provide a match score out of 100:

            Job Description: 
            ${jobDescription}

            Resume:
            ${resumeText}

            Match score:`,
        },
      ],
      temperature: 0, // Controls randomness
      max_tokens: 60, // Limit response length
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Log the response for debugging purposes
    console.log("OpenAI Response:", response);

    // Parse the match score from the response
    const matchScore = parseInt(response.choices[0].message.content.trim(), 10);

    // Check if matchScore is a valid number
    if (isNaN(matchScore)) {
      throw new Error("Failed to parse a valid match score.");
    }

    return matchScore;
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    return 0; // Return 0 score if the API call fails or an error occurs
  }
}

// Function to match job description with resume content
async function matchJobWithResume(jobId, resumeId) {
  const { job, resume } = await getJobAndResume(jobId, resumeId);

  // Validate that the job and resume exist
  if (!job || !resume) {
    throw new Error("Job or Resume not found.");
  }

  // Combine multiple sections of the resume (e.g., work experience, skills) for better matching
  const resumeText = [
    resume.work_experience,
    resume.skills,
    resume.education,
    resume.certifications,
  ]
    .filter(Boolean) // Remove any empty sections
    .join(" ");

  // Use GPT API to match job description with resume text
  const matchScore = await matchJobDescriptionWithResume(
    job.description,
    resumeText
  );

  return matchScore;
}

module.exports = {
  matchJobWithResume,
};

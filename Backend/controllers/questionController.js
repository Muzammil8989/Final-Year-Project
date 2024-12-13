const Question = require("../models/QuestionModel");
const Job = require("../models/jobpostedModel");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API Key
});

exports.generateMCQ = async (req, res) => {
  try {
    const { jobId } = req.params; // Extract jobId from the request parameters

    // Find the job details from the Job model using jobId
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const questionsArray = []; // To hold all the generated questions

    for (let i = 0; i < 10; i++) {
      // Generate a prompt for the OpenAI model based on the job description
      const prompt = `
         Generate a multiple-choice question (MCQ) based on the job title below:
        Job Description: ${job.title}
    
        The question should be related to the job role, focusing on conceptual knowledge, analytical reasoning, and problem-solving skills. It should involve deeper analysis of the job responsibilities, strategic thinking, and case study scenarios that might arise in the job role.
    
        Make sure that the question is challenging, requires critical thinking, and tests the candidate’s ability to apply their knowledge to real-world job situations.
    
        Provide 4 possible answers, with one correct answer and three plausible distractors. Each answer option should challenge the candidate's understanding of the job, and the correct answer should be the most reasonable choice.
    
        Please ensure the questions are designed to assess:
        1. Conceptual understanding of core job responsibilities.
        2. Analytical reasoning and the ability to solve complex problems.
        3. Application of skills to real-world case studies and scenarios.

        Format the output as follows:
        - Question: [Question Text]
          1. [Answer Option 1]
          2. [Answer Option 2]
          3. [Answer Option 3]
          4. [Answer Option 4]
        - Correct Answer ID: [Answer Option Number]
      `;

      // Make the request to OpenAI's API to generate the MCQ
      const openAIResponse = await openai.chat.completions.create({
        model: "gpt-4", // Model to use
        messages: [{ role: "user", content: prompt }],
      });

      // Extract the response from OpenAI
      const responseContent = openAIResponse.choices[0].message.content.trim();

      // Log the response for debugging purposes
      console.log("Response Content:", responseContent);

      // Parse the response to extract question and answers
      const parsedResponse = parseMCQResponse(responseContent);

      if (!parsedResponse) {
        return res
          .status(500)
          .json({ message: "Error parsing OpenAI response" });
      }

      // Ensure correctAnswerId is a valid number
      const correctAnswerId = parsedResponse.correctAnswerId;
      console.log("Parsed correctAnswerId:", correctAnswerId);

      if (isNaN(correctAnswerId)) {
        return res.status(400).json({ message: "Invalid correct answer ID" });
      }

      const hrId = req.user.id;

      // Create a new question document to save
      const newQuestion = new Question({
        job: jobId,
        hrId: hrId,
        question: parsedResponse.question,
        answers: parsedResponse.answers,
        correctAnswerId: correctAnswerId,
      });

      // Save the question to the database
      await newQuestion.save();

      // Push the newly created question to the array
      questionsArray.push(newQuestion);
    }

    // Return the newly created MCQs in the response
    res.status(201).json({
      message: "MCQs created successfully",
      questions: questionsArray,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to parse the OpenAI response into a structured format
// Helper function to parse the OpenAI response into a structured format
const parseMCQResponse = (responseContent) => {
  const lines = responseContent.split("\n").map((line) => line.trim()); // Trim each line for extra spaces

  if (lines.length < 6) return null; // If there aren't enough lines, return null (error in parsing)

  const question = lines[0].replace("Question: ", "").trim();

  // Ensure that answers are properly parsed and not empty
  const answers = lines.slice(1, 5).map((line, index) => {
    const answerText = line.replace(`${index + 1}.`, "").trim();
    if (!answerText) {
      console.error(`Answer ${index + 1} is missing!`);
      return {
        id: index + 1,
        text: `Fallback Answer ${index + 1}`, // If no answer text, use fallback
      };
    }
    return {
      id: index + 1,
      text: answerText,
    };
  });

  // Extract the correct answer ID dynamically from the OpenAI response
  const correctAnswerId = extractCorrectAnswerId(lines);

  // If valid number, return the parsed question and answers; otherwise, return null
  if (isNaN(correctAnswerId)) {
    console.error("Invalid correct answer ID in response.");
    return null;
  }

  return { question, answers, correctAnswerId };
};

// Helper function to extract the correct answer ID from the OpenAI response
const extractCorrectAnswerId = (lines) => {
  // Log lines to help debug
  console.log("Lines from response:", lines);

  const correctAnswerLine = lines.find((line) =>
    line.toLowerCase().includes("correct answer id:")
  );

  // Log the line to debug
  console.log("Extracted Correct Answer Line:", correctAnswerLine);

  if (correctAnswerLine) {
    // Use a regular expression to extract the number after "Correct Answer ID:"
    const match = correctAnswerLine.match(/Correct Answer ID:\s*(\d+)/);

    if (match && match[1]) {
      // Successfully extracted the number
      const correctAnswerId = parseInt(match[1], 10);

      // Log the parsed ID for debugging
      console.log("Parsed Correct Answer ID:", correctAnswerId);

      if (!isNaN(correctAnswerId)) {
        return correctAnswerId;
      }
    } else {
      console.error("No valid number found for correct answer ID in response.");
    }
  } else {
    console.error("Correct Answer ID not found in response.");
  }

  return NaN; // Return NaN if no valid correct answer ID is found
};

exports.getQuestionsForJob = async (req, res) => {
  const { jobId } = req.params; // Job ID passed as a URL parameter

  try {
    // Fetch the job from the database to ensure it exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).send({ error: "Job not found" });
    }

    // Retrieve the questions for the specific job, without populating hrId
    const questions = await Question.find({ job: jobId })
      .select("question answers correctAnswerId job") // Return only relevant fields
      .lean(); // Use .lean() to get a plain JavaScript object

    // If no questions found, return an appropriate message
    if (questions.length === 0) {
      return res.status(404).send({ error: "No questions found for this job" });
    }

    // Optionally, you can include additional job details (e.g., job title) by using jobId
    const jobDetails = {
      title: job.title, // Assuming your Job model has a `title` field
      description: job.description, // Similarly, a description field
      // Add any other fields you need here
    };

    // Return the retrieved questions and job details
    res.status(200).send({ questions, jobDetails });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
};

exports.getQuestionsForJobById = async (req, res) => {
  const { jobId } = req.body; // Job ID passed in the request body

  try {
    // Fetch the job from the database to ensure it exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).send({ error: "Job not found" });
    }

    // Return only the jobId
    res.status(200).send({ jobId: job._id });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
};

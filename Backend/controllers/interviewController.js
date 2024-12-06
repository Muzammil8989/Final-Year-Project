const mongoose = require("mongoose");
const OpenAI = require("openai");
const Interview = require("../models/interviewModel");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function simulateInterview(req, res) {
  const { userAnswer, currentStep } = req.body; // Get user answer and current step from the client
  const candidateId = req.user?.id; // Get candidate ID from req.user

  try {
    // Validate candidateId
    if (!candidateId) {
      return res.status(400).json({ error: "Candidate ID is required." });
    }

    // Handle the first step: The introductory question
    let interviewQuestions = [];
    if (currentStep === 0) {
      // First question: "Tell me about yourself"
      interviewQuestions.push("1.Tell me about yourself");

      return res.status(200).json({
        question: interviewQuestions[0], // Send the first question
        nextStep: 1, // Indicate that the next step is the candidate's response
      });
    }

    // Process the user's answer to the first question
    if (userAnswer) {
      // Generate follow-up questions based on the user's answer
      const openAIResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an HR assistant conducting a general job interview. The user just provided their self-introduction. Based on their response, generate 5 follow-up questions that are relevant and meaningful for the next steps in the interview.",
          },
          {
            role: "user",
            content: `The user said: "${userAnswer}"`, // Candidate's response to the first question
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      // Parse the generated follow-up questions and limit to 5
      const generatedQuestions = openAIResponse.choices[0].message.content
        .trim()
        .split("\n")
        .map((q) => q.trim())
        .slice(0, 5); // Limit to 5 questions

      if (generatedQuestions.length === 0) {
        return res.status(400).json({
          error: "Failed to generate follow-up questions. Please try again.",
        });
      }

      interviewQuestions = generatedQuestions; // Store the generated questions for further use
    }

    // Ask the next question from the generated array of questions, limit to 5
    if (currentStep < interviewQuestions.length && currentStep < 5) {
      const questionToAsk = interviewQuestions[currentStep];

      return res.status(200).json({
        question: questionToAsk, // Send the next question to the candidate
        nextStep: currentStep + 1, // Increment the step for the next question
      });
    }

    // If all questions have been asked, score the interview
    if (currentStep >= 5 || currentStep === interviewQuestions.length) {
      const answers = []; // Collect all answers from the user (could come from the frontend in a batch)
      const timeTakenData = []; // Collect simulated time taken for each answer

      // Simulate time for each answer
      interviewQuestions.forEach((question, idx) => {
        answers.push({ question, answer: userAnswer }); // Save user answer
        timeTakenData.push({
          question,
          timeTaken: Math.floor(Math.random() * 30) + 10, // Simulated random time taken
        });
      });

      // Analyze the entire conversation and score the interview
      const analysisResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are evaluating a candidate's performance in a job interview. Based on the questions and answers below, provide a score from 0 to 10.",
          },
          ...interviewQuestions.map((q, idx) => ({
            role: "assistant",
            content: q, // Send both question and answer for analysis
          })),
        ],
        temperature: 0.5,
        max_tokens: 50,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const analysis = analysisResponse.choices[0].message.content.trim();
      const extractedScore = parseInt(analysis.match(/\d+/)?.[0], 10) || 0;
      const normalizedScore = Math.max(0, Math.min(extractedScore, 10));
      const scoreOutOf100 = (normalizedScore / 10) * 100;

      // Save the interview data to MongoDB
      const interviewData = new Interview({
        candidateId,
        questions: interviewQuestions,
        answers,
        score: Math.round(scoreOutOf100),
      });

      await interviewData.save();

      return res.status(201).json({
        message: "Interview session completed successfully.",
        score: scoreOutOf100,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error:
        "An error occurred during the interview process. Please try again.",
    });
  }
}

module.exports = { simulateInterview };

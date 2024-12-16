const mongoose = require("mongoose");
const OpenAI = require("openai");
const Interview = require("../models/interviewModel");
const Application = require("../models/jobapplicationModel");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function simulateInterview(req, res) {
  const { userAnswer, currentStep } = req.body;
  const candidateId = req.user?.id;
  let responseSent = false; // Flag to prevent multiple responses

  try {
    console.log("Starting simulateInterview function");
    console.log("Request body:", req.body);
    console.log("Candidate ID:", candidateId);

    if (!candidateId) {
      console.error("Candidate ID is missing.");
      return res.status(400).json({ error: "Candidate ID is required." });
    }

    // Check if the candidate's application exists and has a resumeId
    const application = await Application.findOne({
      candidate: candidateId,
    }).populate("job");
    if (!application || !application.resume) {
      console.error("No resume found for the candidate.");
      return res
        .status(400)
        .json({ error: "Resume ID is required to start the interview." });
    }

    console.log(
      "Candidate application found with resumeId:",
      application.resume
    );

    // Get the job title from the populated job data
    const jobTitle = application.job?.title;
    if (!jobTitle) {
      console.error("Job title not found.");
      return res.status(400).json({ error: "Job information not found." });
    }

    console.log("Job title fetched:", jobTitle);

    // Fetch or create interview session
    let interviewSession = await Interview.findOne({ candidateId });
    console.log("Fetched interview session:", interviewSession);

    if (!interviewSession) {
      console.log("No session found, creating a new one.");
      interviewSession = new Interview({
        candidateId,
        questions: [],
        answers: [], // Initialize the answers array
      });
      await interviewSession.save();
    }

    // Handle first question based on job title
    if (currentStep === 0 && interviewSession.questions.length === 0) {
      console.log("Current step is 0, sending first question.");

      // Generate a customized question based on job title
      const question = `What are experiences you have in ${jobTitle}?`; // Job-specific question
      interviewSession.questions.push(question);
      await interviewSession.save();

      // Set a timer to limit the duration of answers (1 minute)
      setTimeout(async () => {
        if (!responseSent) {
          // If the answer hasn't been provided by the candidate, we set a default placeholder
          if (interviewSession.answers.length === currentStep) {
            interviewSession.answers.push(
              "No answer provided within time limit."
            );
            await interviewSession.save();
          }
          // Send the next question automatically after timeout
          if (!responseSent) {
            responseSent = true;
            return res.status(200).json({
              question: interviewSession.questions[currentStep],
              nextStep: currentStep + 1,
            });
          }
        }
      }, 60000); // 1 minute duration for answering

      // Send the question immediately
      if (!responseSent) {
        responseSent = true;
        return res.status(200).json({
          question: interviewSession.questions[0],
          nextStep: 1,
        });
      }
    }

    // Handle generating follow-up questions after the first answer
    if (currentStep === 1 && interviewSession.questions.length === 1) {
      console.log("Generating follow-up questions.");
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
            content: `The user said: "${userAnswer}"`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      console.log("OpenAI response received:", openAIResponse);

      const generatedQuestions = openAIResponse.choices[0].message.content
        .trim()
        .split("\n")
        .map((q) => q.trim())
        .slice(0, 2);

      console.log("Generated questions:", generatedQuestions);

      if (generatedQuestions.length === 0) {
        console.error("No questions generated.");
        return res.status(400).json({
          error: "Failed to generate follow-up questions. Please try again.",
        });
      }

      interviewSession.questions.push(...generatedQuestions);
      await interviewSession.save();
    }

    // Save the user's answer
    if (userAnswer) {
      console.log(`Saving user's answer: ${userAnswer}`);
      interviewSession.answers.push(userAnswer);
      await interviewSession.save();
    }

    // Check if all questions have been answered
    if (interviewSession.answers.length === interviewSession.questions.length) {
      console.log("All questions answered. Proceeding to scoring.");

      // Analyze all answers for scoring
      let totalScore = 0;

      for (let i = 0; i < interviewSession.answers.length; i++) {
        const userAnswer = interviewSession.answers[i];

        const openAIScoreResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are a job interviewer assessing the quality of an answer. Provide a score from 1 to 10 based on the answer quality. Consider clarity, relevance, and depth.",
            },
            {
              role: "user",
              content: `The user said: "${userAnswer}"`,
            },
          ],
          temperature: 0.5,
          max_tokens: 60,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        const scoreText = openAIScoreResponse.choices[0].message.content;
        const rawScore = parseInt(scoreText.trim(), 10); // Parse the score

        // Normalize the score to be out of 100
        const score = Math.min(100, Math.max(0, rawScore * 10)); // Multiply by 10 to scale it to 100
        totalScore += score;
      }

      // Calculate the average score
      const averageScore = totalScore / interviewSession.answers.length;
      const roundedScore = Math.round(averageScore); // Round off the average score to the nearest whole number
      console.log(`Calculated average score: ${roundedScore}`);

      // Update the Application model with the interview score
      if (application) {
        application.interviewScore = roundedScore; // Update the score with the rounded value
        await application.save();
        console.log("Application score updated:", application);
      } else {
        console.log("No application found for the candidate.");
      }

      // Finish the interview
      return res.status(200).json({
        message: "Interview session completed successfully.",
        score: averageScore,
      });
    }

    // Send the next question
    return res.status(200).json({
      question: interviewSession.questions[currentStep],
      nextStep: currentStep + 1,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({
      error:
        "An error occurred during the interview process. Please try again.",
    });
  }
}

module.exports = { simulateInterview };

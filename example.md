http://localhost:5001/api/jobs/673f7d233bf326e650d2fb85/questions
http://localhost:5001/api/answers
// const mongoose = require("mongoose");
// const OpenAI = require("openai");
// const Interview = require("../models/interviewModel");
// const Application = require("../models/jobapplicationModel");

// const openai = new OpenAI({
// apiKey: process.env.OPENAI_API_KEY,
// });

// async function simulateInterview(req, res) {
// const { userAnswer, currentStep } = req.body;
// const candidateId = req.user?.id;

// try {
// console.log("Starting simulateInterview function");
// console.log("Request body:", req.body);
// console.log("Candidate ID:", candidateId);

// if (!candidateId) {
// console.error("Candidate ID is missing.");
// return res.status(400).json({ error: "Candidate ID is required." });
// }

// // Fetch or create interview session
// let interviewSession = await Interview.findOne({ candidateId });
// console.log("Fetched interview session:", interviewSession);

// if (!interviewSession) {
// console.log("No session found, creating a new one.");
// interviewSession = new Interview({
// candidateId,
// questions: [],
// answers: [], // Initialize the answers array
// });
// await interviewSession.save();
// }

// // Handle first question
// if (currentStep === 0 && interviewSession.questions.length === 0) {
// console.log("Current step is 0, sending first question.");
// interviewSession.questions.push("Tell me about yourself");
// await interviewSession.save();

// return res.status(200).json({
// question: interviewSession.questions[0],
// nextStep: 1,
// });
// }

// // Handle generating follow-up questions after the first answer
// if (currentStep === 1 && interviewSession.questions.length === 1) {
// console.log("Generating follow-up questions.");
// const openAIResponse = await openai.chat.completions.create({
// model: "gpt-4",
// messages: [
// {
// role: "system",
// content:
// "You are an HR assistant conducting a general job interview. The user just provided their self-introduction. Based on their response, generate 5 follow-up questions that are relevant and meaningful for the next steps in the interview.",
// },
// {
// role: "user",
// content: `The user said: "${userAnswer}"`,
// },
// ],
// temperature: 0.7,
// max_tokens: 200,
// top_p: 1,
// frequency_penalty: 0,
// presence_penalty: 0,
// });

// console.log("OpenAI response received:", openAIResponse);

// const generatedQuestions = openAIResponse.choices[0].message.content
// .trim()
// .split("\n")
// .map((q) => q.trim())
// .slice(0, 5);

// console.log("Generated questions:", generatedQuestions);

// if (generatedQuestions.length === 0) {
// console.error("No questions generated.");
// return res.status(400).json({
// error: "Failed to generate follow-up questions. Please try again.",
// });
// }

// interviewSession.questions.push(...generatedQuestions);
// await interviewSession.save();
// }

// // Save the user's answer
// if (userAnswer) {
// console.log(`Saving user's answer: ${userAnswer}`);
// interviewSession.answers.push(userAnswer);
// await interviewSession.save();
// }

// // Analyze answer for scoring (scale it to 100)
// let score = 0;
// if (userAnswer) {
// const openAIScoreResponse = await openai.chat.completions.create({
// model: "gpt-4",
// messages: [
// {
// role: "system",
// content:
// "You are a job interviewer assessing the quality of an answer. Provide a score from 1 to 10 based on the answer quality. Consider clarity, relevance, and depth.",
// },
// {
// role: "user",
// content: `The user said: "${userAnswer}"`,
// },
// ],
// temperature: 0.5,
// max_tokens: 60,
// top_p: 1,
// frequency_penalty: 0,
// presence_penalty: 0,
// });

// const scoreText = openAIScoreResponse.choices[0].message.content;
// const rawScore = parseInt(scoreText.trim(), 10); // Parse the score

// // Normalize the score to be out of 100
// score = rawScore \* 10; // Multiply by 10 to scale it to 100
// score = Math.min(100, Math.max(0, score)); // Ensure score is between 0 and 100
// }

// // Update the Application model with the interview score
// if (score > 0) {
// const application = await Application.findOne({ candidate: candidateId });
// if (application) {
// application.interviewScore = score; // Update the score
// await application.save();
// console.log("Application score updated:", application);
// } else {
// console.log("No application found for the candidate.");
// }
// }

// // Send the next question or finish the interview
// if (currentStep < interviewSession.questions.length) {
// console.log(`Sending question for step ${currentStep}.`);
// return res.status(200).json({
// question: interviewSession.questions[currentStep],
// nextStep: currentStep + 1,
// });
// }

// // Finish the interview when all questions have been answered
// return res.status(200).json({
// message: "Interview session completed successfully.",
// });
// } catch (error) {
// console.error("Error occurred:", error);
// return res.status(500).json({
// error:
// "An error occurred during the interview process. Please try again.",
// });
// }
// }

// module.exports = { simulateInterview };
{
"message": "Questions created successfully",
"questions": [
{
"job": "673f7d233bf326e650d2fb85",
"hrId": "66d013deb6c11e604230f7cf",
"question": "What is the difference between a stack and a queue?",
"answers": [
{
"id": 1,
"text": "A stack operates on Last-In-First-Out (LIFO) principle, while a queue operates on First-In-First-Out (FIFO) principle.",
"_id": "674e51c8408055c5a9b8fe30"
},
{
"id": 2,
"text": "Stacks allow insertion and removal from the middle, while queues only allow removal from the front.",
"_id": "674e51c8408055c5a9b8fe31"
},
{
"id": 3,
"text": "There is no difference between them.",
"_id": "674e51c8408055c5a9b8fe32"
},
{
"id": 4,
"text": "Stacks are used for storing data sequentially, while queues store data in a random order.",
"_id": "674e51c8408055c5a9b8fe33"
}
],
"correctAnswerId": 1,
"\_id": "674e51c8408055c5a9b8fe2f",
"createdAt": "2024-12-03T00:33:12.205Z",
"**v": 0
},
{
"job": "673f7d233bf326e650d2fb85",
"hrId": "66d013deb6c11e604230f7cf",
"question": "What is polymorphism in object-oriented programming?",
"answers": [
{
"id": 1,
"text": "It allows objects of different classes to be treated as objects of a common superclass.",
"_id": "674e51c8408055c5a9b8fe35"
},
{
"id": 2,
"text": "It is the concept of inheriting methods from multiple classes.",
"_id": "674e51c8408055c5a9b8fe36"
},
{
"id": 3,
"text": "It is the process of converting one data type to another.",
"_id": "674e51c8408055c5a9b8fe37"
},
{
"id": 4,
"text": "It is the ability to redefine methods in subclasses.",
"_id": "674e51c8408055c5a9b8fe38"
}
],
"correctAnswerId": 1,
"\_id": "674e51c8408055c5a9b8fe34",
"createdAt": "2024-12-03T00:33:12.206Z",
"**v": 0
},
{
"job": "673f7d233bf326e650d2fb85",
"hrId": "66d013deb6c11e604230f7cf",
"question": "What is overfitting in machine learning?",
"answers": [
{
"id": 1,
"text": "It occurs when the model learns the details of the training data too well and performs poorly on unseen data.",
"_id": "674e51c8408055c5a9b8fe3a"
},
{
"id": 2,
"text": "It occurs when the model fails to capture the underlying trend of the data.",
"_id": "674e51c8408055c5a9b8fe3b"
},
{
"id": 3,
"text": "It is when a model predicts values too precisely.",
"_id": "674e51c8408055c5a9b8fe3c"
},
{
"id": 4,
"text": "It happens when a model's training data is too small.",
"_id": "674e51c8408055c5a9b8fe3d"
}
],
"correctAnswerId": 1,
"\_id": "674e51c8408055c5a9b8fe39",
"createdAt": "2024-12-03T00:33:12.206Z",
"**v": 0
},
{
"job": "673f7d233bf326e650d2fb85",
"hrId": "66d013deb6c11e604230f7cf",
"question": "What is the purpose of a confusion matrix?",
"answers": [
{
"id": 1,
"text": "It evaluates the accuracy of a classification model.",
"_id": "674e51c8408055c5a9b8fe3f"
},
{
"id": 2,
"text": "It measures the variance of the training data.",
"_id": "674e51c8408055c5a9b8fe40"
},
{
"id": 3,
"text": "It evaluates the computational efficiency of a model.",
"_id": "674e51c8408055c5a9b8fe41"
},
{
"id": 4,
"text": "It shows the distribution of false positives and false negatives.",
"_id": "674e51c8408055c5a9b8fe42"
}
],
"correctAnswerId": 1,
"\_id": "674e51c8408055c5a9b8fe3e",
"createdAt": "2024-12-03T00:33:12.207Z",
"**v": 0
},
{
"job": "673f7d233bf326e650d2fb85",
"hrId": "66d013deb6c11e604230f7cf",
"question": "What is the difference between HTML and HTML5?",
"answers": [
{
"id": 1,
"text": "HTML5 includes new features like video and audio support, improved form controls, and semantic elements.",
"_id": "674e51c8408055c5a9b8fe44"
},
{
"id": 2,
"text": "HTML5 is an older version and does not support modern features.",
"_id": "674e51c8408055c5a9b8fe45"
},
{
"id": 3,
"text": "There is no difference between HTML and HTML5.",
"_id": "674e51c8408055c5a9b8fe46"
},
{
"id": 4,
"text": "HTML5 includes better support for mobile applications.",
"_id": "674e51c8408055c5a9b8fe47"
}
],
"correctAnswerId": 1,
"\_id": "674e51c8408055c5a9b8fe43",
"createdAt": "2024-12-03T00:33:12.207Z",
"**v": 0
},
{
"job": "673f7d233bf326e650d2fb85",
"hrId": "66d013deb6c11e604230f7cf",
"question": "What is the use of a primary key in a database?",
"answers": [
{
"id": 1,
"text": "It uniquely identifies each record in a database table.",
"_id": "674e51c8408055c5a9b8fe49"
},
{
"id": 2,
"text": "It allows data to be indexed for faster searching.",
"_id": "674e51c8408055c5a9b8fe4a"
},
{
"id": 3,
"text": "It connects two tables in a relational database.",
"_id": "674e51c8408055c5a9b8fe4b"
},
{
"id": 4,
"text": "It stores the password for a user in the database.",
"_id": "674e51c8408055c5a9b8fe4c"
}
],
"correctAnswerId": 1,
"\_id": "674e51c8408055c5a9b8fe48",
"createdAt": "2024-12-03T00:33:12.208Z",
"**v": 0
},
{
"job": "673f7d233bf326e650d2fb85",
"hrId": "66d013deb6c11e604230f7cf",
"question": "What is the purpose of the 'git merge' command?",
"answers": [
{
"id": 1,
"text": "It merges changes from one branch into another.",
"_id": "674e51c8408055c5a9b8fe4e"
},
{
"id": 2,
"text": "It splits a branch into multiple branches.",
"_id": "674e51c8408055c5a9b8fe4f"
},
{
"id": 3,
"text": "It clones a repository to your local machine.",
"_id": "674e51c8408055c5a9b8fe50"
},
{
"id": 4,
"text": "It reverts a commit to a previous state.",
"_id": "674e51c8408055c5a9b8fe51"
}
],
"correctAnswerId": 1,
"\_id": "674e51c8408055c5a9b8fe4d",
"createdAt": "2024-12-03T00:33:12.208Z",
"**v": 0
},
{
"job": "673f7d233bf326e650d2fb85",
"hrId": "66d013deb6c11e604230f7cf",
"question": "Which of the following is a feature of the Agile methodology?",
"answers": [
{
"id": 1,
"text": "Continuous feedback and iterative development.",
"_id": "674e51c8408055c5a9b8fe53"
},
{
"id": 2,
"text": "Waterfall approach with strict project timelines.",
"_id": "674e51c8408055c5a9b8fe54"
},
{
"id": 3,
"text": "Project completed in one single development cycle.",
"_id": "674e51c8408055c5a9b8fe55"
},
{
"id": 4,
"text": "Emphasis on planning and detailed documentation.",
"_id": "674e51c8408055c5a9b8fe56"
}
],
"correctAnswerId": 1,
"\_id": "674e51c8408055c5a9b8fe52",
"createdAt": "2024-12-03T00:33:12.209Z",
"**v": 0
}
]
}

import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function QuizComponent({ onQuizComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);

  // Fetch questions from the server
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/jobs/675833154d91aa6bdda6dde4/questions",
        );
        console.log("Fetched questions:", response.data); // Debugging: check the fetched questions
        setQuestions(response.data.questions);
        setSelectedAnswers(Array(response.data.questions.length).fill(null));
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Timer and visibility control
  useEffect(() => {
    let timer;

    if (timeLeft > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmit();
    }

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft, isSubmitted]);

  // Handle answer submission
  const handleSubmit = async () => {
    setIsSubmitted(true);
    const currentQuestion = questions[currentQuestionIndex];

    const selectedAnswerId = selectedAnswers[currentQuestionIndex];
    const questionId = currentQuestion._id;
    const isAnswerCorrect =
      selectedAnswerId === currentQuestion.correctAnswerId;

    if (isAnswerCorrect) setScore((prev) => prev + 1);

    const token = localStorage.getItem("candidateToken");
    if (!token) return alert("Please log in.");

    const {
      user: { id: candidateId },
    } = jwtDecode(token);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/answers",
        {
          candidateId,
          questionId,
          selectedAnswerId,
          isCorrect: isAnswerCorrect,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Answer submitted successfully:", response.data);

      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsSubmitted(false);
      } else {
        onQuizComplete(score + (isAnswerCorrect ? 1 : 0));
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer. Try again.");
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerId) => {
    if (!isSubmitted) {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestionIndex] = answerId;
      setSelectedAnswers(newSelectedAnswers);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl font-bold">
          <span>Question {currentQuestionIndex + 1}</span>
          <div className="flex items-center space-x-2">
            <Timer className="h-5 w-5" />
            <span
              className="text-lg font-medium"
              role="timer"
              aria-live="polite"
            >
              {timeLeft}s
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={(timeLeft / 60) * 100} className="mb-6" />
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-6 text-xl font-semibold">
              {currentQuestion?.question}
            </h2>
            <RadioGroup
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              value={selectedAnswers[currentQuestionIndex]?.toString() || ""}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {currentQuestion?.answers.map((answer) => (
                <div key={answer.id} className="relative">
                  <RadioGroupItem
                    value={answer.id.toString()}
                    id={`answer-${answer.id}`}
                    className="peer sr-only"
                    disabled={isSubmitted}
                  />
                  <Label
                    htmlFor={`answer-${answer.id}`}
                    className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    {answer.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          className="w-full transform rounded-md bg-[#4431af] px-8 py-4 font-semibold text-white transition-transform duration-300 hover:scale-105"
          disabled={
            isSubmitted || selectedAnswers[currentQuestionIndex] === null
          }
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}

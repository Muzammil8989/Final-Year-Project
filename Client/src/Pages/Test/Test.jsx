"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { notification } from "antd"; // Import notification from Ant Design

function Test() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [newQuestionsCount, setNewQuestionsCount] = useState(0);
  const [newQuestions, setNewQuestions] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/getJobs");
        if (Array.isArray(response.data)) {
          setJobs(response.data);
        } else {
          console.error(
            "Expected an array of jobs, but received:",
            response.data,
          );
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        notification.error({
          message: "Error",
          description: "Failed to fetch jobs. Please try again.",
        });
      }
    };

    fetchJobs();
  }, []);

  const handleSelectQuestionsCount = (value) => {
    const count = Number(value);
    setNewQuestionsCount(count);
    setNewQuestions(
      Array.from({ length: count }, () => ({
        question: "",
        answers: ["", "", "", ""],
        correctAnswerId: null,
      })),
    );
  };

  const handleQuestionTextChange = (index, text) => {
    setNewQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].question = text;
      return updatedQuestions;
    });
  };

  const handleAnswerChange = (questionIndex, answerIndex, text) => {
    setNewQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].answers[answerIndex] = text;
      return updatedQuestions;
    });
  };

  const handleCorrectAnswerChange = (questionIndex, correctAnswerId) => {
    setNewQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].correctAnswerId = correctAnswerId;
      return updatedQuestions;
    });
  };

  const handleSubmitQuestions = async () => {
    try {
      const token = localStorage.getItem("recruiterToken");

      if (!token) {
        notification.error({
          message: "Unauthorized",
          description:
            "You are not authorized to submit questions. Please log in.",
        });
        return;
      }

      if (!selectedJob) {
        notification.error({
          message: "Error",
          description: "Please select a job.",
        });
        return;
      }

      const jobId = selectedJob?._id;

      const payload = newQuestions.map((question) => ({
        question: question.question,
        answers: question.answers.map((answer, index) => ({
          id: index + 1,
          text: answer,
        })),
        correctAnswerId: question.correctAnswerId,
      }));

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `http://localhost:5001/api/jobs/${jobId}/questions`,
        { questions: payload },
        config,
      );

      console.log("Questions submitted successfully:", response.data);
      notification.success({
        message: "Success",
        description: "Questions submitted successfully!",
      });
      setNewQuestions([]); // Reset questions form
      setNewQuestionsCount(0);
    } catch (error) {
      console.error("Error submitting questions:", error);
      notification.error({
        message: "Error",
        description: "Failed to submit questions. Please try again.",
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-7xl">
      <CardHeader>
        <CardTitle>Add Questions to Job</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="job-select">Choose a Job</Label>
            <Select
              onValueChange={(value) =>
                setSelectedJob(jobs.find((job) => job._id === value) || null)
              }
            >
              <SelectTrigger id="job-select">
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job._id} value={job._id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedJob && (
            <>
              <div className="space-y-2">
                <Label htmlFor="question-count">Number of Questions</Label>
                <Select onValueChange={handleSelectQuestionsCount}>
                  <SelectTrigger id="question-count">
                    <SelectValue placeholder="Select number of questions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newQuestionsCount > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2">
                  {newQuestions.map((question, questionIndex) => (
                    <Card key={questionIndex}>
                      <CardContent className="space-y-4 pt-6">
                        <Input
                          value={question.question}
                          onChange={(e) =>
                            handleQuestionTextChange(
                              questionIndex,
                              e.target.value,
                            )
                          }
                          placeholder={`Enter question ${questionIndex + 1}`}
                        />
                        <div className="space-y-2">
                          {question.answers.map((answer, answerIndex) => (
                            <Input
                              key={answerIndex}
                              value={answer}
                              onChange={(e) =>
                                handleAnswerChange(
                                  questionIndex,
                                  answerIndex,
                                  e.target.value,
                                )
                              }
                              placeholder={`Answer ${answerIndex + 1}`}
                            />
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Label>Correct Answer</Label>
                          <RadioGroup
                            onValueChange={(value) =>
                              handleCorrectAnswerChange(
                                questionIndex,
                                parseInt(value),
                              )
                            }
                            value={question.correctAnswerId?.toString()}
                          >
                            {question.answers.map((_, answerIndex) => (
                              <div
                                key={answerIndex}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={(answerIndex + 1).toString()}
                                  id={`answer-${questionIndex}-${answerIndex}`}
                                />
                                <Label
                                  htmlFor={`answer-${questionIndex}-${answerIndex}`}
                                >
                                  Answer {answerIndex + 1}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Button onClick={handleSubmitQuestions} className="w-full">
                Submit All Questions
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Test;

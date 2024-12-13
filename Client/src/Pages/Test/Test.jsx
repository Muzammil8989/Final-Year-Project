"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const QuestionGenerator = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [newQuestions, setNewQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/getJobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleJobSelect = (value) => {
    const job = jobs.find((job) => job._id === value);
    if (job) {
      setSelectedJob(job);
    } else {
      console.log("Job not found!");
    }
    setNewQuestions([]); // Clear questions when a new job is selected
  };

  const generateQuestions = async () => {
    if (!selectedJob) return;

    setIsLoading(true);

    // Get the JWT token from localStorage
    const token = localStorage.getItem("recruiterToken");

    if (!token) {
      console.error("No JWT token found in localStorage");
      setIsLoading(false);
      return;
    }

    try {
      // Include the token in the Authorization header of the request
      const response = await axios.post(
        `http://localhost:5001/api/jobs/${selectedJob._id}/questions`,
        {}, // Assuming no body is needed
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        },
      );
      setNewQuestions(response.data.questions);
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Test Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="jobSelect"
              className="block text-sm font-medium text-gray-700"
            >
              Select a Job:
            </label>
            <Select
              onValueChange={handleJobSelect}
              value={selectedJob ? selectedJob._id : ""}
            >
              <SelectTrigger className="w-full">
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

          <Button
            onClick={generateQuestions}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Questions"
            )}
          </Button>

          {newQuestions && newQuestions.length > 0 && (
            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-semibold">Generated Questions:</h2>
              <ul className="space-y-6">
                {newQuestions.map((question, index) => (
                  <li key={index} className="rounded-lg p-4 shadow">
                    <p className="mb-2 font-medium">{question.question}</p>
                    <ul className="mb-2 list-inside list-disc space-y-1">
                      {question.answers.map((answer) => (
                        <li
                          key={answer.id}
                          className={
                            answer.id === question.correctAnswerId
                              ? "font-medium text-green-600"
                              : ""
                          }
                        >
                          {answer.text}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm italic text-gray-500">
                      Correct Answer: {question.correctAnswerId}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionGenerator;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

import { MapPin, DollarSign, Briefcase, Calendar } from "lucide-react";

export default function JobApplyPage() {
  const { toast } = useToast();
  const { id } = useParams(); // Extract the job ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5001";

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/getJobById/${id}`);
        setJob(response.data);

        // Save the job ID to localStorage after successful fetch
        localStorage.setItem("jobId", id);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast({
          title: "Error",
          description: "Failed to load job details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    } else {
      setLoading(false);
      toast({
        title: "Invalid Job ID",
        description: "No job ID was provided in the URL.",
        variant: "destructive",
      });
    }
  }, [id, BASE_URL, toast]);

  const onFinish = () => {
    const token = localStorage.getItem("candidateToken");

    // Optionally retrieve the job ID when applying
    const savedJobId = localStorage.getItem("jobId");
    console.log("Applying for Job ID:", savedJobId);

    navigate(token ? "/Candidate" : "/SignUp");
  };

  const logoUrl = job?.logo
    ? `${BASE_URL}/${job.logo}`
    : "/images/default-logo.png";

  if (loading) {
    return (
      <Card className="mx-auto mt-10 max-w-3xl">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card className="mx-auto mt-10 max-w-3xl">
        <CardContent className="p-6 text-center">
          <p className="text-lg font-semibold">Job not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center" // Center content vertically and horizontally
    >
      <Card className="w-full max-w-3xl">
        <CardHeader className="relative">
          <motion.div
            className="absolute inset-0 rounded bg-gradient-to-r from-blue-500 to-purple-500 opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 0.5 }}
          />
          <div className="relative z-10 flex items-center space-x-4">
            <motion.img
              src={logoUrl}
              alt={`${job.company} Logo`}
              className="h-20 w-20 rounded-full border-2 border-white bg-white "
              onError={(e) => {
                e.currentTarget.src = "/images/default-logo.png";
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            />
            <div>
              <CardTitle className="text-3xl font-bold text-white">
                {job.title}
              </CardTitle>
              <p className="text-xl text-gray-100">{job.company}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <motion.div
            className="mb-6 grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <span>${job.salary.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-gray-500" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="mb-2 text-2xl font-semibold">Job Description</h3>
            <p className="text-lg font-light">{job.description}</p>
          </motion.div>
        </CardContent>
        <CardFooter className="justify-center bg-gray-50 p-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" onClick={onFinish}>
              Apply Now
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

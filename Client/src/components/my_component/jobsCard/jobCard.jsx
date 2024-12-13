// JobCard.js
import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const JobCard = ({ job, onSelectJob, isSidebarCollapsed }) => {
  return (
    <motion.div
      className="mb-8"
      style={{ width: isSidebarCollapsed ? "100%" : "270px" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        className="rounded-lg shadow-lg"
        style={{
          background: "linear-gradient(135deg, #6A4ED2, #4431AF)",
          color: "#FFFFFF",
        }}
      >
        {/* Card Header: Avatar and Job Info */}
        <CardHeader className="flex flex-col items-center space-y-2 pb-2 pt-6">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={`http://localhost:5001/${job.logo}`}
              alt={`${job.company} logo`}
            />
            <AvatarFallback>
              {job.company.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center">
            <h3 className="text-xl font-semibold text-white">{job.title}</h3>
            <p className="text-sm text-gray-300">{job.company}</p>
          </div>
        </CardHeader>

        {/* Card Content: Applicants Info */}
        <CardContent className="pb-2 pt-0">
          <Badge
            variant="secondary"
            className="mx-auto flex w-fit items-center gap-1 bg-purple-700 text-white"
          >
            <Users className="h-3 w-3" />
            <span>{job.applicants} Applicants</span>
          </Badge>
        </CardContent>

        {/* Card Footer: Action Button */}
        <CardFooter>
          <Button
            onClick={() => onSelectJob(job)} // Trigger the job selection
            className="w-full bg-purple-600 text-white hover:bg-purple-500"
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default JobCard;

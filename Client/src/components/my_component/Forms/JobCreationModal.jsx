import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Building, MapPin, DollarSign, Upload } from "lucide-react";
import axios from "axios";

export default function JobCreationModal({ visible, onClose, onCreate }) {
  const [apiError, setApiError] = useState(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setApiError(null);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("company", data.company);
    formData.append("location", data.location);
    formData.append("salary", data.salary);
    formData.append("description", data.description);
    formData.append("type", data.type);
    if (data.logo && data.logo[0]) {
      formData.append("logo", data.logo[0]);
    }

    const token = localStorage.getItem("recruiterToken");

    if (!token) {
      setApiError("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/jobspost",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Success:", response.data);
      onCreate(response.data);
      reset();
      onClose();
      toast({
        title: "Job Created",
        description: "Your job posting has been successfully created.",
      });
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        setApiError(
          error.response.data.msg ||
            "An error occurred while creating the job.",
        );
      } else if (error.request) {
        setApiError("No response from the server. Please try again later.");
      } else {
        setApiError(error.message || "An unexpected error occurred.");
      }

      toast({
        title: "Error",
        description: "Failed to create job posting. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Job Post</DialogTitle>
        </DialogHeader>
        {apiError && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {apiError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <div className="relative">
              <Briefcase className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="title"
                placeholder="Job Title"
                {...register("title", { required: "Job title is required" })}
                className="pl-9"
              />
            </div>
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <div className="relative">
              <Building className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="company"
                placeholder="Company"
                {...register("company", {
                  required: "Company name is required",
                })}
                className="pl-9"
              />
            </div>
            {errors.company && (
              <p className="text-sm text-red-500">{errors.company.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="location"
                placeholder="Location"
                {...register("location", { required: "Location is required" })}
                className="pl-9"
              />
            </div>
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="salary"
                placeholder="Salary"
                {...register("salary", { required: "Salary is required" })}
                className="pl-9"
              />
            </div>
            {errors.salary && (
              <p className="text-sm text-red-500">{errors.salary.message}</p>
            )}
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Job Type</Label>
            <Select
              onValueChange={(value) => {
                const event = { target: { name: "type", value } };
                register("type").onChange(event);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label htmlFor="logo">Upload Logo</Label>
            <div className="flex h-20 items-center justify-center rounded-md border-2 border-dashed">
              <label
                htmlFor="logo"
                className="flex cursor-pointer flex-col items-center"
              >
                <Upload className="mb-2 h-6 w-6 text-gray-400" />
                <span className="text-sm text-gray-600">Upload Logo</span>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  {...register("logo", { required: "Logo is required" })}
                  className="hidden"
                />
              </label>
            </div>
            {errors.logo && (
              <p className="text-sm text-red-500">{errors.logo.message}</p>
            )}
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Job Description"
              {...register("description", {
                required: "Description is required",
              })}
              className="h-24 resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit">Create Job</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

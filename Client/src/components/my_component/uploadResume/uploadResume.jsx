import React from "react";
import { FaFileUpload } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const UploadResume = ({ onResumeUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Optionally, convert file to base64 (for smaller files)
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store the base64 string in localStorage
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          content: reader.result, // Base64 encoded content
        };

        // Save the file data in localStorage
        localStorage.setItem("uploadedResume", JSON.stringify(fileData));

        // Optionally, call onResumeUpload if you want to pass the file data
        onResumeUpload(file);
      };

      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  return (
    <div className="flex h-96 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 p-16 transition duration-300 hover:bg-gray-100">
      <div className="mb-4 flex flex-col items-center">
        <FaFileUpload className="mb-2 animate-bounce text-4xl font-bold text-[#4431af]" />
        <Label htmlFor="resume" className="text-xl font-semibold text-gray-700">
          Upload Resume
        </Label>
      </div>
      <Input
        type="file"
        id="resume"
        name="resume"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor="resume"
        className="transform cursor-pointer rounded-md bg-[#4431af] px-8 py-4 text-xl font-semibold text-white transition-transform duration-300 hover:scale-105"
      >
        Choose File
      </label>
    </div>
  );
};

export default UploadResume;

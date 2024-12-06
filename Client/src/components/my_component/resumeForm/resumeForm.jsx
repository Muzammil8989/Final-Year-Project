// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { jwtDecode } from "jwt-decode";
// import {
//   FaUser,
//   FaPhone,
//   FaEnvelope,
//   FaLinkedin,
//   FaHome,
//   FaTools,
//   FaGraduationCap,
//   FaUniversity,
//   FaBriefcase,
//   FaCertificate,
// } from "react-icons/fa";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import axios from "axios";
// import { notification } from "antd";

// export default function ResumeForm({
//   formData = {},
//   setFormData = () => {},
//   onSubmitSuccess = () => {},
//   submitButton,
// }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: formData,
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     reset(formData);
//   }, [formData, reset]);

//   const onSubmitHandler = async (data) => {
//     console.log("Submitted Data:", data);
//     setFormData(data);

//     const { name, contact_number, email, linkedin, address } = data;
//     if (name && contact_number && email && linkedin && address) {
//       setIsSubmitting(true);

//       const token = localStorage.getItem("token");
//       console.log("Token from localStorage:", token);

//       if (token) {
//         try {
//           const decodedToken = jwtDecode(token);
//           console.log("Decoded Token:", decodedToken);
//         } catch (err) {
//           console.error("Token Decoding Error:", err);
//         }
//       } else {
//         notification.error({
//           message: "Authorization Error",
//           description: "Please log in to submit your application.",
//         });
//         setIsSubmitting(false);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           "http://localhost:5001/api/upload_resume",
//           data,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("Response:", response);

//         notification.success({
//           message: "Application Submitted",
//           description: "Your application has been submitted successfully!",
//         });

//         setIsSubmitting(false);
//         onSubmitSuccess();
//       } catch (error) {
//         console.error("Submission Error:", error);
//         notification.error({
//           message: "Submission Failed",
//           description:
//             error.response?.data?.message || "There was an error submitting your application.",
//         });
//         setIsSubmitting(false);
//       }
//     } else {
//       notification.warning({
//         message: "Incomplete Information",
//         description: "Please ensure all required fields are filled out before submitting.",
//       });
//     }
//   };

//   const InputField = ({ label, icon: Icon, required = false, registerOptions = {}, name, type = "text", placeholder }) => (
//     <div className="mb-4">
//       <Label htmlFor={name} className="flex items-center text-sm font-medium">
//         {label}
//         {required && <span className="ml-1 text-red-500">*</span>}
//       </Label>
//       <div className="relative mt-1">
//         <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//         <Input
//           id={name}
//           type={type}
//           {...register(name, registerOptions)}
//           className={`pl-10 ${errors[name] ? 'border-red-500' : ''}`}
//           placeholder={placeholder}
//         />
//       </div>
//     </div>
//   );

//   const TextAreaField = ({ label, icon: Icon, required = false, registerOptions = {}, name, placeholder, rows = 3 }) => (
//     <div className="mb-4">
//       <Label htmlFor={name} className="flex items-center text-sm font-medium">
//         {label}
//         {required && <span className="ml-1 text-red-500">*</span>}
//       </Label>
//       <div className="relative mt-1">
//         <Icon className="absolute left-3 top-4 text-muted-foreground" />
//         <Textarea
//           id={name}
//           {...register(name, registerOptions)}
//           className={`pl-10 ${errors[name] ? 'border-red-500' : ''}`}
//           placeholder={placeholder}
//           rows={rows}
//         />
//       </div>
//     </div>
//   );

//   return (
//     <form onSubmit={handleSubmit(onSubmitHandler)} className="mx-auto my-8 max-w-4xl space-y-8">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-center text-3xl font-bold text-primary">Resume Form</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-8 md:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold text-primary">Personal Information</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <InputField
//                   label="Name"
//                   icon={FaUser}
//                   required
//                   name="name"
//                   placeholder="Enter your name"
//                   registerOptions={{ required: "Name is required" }}
//                 />
//                 <InputField
//                   label="Contact Number"
//                   icon={FaPhone}
//                   required
//                   name="contact_number"
//                   placeholder="Enter your contact number"
//                   registerOptions={{
//                     required: "Contact number is required",
//                     pattern: {
//                       value: /^\+?(\d.*){3,}$/,
//                       message: "Invalid contact number",
//                     },
//                   }}
//                 />
//                 <InputField
//                   label="Email"
//                   icon={FaEnvelope}
//                   required
//                   name="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   registerOptions={{
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
//                       message: "Invalid email address",
//                     },
//                   }}
//                 />
//                 <InputField
//                   label="LinkedIn Profile"
//                   icon={FaLinkedin}
//                   name="linkedin"
//                   type="url"
//                   placeholder="Enter your LinkedIn profile URL"
//                   registerOptions={{
//                     pattern: {
//                       value: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?$/,
//                       message: "Invalid LinkedIn URL",
//                     },
//                   }}
//                 />
//                 <InputField
//                   label="Address"
//                   icon={FaHome}
//                   name="address"
//                   placeholder="Enter your address"
//                 />
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold text-primary">Professional Information</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <InputField
//                   label="Skills"
//                   icon={FaTools}
//                   name="skills"
//                   placeholder="Enter your skills (comma-separated)"
//                 />
//                 <InputField
//                   label="Education"
//                   icon={FaGraduationCap}
//                   name="education"
//                   placeholder="Enter your education"
//                 />
//                 <InputField
//                   label="Colleges"
//                   icon={FaUniversity}
//                   name="colleges"
//                   placeholder="Enter your colleges (comma-separated)"
//                 />
//                 <TextAreaField
//                   label="Work Experience"
//                   icon={FaBriefcase}
//                   name="work_experience"
//                   placeholder="Enter your work experience"
//                   rows={4}
//                 />
//                 <TextAreaField
//                   label="Certifications"
//                   icon={FaCertificate}
//                   name="certifications"
//                   placeholder="Enter your certifications (comma-separated)"
//                   rows={3}
//                 />
//               </CardContent>
//             </Card>
//           </div>
//         </CardContent>
//       </Card>
//       <div className="mt-4 flex justify-end">
//         {submitButton || (
//           <Button
//             type="submit"
//             variant="default"
//             className="transform rounded-md bg-[#4431af] px-8 py-4 font-semibold text-white transition-transform duration-300 hover:scale-105"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </Button>
//         )}
//       </div>
//     </form>
//   );
// }

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaHome,
  FaTools,
  FaGraduationCap,
  FaUniversity,
  FaBriefcase,
  FaCertificate,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { notification } from "antd";

export default function ResumeForm({
  formData = {},
  setFormData = () => {},
  onSubmitSuccess = () => {},
  submitButton,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: formData,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobId, setJobId] = useState(null); // State to hold jobId

  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  useEffect(() => {
    // Retrieve jobId from localStorage when component mounts
    const storedJobId = localStorage.getItem("jobId"); // Ensure 'jobId' is the correct key

    if (storedJobId) {
      setJobId(storedJobId);
    } else {
      notification.error({
        message: "Job Application Error",
        description: "No job selected. Please select a job to apply.",
      });
    }
  }, []);
  console.log("Job ID:", jobId);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const onSubmitHandler = async (data) => {
    setIsSubmitting(true);

    const token = localStorage.getItem("candidateToken");
    if (!token) {
      notification.error({
        message: "Authorization Error",
        description: "Please log in to submit your application.",
      });
      setIsSubmitting(false);
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.user.id; // Adjust based on your token's structure
      console.log("User ID (candidate):", userId);
    } catch (decodeError) {
      console.error("Token Decoding Error:", decodeError);
      notification.error({
        message: "Authorization Error",
        description: "Invalid token. Please log in again.",
      });
      setIsSubmitting(false);
      return;
    }

    const requiredFields = ["name", "contact_number", "email"];
    const hasAllRequiredFields = requiredFields.every((field) => data[field]);

    if (!hasAllRequiredFields) {
      notification.warning({
        message: "Incomplete Information",
        description:
          "Please ensure all required fields are filled out before submitting.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!jobId) {
      notification.error({
        message: "Job Application Error",
        description: "Job ID is missing. Cannot apply to the job.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Upload Resume
      const uploadResponse = await axios.post(
        "http://localhost:5001/api/upload_resume",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Upload Response:", uploadResponse.data);

      const resumeId = uploadResponse.data.resume._id;

      if (!resumeId) {
        notification.error({
          message: "Upload Error",
          description: "Failed to retrieve Resume ID. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      // Introduce a 3-second delay
      await delay(3000);

      // Step 2: Apply to the Job
      const applicationResponse = await axios.post(
        "http://localhost:5001/api/applications",
        {
          candidate: userId,
          job: jobId,
          resume: resumeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Application Response:", applicationResponse.data);

      notification.success({
        message: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });

      setIsSubmitting(false);
      onSubmitSuccess();

      // Optional: Clear jobId from localStorage after successful application
      localStorage.removeItem("jobId");
    } catch (error) {
      console.error("Submission Error:", error);
      console.error("Error Response:", error.response?.data);
      notification.error({
        message: "Submission Failed",
        description:
          error.response?.data?.message ||
          "There was an error submitting your application.",
      });
      setIsSubmitting(false);
    }
  };

  const InputField = ({
    label,
    icon: Icon,
    required = false,
    registerOptions = {},
    name,
    type = "text",
    placeholder,
  }) => (
    <div className="mb-4">
      <Label htmlFor={name} className="flex items-center text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <div className="relative mt-1">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={name}
          type={type}
          {...register(name, registerOptions)}
          className={`pl-10 ${errors[name] ? "border-red-500" : ""}`}
          placeholder={placeholder}
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">{errors[name].message}</p>
      )}
    </div>
  );

  const TextAreaField = ({
    label,
    icon: Icon,
    required = false,
    registerOptions = {},
    name,
    placeholder,
    rows = 3,
  }) => (
    <div className="mb-4">
      <Label htmlFor={name} className="flex items-center text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <div className="relative mt-1">
        <Icon className="absolute left-3 top-4 text-muted-foreground" />
        <Textarea
          id={name}
          {...register(name, registerOptions)}
          className={`pl-10 ${errors[name] ? "border-red-500" : ""}`}
          placeholder={placeholder}
          rows={rows}
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="mx-auto my-8 max-w-4xl space-y-8"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-primary">
            Resume Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InputField
                  label="Name"
                  icon={FaUser}
                  required
                  name="name"
                  placeholder="Enter your name"
                  registerOptions={{ required: "Name is required" }}
                />
                <InputField
                  label="Contact Number"
                  icon={FaPhone}
                  required
                  name="contact_number"
                  placeholder="Enter your contact number"
                  registerOptions={{
                    required: "Contact number is required",
                    pattern: {
                      value: /^\+?(\d.*){3,}$/,
                      message: "Invalid contact number",
                    },
                  }}
                />
                <InputField
                  label="Email"
                  icon={FaEnvelope}
                  required
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  registerOptions={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Invalid email address",
                    },
                  }}
                />
                <InputField
                  label="LinkedIn Profile"
                  icon={FaLinkedin}
                  name="linkedin"
                  type="url"
                  placeholder="Enter your LinkedIn profile URL"
                  registerOptions={{
                    pattern: {
                      value:
                        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?$/,
                      message: "Invalid LinkedIn URL",
                    },
                  }}
                />
                <InputField
                  label="Address"
                  icon={FaHome}
                  name="address"
                  placeholder="Enter your address"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InputField
                  label="Skills"
                  icon={FaTools}
                  name="skills"
                  placeholder="Enter your skills (comma-separated)"
                />
                <InputField
                  label="Education"
                  icon={FaGraduationCap}
                  name="education"
                  placeholder="Enter your education"
                />
                <InputField
                  label="Colleges"
                  icon={FaUniversity}
                  name="colleges"
                  placeholder="Enter your colleges (comma-separated)"
                />
                <TextAreaField
                  label="Work Experience"
                  icon={FaBriefcase}
                  name="work_experience"
                  placeholder="Enter your work experience"
                  rows={4}
                />
                <TextAreaField
                  label="Certifications"
                  icon={FaCertificate}
                  name="certifications"
                  placeholder="Enter your certifications (comma-separated)"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 flex justify-end">
        {submitButton || (
          <Button
            type="submit"
            variant="default"
            className="transform rounded-md bg-[#4431af] px-8 py-4 font-semibold text-white transition-transform duration-300 hover:scale-105"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </form>
  );
}

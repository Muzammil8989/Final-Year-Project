// // candidateStepper.jsx
// import React, { useState, useEffect } from "react";
// import {
//   FaFileUpload,
//   FaClipboardCheck,
//   FaUserCheck,
//   FaCheckCircle,
// } from "react-icons/fa";
// import { Modal, notification } from "antd";
// import { Button } from "@/components/ui/button";
// import UploadResume from "../uploadResume/uploadResume";
// import ResumeForm from "../resumeForm/resumeForm";
// import QuizComponent from "../testComponent/testComponent";
// import axios from "axios";
// import { InfinitySpin } from "react-loader-spinner";

// const Stepper = () => {
//   // State Variables
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false); // Instruction modal state
//   const [isScanning, setIsScanning] = useState(false);
//   const [resumeUploaded, setResumeUploaded] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     contact_number: "",
//     email: "",
//     linkedin: "",
//     address: "",
//     skills: "",
//     education: "",
//     colleges: "",
//     work_experience: "",
//     certifications: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false); // Submission state

//   // Placeholder Interview Component
//   const InterviewComponent = () => (
//     <div className="flex flex-col items-center justify-center p-10">
//       <h2 className="mb-4 text-2xl font-semibold">Interview Scheduled</h2>
//       <p>
//         Your interview will be scheduled soon. Please await further
//         instructions.
//       </p>
//     </div>
//   );

//   // Placeholder Submission Component
//   const SubmissionComponent = () => (
//     <div className="flex flex-col items-center justify-center p-10">
//       <h2 className="mb-4 text-2xl font-semibold">Submission Complete</h2>
//       <p>Thank you for completing your application process.</p>
//     </div>
//   );

//   // 1. Define all handler functions first

//   // Handle Resume Upload
//   const handleResumeUpload = (file) => {
//     setIsScanning(true);

//     const uploadData = new FormData();
//     uploadData.append("file", file);

//     axios
//       .post("http://127.0.0.1:5000/extract", uploadData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       .then((response) => {
//         setFormData(response.data);
//         setIsModalOpen(true);
//         setIsScanning(false);
//         setResumeUploaded(true);
//         notification.success({
//           message: "Resume Uploaded",
//           description:
//             "Your resume has been successfully uploaded and scanned.",
//         });
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setIsScanning(false);
//         notification.error({
//           message: "Failed to Upload Resume",
//           description: "Please try uploading your resume again.",
//         });
//       });
//   };

//   // Close Resume Details Modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setTimeout(() => {
//       notification.info({
//         message: "Application Submitted",
//         description:
//           "HR will review your resume and send you an email with the test link.",
//       });

//     }, 6000);
//   };

//   // Handle Final Submission
//   const handleSubmit = () => {
//     setIsSubmitting(true);
//     axios
//       .post("http://127.0.0.1:5000/submit_application", formData)
//       .then((response) => {
//         notification.success({
//           message: "Application Submitted",
//           description:
//             "Your application has been submitted successfully! We will contact you soon.",
//         });
//         setIsSubmitting(false);
//         // Optionally reset the form or redirect the user
//       })
//       .catch((error) => {
//         console.error("Submission Error:", error);
//         notification.error({
//           message: "Submission Failed",
//           description:
//             "There was an error submitting your application. Please try again.",
//         });
//         setIsSubmitting(false);
//       });
//   };

//   // Handle Navigation to Next Step
//   const handleNext = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   // Close Instruction Modal and proceed to Test
//   const closeInstructionModal = () => {
//     setIsInstructionModalOpen(false);
//     setCurrentStep(1); // Move to the test step after closing the instruction modal
//   };

//   // 2. Define the steps array after all handler functions are defined
//   const steps = [
//     {
//       name: "Upload Resume",
//       icon: <FaFileUpload />,
//       component: <UploadResume onResumeUpload={handleResumeUpload} />,
//       description: "Upload your resume to proceed.",
//     },
//     {
//       name: "Test",
//       icon: <FaClipboardCheck />,
//       component: (
//         <QuizComponent
//           onQuizComplete={() => setCurrentStep((prev) => prev + 1)}
//         />
//       ),
//       description: "Complete the assessment test.",
//     },
//     {
//       name: "Interview",
//       icon: <FaUserCheck />,
//       component: <InterviewComponent />, // Placeholder for Interview Component
//       description: "Participate in the interview process.",
//     },
//     {
//       name: "Submission",
//       icon: <FaCheckCircle />,
//       component: <SubmissionComponent />, // Placeholder for Submission Component
//       description: "Finalize your application submission.",
//     },
//   ];

//   // Additional useEffect for visibility change (already defined above)
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "hidden") {
//         notification.warning({
//           message: "Warning",
//           description: "You have switched tabs or minimized the window.",
//         });
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   return (
//     <div className="m-20 flex flex-col items-center rounded-lg bg-purple-50 p-10 shadow-md">
//       {/* Step Indicators */}
//       <div className="mb-8 flex w-full items-center justify-between">
//         {steps.map((step, index) => (
//           <div key={index} className="flex items-center">
//             <div
//               className={`flex items-center justify-center rounded-full border-2 shadow-md ${
//                 index < currentStep
//                   ? "bg-green-500 text-white"
//                   : index === currentStep
//                     ? "bg-[#1b0b75] text-white"
//                     : "border-purple-800 bg-white text-[#1b0b75]"
//               } h-12 w-12`}
//             >
//               {step.icon}
//             </div>
//             <div
//               className={`ml-4 text-lg font-semibold ${
//                 index === currentStep
//                   ? "text-[#1b0b75]"
//                   : index < currentStep
//                     ? "text-green-500"
//                     : "text-gray-700"
//               }`}
//             >
//               {step.name}
//             </div>
//             {index < steps.length - 1 && (
//               <div
//                 className={`mx-4 h-1 ${
//                   index < currentStep - 1
//                     ? "w-16 bg-green-500"
//                     : "w-16 bg-gray-300"
//                 }`}
//               ></div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Current Step Content */}
//       <div className="mt-10 w-full">
//         {isScanning ? (
//           <div className="flex justify-center">
//             <InfinitySpin
//               width="200"
//               color="#1b0b75"
//               ariaLabel="infinity-spin-loading"
//             />
//           </div>
//         ) : (
//           steps[currentStep].component
//         )}
//       </div>

//       {/* Navigation Buttons */}
//       <div className="mt-6 flex w-full justify-end">
//         {currentStep < steps.length - 1 && (
//           <Button
//             variant="default"
//             onClick={handleNext}
//             disabled={
//               (currentStep === 0 && !resumeUploaded) ||
//               false ||
//               false // Update if Interview step has completion criteria
//             }
//             className="mr-4 transform rounded-md bg-[#4431af] px-8 py-4 font-semibold text-white transition-transform duration-300 hover:scale-105"
//           >
//             Next
//           </Button>
//         )}
//         {currentStep === steps.length - 1 && (
//           <Button
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className={`transform rounded-md bg-[#4431af] px-8 py-4 font-semibold text-white transition-transform duration-300 hover:scale-105 ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
//           >
//             {isSubmitting ? "Submitting..." : "Submit Application"}
//           </Button>
//         )}
//       </div>

//       {/* Resume Details Modal */}
//       <Modal
//         title="Resume Details"
//         open={isModalOpen}
//         onCancel={closeModal}
//         footer={null}
//         width={800}
//       >
//         <ResumeForm
//           formData={formData}
//           setFormData={setFormData}
//           onSubmitSuccess={closeModal}
//         />
//       </Modal>

//       {/* Instruction Modal */}
//       <Modal
//         title="Test Instructions"
//         open={isInstructionModalOpen}
//         onCancel={closeInstructionModal}
//         footer={[
//           <Button
//             key="start"
//             className="text-white hover:bg-muted hover:text-primary"
//             onClick={closeInstructionModal}
//           >
//             Start Test
//           </Button>,
//         ]}
//       >
//         <p>
//           Please read the following instructions carefully before proceeding
//           with the test:
//         </p>
//         <ul className="mt-2 list-inside list-disc">
//           <li>
//             1. The test is timed. You have a limited amount of time to complete
//             it.
//           </li>
//           <li>
//             2. Do not switch tabs or leave the test screen, or the test will be
//             paused.
//           </li>
//           <li>3. Make sure you have a stable internet connection.</li>
//           <li>4. If you encounter any issues, contact support immediately.</li>
//         </ul>
//       </Modal>

//     </div>
//   );
// };

// export default Stepper;

import React, { useState, useEffect } from "react";
import { FaClipboardCheck, FaUserCheck, FaCheckCircle } from "react-icons/fa";
import { notification } from "antd";
import { Button } from "@/components/ui/button";
import QuizComponent from "../testComponent/testComponent";
import axios from "axios";
import { InfinitySpin } from "react-loader-spinner";
import { MdIntegrationInstructions } from "react-icons/md";
import InterviewChatbot from "../interviewChatbot/interviewChatbot";

const Stepper = () => {
  // State Variables
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
  const [isScanning, setIsScanning] = useState(false); // Scanning state

  // Placeholder Submission Component
  const SubmissionComponent = () => (
    <div className="flex flex-col items-center justify-center p-10">
      <h2 className="mb-4 text-2xl font-semibold">Submission Complete</h2>
      <p>Thank you for completing your application process.</p>
    </div>
  );

  // Handle Final Submission
  const handleSubmit = () => {
    setIsSubmitting(true);
    axios
      .post("http://127.0.0.1:5000/submit_application", formData)
      .then((response) => {
        notification.success({
          message: "Application Submitted",
          description:
            "Your application has been submitted successfully! We will contact you soon.",
        });
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error("Submission Error:", error);
        notification.error({
          message: "Submission Failed",
          description:
            "There was an error submitting your application. Please try again.",
        });
        setIsSubmitting(false);
      });
  };

  // Handle Navigation to Next Step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Define the steps array
  const steps = [
    {
      name: "Start Tests",
      icon: <MdIntegrationInstructions />,
      component: (
        <div className="flex flex-col items-center justify-center p-10 text-slate-800">
          <h2 className="mb-4 text-2xl font-semibold">Start Tests</h2>
          <p>
            Please read the following instructions carefully before proceeding
            with the test:
          </p>
          <ul className="mt-2 list-inside list-disc">
            <li>
              1. The test is timed. You have a limited amount of time to
              complete it.
            </li>
            <li>
              2. Do not switch tabs or leave the test screen, or the test will
              not be considered valid.
            </li>
            <li>3. Make sure you have a stable internet connection.</li>
            <li>
              4. If you encounter any issues, contact support immediately.
            </li>
          </ul>
        </div>
      ),
      description: "Start the assessment test.",
    },
    // {
    //   name: "Test",
    //   icon: <FaClipboardCheck />,
    //   component: (
    //     <QuizComponent
    //       onQuizComplete={() => setCurrentStep((prev) => prev + 1)}
    //     />
    //   ),
    //   description: "Complete the assessment test.",
    // },
    {
      name: "Interview",
      icon: <FaUserCheck />,
      component: <InterviewChatbot />,
      description: "Participate in the interview process.",
    },
    {
      name: "Submission",
      icon: <FaCheckCircle />,
      component: <SubmissionComponent />,
      description: "Finalize your application submission.",
    },
  ];

  // Listen for visibility changes to warn about tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        notification.warning({
          message: "Warning",
          description: "You have switched tabs or minimized the window.",
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="-mt-36 flex flex-col items-center rounded-lg bg-purple-50 p-4 shadow-md">
      {/* Step Indicators */}
      <div className="mb-4 flex w-full items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center rounded-full border-2 shadow-md ${
                index < currentStep
                  ? "bg-green-500 text-white"
                  : index === currentStep
                    ? "bg-[#1b0b75] text-white"
                    : "border-purple-800 bg-white text-[#1b0b75]"
              } h-12 w-12`}
            >
              {step.icon}
            </div>
            <div
              className={`ml-4 text-lg font-semibold ${
                index === currentStep
                  ? "text-[#1b0b75]"
                  : index < currentStep
                    ? "text-green-500"
                    : "text-gray-700"
              }`}
            >
              {step.name}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-1 ${
                  index < currentStep - 1
                    ? "w-16 bg-green-500"
                    : "w-16 bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="mt-10 w-full">
        {isScanning ? (
          <div className="flex justify-center">
            <InfinitySpin
              width="200"
              color="#1b0b75"
              ariaLabel="infinity-spin-loading"
            />
          </div>
        ) : (
          steps[currentStep].component
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex w-full justify-end">
        {currentStep === 0 && (
          <Button
            variant="default"
            onClick={handleNext}
            className="mr-4 transform rounded-md bg-[#4431af] px-8 py-4 font-semibold text-white transition-transform duration-300 hover:scale-105"
          >
            Next
          </Button>
        )}

        {currentStep === 2 && (
          <Button
            variant="default"
            onClick={handleNext}
            className="mr-4 transform rounded-md bg-[#4431af] px-8 py-4 font-semibold text-white transition-transform duration-300 hover:scale-105"
          >
            Next
          </Button>
        )}

        {currentStep === steps.length - 1 && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`transform rounded-md bg-[#4431af] px-8 py-4 font-semibold text-white transition-transform duration-300 hover:scale-105 ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Stepper;

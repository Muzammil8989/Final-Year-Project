// import React, { useState } from "react";
// import { Modal, notification } from "antd";
// import axios from "axios";
// import { InfinitySpin } from "react-loader-spinner";
// import UploadResume from "../uploadResume/uploadResume";
// import ResumeForm from "../resumeForm/resumeForm";

// function ProcessResume() {
//   const [isScanning, setIsScanning] = useState(false); // Controls visibility of loader
//   const [resumeUploaded, setResumeUploaded] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
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

//   const handleResumeUpload = (file) => {
//     setIsScanning(true); // Show loader immediately

//     const uploadData = new FormData();
//     uploadData.append("file", file);

//     // Optionally add a small delay before making the request to show the loader
//     setTimeout(() => {
//       axios
//         .post("http://127.0.0.1:5000/extract", uploadData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         })
//         .then((response) => {
//           console.log("Response received:", response);
//           setFormData(response.data);
//           setIsModalOpen(true);
//           setIsScanning(false);
//           setResumeUploaded(true);
//           notification.success({
//             message: "Resume Uploaded",
//             description:
//               "Your resume has been successfully uploaded and scanned.",
//           });
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//           setIsScanning(false);
//           notification.error({
//             message: "Failed to Upload Resume",
//             description: "Please try uploading your resume again.",
//           });
//         });
//     }, 1000);
//   };

//   return (
//     <div>
//       {/* Only show UploadResume if scanning is not in progress */}
//       {!isScanning && !resumeUploaded && (
//         <UploadResume onResumeUpload={handleResumeUpload} />
//       )}

//       {/* Show Scanning Loader when scanning is in progress */}
//       {isScanning && (
//         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
//           <InfinitySpin
//             width="200"
//             color="#4fa94d"
//             ariaLabel="infinity-spin-loading"
//           />
//         </div>
//       )}

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
//     </div>
//   );
// }

// export default ProcessResume;

import React, { useState } from "react";
import { Modal, notification } from "antd";
import axios from "axios";
import { InfinitySpin } from "react-loader-spinner";
import UploadResume from "../uploadResume/uploadResume";
import ResumeForm from "../resumeForm/resumeForm";

function ProcessResume() {
  const [isScanning, setIsScanning] = useState(false); // Controls visibility of loader
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact_number: "",
    email: "",
    linkedin: "",
    address: "",
    skills: "",
    education: "",
    colleges: "",
    work_experience: "",
    certifications: "",
  });

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setResumeUploaded(false); // Reset to allow re-uploading of resume
    setIsScanning(false); // Reset scanning state to false (allow upload form to show)

    setTimeout(() => {
      notification.info({
        message: "Application Submitted",
        description:
          "HR will review your resume and send you an email with the test link.",
      });
    }, 6000);
  };

  const handleResumeUpload = (file) => {
    setIsScanning(true); // Start the scanning process

    const uploadData = new FormData();
    uploadData.append("file", file);

    axios
      .post("http://127.0.0.1:5000/extract", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setFormData(response.data); // Update form data with response from server
        setIsModalOpen(true); // Show modal with form data
        setIsScanning(false); // Hide loader after scan is complete
        setResumeUploaded(true); // Mark resume as uploaded

        notification.success({
          message: "Resume Uploaded",
          description:
            "Your resume has been successfully uploaded and scanned.",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsScanning(false); // Stop loader on error
        notification.error({
          message: "Failed to Upload Resume",
          description: "Please try uploading your resume again.",
        });
      });
  };

  return (
    <div>
      {/* Only show UploadResume if scanning is not in progress */}
      {!isScanning && !resumeUploaded && (
        <UploadResume onResumeUpload={handleResumeUpload} />
      )}

      {/* Show Scanning Loader when scanning is in progress */}
      {isScanning && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <InfinitySpin
            width="200"
            color="#1b0b75"
            ariaLabel="infinity-spin-loading"
          />
        </div>
      )}

      {/* Resume Details Modal */}
      <Modal
        title="Resume Details"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        <ResumeForm
          formData={formData}
          setFormData={setFormData}
          onSubmitSuccess={closeModal}
        />
      </Modal>
    </div>
  );
}

export default ProcessResume;

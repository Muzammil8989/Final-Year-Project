import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FiUsers, FiEdit, FiTrash2, FiCopy } from "react-icons/fi";
import { Button, Tooltip, message } from "antd";
import { deleteJob, editJob } from "@/Redux/jobsSlice";
import JobEditModal from "@/components/my_component/Forms/JobEditModal";

const JobDetailCard = ({ job, isSidebarCollapsed }) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      const jobUrl = `${window.location.origin}/JobApply/${job._id}`;
      await navigator.clipboard.writeText(jobUrl);
      message.success("Job link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy the job link:", error);
      message.error("Failed to copy the link. Please try again.");
    }
  };

  const handleDelete = (jobId) => {
    dispatch(deleteJob(jobId))
      .unwrap()
      .then(() => message.success("Job deleted successfully!"))
      .catch((err) => message.error(err));
  };

  const handleEdit = (updatedJob) => {
    dispatch(editJob(updatedJob))
      .unwrap()
      .then(() => {
        closeModal();
        message.success("Job updated successfully!");
      })
      .catch((err) => message.error(err));
  };

  return (
    <>
      <motion.div
        className="relative mb-6 flex h-auto flex-col justify-between rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg transition-shadow duration-300 hover:shadow-xl"
        style={{
          width: isSidebarCollapsed ? "100%" : "500px",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Tooltip title="Copy Job Link">
          <Button
            onClick={handleCopyLink}
            type="primary"
            shape="circle"
            icon={<FiCopy />}
            size="small"
            className="absolute right-2 top-2 opacity-75 transition-opacity hover:opacity-100"
            aria-label="Copy Job Link"
          />
        </Tooltip>

        <div className="p-4">
          <div className="flex flex-col items-center">
            <img
              src={`http://localhost:5001/${job.logo}`}
              alt="company logo"
              className="size-16 rounded-full"
            />
            <h3 className="mb-1 text-2xl font-semibold text-white">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-gray-200">{job.company}</p>
            <p className="text-sm font-medium text-gray-200">{job.location}</p>
            <p className="text-sm font-medium text-gray-200">{job.salary}</p>
            <p className="mt-2 text-center text-sm text-gray-100">
              {job.description}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center text-white">
            <FiUsers className="mr-1" />
            <p className="text-sm font-medium">{job.applicants} Applicants</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4 rounded-b-lg bg-white bg-opacity-10 p-4">
          <Tooltip title="Edit Job">
            <Button
              onClick={openModal}
              type="default"
              icon={<FiEdit />}
              className="flex items-center text-xs transition-colors hover:bg-purple-700 hover:text-white"
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Job">
            <Button
              onClick={() => handleDelete(job._id)}
              type="default"
              danger
              icon={<FiTrash2 />}
              className="flex items-center text-xs transition-colors hover:bg-red-700 hover:text-white"
            >
              Delete
            </Button>
          </Tooltip>
        </div>
      </motion.div>

      <JobEditModal
        visible={isModalOpen}
        onClose={closeModal}
        jobData={job}
        onEdit={handleEdit}
      />
    </>
  );
};

export default JobDetailCard;

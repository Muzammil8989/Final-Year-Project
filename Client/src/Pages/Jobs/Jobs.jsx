import React, { useState } from "react";
import JobDetailCard from "@/components/my_component/jobsCard/JobDetailCard";
import SearchBar from "@/components/my_component/searchBar/searchBar";
import TimeDate from "@/components/my_component/TimeDate/timedate";
import { Button } from "@/components/ui/button";
import JobCreationModal from "@/components/my_component/Forms/JobCreationModal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editJobData, setEditJobData] = useState(null);

  const fetchJobs = async () => {
    const response = await axios.get("http://localhost:5001/api/getJobs");
    return response.data; // Return jobs directly
  };

  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  const handleEdit = (job) => {
    setEditJobData(job);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    console.log("Deleting job  with ID:", id);
  };

  const handleCreate = (values) => {
    console.log("Creating job:", values);
    setIsModalVisible(false);
    setEditJobData(null); // Reset edit data
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedJobs = filteredJobs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNext = () => {
    if (currentPage * itemsPerPage < filteredJobs.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return <div>Loading jobs...</div>;
  }

  if (isError) {
    return <div>Error fetching jobs.</div>;
  }

  return (
    <div className="px-4">
      <h1 className="mb-4 ml-4 text-3xl font-bold">Jobs</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-grow">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div className="flex-none">
          <TimeDate />
        </div>
        <Button
          variant="default"
          size="lg"
          onClick={() => setIsModalVisible(true)}
        >
          Create Job
        </Button>
      </div>
      <div className="mb-4 ml-6 flex justify-between">
        <Button onClick={handlePrev} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentPage * itemsPerPage >= filteredJobs.length}
        >
          Next
        </Button>
      </div>
      <div className="ml-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {displayedJobs.map((job) => (
          <JobDetailCard
            key={job._id} // Assuming `_id` is unique
            job={job}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isSidebarCollapsed={false}
          />
        ))}
      </div>

      {isModalVisible && (
        <JobCreationModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setEditJobData(null); // Reset on close
          }}
          onCreate={handleCreate}
          jobData={editJobData} // Pass job data for editing
        />
      )}
    </div>
  );
}

export default Jobs;

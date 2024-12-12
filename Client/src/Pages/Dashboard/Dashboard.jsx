// import React, { useState } from "react";
// import JobCard from "../../components/my_component/jobsCard/jobCard";
// import { statusCards } from "@/fakeData/jobData"; // Adjust the path as necessary
// import { Modal } from "antd";
// import { Button } from "@/components/ui/button";
// import SearchBar from "@/components/my_component/searchBar/searchBar";
// import StatusCard from "@/components/my_component/statusCard/statusCard";
// import TimeDate from "@/components/my_component/TimeDate/timedate";
// import {
//   AiOutlineCheckCircle,
//   AiOutlineClockCircle,
//   AiOutlineCloseCircle,
// } from "react-icons/ai";
// import { motion } from "framer-motion"; // Import motion
// import CandidateTable from "@/components/my_component/candidateTable/candidateTable";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

// function Dashboard({ isSidebarCollapsed }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalContent, setModalContent] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 4; // Number of job cards per page
//   const [jobs, setJobs] = useState([]);

//   const fetchJobs = async () => {
//     try {
//       const response = await axios.get("http://localhost:5001/api/getJobs");
//       setJobs(response.data);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     }
//   };

//   useQuery({
//     queryKey: ["jobs"],
//     queryFn: fetchJobs,
//   });

//   const showModal = (content) => {
//     setModalContent(content);
//     setIsModalOpen(true);
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   // Define a mapping for icons based on the title
//   const iconMapping = {
//     Success: AiOutlineCheckCircle,
//     Pending: AiOutlineClockCircle,
//     Failed: AiOutlineCloseCircle,
//   };

//   // Filter jobs based on searchQuery
//   const filteredJobs = jobs.filter((job) =>
//     job.title.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   // Pagination Logic
//   const totalItems = filteredJobs.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const goToPage = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <>
//       <div className="p-12">
//         <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
//         <div className="flex items-center justify-evenly">
//           <SearchBar
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//           />
//           <TimeDate />
//         </div>
//         <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2 md:grid-cols-3 md:px-8">
//           {statusCards.map((card, index) => {
//             const Icon = iconMapping[card.title];
//             return (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <StatusCard
//                   title={card.title}
//                   percentage={card.percentage}
//                   color={card.color}
//                   icon={Icon}
//                 />
//               </motion.div>
//             );
//           })}
//         </div>
//         <div className="flex flex-wrap justify-center gap-3 px-4 md:px-8">
//           {currentJobs.map((job, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               transition={{ duration: 0.3 }}
//             >
//               <JobCard
//                 job={job}
//                 showModal={showModal}
//                 isSidebarCollapsed={isSidebarCollapsed}
//               />
//             </motion.div>
//           ))}

//           <Modal
//             open={isModalOpen}
//             onOk={handleOk}
//             onCancel={handleCancel}
//             footer={null}
//             width={1900}
//             className="custom-modal"
//           >
//             <CandidateTable />
//             <Button
//               className="animate__animated animate__fadeIn animate__delay-1s mt-4 bg-red-600 text-white hover:bg-red-700"
//               onClick={handleCancel}
//               danger
//             >
//               Cancel
//             </Button>
//           </Modal>
//         </div>

//         {/* Pagination Controls */}
//         <div className="mt-2 flex items-center justify-center">
//           <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
//             Previous
//           </Button>
//           <div className="mx-4 flex gap-2">
//             {Array.from({ length: totalPages }, (_, i) => (
//               <Button
//                 key={i + 1}
//                 onClick={() => goToPage(i + 1)}
//                 className={
//                   currentPage === i + 1 ? "bg-blue-500 text-white" : ""
//                 }
//               >
//                 {i + 1}
//               </Button>
//             ))}
//           </div>
//           <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
//             Next
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "antd";
import { AiOutlineCheckCircle, AiOutlineClockCircle } from "react-icons/ai";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardCharts from "@/components/my_component/Charts/dashboardCharts";
import { Progress } from "@/components/ui/progress";
import JobCard from "@/components/my_component/jobsCard/jobCard";
import SearchBar from "@/components/my_component/searchBar/searchBar";
import { notification } from "antd";

import TimeDate from "@/components/my_component/TimeDate/timedate";
import CandidateTable from "@/components/my_component/candidateTable/candidateTable";

const fetchStatusCounts = async () => {
  try {
    // Get the recruiter token from localStorage
    const recruiterToken = localStorage.getItem("recruiterToken");

    // Create the headers with the Bearer token if it exists
    const headers = recruiterToken
      ? { Authorization: `Bearer ${recruiterToken}` }
      : {}; // If no token, no Authorization header

    const response = await axios.get("http://localhost:5001/api/statusCounts", {
      headers,
    });
    const data = response.data;

    // Fallback values in case the response does not contain the expected fields
    const statusCounts = {
      Applied: data?.Applied || 0,
      Screening: data?.Screening || 0,
      Interview: data?.Interview || 0,
      Offer: data?.Offer || 0,
      Hired: data?.Hired || 0,
      Rejected: data?.Rejected || 0,
    };

    console.log("Status Counts:", statusCounts);
    return statusCounts;
  } catch (error) {
    console.error("Error fetching status counts:", error);
    return {
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Offer: 0,
      Hired: 0,
      Rejected: 0,
    };
  }
};

function Dashboard({ isSidebarCollapsed }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [totalApplications, setTotalApplications] = useState(0);

  useEffect(() => {
    // Function to fetch total applications
    const fetchTotalApplications = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("recruiterToken");

        if (!token) {
          // If token is not found, show an error notification
          notification.error({
            message: "Unauthorized",
            description: "Please log in to access this data.",
          });
          return;
        }

        // Configure axios headers with the token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Make GET request to the API
        const response = await axios.get(
          "http://localhost:5001/api/countTotalApplications",
          config,
        );

        // Check if the response contains the total applications count
        if (response.data && response.data.totalApplications !== undefined) {
          setTotalApplications(response.data.totalApplications);
        } else {
          throw new Error("Invalid response data");
        }
      } catch (error) {
        console.error("Error fetching total applications:", error);
        notification.error({
          message: "Error",
          description: "Failed to fetch total applications. Please try again.",
        });
      }
    };

    fetchTotalApplications();
  }, []);

  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5001/api/getJobs");
      return response.data;
    },
  });

  const {
    data: statusCounts,
    isLoading: statusLoading,
    isError: statusError,
  } = useQuery({
    queryKey: ["statusCounts"],
    queryFn: fetchStatusCounts,
  });

  const showModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching jobs</div>;

  return (
    <div className="p-6 lg:p-12">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">HR Dashboard</h1>
        <TimeDate />
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <FiTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Open Positions
            </CardTitle>
            <AiOutlineClockCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">4 closing this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
            <FiTrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 days</div>
            <p className="text-xs text-muted-foreground">
              -2.4 days from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Offer Acceptance Rate
            </CardTitle>
            <AiOutlineCheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">+5% from last year</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4">
        <DashboardCharts />

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hiring Pipeline</CardTitle>
            <CardDescription>
              Current status of applicants in the hiring process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  stage: "Applied",
                  count: statusCounts.Applied.count,
                  percentage: statusCounts.Applied.percentage,
                  color: "bg-blue-500",
                },
                {
                  stage: "Screening",
                  count: statusCounts.Screening.count,
                  percentage: statusCounts.Screening.percentage,
                  color: "bg-yellow-500",
                },
                {
                  stage: "Interview",
                  count: statusCounts.Interview.count,
                  percentage: statusCounts.Interview.percentage,
                  color: "bg-orange-500",
                },
                {
                  stage: "Offer",
                  count: statusCounts.Offer.count,
                  percentage: statusCounts.Offer.percentage,
                  color: "bg-green-500",
                },
                {
                  stage: "Hired",
                  count: statusCounts.Hired.count,
                  percentage: statusCounts.Hired.percentage,
                  color: "bg-purple-500",
                },
                {
                  stage: "Rejected",
                  count: statusCounts.Rejected.count,
                  percentage: statusCounts.Rejected.percentage,
                  color: "bg-red-500",
                },
              ].map((stage, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-36 text-sm font-medium">{stage.stage}</div>
                  <div className="flex-1">
                    <Progress
                      value={stage.percentage}
                      className={stage.color}
                    />
                  </div>
                  <div className="w-12 text-right text-sm font-medium">
                    {stage.count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="mb-8 grid gap-2 md:grid-cols-2 lg:grid-cols-5">
        <AnimatePresence>
          {currentJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <JobCard
                job={job}
                showModal={showModal}
                isSidebarCollapsed={isSidebarCollapsed}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={1900}
          className="custom-modal"
        >
          <CandidateTable />
          <Button
            className="animate__animated animate__fadeIn animate__delay-1s mt-4 bg-red-600 text-white hover:bg-red-700"
            onClick={handleCancel}
            danger
          >
            Cancel
          </Button>
        </Modal>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            variant={currentPage === i + 1 ? "default" : "outline"}
          >
            {i + 1}
          </Button>
        ))}
        <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;

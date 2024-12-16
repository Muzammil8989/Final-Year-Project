"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";  // Importing from recharts
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

// API to fetch the hiring status counts
const fetchStatusCounts = async () => {
  try {
    const recruiterToken = localStorage.getItem("recruiterToken");

    const headers = recruiterToken
      ? { Authorization: `Bearer ${recruiterToken}` }
      : {};

    const response = await axios.get("http://localhost:5001/api/statusCounts", { headers });

    const data = response.data;

    // Extracting count from each status
    const statusCounts = {
      Applied: data?.Applied?.count || 0,
      Interview: data?.Interview?.count || 0,
      Hired: data?.Hired?.count || 0,
      Rejected: data?.Rejected?.count || 0,
    };

    return statusCounts;
  } catch (error) {
    console.error("Error fetching status counts:", error);
    return {
      Applied: 0,
      Interview: 0,
      Hired: 0,
      Rejected: 0,
    };
  }
};

function DashboardCharts() {
  const [statusCounts, setStatusCounts] = useState({
    Applied: 0,
    Interview: 0,
    Hired: 0,
    Rejected: 0,
  });

  useEffect(() => {
    const loadStatusCounts = async () => {
      const data = await fetchStatusCounts();
      console.log("Fetched Data:", data);  // Log the fetched data
      setStatusCounts(data);
    };

    loadStatusCounts();
  }, []);

  const hiringPipelineData = [
    { stage: "Applied", count: statusCounts.Applied },
    { stage: "Interview", count: statusCounts.Interview },
    { stage: "Hired", count: statusCounts.Hired },
    { stage: "Rejected", count: statusCounts.Rejected },
  ];

  // Calculate percentages for the Pie Chart
  const totalApplicants =
    statusCounts.Applied +
    statusCounts.Screening +
    statusCounts.Interview +
    statusCounts.Offer +
    statusCounts.Hired +
    statusCounts.Rejected;

  const chartData = [
    { name: "Applied", value: statusCounts.Applied, percentage: (statusCounts.Applied / totalApplicants) * 100 },
    { name: "Interview", value: statusCounts.Interview, percentage: (statusCounts.Interview / totalApplicants) * 100 },
    { name: "Hired", value: statusCounts.Hired, percentage: (statusCounts.Hired / totalApplicants) * 100 },
    { name: "Rejected", value: statusCounts.Rejected, percentage: (statusCounts.Rejected / totalApplicants) * 100 },
  ];

  return (
    <div className="flex space-x-8">
      {/* BarChart for Hiring Pipeline */}
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Hiring Pipeline</CardTitle>
          <CardDescription>Current status of applicants in the hiring process</CardDescription>
        </CardHeader>
        <CardContent className="pl-2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hiringPipelineData}>
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* PieChart for Hiring Pipeline Distribution */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Hiring Pipeline - PieChart</CardTitle>
          <CardDescription>Distribution of applicants across different stages</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Tooltip cursor={false} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                stroke="0"
                innerRadius={60}
                outerRadius={80}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={["#ffbb28", "#ff8042", "#00C49F", "#0088FE", "#FF8042", "#FFBB28"][index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="flex-col items-start space-y-1.5">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ["#ffbb28", "#ff8042", "#00C49F", "#0088FE", "#FF8042", "#FFBB28"][index] }} />
              <span>{entry.name}</span>
            </div>
          ))}
        </CardFooter>
        
      </Card>
    </div>
  );
}

export default DashboardCharts;

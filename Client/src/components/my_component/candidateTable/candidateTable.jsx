import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, yellow, red, purple } from "@mui/material/colors";
import { Email as EmailIcon, GetApp as GetAppIcon } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { Select, MenuItem } from "@mui/material";
import { notification } from 'antd';

const columns = [
  {
    name: "S No",
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value) => (
        <div style={{ textAlign: "center", fontWeight: "bold" }}>{value}</div>
      ),
    },
  },
  {
    name: "Name",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => (
        <div style={{ textAlign: "center", fontWeight: "bold" }}>{value}</div>
      ),
    },
  },
  {
    name: "Email",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => (
        <div style={{ textAlign: "center" }}>{value}</div>
      ),
    },
  },
  {
    name: "Phone Number",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => (
        <div style={{ textAlign: "center" }}>{value}</div>
      ),
    },
  },
  {
    name: "LinkedIn",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => (
        <div style={{ textAlign: "center" }}>
          <a href={value} target="_blank" rel="noopener noreferrer">
            LinkedIn Profile
          </a>
        </div>
      ),
    },
  },
  {
    name: "Address",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => (
        <div style={{ textAlign: "center" }}>{value}</div>
      ),
    },
  },
  {
    name: "Skills",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => (
        <div style={{ textAlign: "center" }}>{value.join(", ")}</div> // Skills is an array, join to display
      ),
    },
  },
  {
    name: "Education",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => (
        <div style={{ textAlign: "center" }}>{value}</div>
      ),
    },
  },
  {
    name: "University",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => (
        <div style={{ textAlign: "center" }}>{value}</div>
      ),
    },
  },
  {
    name: "Resume",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value) => (
        <div style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            href={value}
            download
            startIcon={<GetAppIcon />}
            size="small"
          >
            Download
          </Button>
        </div>
      ),
    },
  },
  {
    name: "Email Candidate",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta) => {
        const resumeScore = tableMeta.rowData[11]; // Resume Score

        const email = tableMeta.rowData[2]; // Email

        let backgroundColor = "";
        let textColor = "#ffffff";

        if (resumeScore >= 70) {
          backgroundColor = green[500]; // Green for both above 70%
        } else if (resumeScore >= 50) {
          backgroundColor = yellow[700]; // Yellow for either score above 50%
          textColor = "#000000";
        } else {
          backgroundColor = red[500]; // Red for both below 50%
        }

        return (
          <div style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              style={{ backgroundColor, color: textColor }}
              onClick={() => handleEmailCandidate(email)}
              startIcon={<EmailIcon />}
              size="small"
            >
              Email
            </Button>
          </div>
        );
      },
    },
  },
  {
    name: "Resume Score",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Tooltip title={`Resume Score: ${value}%`}>
            <CircularProgress
              variant="determinate"
              value={value}
              size={30}
              thickness={5}
              style={{ color: purple[500] }}
            />
          </Tooltip>
          <span style={{ marginLeft: 8, fontWeight: "bold" }}>{value}%</span>
        </Box>
      ),
    },
  },

  {
    name: "Quiz Score",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Tooltip title={`Quiz Score: ${value}`}>
            <CircularProgress
              variant="determinate"
              value={value}
              size={30}
              thickness={5}
              style={{ color: purple[500] }}
            />
          </Tooltip>
          <span style={{ marginLeft: 8, fontWeight: "bold" }}>{value}%</span>
        </Box>
      ),
    },
  },
  {
    name: "Test Score",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Tooltip title={`Test Score: ${value}%`}>
            <CircularProgress
              variant="determinate"
              value={value}
              size={30}
              thickness={5}
              style={{ color: purple[500] }}
            />
          </Tooltip>
          <span style={{ marginLeft: 8, fontWeight: "bold" }}>{value}%</span>
        </Box>
      ),
    },
  },
  {
    name: "Status",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta) => {
        const id = tableMeta.rowData[0]; // Assuming Candidate's ID is the second column
        const currentStatus = value || "Applied"; // Default status if none exists

        return (
          <div style={{ textAlign: "center" }}>
            <Select
              value={currentStatus}
              onChange={(e) => handleStatusChange(id, e.target.value)}
              displayEmpty
              fullWidth
            >
              {["Applied", "Interview", "Hired", "Rejected"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </div>
        );
      },
    },
  },
  {
    name: "Send Report",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta) => {
        const id = tableMeta.rowData[0]; // Get the email of the candidate
        return (
          <div style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleSendReport(id)}
              startIcon={<EmailIcon />}
              size="small"
            >
              Send Report
            </Button>
          </div>
        );
      },
    },
  },
];

const getMuiTheme = () =>
  createTheme({
    typography: {
      useNextVariants: true,
      fontFamily: "'Roboto', sans-serif",
    },
    palette: {
      background: {
        default: "#f5f5f5",
      },
      primary: {
        main: purple[500],
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "#ffffff",
            padding: "8px",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: purple[500],
            color: "#ffffff",
            fontWeight: "bold",
            textAlign: "center",
            padding: "4px", // Reduced padding
          },
          body: {
            textAlign: "center",
            fontSize: "0.875rem", // Smaller font size
            padding: "2px", // Reduced padding
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            padding: "4px 8px",
            fontSize: "0.75rem", // Smaller button text
          },
        },
      },
    },
  });

  const handleEmailCandidate = async (email) => {
    try {
      // Log the email for reference
      console.log(`Sending email to: ${email}`);
  
      // Prepare the data to be sent in the POST request
      const requestData = {
        email: email, // Only the email is sent
      };
  
      // Make the POST request to the API
      const response = await axios.post(
        "http://localhost:5001/api/send-test-link",
        requestData,
      );
  
      // Handle the response from the server
      console.log("Email sent successfully:", response.data);
  
      // Show success notification
      notification.success({
        message: 'Email Sent',
        description: `Test link sent to ${email} successfully.`,
        placement: 'topRight', // You can customize the placement of the notification
        duration: 3, // Duration in seconds
      });
    } catch (error) {
      // Handle errors
      console.error("Error sending email:", error);
  
      // Show error notification
      notification.error({
        message: 'Error Sending Email',
        description: 'An error occurred while sending the test link email.',
        placement: 'topRight', // You can customize the placement of the notification
        duration: 3, // Duration in seconds
      });
    }
  };

const handleStatusChange = async (id, newStatus) => {
  try {
    const recruiterToken = localStorage.getItem("recruiterToken"); // Get the recruiter token

    if (!recruiterToken) {
      console.error("Recruiter token is missing.");
      return;
    }

    // Send the PUT request with the token in the Authorization header and the data in the body
    const response = await axios.put(
      `http://localhost:5001/api/update-status/${id}`,
      { _id: id, status: newStatus },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${recruiterToken}`,
        },
      },
    );

    console.log("Status updated successfully:", response.data);
  } catch (error) {
    console.error("Error updating status:", error);
  }
};
const handleSendReport = async (id) => {
  try {
    // Correcting the typo here, use 'applicationId' instead of 'ema'
    const requestData = { applicationId: id };

    // Sending the report email through the API
    const response = await axios.post(
      "http://localhost:5001/api/send-report", // Make sure this matches the route on the server
      requestData,
    );

    console.log("Report sent successfully:", response.data);

    // Show success notification
    notification.success({
      message: 'Report Sent',
      description: 'The application report was sent successfully.',
      placement: 'topRight', // You can customize the placement of the notification
      duration: 3, // Duration in seconds
    });
  } catch (error) {
    console.error("Error sending report:", error);

    // Show error notification
    notification.error({
      message: 'Error Sending Report',
      description: 'An error occurred while sending the application report.',
      placement: 'topRight', // You can customize the placement of the notification
      duration: 3, // Duration in seconds
    });
  }
};

const CandidateTable = ({ jobId }) => {
  const [data, setData] = useState([]);

  // Function to fetch applications data
  const fetchApplicationsData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/get_application?job=${jobId}`,
      );
      const applications = await response.json();
      console.log(jobId);

      // Format the fetched data as needed for the table
      const formattedData = applications.map((app, index) => [
        app._id,
        app.candidate.name,
        app.candidate.email,
        app.resume.contact_number,
        app.resume.linkedin,
        app.resume.address,
        app.resume.skills,
        app.resume.education,
        app.resume.colleges[0], // Assuming only one college is relevant
        app.resume.filePath, // Path to the resume file
        app.candidate.email,
        app.matchScore, // Assuming matchScore is the resume score
        app.quizScore,
        app.interviewScore, // Assuming testScore is also available in the app
        app.status,
      ]);

      console.log(formattedData);

      setData(formattedData);
    } catch (err) {
      console.error("Error fetching applications data:", err);
    }
  };

  // Fetch both interview data and application data on component mount
  useEffect(() => {
    fetchApplicationsData(); // Fetch applications data on initial render
  }, [jobId]);

  return (
    <div style={{ padding: "24px" }}>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={"Candidate List"}
          data={data}
          columns={columns}
          options={{
            filterType: "checkbox",
            responsive: "standard",
            elevation: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: [5, 10, 20],
            selectableRows: "none",
            downloadOptions: {
              filename: "candidate_data.csv",
              separator: ",",
            },
            onDownload: (buildHead, buildBody, columns, data) => {
              return "\uFEFF" + buildHead(columns) + buildBody(data);
            },
            textLabels: {
              body: {
                noMatch: "Sorry, no matching records found",
              },
            },
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default CandidateTable;

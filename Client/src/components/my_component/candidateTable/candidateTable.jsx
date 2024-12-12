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
        const testScore = tableMeta.rowData[12]; // Test Score
        const email = tableMeta.rowData[2]; // Email

        let backgroundColor = "";
        let textColor = "#ffffff";

        if (resumeScore >= 70 && testScore >= 70) {
          backgroundColor = green[500]; // Green for both above 70%
        } else if (resumeScore >= 50 || testScore >= 50) {
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
          },
          body: {
            textAlign: "center",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
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
  } catch (error) {
    // Handle errors
    console.error("Error sending email:", error);
  }
};

const CandidateTable = () => {
  const [data, setData] = useState([]);

  // Function to get the auth token from localStorage

  // Function to fetch applications data
  const fetchApplicationsData = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/get_application");
      const applications = await response.json();

      // Format the fetched data as needed for the table
      const formattedData = applications.map((app, index) => [
        index + 1,
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
        app.interviewScore, // Assuming testScore is also available in the app
      ]);
      setData(formattedData);
    } catch (err) {
      console.error("Error fetching applications data:", err);
    }
  };

  // Fetch both interview data and application data on component mount
  useEffect(() => {
    fetchApplicationsData(); // Fetch applications data without auth
  }, []);

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

// import React, { useState, useEffect } from "react";
// import MUIDataTable from "mui-datatables";
// import CircularProgress from "@mui/material/CircularProgress";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { green, yellow, red, purple } from "@mui/material/colors";
// import { Email as EmailIcon, GetApp as GetAppIcon } from "@mui/icons-material";
// import Tooltip from "@mui/material/Tooltip";

// const columns = [
//   {
//     name: "S No",
//     options: {
//       filter: false,
//       sort: true,
//       customBodyRender: (value) => (
//         <div style={{ textAlign: "center", fontWeight: "bold" }}>{value}</div>
//       ),
//     },
//   },
//   {
//     name: "Name",
//     options: {
//       filter: true,
//       sort: true,
//       customBodyRender: (value) => (
//         <div style={{ textAlign: "center", fontWeight: "bold" }}>{value}</div>
//       ),
//     },
//   },
//   {
//     name: "Email",
//     options: {
//       filter: true,
//       sort: true,
//       customBodyRender: (value) => (
//         <div style={{ textAlign: "center" }}>{value}</div>
//       ),
//     },
//   },
//   {
//     name: "Phone Number",
//     options: {
//       filter: true,
//       sort: false,
//       customBodyRender: (value) => (
//         <div style={{ textAlign: "center" }}>{value}</div>
//       ),
//     },
//   },
//   {
//     name: "LinkedIn",
//     options: {
//       filter: true,
//       sort: false,
//       customBodyRender: (value) => (
//         <div style={{ textAlign: "center" }}>
//           <a href={value} target="_blank" rel="noopener noreferrer">
//             LinkedIn Profile
//           </a>
//         </div>
//       ),
//     },
//   },
//   {
//     name: "Address",
//     options: {
//       filter: true,
//       sort: false,
//       customBodyRender: (value) => (
//         <div style={{ textAlign: "center" }}>{value}</div>
//       ),
//     },
//   },
//   {
//     name: "Skills",
//     options: {
//       filter: true,
//       sort: false,
//       customBodyRender: (value) => (
//         <div style={{ textAlign: "center" }}>{value.join(", ")}</div> // Skills is an array, join to display
//       ),
//     },
//   },
//   {
//     name: "Education",
//     options: {
//       filter: true,
//       sort: false,
//       customBodyRender: (value) => (
//         <div style={{ textAlign: "center" }}>{value}</div>
//       ),
//     },
//   },
//   {
//     name: "University",
//     options: {
//       filter: true,
//       sort: false,
//       customBodyRender: (value) => (
//         <div style={{ textAlign: "center" }}>{value}</div>
//       ),
//     },
//   },
//   {
//     name: "Resume",
//     options: {
//       filter: false,
//       sort: false,
//       customBodyRender: (value) => (
//         <div style={{ textAlign: "center" }}>
//           <Button
//             variant="contained"
//             color="primary"
//             href={value}
//             download
//             startIcon={<GetAppIcon />}
//             size="small"
//           >
//             Download
//           </Button>
//         </div>
//       ),
//     },
//   },
//   {
//     name: "Email Candidate",
//     options: {
//       filter: false,
//       sort: false,
//       customBodyRender: (value, tableMeta) => {
//         const resumeScore = tableMeta.rowData[8]; // Resume Score
//         const testScore = tableMeta.rowData[9]; // Test Score
//         const email = tableMeta.rowData[2]; // Email

//         let backgroundColor = "";
//         let textColor = "#ffffff";

//         if (resumeScore > 70 && testScore > 70) {
//           backgroundColor = green[500]; // Green for both above 70%
//         } else if (resumeScore >= 50 || testScore >= 50) {
//           backgroundColor = yellow[700]; // Yellow for either score above 50%
//           textColor = "#000000";
//         } else {
//           backgroundColor = red[500]; // Red for both below 50%
//         }

//         return (
//           <div style={{ textAlign: "center" }}>
//             <Button
//               variant="contained"
//               style={{ backgroundColor, color: textColor }}
//               onClick={() => handleEmailCandidate(email)}
//               startIcon={<EmailIcon />}
//               size="small"
//             >
//               Email
//             </Button>
//           </div>
//         );
//       },
//     },
//   },
//   {
//     name: "Resume Score",
//     options: {
//       filter: true,
//       sort: true,
//       customBodyRender: (value) => (
//         <Box display="flex" alignItems="center" justifyContent="center">
//           <Tooltip title={`Resume Score: ${value}%`}>
//             <CircularProgress
//               variant="determinate"
//               value={value}
//               size={30}
//               thickness={5}
//               style={{ color: purple[500] }}
//             />
//           </Tooltip>
//           <span style={{ marginLeft: 8, fontWeight: "bold" }}>{value}%</span>
//         </Box>
//       ),
//     },
//   },
//   {
//     name: "Test Score",
//     options: {
//       filter: true,
//       sort: true,
//       customBodyRender: (value) => (
//         <Box display="flex" alignItems="center" justifyContent="center">
//           <Tooltip title={`Test Score: ${value}%`}>
//             <CircularProgress
//               variant="determinate"
//               value={value}
//               size={30}
//               thickness={5}
//               style={{ color: purple[500] }}
//             />
//           </Tooltip>
//           <span style={{ marginLeft: 8, fontWeight: "bold" }}>{value}%</span>
//         </Box>
//       ),
//     },
//   },
// ];

// const getMuiTheme = () =>
//   createTheme({
//     typography: {
//       useNextVariants: true,
//       fontFamily: "'Roboto', sans-serif",
//     },
//     palette: {
//       background: {
//         default: "#f5f5f5",
//       },
//       primary: {
//         main: purple[500],
//       },
//     },
//     components: {
//       MuiPaper: {
//         styleOverrides: {
//           root: {
//             backgroundColor: "#ffffff",
//           },
//         },
//       },
//       MuiTableCell: {
//         styleOverrides: {
//           head: {
//             backgroundColor: purple[500],
//             color: "#ffffff",
//             fontWeight: "bold",
//             textAlign: "center",
//           },
//           body: {
//             textAlign: "center",
//           },
//         },
//       },
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             textTransform: "none",
//           },
//         },
//       },
//     },
//   });

// const handleEmailCandidate = (email) => {
//   // Logic to send email to the candidate
//   console.log(`Sending email to: ${email}`);
// };

// const CandidateTable = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // Fetch data from API (assuming API is set up to send JSON response)
//     fetch("http://localhost:5001/api/get_application")
//       .then((res) => res.json())
//       .then((applications) => {
//         const formattedData = applications.map((app, index) => [
//           index + 1,
//           app.candidate.name,
//           app.candidate.email,
//           app.resume.contact_number,
//           app.resume.linkedin,
//           app.resume.address,
//           app.resume.skills,
//           app.resume.education,
//           app.resume.colleges[0], // Assuming only one college is relevant
//           app.resume.filePath, // Path to the resume file
//           app.candidate.email,
//           app.matchScore, // Assuming matchScore is the resume score
//           app.matchScore, // Assuming testScore is also available in the app (can be different if needed)
//         ]);
//         setData(formattedData);
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div style={{ padding: "24px" }}>
//       <ThemeProvider theme={getMuiTheme()}>
//         <MUIDataTable
//           title={"Candidate List"}
//           data={data}
//           columns={columns}
//           options={{
//             filterType: "checkbox",
//             responsive: "standard",
//             elevation: 0,
//             rowsPerPage: 5,
//             rowsPerPageOptions: [5, 10, 20],
//             selectableRows: "none",

//             downloadOptions: {
//               filename: "candidate_data.csv",
//               separator: ",",
//             },
//             onDownload: (buildHead, buildBody, columns, data) => {
//               return "\uFEFF" + buildHead(columns) + buildBody(data);
//             },
//             textLabels: {
//               body: {
//                 noMatch: "Sorry, no matching records found",
//               },
//             },
//           }}
//         />
//       </ThemeProvider>
//     </div>
//   );
// };

// export default CandidateTable;

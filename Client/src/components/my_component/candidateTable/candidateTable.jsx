import React from "react";
import MUIDataTable from "mui-datatables";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, yellow, red, purple } from "@mui/material/colors";
import { Email as EmailIcon, GetApp as GetAppIcon } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";

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
    name: "Skills",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => (
        <div style={{ textAlign: "center" }}>{value}</div>
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
        const resumeScore = tableMeta.rowData[8]; // Resume Score
        const testScore = tableMeta.rowData[9]; // Test Score
        const email = tableMeta.rowData[2]; // Email

        let backgroundColor = "";
        let textColor = "#ffffff";

        if (resumeScore > 70 && testScore > 70) {
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

const data = [
  [
    1,
    "Joe James",
    "joe.james@example.com",
    "JavaScript, React",
    "Bachelor of Science",
    "XYZ University",
    "path/to/resume1.pdf",
    "joe.james@example.com",
    90,
    85,
  ],
  [
    2,
    "John Walsh",
    "john.walsh@example.com",
    "Java, Spring",
    "Master of Science",
    "ABC University",
    "path/to/resume2.pdf",
    "john.walsh@example.com",
    65,
    60,
  ],
  [
    3,
    "Bob Herm",
    "bob.herm@example.com",
    "Python, Django",
    "Bachelor of Arts",
    "LMN University",
    "path/to/resume3.pdf",
    "bob.herm@example.com",
    45,
    50,
  ],
  [
    4,
    "James Houston",
    "james.houston@example.com",
    "C#, ASP.NET",
    "Bachelor of Technology",
    "OPQ University",
    "path/to/resume4.pdf",
    "james.houston@example.com",
    80,
    85,
  ],
];

const options = {
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
};

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

const handleEmailCandidate = (email) => {
  // Logic to send email to the candidate
  console.log(`Sending email to: ${email}`);
};

const CandidateTable = () => {
  return (
    <div style={{ padding: "24px" }}>
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={"Candidate List"}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </div>
  );
};

export default CandidateTable;

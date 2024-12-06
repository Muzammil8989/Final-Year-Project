import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to get token from local storage
const getToken = () => {
  return localStorage.getItem("recruiterToken");
};

// Async Thunks for CRUD operations
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const token = getToken(); // Get token from local storage
      await axios.delete(`http://localhost:5001/api/deleteJob/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      return jobId;
    } catch (error) {
      // Ensure error.response and error.response.data exist
      return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : { message: error.message }
      );
    }
  }
);

export const editJob = createAsyncThunk(
  "jobs/editJob",
  async (formData, { rejectWithValue }) => {
    try {
      const token = getToken();
      const id = formData.get("id"); // Ensure 'id' is present in formData
      const response = await axios.put(
        `http://localhost:5001/api/updateJob/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : { message: error.message }
      );
    }
  }
);

// Job slice
const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Typically an object
      })

      // Handle Edit Job
      .addCase(editJob.pending, (state) => {
        state.status = "loading";
        state.error = null; // Reset error on new request
      })
      .addCase(editJob.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        state.error = null; // Clear any previous errors
      })
      .addCase(editJob.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setJobs } = jobsSlice.actions;
export default jobsSlice.reducer;

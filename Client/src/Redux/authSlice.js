import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Login user thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5001/api/login", {
        email,
        password,
        role,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        msg: error.response?.data?.msg || "Failed to login. Please try again",
      });
    }
  },
);

// Register user thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5001/api/register", {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        msg: error.response?.data?.msg || "Registration failed",
      });
    }
  },
);

// Load user details thunk
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get("http://localhost:5001/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        msg: error.response?.data?.msg || "Failed to load user",
      });
    }
  },
);

// Forget password thunk
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/forgetPassword",
        { email },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        msg: error.response?.data?.msg || "Password reset failed",
      });
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    successMsg: "",
    token:
      localStorage.getItem("candidateToken") ||
      localStorage.getItem("recruiterToken") ||
      null,
    user: null,
    roleAssigned: false,
    currentRole: null, // Track the current role ("Candidate" or "Recruiter")
  },
  reducers: {
    logout: (state) => {
      state.loading = false;
      state.error = null;
      state.successMsg = "";
      state.token = null;
      state.user = null;
      state.roleAssigned = false;
      state.currentRole = null; // Clear current role
      localStorage.removeItem("candidateToken");
      localStorage.removeItem("recruiterToken");
    },
    clearMessages: (state) => {
      // Clear success and error messages
      state.successMsg = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMsg = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMsg = action.payload?.msg || "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "Registration failed";
        state.successMsg = "";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMsg = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMsg = action.payload?.msg || "Login successful";
        state.token = action.payload?.token || null;
        state.roleAssigned = action.payload?.roleAssigned || false;

        // Role-specific logic
        const role = action.meta.arg.role; // Extract role from thunk argument
        const token = action.payload?.token;

        if (role === "Candidate") {
          localStorage.setItem("candidateToken", token || "");
          state.currentRole = "Candidate";
        } else if (role === "Recruiter") {
          localStorage.setItem("recruiterToken", token || "");
          state.currentRole = "Recruiter";
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.msg || "Failed to login. Please try again";
        state.successMsg = "";
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.currentRole = action.payload?.role || state.currentRole; // Update role
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "Failed to load user";
      })
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMsg = "";
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMsg = action.payload?.msg || "Password reset link sent";
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "Password reset failed";
        state.successMsg = "";
      });
  },
});

export const { logout, clearMessages } = authSlice.actions;

export default authSlice.reducer;

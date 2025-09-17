// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Mock login API
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }) => {
    // Simulate API call
    return { id: 1, name: "John Doe", email };
  }
);

// Mock register API
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }) => {
    // Simulate API call
    return { id: 2, name, email };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = "failed";
        state.error = "Login failed";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

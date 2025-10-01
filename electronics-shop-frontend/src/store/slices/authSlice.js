import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api"; // axios instance with baseURL and token injection

// Load tokens from localStorage
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

// --- Async thunks ---

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { access_token, refresh_token, user } = res.data;

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      return { user, accessToken: access_token, refreshToken: refresh_token };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, confirm_password }, thunkAPI) => {
    try {
      // Backend expects confirm_password too
      const res = await api.post("/auth/register", {
        email,
        password,
        confirm_password,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch Profile
export const fetchProfile = createAsyncThunk("auth/fetchProfile", async (_, thunkAPI) => {
  try {
    const res = await api.get("/auth/profile"); // axios interceptor already attaches token
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Refresh Access Token
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return null;

      const res = await api.post("/auth/refresh", { refresh_token: refreshToken });
      const { access_token } = res.data;

      localStorage.setItem("accessToken", access_token);
      return access_token;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken,
    refreshToken,
    status: "idle",
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
        s.refreshToken = a.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // Register
      .addCase(registerUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s) => {
        s.status = "succeeded";
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // Profile
      .addCase(fetchProfile.fulfilled, (s, a) => {
        s.user = a.payload;
      })

      // Refresh token
      .addCase(refreshAccessToken.fulfilled, (s, a) => {
        s.accessToken = a.payload;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;

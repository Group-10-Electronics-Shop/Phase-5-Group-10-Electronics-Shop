import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser as loginAPI, registerUser as registerAPI } from "../../api";

// ✅ Fixed admin credentials
const ADMIN_EMAIL = "admin@shop.com";
const ADMIN_PASSWORD = "admin123";

// ------------------------------
// Login thunk
// ------------------------------
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      // ✅ Check for admin credentials first
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          id: 0,
          first_name: "Admin",
          last_name: "User",
          email: ADMIN_EMAIL,
          role: "admin",
        };

        // Store fake token and user info
        localStorage.setItem("token", "admin_token_123");
        localStorage.setItem("user", JSON.stringify(adminUser));

        return adminUser;
      }

      // ✅ Regular user login via API
      const response = await loginAPI(email, password);

      if (response.success && response.data) {
        const { user, access_token } = response.data;

        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        return user;
      }

      throw new Error(response.message || "Login failed");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ------------------------------
// Register thunk (users only)
// ------------------------------
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      // ✅ Prevent registration for the admin account
      if (userData.email === ADMIN_EMAIL) {
        return thunkAPI.rejectWithValue("Admin account cannot register.");
      }

      const response = await registerAPI(userData);

      if (response.success && response.data) {
        const { user, access_token } = response.data;

        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        return user;
      }

      throw new Error(response.message || "Registration failed");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Registration failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ------------------------------
// Slice setup
// ------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

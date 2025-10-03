import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, role }, thunkAPI) => {
    try {
      // Mocked login: role comes from the dropdown in Login.jsx
      const user = {
        id: Math.floor(Math.random() * 1000),
        name: email.split("@")[0],
        email,
        role: role || "user", // if none selected, fallback to user
      };

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      return thunkAPI.rejectWithValue("Login failed");
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email }, thunkAPI) => {
    try {
      // Registration always creates a "user"
      const user = {
        id: Math.floor(Math.random() * 1000),
        name,
        email,
        role: "user", // locked to user during registration
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      return thunkAPI.rejectWithValue("Registration failed");
    }
  }
);

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
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.user = action.payload;
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      });
  },
});

// Export actions and reducer
export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;

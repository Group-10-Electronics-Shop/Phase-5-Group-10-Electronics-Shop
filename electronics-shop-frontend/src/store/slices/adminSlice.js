import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { admin } from '../../api';

// Dashboard analytics
export const fetchDashboard = createAsyncThunk('admin/fetchDashboard', async (_, thunkAPI) => {
  try {
    const res = await admin.getDashboard();
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, thunkAPI) => {
  try {
    const res = await admin.getUsers();
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchOrders = createAsyncThunk('admin/fetchOrders', async (_, thunkAPI) => {
  try {
    const res = await admin.getAllOrders();
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchProductsAnalytics = createAsyncThunk('admin/fetchProductsAnalytics', async (_, thunkAPI) => {
  try {
    const res = await admin.getProductsAnalytics();
    return res.data.data || res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboard: null,
    users: [],
    orders: [],
    productsAnalytics: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchDashboard.fulfilled, (s, a) => { s.status = 'succeeded'; s.dashboard = a.payload; })
      .addCase(fetchDashboard.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })

      .addCase(fetchUsers.fulfilled, (s, a) => { s.users = a.payload; })
      .addCase(fetchOrders.fulfilled, (s, a) => { s.orders = a.payload; })
      .addCase(fetchProductsAnalytics.fulfilled, (s, a) => { s.productsAnalytics = a.payload; });
  },
});

export default adminSlice.reducer;

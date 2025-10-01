import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { products } from '../../api';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, thunkAPI) => {
  try {
    const response = await products.fetchAll();
    const payload = response.data;
    if (payload && payload.data && Array.isArray(payload.data.products)) {
      return payload.data.products;
    }
    if (Array.isArray(payload)) return payload;
    return [];
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id, thunkAPI) => {
  try {
    const response = await products.fetchById(id);
    const payload = response.data;
    if (payload && payload.data && payload.data.product) {
      return payload.data.product;
    }
    return payload;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProduct: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(fetchProductById.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.status = 'succeeded'; state.selectedProduct = action.payload; })
      .addCase(fetchProductById.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export default productsSlice.reducer;

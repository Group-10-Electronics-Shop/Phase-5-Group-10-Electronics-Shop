import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cart as cartApi } from '../../api';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const res = await cartApi.get();
    const payload = res.data;
    if (payload && payload.data) {
      return payload.data.cart || payload.data.items || payload.data;
    }
    return payload;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (payload, thunkAPI) => {
  try {
    const res = await cartApi.add(payload);
    const result = res.data;
    if (result && result.data) {
      return result.data;
    }
    return result;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ itemId, payload }, thunkAPI) => {
  try {
    const res = await cartApi.updateItem(itemId, payload);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId, thunkAPI) => {
  try {
    await cartApi.removeItem(itemId);
    return itemId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
  try {
    await cartApi.clear();
    return [];
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => { state.items = Array.isArray(action.payload) ? action.payload : []; state.status = 'succeeded'; })
      .addCase(fetchCart.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCart.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (action.payload && action.payload.items) state.items = action.payload.items;
        else if (action.payload && Array.isArray(action.payload)) state.items = action.payload;
        else if (action.payload && action.payload.item) state.items.push(action.payload.item);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updated = action.payload?.item || action.payload;
        if (!updated) return;
        const idx = state.items.findIndex((i) => i.id === updated.id || (i.product && i.product.id === updated.product?.id));
        if (idx !== -1) state.items[idx] = updated;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((i) => (i.id !== id && !(i.product && i.product.id === id)));
      })
      .addCase(clearCart.fulfilled, (state) => { state.items = []; });
  },
});

export default cartSlice.reducer;

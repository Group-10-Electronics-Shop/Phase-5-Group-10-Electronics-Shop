import { createSlice } from '@reduxjs/toolkit';

const initial = JSON.parse(localStorage.getItem('wishlist') || '[]');

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: initial },
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find((p) => p.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

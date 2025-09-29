// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice"; // new slice
import orderReducer from "../features/orders/orderSlice";
import productReducer from "../features/products/productSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer, // added wishlist
    orders: orderReducer,
    products: productReducer,
  },
});

export default store;

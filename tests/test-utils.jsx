import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

// import your reducers
import cartReducer from "../src/redux/cartSlice";
import authReducer from "../src/redux/authSlice";

export function renderWithProviders(ui, { preloadedState = {}, store } = {}) {
  if (!store) {
    store = configureStore({
      reducer: {
        cart: cartReducer,
        auth: authReducer,
      },
      preloadedState,
    });
  }

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}

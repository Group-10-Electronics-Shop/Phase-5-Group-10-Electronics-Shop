/**
 * Minimal Redux store created automatically because one was missing.
 * If you already have a store, replace this file with your real store.
 */
import { configureStore } from "@reduxjs/toolkit";

// Placeholder reducer: replace or add your real reducers here.
function placeholderReducer(state = { items: [] }, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const store = configureStore({
  reducer: {
    // keep your real reducers here, e.g. products: productsReducer
    placeholder: placeholderReducer,
  },
});

export default store;

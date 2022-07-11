import bookReducer from "./bookSlice";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = {
  book: bookReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;

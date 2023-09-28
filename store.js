import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./redux/slice";

const store = configureStore({
  reducer: {
    reducer: appReducer,
  },
});

export default store;
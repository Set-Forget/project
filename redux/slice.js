import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const BASE_URL =
  "https://script.google.com/macros/s/AKfycbx-8MsZkrFzfY4KaKj6ImCJKyT-ICRR9JqaWv3wzACv7SNut6jOqGJPVXE-in_-8fkDvQ/exec";

export const fetchData = createAsyncThunk("getData/fetchData", async () => {
  let url = BASE_URL + "?action=fetchData";
  const response = await fetch(url);
  const data = await response.json();
  return data.response;
});

const appReducer = createSlice({
  name: "getData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload; // Replaces the existing data
    });
  },
});

export default appReducer.reducer;

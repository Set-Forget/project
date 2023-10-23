import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  allLocations: []
};

const BASE_URL =
  "https://script.google.com/macros/s/AKfycbx-8MsZkrFzfY4KaKj6ImCJKyT-ICRR9JqaWv3wzACv7SNut6jOqGJPVXE-in_-8fkDvQ/exec";

export const fetchData = createAsyncThunk("getData/fetchData", async () => {
  let url = BASE_URL + "?action=fetchData";
  const response = await fetch(url);
  const data = await response.json();
  return data.response;
});

export const fetchAllLocations = createAsyncThunk("getData/fetchAllLocations", async () => {
  let url = BASE_URL + "?action=fetchAllLocation";
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
    builder.addCase(fetchAllLocations.fulfilled, (state, action) => {
      state.allLocations = action.payload; // Replaces the existing data
    });
  },
});

export default appReducer.reducer;

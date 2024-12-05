
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/users"; // Service to fetch user data

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
    const users = await userService.getAll(); 
  return users;
});

const allUserSlice = createSlice({
  name: "users",
  initialState: { users: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default allUserSlice.reducer;
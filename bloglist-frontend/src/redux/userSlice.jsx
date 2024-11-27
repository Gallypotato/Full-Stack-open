import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import loginService from '../services/login';

const initialState = {
    user: null, // Stores user object upon successful login
    status: 'idle', // Tracks the status: 'idle', 'loading', 'succeeded', 'failed'
    error: null, // Stores error messages, if any
  };

// Async thunk for login
export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
    try {
      const user = await loginService.login(credentials); // Call your login service
      const expiryTime = Date.now() + user.expiresIn * 1000;
      const userWithExpiry = { ...user, expiryTime };
      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(userWithExpiry),
      );
      return userWithExpiry; // Add expiryTime to the user object
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed'); // Return error message
    }
  });

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload; // Set user data in Redux state
        },
        clearUser(state) {
           state.user = null;
           state.status = 'idle';
           state.error = null;
        }
    },
    extraReducers:(builder) => {
        builder
          // Handle login pending
          .addCase(login.pending, (state) => {
            state.status = 'loading';
            state.error = null;
          })
          // Handle login success
          .addCase(login.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.user = action.payload;
          })
          // Handle login failure
          .addCase(login.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'Login failed';
          });
    }

})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
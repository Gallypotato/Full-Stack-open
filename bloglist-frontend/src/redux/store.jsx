import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notificationSlice";
import blogReducer from "./blogSlice"
import userReducer from "./userSlice"
import allUserReducer from './allUserSlice'

// Create the store using configureStore
const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
    users: allUserReducer,
  },
});

export default store;
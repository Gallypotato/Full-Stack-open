import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    message: null,
    type: null,
  },
  reducers: {
    setNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearNotification: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export const notify = (message, type, timeout = 5000) => (dispatch) => {
  dispatch(setNotification({ message, type }));
  
  setTimeout(() => {
    dispatch(clearNotification());
  }, timeout);
};
export default notificationSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';



const notificationSlice = createSlice({
  name: "notification",
  initialState: { message:'', timeoutId: null },
  reducers: {
    setNotificationWithTimeout(state, action) {
      const { message, time } = action.payload
  
      if (state.timeoutId) {
        clearTimeout(state.timeoutId)
      }
      state.message = message
      state.timeoutId = setTimeout(() => {
        state.message = ''
      }, time * 1000)
    },
    removeNotification(state) {
      state.message = ''
      state.timeoutId = null
    }
  }
});

export const { setNotificationWithTimeout, removeNotification } = notificationSlice.actions

export const setNotification = (message, timeInSeconds) => {
  return (dispatch) => {
    // Dispatch notification with the message and timeout
    dispatch(setNotificationWithTimeout({ message, time: timeInSeconds }))

    // Automatically remove the notification after the timeout
    setTimeout(() => {
      dispatch(removeNotification());
    }, timeInSeconds * 1000)
}
}
export default notificationSlice.reducer
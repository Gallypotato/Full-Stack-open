import { useReducer, createContext, useContext } from 'react'
import PropTypes from 'prop-types'
// Define action types
const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'
const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION'

// Define initial state
const initialState = {
  message: '',
  visible: false,
}

// Reducer function to manage notification state
const notificationReducer = (state, action) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return { ...state, message: action.message, visible: true }
    case HIDE_NOTIFICATION:
      return { ...state, visible: false }
    default:
      return state
  }
}

const NotificationContext  = createContext()

export const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, initialState);
  
    return (
      <NotificationContext.Provider value={{ state, dispatch }}>
        {children}
      </NotificationContext.Provider>
    );
  };
  

// Custom hook to use notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};

// Actions to show and hide notifications
export const showNotification = (message) => ({
  type: SHOW_NOTIFICATION,
  message,
});

export const hideNotification = () => ({
  type: HIDE_NOTIFICATION,
});

NotificationProvider.propTypes = {
    children: PropTypes.array.isRequired
  }
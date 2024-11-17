//actions
export const SET_FILTER = "SET_FILTER";

export const setFilter = (filter) => ({
    type: SET_FILTER,
    payload: filter,
  });
//reducer
const filterReducer = (state = "", action) => {
    switch (action.type) {
      case 'SET_FILTER':
        return action.payload;
      default:
        return state
    }
  }

export default filterReducer
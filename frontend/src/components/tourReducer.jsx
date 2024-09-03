import {
  FETCH_TOURS_REQUEST,
  FETCH_TOURS_SUCCESS,
  FETCH_TOURS_FAILURE,
} from "./tourActions";

const initialState = {
  tours: [],
  status: "loading",
};

function tourReducer(state, action) {
  switch (action.type) {
    case FETCH_TOURS_REQUEST:
      return { ...state, loading: true, error: null, status: "loading" };
    case FETCH_TOURS_SUCCESS:
      return {
        ...state,
        loading: false,
        tours: action.payload,
        status: "success",
      };
    case FETCH_TOURS_FAILURE:
      return { ...state, loading: false, error: action.error, status: "error" };
    default:
      return state;
  }
}

export { initialState, tourReducer };

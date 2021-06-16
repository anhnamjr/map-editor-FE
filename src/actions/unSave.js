// import axios from "axios";
import { ADD_TO_UNSAVE } from "../constants/actions";
// import { BASE_URL } from "../constants/endpoint";
// import { useDispatch } from "react-redux"

export const AddToUnsave = (feature) => async (dispatch) => {
  return dispatch({
    type: ADD_TO_UNSAVE,
    payload: feature,
  });
};

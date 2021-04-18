import axios from "axios";
import { SET_USER } from "../constants/actions";
import { AUTH_URL } from "../constants/endpoint";

export const userSignIn = (user) => async (dispatch) => {
  // TODO
  const result = await axios.post(`${AUTH_URL}/sign-in`, user).then((res) => {
    console.log(res.data);
  });
};

export const userSignUp = (user) => async (dispatch) => {
  // TODO
  const result = await axios.post(`${AUTH_URL}/sign-up`, user).then((res) => {
    console.log(res.data);
  });
};

export const setUser = (user) => (dispatch) => {
  dispatch({
    type: SET_USER,
    payload: user,
  });
};

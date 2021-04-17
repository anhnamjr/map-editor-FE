import axios from "axios";
import { FETCH_LAYER_TREE } from "../constants/actions";
import { BASE_URL } from "../constants/endpoint";

export const userSignIn = (user) => async (dispatch) => {
  // TODO
  const result = await axios
    .post(`${BASE_URL}/sign-in`, user)
    .then((res) => {
      console.log(res.data)
    });
};

export const userSignUp = (user) => async (dispatch) => {
  // TODO
  const result = await axios
    .post(`${BASE_URL}/sign-up`, user)
    .then((res) => {
      console.log(res.data)
    });
};

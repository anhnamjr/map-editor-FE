// import axios from "axios";
import { AXIOS_INSTANCE } from "../config/requestInterceptor";
import { FETCH_LAYER_TREE } from "../constants/actions";
import { BASE_URL } from "../constants/endpoint";

export const fetchLayerTree = (/*userId*/) => async (dispatch) => {
  // TODO
  const result = await AXIOS_INSTANCE.get(`${BASE_URL}/maps`, {
    // userId,
  }).then((res) => res.data.maps);

  dispatch({
    type: FETCH_LAYER_TREE,
    payload: result,
  });
};

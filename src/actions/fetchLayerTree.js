// import axios from "axios";
import { AXIOS_INSTANCE } from "../config/requestInterceptor";
import { FETCH_LAYER_TREE, SET_CURRENT_LAYER_COL, SET_CURRENT_LAYER_STYLE } from "../constants/actions";
import { BASE_URL } from "../constants/endpoint";

export const fetchLayerTree = (/*userId*/) => async (dispatch) => {
  // TODO
  const { data } = await AXIOS_INSTANCE.get(`${BASE_URL}/maps`, {
    // userId,
  })

  dispatch({
    type: FETCH_LAYER_TREE,
    payload: data.maps,
  });
};

export const fetchLayerCols = (id) => async (dispatch) => {
  // TODO
  const { data } = await AXIOS_INSTANCE.get(`${BASE_URL}/layer-column?layerID=${id}`)

  dispatch({
    type: SET_CURRENT_LAYER_COL,
    payload: [...data.opt],
  });

  dispatch({
    type: SET_CURRENT_LAYER_STYLE,
    payload: [...data.def]
  })
};


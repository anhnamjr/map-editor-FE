// import axios from "axios";
import { AXIOS_INSTANCE } from "../config/requestInterceptor";
import { calGeomCenter } from "../utils"

import {  UPDATE_LAYER_DATA, CHANGE_MAP_CENTER } from "../constants/actions";
import { BASE_URL } from "../constants/endpoint";
// import { useDispatch } from "react-redux"

export const searchGeom = (geoID) => async (dispatch) => {
  // TODO
  const { data } = await AXIOS_INSTANCE.get(`${BASE_URL}/single-shape?geoID=${geoID}`)

  dispatch({ type: UPDATE_LAYER_DATA, payload: data})

  dispatch({ type: CHANGE_MAP_CENTER, payload: calGeomCenter(data.geometry.coordinates) })
};


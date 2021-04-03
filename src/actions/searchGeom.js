import axios from "axios";
import { CHANGE_MAP_CENTER, UPDATE_LAYER_DATA } from "../constants/actions";
import { BASE_URL } from "../constants/endpoint";
import { useDispatch } from "react-redux"

export const searchGeom = (geoID) => async (dispatch) => {
  // TODO
  const { data } = await axios.get(`${BASE_URL}/single-shape?geoID=${geoID}`)
  console.log(data)

  dispatch({ type: UPDATE_LAYER_DATA, payload: data})

  // dispatch({ type: CHANGE_MAP_CENTER, payload: data.geometry.coordinates })
};


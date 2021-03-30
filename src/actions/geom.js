import axios from "axios";
import { EDIT_GEOM } from "../constants/actions";
import { BASE_URL } from "../constants/endpoint";

export const editGeom = (editedGeom) => (dispatch) => {
  // TODO
  const result = axios
    .post(`${BASE_URL}/edit-geom`, [editedGeom])
    .then((res) => {
      dispatch({
        type: EDIT_GEOM,
        payload: res.data,
      });
    });
};

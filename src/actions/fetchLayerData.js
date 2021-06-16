import { AXIOS_INSTANCE } from "../config/requestInterceptor";
import { FETCH_LAYER_DATA } from "../constants/actions";
import { BASE_URL } from "../constants/endpoint";

export const fetchLayerData = (layerId) => {
  // TODO
  const result = AXIOS_INSTANCE
    .get(`${BASE_URL}/data`, {
      layerId,
    })
    .then((res) => res.data.maps);

  return {
    type: FETCH_LAYER_DATA,
    payload: result,
  };
};

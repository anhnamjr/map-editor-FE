import { STORE_GEOM_COOR, STORE_GEOM_DATA } from "../constants/actions";

const initState = {
  geom: "",
  layerID: "",
  geoName: "",
  categoryID: "",
  description: "",
  color: "",
};

export const storeGeom = (state = initState, action) => {
  switch (action.type) {
    case STORE_GEOM_COOR:
      return {
        ...state,
        geom: action.payload,
      };

    case STORE_GEOM_DATA:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return { ...state };
  }
};

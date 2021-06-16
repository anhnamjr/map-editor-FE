import {
  STORE_GEOM_COOR,
  STORE_GEOM_DATA,
  SET_EDIT,
  SET_NOT_EDIT,
  RESET_GEOM_DATA,
} from "../constants/actions";

const initState = {
  geom: {
    type: "Feature",
    geometry: null,
    properties: null,
  },
  isEditing: false,
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
    case SET_EDIT:
      return {
        ...state,
        isEditing: true,
      };
    case SET_NOT_EDIT:
      return {
        ...state,
        isEditing: false,
      };
    case RESET_GEOM_DATA:
      return {
        ...state,
        geom: initState.geom,
      };
    default:
      return { ...state };
  }
};

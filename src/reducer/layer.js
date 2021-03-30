import {
  FETCH_LAYER_DATA,
  CLEAR_LAYER_DATA,
  EDIT_GEOM,
} from "../constants/actions";

const initState = {
  layerData: {},
};

export const layerReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_LAYER_DATA:
      return {
        ...state,
        layerData: action.payload,
      };

    case CLEAR_LAYER_DATA:
      return {
        ...state,
        layerData: {},
      };

    case EDIT_GEOM:
      return {
        ...state,
        layerData: state.layerData,
      };

    default:
      return { ...state };
  }
};

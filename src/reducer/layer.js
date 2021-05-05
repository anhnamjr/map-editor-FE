import { FETCH_LAYER_DATA, CLEAR_LAYER_DATA, UPDATE_LAYER_DATA } from "../constants/actions";

const initState = {
  layerData: {},
  layerCol: []
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
        layerData: [],
      };

    case UPDATE_LAYER_DATA:
      return state.layerData.type ? {
        ...state,
        layerData: {
          ...state.layerData,
          features: [...state.layerData.features, action.payload]
        },
      } : {
        ...state,
        layerData: {
          type: "FeatureCollection",
          features: [action.payload]
        }
      }

    default:
      return { ...state };
  }
};

import {
  FETCH_LAYER_DATA,
  CLEAR_LAYER_DATA,
  UPDATE_LAYER_DATA,
  ADD_LAYER_DATA,
  DELETE_GEOM,
  UPDATE_FROM_UNSAVE
} from "../constants/actions";
import { findIndex } from "lodash";

const initState = {
  layerData: {},
  layerCol: [],
  editedGeomId: [],
  deletedGeomId: [],
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

    case ADD_LAYER_DATA:
      return state.layerData.type
        ? {
          ...state,
          layerData: {
            ...state.layerData,
            features: [...state.layerData.features, action.payload],
          },
        }
        : {
          ...state,
          layerData: {
            type: "FeatureCollection",
            features: [action.payload],
          },
        };
    case UPDATE_LAYER_DATA: {
      const layerData = state.layerData;
      const { geom } = action.payload;
      const idx = findIndex(layerData.features, {
        properties: { geoID: geom.properties.geoID },
      });
      layerData.features[idx] = geom;
      return {
        ...state,
        layerData: layerData,
        editedGeomId: geom.properties.geoID ? [...state.editedGeomId, geom.properties.geoID] : [...state.editedGeomId]
      };
    }

    case UPDATE_FROM_UNSAVE:
      return {
        ...state,
        layerData: {
          ...state.layerData,
          features: [...state.layerData.features, ...action.payload],
        }
      }

    case DELETE_GEOM:
      const newData = { ...state.layerData }
      newData.features = newData.features.filter(item => item.properties.geoID !== action.payload)
      return {
        ...state,
        layerData: newData,
        deletedGeomId: [...state.deletedGeomId, action.payload]
      };
    default:
      return { ...state };
  }
};

import {
  FETCH_LAYER_DATA,
  CLEAR_LAYER_DATA,
  UPDATE_LAYER_DATA,
  ADD_LAYER_DATA,
  REVERSE_BACKUP_GEOM,
  SET_BACKUP_GEOM,
  DELETE_GEOM
} from "../constants/actions";
import { findIndex } from "lodash";

const initState = {
  layerData: {},
  layerCol: [],
  backupGeom: "",
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
      layerData.features[idx].geometry = geom.geometry;
      return {
        ...state,
        layerData: layerData,
      };
    }

    case DELETE_GEOM:
      const newData = { ...state.layerData }
      newData.features = newData.features.filter(item => item.properties.geoID !== action.payload)
      return {
        ...state,
        layerData: newData,
      };

    case SET_BACKUP_GEOM:
      return {
        ...state,
        backupGeom: action.payload,
      };
    case REVERSE_BACKUP_GEOM:
      return {
        ...state,
        backupGeom: "",
      };
    default:
      return { ...state };
  }
};

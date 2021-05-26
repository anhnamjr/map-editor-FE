import {
  ADD_TO_UNSAVE,
  REMOVE_FROM_UNSAVE,
  TOGGLE_UNSAVE,
  UPDATE_UNSAVE_LAYER_DATA,
  CLEAR_UNSAVE,
  SET_UNSAVE
} from "../constants/actions";
import { findIndex } from "lodash";

const initState = {
  unSaveGeom: [],
  showUnsave: false,
};

export const unSaveReducer = (state = initState, action) => {
  switch (action.type) {
    case ADD_TO_UNSAVE:
      return {
        ...state,
        unSaveGeom: [...state.unSaveGeom, action.payload],
      };

    case TOGGLE_UNSAVE:
      return {
        ...state,
        showUnsave: action.payload,
      };

    case REMOVE_FROM_UNSAVE:
      return {
        ...state,
        unSaveGeom: state.unSaveGeom.filter(
          (geom) => geom.properties.geoID !== action.payload
        ),
      };
    case UPDATE_UNSAVE_LAYER_DATA: {
      const { unSaveGeom } = state;
      const { geom } = action.payload;
      const idx = findIndex(unSaveGeom, {
        properties: { geoID: geom.properties.geoID },
      });
      console.log(idx)
      if(idx) {
        unSaveGeom[idx].geometry = geom.geometry;
      }
      return {
        ...state,
        unSaveGeom: unSaveGeom,
      };
    }

    case CLEAR_UNSAVE:
      return {
        ...state,
        unSaveGeom: []
      }
    case SET_UNSAVE:
      return {
        ...state,
        unSaveGeom: action.payload
      };

    default:
      return { ...state };
  }
};

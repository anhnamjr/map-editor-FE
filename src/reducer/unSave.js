import {
  ADD_TO_UNSAVE,
  REMOVE_FROM_UNSAVE,
  TOGGLE_UNSAVE,
} from "../constants/actions";

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
        unSaveGeom: state.unSaveGeom.filter(geom => geom.properties.geoID !== action.payload)
      }

    default:
      return { ...state };
  }
};

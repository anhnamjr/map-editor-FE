import { CHANGE_MAP_CENTER, CLEAR_SEARCH } from "../constants/actions";

const initState = {
  center: [10.7646598, 106.6855794],
  showMarker: false
};

export const mapReducer = (state = initState, action) => {
  switch (action.type) {
    case CHANGE_MAP_CENTER:
      return {
        ...state,
        center: action.payload.coor,
        showMarker: action.payload.showMarker
      };

    case CLEAR_SEARCH:
      return {
        ...state,
        showMarker: false
      };

    default:
      return { ...state };
  }
};

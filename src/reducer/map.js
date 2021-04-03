import { CHANGE_MAP_CENTER } from "../constants/actions";

const initState = {
  center: [10.7646598, 106.6855794],
};

export const mapReducer = (state = initState, action) => {
  switch (action.type) {
    case CHANGE_MAP_CENTER:
      return {
        ...state,
        center: action.payload,
      };

    default:
      return { ...state };
  }
};

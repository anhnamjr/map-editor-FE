import { 
  ADD_TO_UNSAVE,
  REMOVE_FROM_UNSAVE,
  SHOW_UNSAVE,
  HIDE_UNSAVE
} from "../constants/actions";

const initState = {
  unSaveGeom: [],
  showUnsave: false
};

export const unSaveReducer = (state = initState, action) => {
  switch (action.type) {
    case ADD_TO_UNSAVE:
      return {
        ...state,
        unSaveGeom: [...state.unSaveGeom, action.payload],
      };

    case SHOW_UNSAVE:
      return {
        ...state,
        showUnsave:true
      }

    case HIDE_UNSAVE:
      return {
        ...state,
        showUnsave:false
      }

    default:
      return { ...state };
  }
};

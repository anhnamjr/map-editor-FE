import {
  GET_MOUSE_BOUND,
  GET_MOUSE_POSITION,
  SET_GEOM_R_TREE,
  SET_MID_POINT,
  SET_R_TREE,
} from "../constants/actions";

const initialState = {
  tree: null,
  node: null,
  mousePosition: null,
  mouseBound: null,
  midPoint: null,
};

export const snap = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_R_TREE:
      return {
        ...state,
        tree: action.payload,
      };
    case SET_GEOM_R_TREE:
      const tree = state.tree;
      tree.insert(action.payload);
      return {
        ...state,
        tree: tree,
        node: tree.all(),
      };
    case GET_MOUSE_BOUND: {
      return {
        ...state,
        mouseBound: action.payload,
      };
    }
    case GET_MOUSE_POSITION:
      return {
        ...state,
        mousePosition: action.payload,
      };
    case SET_MID_POINT:
      return {
        ...state,
        midPoint: action.payload,
      };
    default:
      return state;
  }
};

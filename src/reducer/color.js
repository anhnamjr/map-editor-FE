import { SET_COLOR, SET_FILL_COLOR, SET_FILL_OPACITY, SET_WEIGHT, SET_FULL_COLOR } from "../constants/actions";

const defaultColor = "#ffffff"
const initialState = {
  color: defaultColor,
  fill: defaultColor,
  weight: 1,
  fillOpacity: 0.3,
}

export const colorReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_COLOR:
      return {
        ...state,
        color: action.payload
      }
    case SET_FILL_COLOR:
      return {
        ...state,
        fill: action.payload
      }
    case SET_FILL_OPACITY:
      return {
        ...state,
        fillOpacity: action.payload
      }
    case SET_WEIGHT:
      return {
        ...state,
        weight: action.payload
      }
    case SET_FULL_COLOR:
      return action.payload
    default:
      return state
  }
}


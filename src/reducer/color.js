import { 
  SET_COLOR, 
  SET_FILL_COLOR, 
  SET_FILL_OPACITY, 
  SET_WEIGHT, 
  SET_FULL_COLOR, 
  SET_ANOTHER_PROPERTIES,
  SET_PROPERTIES
} from "../constants/actions";

const defaultColor = "#ffffff"
const initialState = {
  color: defaultColor,
  fill: defaultColor,
  weight: 1,
  fillOpacity: 0.3,
}

export const colorReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_PROPERTIES:
      return {
        ...state,
        ...action.payload
      }

    case SET_FULL_COLOR:
      return action.payload

    default:
      return state
  }
}


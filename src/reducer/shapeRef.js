import { STORE_SHAPE_REF, CLEAR_SHAPE_REF } from "../constants/actions"

const initState = {
  shapeRef: null
}

export const storeShapeRef = (state = initState, action) => {
  switch (action.type) {
    case STORE_SHAPE_REF:
      return {
        ...state,
        shapeRef: action.payload
      }
    case CLEAR_SHAPE_REF:
      return {
        ...state,
        shapeRef: null
      }
    default:
      return state
  }
}
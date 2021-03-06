import { FETCH_LAYER_TREE } from '../constants/actions';

const initState = {
    layerTree: []
}

export const treeReducer = (state=initState, action) => {
    switch(action.type) {
        case FETCH_LAYER_TREE:
            return {
                ...state,
                layerTree: action.payload
            }

        default: return {...state}
    }
}
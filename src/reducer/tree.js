import { FETCH_LAYER_TREE, SET_CURRENT_EDIT_LAYER } from '../constants/actions';

const initState = {
    layerTree: [],
    currentEditLayer: ""
}

export const treeReducer = (state=initState, action) => {
    switch(action.type) {
        case FETCH_LAYER_TREE:
            return {
                ...state,
                layerTree: action.payload
            }

        case SET_CURRENT_EDIT_LAYER: 
            return {
                ...state,
                currentEditLayer: action.payload
            }

        default: return {...state}
    }
}
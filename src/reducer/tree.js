import { FETCH_LAYER_TREE, SET_CURRENT_EDIT_LAYER, SET_CURRENT_LAYER_COL } from '../constants/actions';

const initState = {
    layerTree: [],
    currentEditLayer: "",
    currentLayerCol: []
}

export const treeReducer = (state = initState, action) => {
    switch (action.type) {
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

        case SET_CURRENT_LAYER_COL:
            return {
                ...state,
                currentLayerCol: action.payload
            }
        default: return { ...state }
    }
}
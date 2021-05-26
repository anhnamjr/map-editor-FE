import { FETCH_LAYER_TREE, 
    SET_CURRENT_EDIT_LAYER, 
    SET_CURRENT_LAYER_COL, 
    SET_CURRENT_LAYER_STYLE 
} from '../constants/actions';

const initState = {
    layerTree: [],
    currentEditLayer: "",
    currentLayerCol: [],
    currentLayerStyle: {}
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

        case SET_CURRENT_LAYER_STYLE:
            const style = action.payload.map(item => ({[item.column_name]: item.column_default}))
            console.log(style)
            return {
                ...state,
                currentLayerStyle: action.payload
            } 
        default: return { ...state }
    }
}
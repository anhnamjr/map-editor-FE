import { combineReducers } from 'redux';
import { treeReducer } from './tree'
import { layerReducer } from './layer'
import { storeGeom } from './geom'

export const rootReducer = combineReducers({
    treeReducer,
    layerReducer,
    storeGeom,
})
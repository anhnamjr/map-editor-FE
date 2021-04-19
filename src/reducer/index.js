import { combineReducers } from 'redux';
import { treeReducer } from './tree'
import { layerReducer } from './layer'
import { storeGeom } from './geom'
import { mapReducer } from './map'
import { storeShapeRef } from "./shapeRef"

export const rootReducer = combineReducers({
    treeReducer,
    layerReducer,
    storeGeom,
    mapReducer,
    storeShapeRef
})
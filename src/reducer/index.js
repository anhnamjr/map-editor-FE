import { combineReducers } from "redux";
import { treeReducer } from "./tree";
import { layerReducer } from "./layer";
import { storeGeom } from "./geom";
import { mapReducer } from "./map";
import { userReducer } from "./user";
import { storeShapeRef } from "./shapeRef";
import { unSaveReducer } from "./unSave";
import { colorReducer } from "./color";

export const rootReducer = combineReducers({
  treeReducer,
  layerReducer,
  storeGeom,
  mapReducer,
  userReducer,
  storeShapeRef,
  unSaveReducer,
  colorReducer,
});

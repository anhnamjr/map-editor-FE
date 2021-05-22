import React from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../../../constants/endpoint";
import Shape from "../Shape";
import { AddToUnsave } from "../../../../actions/unSave";
import { TOGGLE_UNSAVE } from "../../../../constants/actions";

export default function EditableLayer({ geoData }) {
  const dispatch = useDispatch();
  const { unSaveGeom, showUnsave } = useSelector(
    (state) => state.unSaveReducer
  );
  const { currentEditLayer } = useSelector((state) => state.treeReducer);
  const controlCreate = (e) => {
    let geom = e.layer.toGeoJSON().geometry;
    geom = {
      type: geom.type,
      coordinates: geom.coordinates,
    };
    let shapeItem = {
      type: "Feature",
      geometry: geom,
      properties: {
        geoID: Math.random(),
        color: "#40a9ff",
        fill: "#40a9ff",
        fillOpacity: 0.3,
        radius: 0,
        weight: 3,
        layerID: currentEditLayer
      },
    };
    if (e.layer._mRadius) {
      shapeItem.properties = {
        ...shapeItem.properties,
        radius: e.layer._mRadius,
      };
    }
    let localUnsave = JSON.parse(localStorage.getItem("unsave")) || [];
    localUnsave.push(shapeItem)
    localStorage.setItem("unsave", JSON.stringify(localUnsave))
    dispatch(AddToUnsave(shapeItem));
    dispatch({ type: TOGGLE_UNSAVE, payload: true });
    e.layer.remove();
  };

  const renderGeo = (geoData) => {
    if (geoData.features) {
      return geoData.features.map((item) => (
        <Shape item={item} key={item.properties.geoID} />
      ));
    }
  };
  const renderUnsave = (unsave) => {
    if (unsave && unsave.length !== 0) {
      return unsave.map((item, index) => <Shape item={item} key={index} />);
    }
  };


  const handleDelete = (e) => {
    const deletedId = Object.values(e.layers._layers).map(
      (item) => item.options.id
    );
    axios.post(`${BASE_URL}/delete-geom`, { id: deletedId });
  };

  return (
    <FeatureGroup>
      {
        currentEditLayer && <EditControl
          position="topright"
          onCreated={controlCreate}
          // onEdited={handleEdit}
          onDeleted={handleDelete}
          draw={{
            circlemarker: false,
          }}
          edit={{
            edit: false,
            remove: false,
          }}
        />
      }
      {renderGeo(geoData)}
      {unSaveGeom.length !== 0 && showUnsave && renderUnsave(unSaveGeom)}
    </FeatureGroup>
  );
}

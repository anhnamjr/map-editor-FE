import React from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
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

  const { currentLayerStyle, currentEditLayer } = useSelector(state => state.treeReducer)

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
        layerID: currentEditLayer,
        radius: -1,
        color: currentLayerStyle.color || "#40a9ff",
        fill: currentLayerStyle.fill || "#40a9ff",
        fillOpacity: currentLayerStyle.fillOpacity || 0.3,
        weight: currentLayerStyle.weight || 3,
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

  // const handleEdit = (e) => {
  //   const editedId = Object.entries(e.layers._layers);
  //   const editedGeom = editedId.map((item) => {
  //     //circle
  //     if (item[1]._mRadius)
  //       return {
  //         geoID: item[1].options.id,
  //         // type:'Circle',
  //         geom: {
  //           type: "Point",
  //           // coordinates: item[1]._latlngs
  //           coordinates: Object.values(item[1]._latlng).reverse(),
  //         },
  //         radius: item[1]._mRadius,
  //       };

  //     if (item[1]._latlngs) {
  //       //line string
  //       if (item[1]._latlngs.length > 1)
  //         return {
  //           geoID: item[1].options.id,
  //           geom: {
  //             type: "LineString", // 2d
  //             coordinates: reverseCoor(
  //               item[1]._latlngs.map((coor) => {
  //                 return Object.values(coor).slice(0, 2);
  //               })
  //             ),
  //           },
  //         };
  //       //polygon
  //       if (item[1]._latlngs.length === 1)
  //         return {
  //           geoID: item[1].options.id,
  //           geom: {
  //             type: "Polygon", //3d
  //             coordinates: [
  //               reverseCoor(
  //                 item[1]._latlngs[0].map((coor) => {
  //                   return Object.values(coor).slice(0, 2);
  //                 })
  //               ),
  //             ],
  //           },
  //         };
  //     }
  //     //marker
  //     return {
  //       geoID: item[1].options.id,
  //       geom: {
  //         type: "Point",
  //         // coordinates: item[1]._latlngs
  //         coordinates: Object.values(item[1]._latlng).reverse(),
  //       },
  //     };
  //   });
  //   axios.post(`${BASE_URL}/edit-geom`, editedGeom);
  // };

  const handleDelete = (e) => {
    const deletedId = Object.values(e.layers._layers).map(
      (item) => item.options.id
    );
    axios.post(`${BASE_URL}/delete-geom`, { id: deletedId });
  };

  return (
    <FeatureGroup>
      <EditControl
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
      {renderGeo(geoData)}
      {unSaveGeom.length !== 0 && showUnsave && renderUnsave(unSaveGeom)}
    </FeatureGroup>
  );
}

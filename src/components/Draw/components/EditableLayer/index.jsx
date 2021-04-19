import React, { useEffect, useRef } from "react";
import { FeatureGroup, useLeaflet } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useDispatch } from "react-redux";
import { STORE_GEOM_COOR } from "../../../../constants/actions";
import { reverseCoor } from "../../../../utils";
import axios from "axios";
import { BASE_URL } from "../../../../constants/endpoint";
import Shape from "../Shape";

export default function EditableLayer({
  item,
  layer,
  showDrawControl,
  onLayerClicked,
}) {
  const dispatch = useDispatch();
  const controlCreate = (e) => {
    let geom = e.layer.toGeoJSON().geometry;
    geom = {
      type: geom.type,
      coordinates: geom.coordinates,
    };
    if (e.layer._mRadius) {
      geom = {
        ...geom,
        properties: { ...geom.properties, radius: e.layer._mRadius },
      };
    }
    dispatch({ type: STORE_GEOM_COOR, payload: geom });
  };

  const handleEdit = (e) => {
    const editedId = Object.entries(e.layers._layers);
    console.log(editedId); // convert job -> arr
    const editedGeom = editedId.map((item) => {
      //circle
      if (item[1]._mRadius)
        return {
          geoID: item[1].options.id,
          // type:'Circle',
          geom: {
            type: "Point",
            // coordinates: item[1]._latlngs
            coordinates: Object.values(item[1]._latlng).reverse(),
          },
          radius: item[1]._mRadius,
        };

      if (item[1]._latlngs) {
        //line string
        if (item[1]._latlngs.length > 1)
          return {
            geoID: item[1].options.id,
            geom: {
              type: "LineString", // 2d
              coordinates: reverseCoor(
                item[1]._latlngs.map((coor) => {
                  return Object.values(coor).slice(0, 2);
                })
              ),
            },
          };
        //polygon
        if (item[1]._latlngs.length === 1)
          return {
            geoID: item[1].options.id,
            geom: {
              type: "Polygon", //3d
              coordinates: [
                reverseCoor(
                  item[1]._latlngs[0].map((coor) => {
                    return Object.values(coor).slice(0, 2);
                  })
                ),
              ],
            },
          };
      }
      //marker
      return {
        geoID: item[1].options.id,
        geom: {
          type: "Point",
          // coordinates: item[1]._latlngs
          coordinates: Object.values(item[1]._latlng).reverse(),
        },
      };
    });
    console.log(editedGeom);

    axios.post(`${BASE_URL}/edit-geom`, editedGeom);
  };

  const handleDelete = (e) => {
    const deletedId = Object.values(e.layers._layers).map(
      (item) => item.options.id
    );
    console.log(deletedId);
    axios.post(`${BASE_URL}/delete-geom`, { id: deletedId });
  };

  return (
    <FeatureGroup>
      <EditControl
        position="topright"
        onCreated={controlCreate}
        onEdited={handleEdit}
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
    </FeatureGroup>
  );
}

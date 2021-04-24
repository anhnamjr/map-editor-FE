import React, { useRef, useEffect } from "react";
import { FeatureGroup, useLeaflet } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useDispatch, useSelector } from "react-redux";
import { STORE_GEOM_COOR, STORE_SHAPE_REF } from "../../../../constants/actions";
import { reverseCoor } from "../../../../utils";
import axios from "axios"
import { BASE_URL } from "../../../../constants/endpoint";
import Shape from "../Shape";
import { AddToUnsave } from "../../../../actions/unSave"


export default function EditableLayer({ geoData }) {
  const dispatch = useDispatch();
  const { map } = useLeaflet();
  const temp = useSelector((state) => state.storeShapeRef)

  // const featureGroupRef = useRef()

  // useEffect(() => {
  //   featureGroupRef.current.leafletElement.eachLayer((layer) => {
  //     console.log(layer)
  //   })
  // })

  // useEffect(() => {

  // })

  const controlCreate = (e) => {
    let geom = e.layer.toGeoJSON().geometry;
    console.log(geom)
    geom = {
      type: geom.type,
      coordinates: geom.coordinates,
    };
    let shapeItem = {
      type: "Feature",
      geometry: geom,
      properties: {
        geoID: Math.random(),
        // layerID: "",
        geoName: "rooooo naaa",
        color: "#40a9ff",
        dashArray: 1,
        dayModify: null,
        description: "77777777",
        fill: "#40a9ff",
        fillOpacity: 0.3,
        properties: null,
        radius: 0,
        weight: 3,
      }
    }
    if (e.layer._mRadius) {
      shapeItem.properties = {
        ...shapeItem.properties, radius: e.layer._mRadius
      };
    }
    dispatch(AddToUnsave(shapeItem))
    e.layer.remove()
    console.log(shapeItem)
    e.layer.on("click", () => {
      // target.pm.enable();
      // target.on("pm:edit", (e) => {
      //   console.log("Edit")
      // })
      console.log(e)
      dispatch({ type: STORE_GEOM_COOR, payload: shapeItem });
      // dispatch({ type: STORE_SHAPE_REF, payload: 1 });
      map.off("click");
    });
    // dispatch({ type: STORE_GEOM_COOR, payload: geom });
  };

  const renderGeo = (geoData) => {
    if (geoData.features) {
      return geoData.features.map((item, index) => (
        <Shape item={item} key={index} />
      ));
    }
  };

  const handleEdit = (e) => {
    const editedId = Object.entries(e.layers._layers);
    // console.log(editedId); // convert job -> arr
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
    // console.log(editedGeom);

    axios.post(`${BASE_URL}/edit-geom`, editedGeom);
  };

  const handleDelete = (e) => {
    const deletedId = Object.values(e.layers._layers).map(
      (item) => item.options.id
    );
    // console.log(deletedId);
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
      {/* {unsaveData && renderGeo()} */}
    </FeatureGroup>
  );
}

import React from "react";
import { FeatureGroup } from "react-leaflet";
import Shape from "./components/Shape";
import { EditControl } from "react-leaflet-draw";
import { useDispatch } from "react-redux";
import { STORE_GEOM_COOR } from "../../constants/actions";
import { reverseCoor, reverseCoorMultiPolygon } from "../../utils";
import axios from "axios";
import { BASE_URL } from "../../constants/endpoint";
import { editGeom } from "../../actions/geom";

export default function Draw({ geoData }) {
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
    const editedLayer = Object.entries(e.layers._layers)[0];
    const shapeType = editedLayer[1].options.type
    let editedGeom
    if (shapeType === "MultiPolygon") {
      const editedLayerMulti = Object.entries(e.layers._layers);
      console.log('layer multi', editedLayerMulti)

      let arrPolygon = []
      editedLayerMulti.forEach(polygon => {
        let geom = {
          subId: polygon[1].options.subId, //3d
          coordinates: [
            reverseCoor(
              polygon[1]._latlngs[0].map((coor) => {
                return Object.values(coor).slice(0, 2);
              })
            ),
          ],
        }
        arrPolygon.push(geom);
      })

      axios.get(`${BASE_URL}/single-MP?geoID=${editedLayerMulti[0][1].options.id}`).then(res => {
        const newCoor = [...res.data.coordinates]
        console.log(newCoor)
        arrPolygon.forEach(item => {
          newCoor[item.subId] = item.coordinates
        })
        editedGeom = {
          geoID: editedLayerMulti[0][1].options.id,
          geom: {
            type: "MultiPolygon", // 2d
            coordinates: newCoor
          },
        }
        dispatch(editGeom(editedGeom))
        return
      })
    } else {
      if (shapeType === "Circle") {
        //circle
        editedGeom = {
          geoID: editedLayer[1].options.id,
          geom: {
            type: "Point",
            coordinates: Object.values(editedLayer[1]._latlng).reverse(),
          },
          radius: editedLayer[1]._mRadius,
        };
      }
      else if (shapeType === "LineString") {
        //line string
        editedGeom = {
          geoID: editedLayer[1].options.id,
          geom: {
            type: "LineString", // 2d
            coordinates: reverseCoor(
              editedLayer[1]._latlngs.map((coor) => {
                return Object.values(coor).slice(0, 2);
              })
            ),
          },
        }
      }

      //polygon
      else if (shapeType === "Polygon")
        editedGeom = {
          geoID: editedLayer[1].options.id,
          geom: {
            type: "Polygon", //3d
            coordinates: [
              reverseCoor(
                editedLayer[1]._latlngs[0].map((coor) => {
                  return Object.values(coor).slice(0, 2);
                })
              ),
            ],
          },
        };

      //marker
      else if (shapeType === "Point") {
        editedGeom = {
          geoID: editedLayer[1].options.id,
          geom: {
            type: "Point",
            // coordinates: item[1]._latlngs
            coordinates: Object.values(editedLayer[1]._latlng).reverse(),
          },
        };
      }
      dispatch(editGeom(editedGeom))
    }
  };

  const handleDelete = (e) => {
    console.log(e.layers._layers);
    const deletedId = Object.values(e.layers._layers).map(
      (item) => item.options.id
    );
    console.log(deletedId);
    axios.post(`${BASE_URL}/delete-geom`, { id: deletedId });
  };

  const handleClick = (e) => {
    console.log(e.layer.toGeoJSON().geometry);
  };

  const renderGeo = (geoData) => {
    if (geoData.features) {
      return geoData.features.map((item, index) => {
        return <Shape item={item} key={index} />;
      });
    }
  };

  return (
    <FeatureGroup onClick={handleClick}>
      <EditControl
        position="topright"
        key="feature-group"
        onCreated={controlCreate}
        onEdited={handleEdit}
        onDeleted={handleDelete}
        draw={{
          circlemarker: false,
        }}
      />
      {geoData.features && renderGeo(geoData)}
    </FeatureGroup>
  );
}

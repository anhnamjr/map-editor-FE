import React, { useState, createContext } from "react";
import {
  FeatureGroup,
  Polyline,
  Marker,
  Polygon,
  Circle,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useDispatch } from "react-redux";
import { STORE_GEOM_COOR } from "../../constants/actions";
import { reverseCoor } from "../../utils";
import CustomPopup from "./components/CustomPopup";
import axios from "axios";
import { BASE_URL } from "../../constants/endpoint";

export const GeoContext = createContext(null);

export default function Draw({ geoData }) {
  // const [deleteList, setDeleteList] = useState([]);

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
        if (item[1]._latlngs.length == 1)
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

  // const handleEditStart = (e) => {
  //   console.log(e);
  // };

  const handleDelete = (e) => {
    const deletedId = Object.values(e.layers._layers).map(
      (item) => item.options.id
    );
    console.log(deletedId);
    axios.post(`${BASE_URL}/delete-geom`, { id: deletedId });
  };

  const handleClick = (e) => {
    console.log(e.layer.toGeoJSON().geometry);
    var layer = e.layer;
    const initState = {
      color: "",
      fillColor: "",
      fillOpacity: 0.5,
      weight: 1,
      dashArray: 0,
    };
    // console.log(
    //   ReactDOMServer.renderToString(<CustomPopup item={initState} />)
    // );
    // layer.bindPopup(
    //   ReactDOMServer.renderToString(<CustomPopup item={initState} />)
    // );
  };

  const showGeomPopover = (item) => {
    console.log(item);
  };

  const renderGeo = (geoData) => {
    if (geoData.features) {
      return geoData.features.map((item) => {
        // if (item.geometry.type === "LineString") {
        //   return (
        //     <Polyline
        //       key={item.properties.geoID}
        //       id={item.properties.geoID}
        //       positions={reverseCoor(item.geometry.coordinates)}
        //       // onClick={() => showGeomPopover(item)}
        //     >
        //       <CustomPopup item={item} />
        //     </Polyline>
        //   );
        // }
        if (item.geometry.type === "Polygon") {
          return (
            <GeoContext.Provider value={item}>
              <Polygon
                key={item.properties.geoID}
                id={item.properties.geoID}
                positions={reverseCoor(item.geometry.coordinates[0])}
                // onClick={() => showGeomPopover(item)}
                color={item.properties.color}
                fillColor="red"
                weight={5}
                dashArray={100}
              >
                <CustomPopup item={item} />
              </Polygon>
            </GeoContext.Provider>
          );
        }
        // if (item.geometry.type === "Point") {
        //   if (item.properties.radius) {
        //     return (
        //       <Circle
        //         key={item.properties.geoID}
        //         id={item.properties.geoID}
        //         center={[
        //           item.geometry.coordinates[1],
        //           item.geometry.coordinates[0],
        //         ]}
        //         radius={item.properties.radius}
        //         // onClick={() => showGeomPopover(item)}
        //       >
        //         <CustomPopup item={item} />
        //       </Circle>
        //     );
        //   } else {
        //     return (
        //       <Marker
        //         key={item.properties.geoID}
        //         id={item.properties.geoID}
        //         position={[
        //           item.geometry.coordinates[1],
        //           item.geometry.coordinates[0],
        //         ]}
        //         // onClick={() => showGeomPopover(item)}
        //       >
        //         <CustomPopup item={item} />
        //       </Marker>
        //     );
        //   }
        // }
        return null;
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
        // onEditStart={handleEditStart}
        onDeleted={handleDelete}
        draw={{
          circlemarker: false,
        }}
      />
      {geoData.features && renderGeo(geoData)}
    </FeatureGroup>
  );
}

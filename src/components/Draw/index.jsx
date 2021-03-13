import React from "react";
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
import ReactDOMServer from "react-dom/server";
import AttributeTab from "./components/AttributeTab";

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
    console.log(Object.entries(e.layers._layers));
  };

  const handleEditStart = (e) => {
    console.log(e);
  };

  const handleDelete = (e) => {
    console.log(e);
  };

  const handleClick = (e) => {
    // console.log(e.layer.toGeoJSON().geometry);
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
        if (item.geometry.type === "LineString") {
          return (
            <Polyline
              key={item.properties.geoID}
              positions={reverseCoor(item.geometry.coordinates)}
              onClick={() => showGeomPopover(item)}
            >
              <CustomPopup item={item} />
            </Polyline>
          );
        }
        if (item.geometry.type === "Polygon") {
          return (
            <Polygon
              key={item.properties.geoID}
              positions={reverseCoor(item.geometry.coordinates[0])}
              onClick={() => showGeomPopover(item)}
              color={item.properties.color}
              fillColor="red"
              weight={5}
              dashArray={100}
            >
              <CustomPopup item={item} />
            </Polygon>
          );
        }
        if (item.geometry.type === "Point") {
          if (item.properties.radius) {
            return (
              <Circle
                key={item.properties.geoID}
                center={[
                  item.geometry.coordinates[1],
                  item.geometry.coordinates[0],
                ]}
                radius={item.properties.radius}
                onClick={() => showGeomPopover(item)}
              >
                <CustomPopup item={item} />
              </Circle>
            );
          } else {
            return (
              <Marker
                key={item.properties.geoID}
                position={[
                  item.geometry.coordinates[1],
                  item.geometry.coordinates[0],
                ]}
                onClick={() => showGeomPopover(item)}
              >
                <CustomPopup item={item} />
              </Marker>
            );
          }
        }
        return null;
      });
    }
  };

  return (
    <FeatureGroup onClick={handleClick}>
      <EditControl
        position="topright"
        key="feature-group"
        onEdited={handleEdit}
        onDeleted={handleDelete}
        onCreated={controlCreate}
        onEditStart={handleEditStart}
      />
      {geoData.features && renderGeo(geoData)}
    </FeatureGroup>
  );
}

import React, { useState } from "react";
import { Polygon, Polyline, Marker, Circle } from "react-leaflet";
import { reverseCoor, reverseCoorMultiPolygon } from "../../../../utils";
import CustomPopup from "../CustomPopup";

export default function Shape({ item }) {
  const [shapeProps, setShapeProps] = useState({ ...item.properties });

  if (item.geometry.type === "LineString") {
    return (
      <Polyline
        positions={reverseCoor(item.geometry.coordinates)}
        color={shapeProps.color}
        weight={shapeProps.weight}
      >
        <CustomPopup
          type="Polyline"
          shapeProps={shapeProps}
          onChangeAttr={setShapeProps}
        />
      </Polyline>
    );
  }
  if (item.geometry.type === "Polygon") {
    return (
      <Polygon
        positions={reverseCoor(item.geometry.coordinates[0])}
        color={shapeProps.color || "#0f0f0f"}
        weight={shapeProps.weight || 3}
        fillColor={shapeProps.fill || "red"}
        fillOpacity={shapeProps.fillOpacity || 0.3}
      >
        <CustomPopup
          type="Polygon"
          shapeProps={shapeProps}
          onChangeAttr={setShapeProps}
        />
      </Polygon>
    );
  }
  if (item.geometry.type === "MultiPolygon") {
    return (
      <Polygon
        key={item.properties.geoID}
        id={item.properties.geoID}
        positions={reverseCoorMultiPolygon(item.geometry.coordinates)}
        color={shapeProps.color}
        weight={shapeProps.weight}
        fillColor={shapeProps.fill}
        fillOpacity={shapeProps.fillOpacity}
      >
        <CustomPopup
          type="Polygon"
          shapeProps={shapeProps}
          onChangeAttr={setShapeProps}
        />
      </Polygon>
    );
  }
  if (item.geometry.type === "Point") {
    if (item.properties.radius) {
      return (
        <Circle
          center={[item.geometry.coordinates[1], item.geometry.coordinates[0]]}
          radius={item.properties.radius}
          color={shapeProps.color}
          weight={shapeProps.weight}
          fillColor={shapeProps.fill}
          fillOpacity={shapeProps.fillOpacity}
        >
          <CustomPopup
            type="Circle"
            shapeProps={shapeProps}
            onChangeAttr={setShapeProps}
          />
        </Circle>
      );
    } else {
      return (
        <Marker
          position={[
            item.geometry.coordinates[1],
            item.geometry.coordinates[0],
          ]}
        />
      );
    }
  }
}

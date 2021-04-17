import React, { useState, useContext } from "react";
import { Polygon, Polyline, Marker, Circle } from "react-leaflet";
import { reverseCoor, reverseCoorMultiPolygon } from "../../../../utils";
import CustomPopup from "../CustomPopup";
import { ShapeContext } from "../../../../context/ShapeContext"

export default function Shape({ item }) {
  const [shapeProps, setShapeProps] = useState({ ...item.properties })
  const { setShapeItem } = useContext(ShapeContext)

  const onClickShape = () => {
    setShapeItem(item)
  }

  if (item.geometry.type === "LineString") {
    return (
      <Polyline
        onClick={onClickShape}
        positions={reverseCoor(item.geometry.coordinates)}
        color={shapeProps.color}
        weight={shapeProps.weight}
      >
        <CustomPopup item={item} type="Polyline" shapeProps={shapeProps} onChangeAttr={setShapeProps} />
      </Polyline>
    );
  }
  if (item.geometry.type === "Polygon") {
    return (
      <Polygon
        onClick={onClickShape}
        positions={reverseCoor(item.geometry.coordinates[0])}
        color={shapeProps.color || "#0f0f0f"}
        weight={shapeProps.weight || 3}
        fillColor={shapeProps.fill || "red"}
        fillOpacity={shapeProps.fillOpacity || 0.3}
      >
        <CustomPopup item={item} type="Polygon" shapeProps={shapeProps} onChangeAttr={setShapeProps} />
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
        <CustomPopup item={item} type="Polygon" shapeProps={shapeProps} onChangeAttr={setShapeProps} />
      </Polygon>
    );
  }
  if (item.geometry.type === "Point") {
    if (item.properties.radius) {
      return (
        <Circle
          onClick={onClickShape}
          center={[
            item.geometry.coordinates[1],
            item.geometry.coordinates[0],
          ]}
          radius={item.properties.radius}
          color={shapeProps.color}
          weight={shapeProps.weight}
          fillColor={shapeProps.fill}
          fillOpacity={shapeProps.fillOpacity}
        >
          <CustomPopup item={item} type="Circle" shapeProps={shapeProps} onChangeAttr={setShapeProps} />
        </Circle>
      );
    } else {
      return (
        <Marker
          onClick={onClickShape}
          position={[
            item.geometry.coordinates[1],
            item.geometry.coordinates[0],
          ]}
        >
          <CustomPopup item={item} type="Marker" shapeProps={shapeProps} onChangeAttr={setShapeProps} showProps={false} />
        </Marker>
      );
    }
  }
  return null;
}

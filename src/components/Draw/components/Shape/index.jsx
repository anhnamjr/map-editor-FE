import React, { useState, useContext } from "react";
import { Polygon, Polyline, Marker, Circle } from "react-leaflet";
import { reverseCoor } from "../../../../utils";
import CustomPopup from "../CustomPopup";
import {ShapeContext} from "../../../../context/ShapeContext"

export default function Shape({ item }) {
  const [shapeProps, setShapeProps] = useState({ ...item.properties })
  const {setShapeItem} = useContext(ShapeContext)

  const onClickShape = (e) => {
    setShapeItem(item)
    // console.log("polygon")
    // e.stopPropagation()
  }

  if (item.geometry.type === "LineString") {
    return (
      <Polyline
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
      )
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
  return null;
}
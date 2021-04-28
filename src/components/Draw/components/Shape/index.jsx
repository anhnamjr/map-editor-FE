import React, { useState, useRef, useEffect } from "react";
import { Polygon, Polyline, Marker, Circle } from "react-leaflet";
import { reverseCoor, reverseCoorMultiPolygon } from "../../../../utils";
import CustomPopup from "../CustomPopup";
import { useDispatch, useSelector } from "react-redux";
import {
  STORE_GEOM_COOR,
  STORE_SHAPE_REF,
} from "../../../../constants/actions";

export default function Shape({ item }) {
  const [shapeProps, setShapeProps] = useState({ ...item.properties });
  const dispatch = useDispatch();
  const shapeRef = useRef();
  const temp = useSelector((state) => state.storeShapeRef);

  console.log("Shape")

  useEffect(() => {
    if (item.properties.geoID === temp.shapeRef) {
      const shapeEdit = shapeRef.current.leafletElement
      shapeEdit.pm.enable();
      shapeEdit.on("pm:edit", (e) => {
        let editGeom = { ...e.target.toGeoJSON(), properties: item.properties }
        dispatch({ type: STORE_GEOM_COOR, payload: { ...editGeom } })
      })
    } else {
      shapeRef.current.leafletElement.pm.disable();
    }
  }, [temp])

  const onClickShape = () => {
    // console.log(shapeRef.current);
    // map.removeLayer(shapeRef.current.leafletElement)
    // shapeRef.current.leafletElement.pm.enable()
    dispatch({ type: STORE_GEOM_COOR, payload: item });
    // shapeRef.current.leafletElement._leafletId = shapeRef.current.leafletElement.toGeoJSON().properties.geoID
    // console.log(shapeRef.current.leafletElement)

  };

  if (item.geometry.type === "LineString") {
    return (
      <Polyline
        ref={shapeRef}
        onClick={onClickShape}
        positions={reverseCoor(item.geometry.coordinates)}
        color={shapeProps.color}
        weight={shapeProps.weight}
      >
        <CustomPopup
          item={item}
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
        ref={shapeRef}
        onClick={onClickShape}
        positions={reverseCoor(item.geometry.coordinates[0])}
        color={shapeProps.color || "#0f0f0f"}
        weight={shapeProps.weight || 3}
        fillColor={shapeProps.fill || "red"}
        fillOpacity={shapeProps.fillOpacity || 0.2}
      >
        <CustomPopup
          item={item}
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
        ref={shapeRef}
        key={item.properties.geoID}
        id={item.properties.geoID}
        positions={reverseCoorMultiPolygon(item.geometry.coordinates)}
        color={shapeProps.color}
        weight={shapeProps.weight}
        fillColor={shapeProps.fill}
        fillOpacity={shapeProps.fillOpacity}
      >
        <CustomPopup
          item={item}
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
          ref={shapeRef}
          onClick={onClickShape}
          center={[item.geometry.coordinates[1], item.geometry.coordinates[0]]}
          radius={item.properties.radius}
          color={shapeProps.color}
          weight={shapeProps.weight}
          fillColor={shapeProps.fill}
          fillOpacity={shapeProps.fillOpacity}
        >
          <CustomPopup
            item={item}
            type="Circle"
            shapeProps={shapeProps}
            onChangeAttr={setShapeProps}
          />
        </Circle>
      );
    } else {
      return (
        <Marker
          ref={shapeRef}
          onClick={onClickShape}
          position={[
            item.geometry.coordinates[1],
            item.geometry.coordinates[0],
          ]}
        >
          <CustomPopup
            item={item}
            type="Marker"
            shapeProps={shapeProps}
            onChangeAttr={setShapeProps}
            showProps={false}
          />
        </Marker>
      );
    }
  }
  return null;
}

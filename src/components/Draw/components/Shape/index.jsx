import React, { useRef, useEffect, useState } from "react";
import { Polygon, Polyline, Marker, Circle } from "react-leaflet";
import { reverseCoor, reverseCoorMultiPolygon } from "../../../../utils";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_FULL_COLOR,
  STORE_GEOM_COOR,
  STORE_SHAPE_REF,
  UPDATE_UNSAVE_LAYER_DATA,
  UPDATE_LAYER_DATA,
  SET_GEOM_R_TREE,
} from "../../../../constants/actions";
import { get } from "lodash";

export default function Shape({ item }) {
  const initialState = {
    color: item.properties.color,
    fill: item.properties.fill,
    fillOpacity: item.properties.fillOpacity,
    weight: item.properties.weight,
  };
  console.log(initialState);

  const [color, setColor] = useState(initialState);
  const dispatch = useDispatch();
  const shapeRef = useRef();
  const temp = useSelector((state) => state.storeShapeRef);
  const newColor = useSelector((state) => state.colorReducer);

  useEffect(() => {
    const leafletElement = shapeRef.current.leafletElement;
    let bb;
    if (get(item, "geometry.type", "") === "Point") {
      const point = get(item, "geometry.coordinates", []);
      bb = { minX: point[0], minY: point[1], maxX: point[0], maxY: point[1] };
    } else {
      const bound = leafletElement.getBounds();
      bb = {
        minX: bound._southWest.lng,
        minY: bound._southWest.lat,
        maxX: bound._northEast.lng,
        maxY: bound._northEast.lat,
      };
    }
    dispatch({
      type: SET_GEOM_R_TREE,
      payload: { ...bb, geom: item },
    });
  }, []);

  useEffect(() => {
    if (item.properties.geoID === temp.shapeRef) {
      const shapeEdit = shapeRef.current.leafletElement;
      shapeEdit.pm.enable();
      shapeEdit.on("pm:edit", (e) => {
        let editGeom = {
          ...e.target.toGeoJSON(),
          properties: item.properties,
        };
        if (e.target._mRadius) {
          editGeom.properties.radius = e.target._mRadius;
        }
        dispatch({ type: STORE_GEOM_COOR, payload: { ...editGeom } });
        if (typeof item.properties.geoID === "number") {
          dispatch({
            type: UPDATE_UNSAVE_LAYER_DATA,
            payload: { geom: editGeom },
          });
        } else {
          dispatch({ type: UPDATE_LAYER_DATA, payload: { geom: editGeom } });
        }
      });
    } else {
      shapeRef.current.leafletElement.pm.disable();
    }
    //eslint-disable-next-line
  }, [temp]);

  useEffect(() => {
    if (item.properties.geoID === temp.shapeRef) {
      let editGeom = {
        ...item,
        properties: { ...item.properties, ...newColor },
      };
      if (typeof item.properties.geoID === "number") {
        dispatch({
          type: UPDATE_UNSAVE_LAYER_DATA,
          payload: { geom: editGeom },
        });
      } else {
        dispatch({ type: UPDATE_LAYER_DATA, payload: { geom: editGeom } });
      }
      setColor(newColor);
    }
    //eslint-disable-next-line
  }, [newColor, temp]);

  const onClickShape = () => {
    dispatch({ type: STORE_SHAPE_REF, payload: item.properties.geoID });
    dispatch({ type: SET_FULL_COLOR, payload: { ...color } });
    dispatch({ type: STORE_GEOM_COOR, payload: item });
  };

  if (item.geometry.type === "LineString") {
    return (
      <Polyline
        ref={shapeRef}
        onClick={onClickShape}
        positions={reverseCoor(item.geometry.coordinates)}
        color={color.color}
        weight={color.weight}
      />
    );
  }
  if (item.geometry.type === "Polygon") {
    return (
      <Polygon
        ref={shapeRef}
        onClick={onClickShape}
        positions={reverseCoor(item.geometry.coordinates[0])}
        color={color.color}
        weight={color.weight}
        fillColor={color.fill}
        fillOpacity={color.fillOpacity}
      />
    );
  }
  if (item.geometry.type === "MultiPolygon") {
    return (
      <Polygon
        ref={shapeRef}
        key={item.properties.geoID}
        id={item.properties.geoID}
        positions={reverseCoorMultiPolygon(item.geometry.coordinates)}
        color={color.color}
        weight={color.weight}
        fillColor={color.fill}
        fillOpacity={color.fillOpacity}
      />
    );
  }
  if (item.geometry.type === "Point") {
    if (item.properties.radius > 0) {
      return (
        <Circle
          ref={shapeRef}
          onClick={onClickShape}
          center={[item.geometry.coordinates[1], item.geometry.coordinates[0]]}
          radius={item.properties.radius}
          color={color.color}
          weight={color.weight}
          fillColor={color.fill}
          fillOpacity={color.fillOpacity}
        />
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
        />
      );
    }
  }
  return null;
}

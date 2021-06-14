import { Marker } from "react-leaflet";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { get, size } from "lodash";
import L from "leaflet";

const midPointIcon = L.icon({
  iconUrl: require("../../../../icons/heart.svg"),
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

export default function SnapPoint({ type }) {
  const point = useSelector((state) => state.snap[type], shallowEqual) || [];

  if (size(point) === 0) {
    return <div></div>;
  }

  return <Marker position={[point[1], point[0]]} icon={midPointIcon} />;
}

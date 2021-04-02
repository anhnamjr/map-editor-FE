import React from "react";
import {geometry} from "geojson-area";
import * as length from "geojson-length";
import "./style.scss";

const PI = 3.1416


export default function AttributeTab({ item }) {
  const type = item.geometry.type
  const calculate = () => {
    if(type === "Polygon" || type === "MultiPolygon") {
      return (
        <tr>
          <td>Square meters:</td>
          <td>{Number.parseFloat(geometry(item.geometry)).toFixed(2)}</td>
        </tr>
      ) 
    }
    if(type === "LineString") {
      return (
        <tr>
          <td>Meters:</td>
          <td>{Number.parseFloat(length(item.geometry)).toFixed(2)}</td>
        </tr>
      )
    }
    if(type === "Point" && item.properties.radius) {
      return (
        <tr>
          <td>Square meters:</td>
          <td>{Number.parseFloat(item.properties.radius * PI).toFixed(2)}</td>
        </tr>
      ) 
    }
  }


  return (
    <div style={{ width: "100%" }}>
      <table>
        <tbody>
          {calculate()}
          {calculate()}
        </tbody>
      </table>
    </div>
  );
}

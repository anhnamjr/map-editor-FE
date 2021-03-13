import React, { useState } from "react";

const initState = {
  color: "",
  fillColor: "",
  fillOpacity: 0.5,
  weight: 1,
  dashArray: 0,
};

export default function AttributeTab({ item }) {
  const input = useState({ ...initState, ...item });
  return (
    <div style={{ width: "100%" }}>
      <table>
        <tbody>input.map</tbody>
      </table>
    </div>
  );
}

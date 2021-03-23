import React from "react";
import "./style.scss";

export default function PropertyTab({ item }) {
  return (
    <div style={{ width: "100%" }}>
      <table>
        <tbody>
          {item.properties.map((pro) => (
            <tr></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

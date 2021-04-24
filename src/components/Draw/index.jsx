import React from "react";

import EditableLayer from "./components/EditableLayer";

export default function Draw({ geoData }) {
  console.log("Draw")
  return <EditableLayer geoData={geoData} />
}

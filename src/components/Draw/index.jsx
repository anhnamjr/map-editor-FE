import React from "react";

import EditableLayer from "./components/EditableLayer";

export default function Draw({ geoData }) {
  return <>{geoData && <EditableLayer geoData={geoData} />}</>;
}

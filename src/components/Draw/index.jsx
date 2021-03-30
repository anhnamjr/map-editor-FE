import React, { useState } from "react";
import L from "leaflet"
import EditableLayer from "./components/EditableLayer";

export default function Draw({ geoData }) {
  
    const [selectedLayerId, setSelectedLayerId] = useState(0)


  // const renderGeo = (geoData) => {
  //   if (geoData.features) {
  //     return geoData.features.map((item, index) => (
  //       <Shape item={item} key={index} />
  //     ));
  //   }
  // };

  function handleLayerClick(value) {
    setSelectedLayerId(value.properties.editLayerId)
  }

  const dataLayer = new L.GeoJSON(geoData);
  console.log(dataLayer);
  let layers = [];
  let i = 0;
  dataLayer.eachLayer((layer) => {
    layer.feature.properties.editLayerId = i;
    layers.push(layer);
    i++;
  });

  return (
    <>
      {layers && layers.map((layer, i) => (
        <EditableLayer key={i} item={layer.feature} layer={layer} showDrawControl={i === selectedLayerId} onLayerClicked={handleLayerClick} />
      ))}
    </>
  );
}

import React, { useState, useEffect } from "react";
import "./styles.css";
import "antd/dist/antd.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Map, TileLayer, ZoomControl } from "react-leaflet";
import MapSidebar from "./components/MapSidebar";
import { useSelector } from "react-redux";
import MapLayerControl from "./components/MapLayerControl";
import Draw from "./components/Draw";

const App = () => {
  const [geoData, setGeoData] = useState({});
  const data = useSelector((state) => state.layerReducer.layerData);

  useEffect(() => {
    setGeoData(data);
  }, [data]);

  return (
    <>
      <MapSidebar />
      <Map className="mapStyle" zoom={13} center={[10.7646598, 106.6855794]}>
        <MapLayerControl />
        <ZoomControl position="topright" />
        <Draw geoData={geoData} />
        <TileLayer
          attribution=""
          url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />
      </Map>
    </>
  );
};

export default App;

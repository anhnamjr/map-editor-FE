import React, { useState, useEffect, useRef } from "react";
import "antd/dist/antd.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Map, TileLayer, ZoomControl } from "react-leaflet";
import MapSidebar from "../../components/MapSidebar";
import { useSelector } from "react-redux";
import MapLayerControl from "../../components/MapLayerControl";
import Draw from "../../components/Draw";

const Maps = () => {
  const [geoData, setGeoData] = useState({});
  const data = useSelector((state) => state.layerReducer.layerData);
  const mapRef = useRef()

  // const { center } = useSelector((state) => state.mapReducer)

  useEffect(() => {
    setGeoData(data);
  }, [data]);

  return (
    <>
      <Map className="mapStyle" doubleClickZoom={false} zoom={13} center={[10.7646598, 106.6855794]} ref={mapRef}>
        <MapLayerControl mapRef={mapRef} />
        <ZoomControl position="topright" />
        <Draw geoData={geoData} />
        <TileLayer
          attribution=""
          url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />
      </Map>
      <MapSidebar map={mapRef} />
    </>
  );
};

export default Maps;

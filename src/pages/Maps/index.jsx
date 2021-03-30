import React, { useState, useEffect, useRef } from "react";
import "antd/dist/antd.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Map, TileLayer, ZoomControl, withLeaflet } from "react-leaflet";
import MapSidebar from "../../components/MapSidebar";
import { useSelector } from "react-redux";
import MapLayerControl from "../../components/MapLayerControl";
import Draw from "../../components/Draw";
import PrintControlDefault from "react-leaflet-easyprint";
import DeflateDefault from 'react-leaflet-deflate';
const Deflate = withLeaflet(DeflateDefault);
const PrintControl = withLeaflet(PrintControlDefault);







const Maps = () => {
  //fake data (lấy cái data không được, mặc dù log ra y chan :v)


  const [geoData, setGeoData] = useState({});
  const data = useSelector((state) => state.layerReducer.layerData);
  const mapRef = useRef()
  const printControlRef = useRef();


  useEffect(() => {
    setGeoData(data);
  }, [data]);

  return (
    <>
      <MapSidebar />
      <Map className="mapStyle" zoom={13} center={[10.7646598, 106.6855794]} ref={mapRef}>
        <MapLayerControl mapRef={mapRef} />
        <ZoomControl position="topright" />
        <Draw geoData={geoData} />
        <TileLayer
          attribution=""
          url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />

        <PrintControl
          ref={printControlRef}
          position="topright"
          // position="topleft"
          sizeModes={["Current", "A4Portrait", "A4Landscape"]}
          hideControlContainer={false}
        />
        <PrintControl
          position="topright"
          // position="topleft"
          sizeModes={["Current", "A4Portrait", "A4Landscape"]}
          hideControlContainer={false}
          title="Export as PNG"
          exportOnly
        />
        {/* <Deflate
          // data={geoData}
          data={geojson}
          minSize={10}
          markerCluster={true}
        /> */}
      </Map>
    </>
  );
};

export default Maps;

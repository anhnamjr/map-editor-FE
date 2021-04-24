import React, { useState, useEffect, useRef } from "react";
import "antd/dist/antd.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Map, TileLayer, ZoomControl, withLeaflet } from "react-leaflet";
import MapSidebar from "../../components/MapSidebar";
import { useSelector, useDispatch } from "react-redux";
import MapLayerControl from "../../components/MapLayerControl";
import Draw from "../../components/Draw";
import PrintControlDefault from "react-leaflet-easyprint";
import { SHOW_UNSAVE } from "../../constants/actions"

const PrintControl = withLeaflet(PrintControlDefault);

const Maps = () => {
  const [geoData, setGeoData] = useState({});
  const data = useSelector((state) => state.layerReducer.layerData);
  const { unSaveGeom, showUnsave } = useSelector((state) => state.unSaveReducer)
  const mapRef = useRef();
  const printControlRef = useRef();
  const dispatch = useDispatch()

  // const { center } = useSelector((state) => state.mapReducer)

  useEffect(() => {
    if (unSaveGeom.length !== 0) {
      dispatch({ type: SHOW_UNSAVE, payload: null })
    }
    let newFeatures = [...unSaveGeom]
    if (data.features) {
      newFeatures = [...newFeatures, ...data.features]
    }
    setGeoData({
      ...data,
      features: newFeatures
    });
  }, [data, unSaveGeom]);

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
        <PrintControl
          ref={printControlRef}
          position="topright"
          sizeModes={["Current", "A4Portrait", "A4Landscape"]}
          hideControlContainer={false}
        />
        <PrintControl
          position="topright"
          sizeModes={["Current", "A4Portrait", "A4Landscape"]}
          hideControlContainer={false}
          title="Export as PNG"
          exportOnly
        />
      </Map>
      <MapSidebar map={mapRef} />
    </>
  );
};

export default Maps;

import React, { useState, useEffect, useRef } from "react";
import "antd/dist/antd.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
  Map,
  TileLayer,
  ZoomControl,
  withLeaflet,
  Marker,
} from "react-leaflet";
import MapSidebar from "../../components/MapSidebar";
import { useSelector, useDispatch } from "react-redux";
import MapLayerControl from "../../components/MapLayerControl";
import Draw from "../../components/Draw";
import PrintControlDefault from "react-leaflet-easyprint";
import { CLEAR_SHAPE_REF, GET_MOUSE_POSITION } from "../../constants/actions";
import { get } from "lodash";
import L from "leaflet";
import useDebounce from "../../hooks/useDebounce";

const PrintControl = withLeaflet(PrintControlDefault);

const Maps = () => {
  const [geoData, setGeoData] = useState({});
  const [zoom, setZoom] = useState(13);
  const data = useSelector((state) => state.layerReducer.layerData);
  const { center, showMarker } = useSelector((state) => state.mapReducer);
  const mapRef = useRef();
  const [mousePosition, setMousePosition] = useState(null);
  const printControlRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setGeoData(data);
  }, [data]);

  // useEffect(() => {
  //   if (showMarker) {
  //     setTimeout(() => { setZoom(20) }, 100)
  //   }
  // }, [showMarker])

  const handleClearShapeRef = () => {
    dispatch({ type: CLEAR_SHAPE_REF });
  };

  const position = useDebounce(mousePosition);
  const onGetMousePosition = (e) => {
    setMousePosition(e.latlng);
  };

  useEffect(() => {
    if (position) {
      dispatch({
        type: GET_MOUSE_POSITION,
        payload: [position.lng, position.lat],
      });
    }
  }, [position]);

  return (
    <>
      <Map
        className="mapStyle"
        doubleClickZoom={false}
        zoom={zoom}
        center={center || [10.7646598, 106.6855794]}
        onDblClick={handleClearShapeRef}
        onMouseMove={onGetMousePosition}
        ref={mapRef}
      >
        {showMarker && <Marker position={center} />}
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

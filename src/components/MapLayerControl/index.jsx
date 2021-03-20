import React, { useEffect, useState } from "react";
import { LayersControl, TileLayer, GeoJSON, LayerGroup, FeatureGroup } from "react-leaflet";
import axios from "axios"
import { BASE_URL } from "../../constants/endpoint";


const { BaseLayer, Overlay } = LayersControl;

export default function MapLayerControl({mapRef}) {
  const [provinceGeom, setProvinceGeom] = useState(null)
  const [districtGeom, setDistrictGeom] = useState(null)

  useEffect(() => {
    const map = mapRef.current.leafletElement;
    map.on("overlayadd", (e) => {
      axios.get(`${BASE_URL}/default-layer?name=${e.name.toLowerCase()}`).then(res => {
        switch(e.name){
          case "Province": 
            setProvinceGeom(res.data)
            break
          case "District": 
            setDistrictGeom(res.data)
            break
        }
      })
    });

    map.on("overlayremove", (e) => {
      switch(e.name){
        case "Province": 
          setProvinceGeom(null)
          return
        case "District": 
          setDistrictGeom(null)
          return
      }
    });
  }, []);

  return (
    <LayersControl position="topright">
      <BaseLayer checked name="Standard">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </BaseLayer>
      <BaseLayer name="Black and White">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
        />
      </BaseLayer>
      <BaseLayer name="Transport">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://tile.memomaps.de/tilegen/{z}/{x}/{y}.png"
        />
      </BaseLayer>
      <BaseLayer name="Topography">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.opentopomap.org/{z}/{x}/{y}.png"
        />
      </BaseLayer>
      <BaseLayer name="Dark Matter">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        />
      </BaseLayer>
      <Overlay name="Province">
        <FeatureGroup>
          {provinceGeom && <GeoJSON data={provinceGeom} />}
        </FeatureGroup>
      </Overlay>
      <Overlay name="District">
        <FeatureGroup>
          {districtGeom && <GeoJSON data={districtGeom} />}
        </FeatureGroup>
      </Overlay>
    </LayersControl>
  );
}

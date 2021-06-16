import React from "react";
import { LayersControl, TileLayer } from "react-leaflet";

const { BaseLayer, Overlay } = LayersControl;

export default function MapLayerControl() {
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
    </LayersControl>
  );
}

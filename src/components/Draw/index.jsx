import React, { createContext } from "react";
import { FeatureGroup, Polyline, Marker, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useDispatch } from "react-redux";
import { STORE_GEOM_COOR } from "../../constants/actions";
import { reverseCoor } from "../../utils";
import CustomPopup from "./components/CustomPopup";

export const GeoContext = createContext(null)

export default function Draw({ geoData }) {
  const dispatch = useDispatch();
  const controlCreate = (e) => {
    let geom = e.layer.toGeoJSON().geometry;
    geom = {
      type: geom.type,
      coordinates: [geom.coordinates],
    };
    dispatch({ type: STORE_GEOM_COOR, payload: geom });
  };

  const handleEdit = (e) => {
    // console.log(Object.entries(e.layers._layers));
  };

  const handleEditStart = (e) => {
    console.log(e);
  };

  const handleDelete = (e) => {
    console.log(e);
  };

  const handleClick = (e) => {
    // console.log(e.layer.toGeoJSON());
  };

  const showGeomPopover = (item) => {
    // console.log(item);
  };

  const renderGeo = (geoData) => {
    if (geoData.features) {
      return geoData.features.map((item) => {
        
        const onChangeAttr = (attr) => {
          
          item.properties.color = attr.stroke;
          // console.log(item.properties.color);
        }
        // if (item.geometry.type === "LineString") {
        //   return (
        //     <Polyline
        //       key={item.properties.geoID}
        //       positions={reverseCoor(item.geometry.coordinates)}
        //       onClick={() => showGeomPopover(item)}
        //     >
        //       <CustomPopup type="Polyline" />
        //     </Polyline>
        //   );
        // }
        if (item.geometry.type === "Polygon") {
          return (
            <GeoContext.Provider value={item}>
              <Polygon
                key={item.properties.geoID}
                positions={reverseCoor(item.geometry.coordinates[0])}
                onClick={() => showGeomPopover(item)}
                color={item.properties.color}
                fillColor={item.properties.fillColor}
                weight={item.properties.weight}
              >
                <CustomPopup type="Polygon" onChangeAttr={onChangeAttr}/>
              </Polygon>
            </GeoContext.Provider>
          );
        }
        // if (item.geometry.type === "Point") {
        //   return (
        //     <Marker
        //       key={item.properties.geoID}
        //       position={[
        //         item.geometry.coordinates[1],
        //         item.geometry.coordinates[0],
        //       ]}
        //       onClick={() => showGeomPopover(item)}
        //     >
        //       <CustomPopup />
        //     </Marker>
        //   );
        // }
        return null;
      });
    }
  };

  return (
    <FeatureGroup onClick={handleClick}>
      <EditControl
        position="topright"
        key="feature-group"
        onEdited={handleEdit}
        onDeleted={handleDelete}
        onCreated={controlCreate}
        onEditStart={handleEditStart}
      />
      {geoData.features && renderGeo(geoData)}
    </FeatureGroup>
  );
}

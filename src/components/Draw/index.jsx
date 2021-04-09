import React from "react";
import { FeatureGroup } from "react-leaflet";
import Shape from "./components/Shape";
import { EditControl } from "react-leaflet-draw";
import { useDispatch } from "react-redux";
import { STORE_GEOM_COOR } from "../../constants/actions";
import { reverseCoor } from "../../utils";
import axios from "axios";
import { BASE_URL } from "../../constants/endpoint";

export default function Draw({ geoData }) {
  // const [deleteList, setDeleteList] = useState([]);

  const dispatch = useDispatch();
  const controlCreate = (e) => {
    let geom = e.layer.toGeoJSON().geometry;
    geom = {
      type: geom.type,
      coordinates: geom.coordinates,
    };
    if (e.layer._mRadius) {
      geom = {
        ...geom,
        properties: { ...geom.properties, radius: e.layer._mRadius },
      };
    }
    dispatch({ type: STORE_GEOM_COOR, payload: geom });
  };

  const handleEdit = (e) => {
    const editedId = Object.entries(e.layers._layers);
    console.log(editedId); // convert job -> arr
    const editedGeom = editedId.map((item) => {
      console.log(item)
      //circle
      if (item[1]._mRadius)
        return {
          geoID: item[1].options.id,
          // type:'Circle',
          geom: {
            type: "Point",
            // coordinates: item[1]._latlngs
            coordinates: Object.values(item[1]._latlng).reverse(),
          },
          radius: item[1]._mRadius,
        };

      if (item[1]._latlngs) {
        //line string
        if (item[1]._latlngs.length > 1)
          return {
            geoID: item[1].options.id,
            geom: {
              type: "LineString", // 2d
              coordinates: reverseCoor(
                item[1]._latlngs.map((coor) => {
                  return Object.values(coor).slice(0, 2);
                })
              ),
            },
          };
        //polygon
        if (item[1]._latlngs.length === 1)
          return {
            geoID: item[1].options.id,
            geom: {
              type: "Polygon", //3d
              coordinates: [
                reverseCoor(
                  item[1]._latlngs[0].map((coor) => {
                    return Object.values(coor).slice(0, 2);
                  })
                ),
              ],
            },
          };
      }
      //marker
      return {
        geoID: item[1].options.id,
        geom: {
          type: "Point",
          // coordinates: item[1]._latlngs
          coordinates: Object.values(item[1]._latlng).reverse(),
        },
      };
    });
    console.log(editedGeom);

    axios.post(`${BASE_URL}/edit-geom`, editedGeom);
  };

  const handleDelete = (e) => {
    const deletedId = Object.values(e.layers._layers).map(
      (item) => item.options.id
    );
    console.log(deletedId);
    axios.post(`${BASE_URL}/delete-geom`, { id: deletedId });
  };

  const handleClick = (e) => {
    console.log(e.layer.toGeoJSON().geometry);
  };

  const renderGeo = (geoData) => {
    if (geoData.features) {
      return geoData.features.map((item, index) => {
        return <Shape item={item} key={index} />;
      });
    }
  };

  return (
    <FeatureGroup onClick={handleClick}>
      <EditControl
        position="topright"
        key="feature-group"
        onCreated={controlCreate}
        onEdited={handleEdit}
        // onEditStart={handleEditStart}
        onDeleted={handleDelete}
        draw={{
          circlemarker: false,
        }}
      />
      {geoData.features && renderGeo(geoData)}
    </FeatureGroup>
  );
}

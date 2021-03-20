import React, { useState, useContext } from "react";
import { Tabs } from "antd";
import { Popup } from "react-leaflet";
import { AppleOutlined, AndroidOutlined } from "@ant-design/icons";
import Form from "../form";
import { GeoContext } from "../../index";
import AttributeTab from "../AttributeTab";

import "./style.scss";

const { TabPane } = Tabs;

const CustomPopup = ({ type = "Polygon", onChangeAttr }) => {
  const geoData = useContext(GeoContext);

  const initAttr = (type) => {
    const polygonAttr = {
      stroke: geoData.properties.color,
      strokeWidth: geoData.properties.weight,
      strokeOpacity: 1,
      fill: geoData.properties.fill,
      fillOpacity: geoData.properties.fillOpacity,
    };

    return polygonAttr;
  };

  const [attr, setAttr] = useState(initAttr(type));

  const handleChange = ({ target }) => {
    const value = target.value;
    setAttr({
      ...attr,
      [target.name]: value,
    });
    // console.log(attr.stroke)
    onChangeAttr(attr);
  };

  return (
    <Popup>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <AppleOutlined />
              Attribute
            </span>
          }
          key="1"
        >
          <Form>
            <Form.Row>
              <Form.Label htmlFor="stroke">Stroke:</Form.Label>
              <Form.Input
                type="color"
                name="stroke"
                value={attr.stroke}
                onChange={handleChange}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label htmlFor="strokeWidth">Stroke-width:</Form.Label>
              <Form.Input
                type="number"
                step={0.1}
                value={attr.strokeWidth}
                min={0}
                name="strokeWidth"
                onChange={handleChange}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label htmlFor="strokeOpacity">Stroke-opacity:</Form.Label>
              <Form.Input
                type="number"
                name="strokeOpacity"
                step={0.1}
                value={attr.strokeOpacity}
                min={0}
                max={1}
                onChange={handleChange}
              />
            </Form.Row>
            {type === "Polygon" && (
              <>
                <Form.Row>
                  <Form.Label htmlFor="fill">Fill:</Form.Label>
                  <Form.Input
                    type="color"
                    name="fill"
                    value={attr.fill}
                    onChange={handleChange}
                  />
                </Form.Row>
                <Form.Row>
                  <Form.Label htmlFor="fillOpacity">Fill-opacity:</Form.Label>
                  <Form.Input
                    type="number"
                    name="fillOpacity"
                    step={0.1}
                    value={attr.fillOpacity}
                    min={0}
                    max={1}
                    onChange={handleChange}
                  />
                </Form.Row>
              </>
            )}
          </Form>
        </TabPane>
        <TabPane
          tab={
            <span>
              <AndroidOutlined />
              Info
            </span>
          }
          key="2"
        >
          <AttributeTab />
        </TabPane>
      </Tabs>
    </Popup>
  );
};

export default CustomPopup;

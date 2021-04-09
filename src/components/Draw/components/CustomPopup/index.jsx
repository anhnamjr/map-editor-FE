import React from "react";
import { Tabs } from "antd";
import { Popup } from "react-leaflet";
import { AppleOutlined, AndroidOutlined } from "@ant-design/icons";
import Form from "../form";
import AttributeTab from "../AttributeTab";

import "./style.scss";

const { TabPane } = Tabs;

const CustomPopup = ({ type = "Polygon", shapeProps, onChangeAttr }) => {
  const handleChange = ({ target }) => {
    const value = target.value;
    onChangeAttr({
      ...shapeProps,
      [target.name]: value,
    });
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
                name="color"
                value={shapeProps.color}
                onChange={handleChange}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label htmlFor="strokeWidth">Stroke-width:</Form.Label>
              <Form.Input
                type="number"
                step={1}
                value={shapeProps.weight}
                min={1}
                max={10}
                name="weight"
                onChange={handleChange}
              />
            </Form.Row>
            {(type === "Polygon" || type === "Circle") && (
              <>
                <Form.Row>
                  <Form.Label htmlFor="fill">Fill:</Form.Label>
                  <Form.Input
                    type="color"
                    name="fill"
                    value={shapeProps.fill}
                    onChange={handleChange}
                  />
                </Form.Row>
                <Form.Row>
                  <Form.Label htmlFor="fillOpacity">Fill-opacity:</Form.Label>
                  <Form.Input
                    type="number"
                    name="fillOpacity"
                    step={0.1}
                    value={shapeProps.fillOpacity}
                    min={0.1}
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

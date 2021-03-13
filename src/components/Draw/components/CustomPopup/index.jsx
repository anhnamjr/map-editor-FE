import React from "react";
import { Tabs, Table } from "antd";
import { Popup } from "react-leaflet";
import { AppleOutlined, AndroidOutlined } from "@ant-design/icons";
import PropertyTab from "../PropertyTab";
import AttributeTab from "../AttributeTab";

import "./style.scss";

const { TabPane } = Tabs;

const CustomPopup = ({ item }) => {
  return (
    <Popup>
      <Tabs defaultActiveKey="2">
        <TabPane
          tab={
            <span>
              <AppleOutlined />
              Tab 1
            </span>
          }
          key="1"
        >
          <PropertyTab item={item} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <AndroidOutlined />
              Tab 2
            </span>
          }
          key="2"
        >
          <AttributeTab item={item} />
        </TabPane>
      </Tabs>
    </Popup>
  );
};

export default CustomPopup;

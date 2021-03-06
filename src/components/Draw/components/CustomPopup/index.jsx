import React from "react";
import { Tabs, Table } from "antd";
import { Popup } from "react-leaflet";
import { AppleOutlined, AndroidOutlined } from "@ant-design/icons";

import './style.scss'

const { TabPane } = Tabs;

const CustomPopup = () => {
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
          Tab 1
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
          Tab 2
        </TabPane>
      </Tabs>
    </Popup>
  );
};

export default CustomPopup;

import React, { useState } from "react";
import { Sidebar, Tab } from "react-leaflet-sidetabs";
import { FiHome, FiChevronLeft, FiSearch, FiSettings } from "react-icons/fi";
import { BsGeoAlt } from "react-icons/bs";
import LayerTree from "../LayerTree";
import AddForm from "./components/CreateGeoForm";
import SearchForm from "./components/Search";
import { Tabs } from 'antd';

import AddMap from './components/AddMap';
import AddLayer from './components/AddLayer';


const { TabPane } = Tabs;

const MapSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("maps");

  const onClose = () => setCollapsed(true);

  const onOpen = (tab) => {
    setCollapsed(false);
    setSelected(tab);
  };
  const callback = (key) => {
    console.log(key)
  }
  return (
    <Sidebar
      id="sidebar"
      position="left"
      collapsed={collapsed}
      closeIcon={<FiChevronLeft />}
      selected={selected}
      onOpen={onOpen}
      onClose={onClose}
      style={{ zIndex: 401 }}
    >
      <Tab id="maps" header="Maps" icon={<FiHome />}>
        <Tabs defaultActiveKey="1" onChange={callback} >
          <TabPane tab="Your Maps" key="1">
            <h2></h2>
            <LayerTree />
          </TabPane>
          <TabPane tab="Add Map" key="2">
            <AddMap />
          </TabPane>
          <TabPane tab="Add Layer" key="3">
            <AddLayer />
          </TabPane>

        </Tabs>
      </Tab>

      <Tab id="search" header="Search" icon={<FiSearch />}>
        <SearchForm
        />

      </Tab>

      {/* <Tab id="map" header="Create Map" icon={<RiRoadMapLine />}>
            <AddForm/>
          </Tab>

          <Tab id="layer" header="Create Layer" icon={<FiLayers />}>
            <AddForm/>
          </Tab> */}

      <Tab id="geom" header="Create GeoData" icon={<BsGeoAlt />}>
        <AddForm />
      </Tab>

      <Tab
        id="settings"
        header="Settings"
        anchor="bottom"
        icon={<FiSettings />}
      >
        <p>We don't want privacy so much as privacy settings!</p>
      </Tab>
    </Sidebar>
  );
};

export default MapSidebar;

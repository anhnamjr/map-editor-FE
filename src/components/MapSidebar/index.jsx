import React, { useState, useEffect } from "react";
import { Sidebar, Tab } from "react-leaflet-sidetabs";
import { FiHome, FiChevronLeft, FiSearch, FiSettings } from "react-icons/fi";
import { FileOutlined } from "@ant-design/icons";
import { BsGeoAlt } from "react-icons/bs";
import LayerTree from "../LayerTree";
import AddForm from "./components/CreateGeoForm";
import SearchForm from "./components/Search";
import { Tabs, Button } from "antd";
import AddMap from "./components/AddMap";
import AddLayer from "./components/AddLayer";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import File from "./components/File";

const { TabPane } = Tabs;

const MapSidebar = ({ map }) => {
  // const { shapeItem } = useContext(ShapeContext)
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("maps");
  const { geom = null } = useSelector((state) => state.storeGeom);

  const onClose = () => setCollapsed(true);

  useEffect(() => {
    setSelected(geom.geometry ? "geom" : "maps");
  }, [geom]);

  const onOpen = (tab) => {
    setCollapsed(false);
    setSelected(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/signin");
  };

  return (
    <Sidebar
      id="sidebar"
      position="left"
      collapsed={collapsed}
      closeIcon={<FiChevronLeft />}
      selected={selected}
      onOpen={onOpen}
      onClose={onClose}
      style={{ zIndex: 401, padding: 10 }}
    >
      <Tab id="maps" header="Maps" icon={<FiHome />}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Your Maps" key="1">
            <h2>Your maps</h2>
            <LayerTree />
          </TabPane>
          <TabPane tab="Add Map" key="2">
            <AddMap />
          </TabPane>
          <TabPane tab="Add Layer" key="3" style={{ paddingRight: 20 }}>
            <AddLayer />
          </TabPane>
        </Tabs>
      </Tab>

      <Tab id="search" header="Search" icon={<FiSearch />}>
        <SearchForm />
      </Tab>

      <Tab id="geom" header="Create GeoData" icon={<BsGeoAlt />}>
        <AddForm map={map} />
      </Tab>

      <Tab id="file" header="Import/Export File" icon={<FileOutlined />}>
        <File />
      </Tab>

      <Tab
        id="settings"
        header="Settings"
        anchor="bottom"
        icon={<FiSettings />}
      >
        <Button onClick={handleLogout}>Log out</Button>
      </Tab>
    </Sidebar>
  );
};

export default MapSidebar;

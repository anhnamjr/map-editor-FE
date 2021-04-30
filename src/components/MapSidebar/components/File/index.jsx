import React from "react";
import { Tabs } from "antd";
import { FaFileImport, FaFileExport } from "react-icons/fa";
import Export from "../Export";
import Import from "../Import";

const { TabPane } = Tabs;

const File = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane
        tab={
          <span>
            <FaFileImport /> Import
          </span>
        }
        key="1"
      >
        <Import />
      </TabPane>
      <TabPane
        tab={
          <span>
            <FaFileExport /> Export
          </span>
        }
        key="2"
      >
        <Export />
      </TabPane>
    </Tabs>
  );
};

export default File;

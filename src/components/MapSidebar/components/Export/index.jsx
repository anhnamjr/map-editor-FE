import React, { useState } from "react";
import { Select, Button } from "antd";
import { useSelector } from "react-redux";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { BASE_URL } from "../../../../constants/endpoint";

const { Option, OptGroup } = Select;

const Export = () => {
  const mapList = useSelector((state) => state.treeReducer.layerTree) || null;
  const [selected, setSelected] = useState(null);
  const [exportLinks, setExportLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (val) => {
    setSelected(val);
  };

  const handleExport = () => {
    setLoading(true);
    AXIOS_INSTANCE.request({
      url: `${BASE_URL}/export/geojson?layerID=${selected}`,
      method: "GET",
    }).then((res) => {
      setExportLinks(res.data);
      setLoading(false);
    });
  };

  return (
    <div>
      <h3>Select a layer to export</h3>
      <Select style={{ width: "100%", marginTop: 10 }} onChange={handleChange}>
        {mapList &&
          mapList.map((item) => (
            <OptGroup key={item.key} label={item.title}>
              {item.children.length !== 0 &&
                item.children.map((child) => (
                  <Option key={child.key} value={child.key}>
                    {child.title}
                  </Option>
                ))}
            </OptGroup>
          ))}
      </Select>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Button type="primary" disabled={!selected} onClick={handleExport}>
          Export
        </Button>
      </div>
      {exportLinks && (
        <a href={`${exportLinks.data}`} download>
          {exportLinks.data}
        </a>
      )}
    </div>
  );
};

export default Export;

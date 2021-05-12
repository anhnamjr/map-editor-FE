import React, { useState } from "react";
import { Select, Button } from "antd";
import { useSelector } from "react-redux";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { BASE_URL } from "../../../../constants/endpoint";
import "./style.scss"
import { FcFile } from "react-icons/fc";
import { toSlug } from "../../../../utils"

const { Option, OptGroup } = Select;

const Export = () => {
  const mapList = useSelector((state) => state.treeReducer.layerTree) || null;
  const [selected, setSelected] = useState(null);
  const [layerName, setLayerName] = useState(null)
  const [loading, setLoading] = useState(false);
  const [FileLink, setFileLink] = useState(null)

  const handleChange = (val) => {
    setSelected(val);
  };

  const handleClick = (title) => {
    setLayerName(title)
  }

  const handleExport = () => {
    setLoading(true);
    AXIOS_INSTANCE.request({
      url: `${BASE_URL}/export/geojson?layerID=${selected}&layerName=${toSlug(layerName)}`,
      method: "GET",
    }).then((res) => {
      setFileLink(res.data.file)
      setLoading(false);
    })
      .catch(err => {
        console.log(err)
        setLoading(false);
      })
  };

  return (
    <div>
      <h3>Select layer to export</h3>
      <Select
        mode="multiple"
        style={{ width: "100%", marginTop: 10 }}
        onChange={handleChange}
      >
        {mapList &&
          mapList.map((item) => (
            <OptGroup key={item.key} label={item.title}>
              {item.children.length !== 0 &&
                item.children.map((child) => (
                  <Option key={child.key} value={child.key} >
                    <div onClick={() => handleClick(child.title)} >{child.title}</div>
                  </Option>
                ))}
            </OptGroup>
          ))}
      </Select>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Button loading={loading} type="primary" disabled={!selected} onClick={handleExport}>
          Export
        </Button>
      </div>
      {FileLink && (
        <div className="export-link-container">
          <a href={`${FileLink.url}`} download className="export-link">
            <p>{FileLink.fileName}</p>
            <FcFile style={{ fontSize: 24 }} />
          </a>
        </div>
      )}
    </div>
  );
};

export default Export;

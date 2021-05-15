import React, { useState } from "react";
import { Upload, message, Button, Select, Input } from "antd";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { PlusOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../../../constants/endpoint";
import { useSelector } from "react-redux";
import "./style.scss";

const { Option } = Select;

const Import = () => {
  const [fileList, setFileList] = useState([]);
  const [map, setMap] = useState(null);
  const [layerName, setLayerName] = useState(null);
  const mapList = useSelector((state) => state.treeReducer.layerTree);
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file) => {
    console.log(file);
    setFileList([
      ...fileList,
      {
        file: file,
        uid: file.uid,
        name: file.name,
      },
    ]);
  };

  const handleImport = () => {
    setLoading(true);
    const bodyFormData = new FormData();
    fileList.forEach((item) => {
      bodyFormData.append("file", item.file);
    });
    // bodyFormData.append("body", JSON.stringify(map));
    AXIOS_INSTANCE.request({
      url: `${BASE_URL}/import/geojson?mapID=${map}&layerName=${layerName}`,
      method: "POST",
      data: bodyFormData,
    }).then((res) => {
      setLoading(false);
      setMap(null);
      setFileList([]);
      message.success("Import successfully!")
    })
      .catch(err => {
        setLoading(false);
        setMap(null);
        setFileList([]);
        message.error(err.data.msg)
      })
  };

  const handleChange = (info) => {
    let newFileList = [];
    info.fileList.forEach((file1) => {
      fileList.forEach((item) => {
        if (file1.uid === item.uid) {
          newFileList.push({ ...item, status: "done" });
        }
      });
    });
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleClick = (value) => {
    console.log(value);
    setMap(value);
  };

  const handleChangeLayerName = (e) => {
    setLayerName(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        // marginTop: 10,
        flexDirection: "column",
        alignItems: "flex-start",
      }}
      className="import-form"
    >
      <h3>Select map to import layer</h3>
      <Select
        placeholder="Select a map"
        onChange={handleClick}
        value={map}
        style={{ width: "100%", margin: "10px auto" }}
        allowClear
      >
        {mapList &&
          mapList.map((item) => {
            return (
              <Option value={item.key} key={item.key}>
                {" "}
                {item.title}
              </Option>
            );
          })}
      </Select>
      <Input
        placeholder="Layer name"
        value={layerName}
        onChange={handleChangeLayerName}
      />
      <div style={{ width: "100%", padding: 20 }}>
        <Upload
          name="file"
          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={beforeUpload}
        >
          {uploadButton}
        </Upload>
      </div>
      <div style={{ textAlign: "center", width: "100%" }}>
        <Button
          type="primary"
          disabled={fileList.length === 0 || map === null}
          style={{ marginTop: 20 }}
          onClick={handleImport}
          loading={loading}
        >
          Import
        </Button>
      </div>
    </div>
  );
};

export default Import;

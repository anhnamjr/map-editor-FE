import React, { useState } from "react";
import { Upload, message, Button, Select } from "antd";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { PlusOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../../../constants/endpoint";
import { useSelector } from "react-redux";

const { Option } = Select;

const Import = () => {
  const [fileList, setFileList] = useState([]);
  const [map, setMap] = useState(null);
  const mapList = useSelector((state) => state.treeReducer.layerTree);

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
    const bodyFormData = new FormData();
    fileList.forEach((item) => {
      bodyFormData.append("file", item.file);
    });
    bodyFormData.append("mapID", map);
    AXIOS_INSTANCE.request({
      url: `${BASE_URL}/import/geojson`,
      method: "POST",
      data: bodyFormData,
    }).then((res) => {});
  };

  const handleChange = (info) => {
    console.log(info.fileList);
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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: 10,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3>Select map to import layer</h3>
      <Select
        placeholder="Select a option and change input text above"
        onChange={handleClick}
        value={map}
        style={{ width: "80%", margin: "10px auto" }}
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
      <Button
        type="primary"
        disabled={fileList.length === 0}
        style={{ marginTop: 20 }}
        onClick={handleImport}
      >
        Import
      </Button>
    </div>
  );
};

export default Import;

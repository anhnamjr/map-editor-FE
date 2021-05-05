import React, { useState } from "react";
import { Upload, message, Button } from "antd";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { PlusOutlined } from "@ant-design/icons"
import { BASE_URL } from "../../../../constants/endpoint";

const Import = () => {
  const [fileList, setFileList] = useState([]);

  const beforeUpload = (file) => {
    console.log(file)
    setFileList([...fileList, file]);
  };

  const handleImport = () => {
    const bodyFormData = new FormData();
    fileList.forEach((item => {
      bodyFormData.append("file", item);
    }))

    console.log(bodyFormData);
    AXIOS_INSTANCE.request({
      url: `${BASE_URL}/import`,
      method: "POST",
      data: bodyFormData,
    }).then((res) => { });
  };

  const handleChange = (info) => {
    console.log(info.fileList)
    let newFileList = []
    info.fileList.forEach(file1 => {
      fileList.forEach(file2 => {
        if (file1.uid === file2.uid) {
          newFileList.push(file2)
        }
      })
    })
    setFileList(newFileList)
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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

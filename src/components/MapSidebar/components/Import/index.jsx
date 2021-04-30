import React, { useState } from "react";
import { Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";

const Import = () => {
  const [file, setFile] = useState(null);

  const beforeUpload = (file) => {
    setFile(file);
  };

  const handleImport = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    console.log(bodyFormData);
    // AXIOS_INSTANCE.request({
    //   url: `abc.com`,
    //   method: "POST",
    //   data: bodyFormData,
    // }).then((res) => {});
  };

  const handleChange = (info) => {
    console.log(info);
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
      <Upload
        name="file"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <Button
        type="primary"
        disabled={!file}
        style={{ marginTop: 20 }}
        onClick={handleImport}
      >
        Import
      </Button>
    </div>
  );
};

export default Import;

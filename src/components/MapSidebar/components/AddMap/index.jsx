import React, { useState } from "react";
import { BASE_URL } from "../../../../../src/constants/endpoint";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { fetchLayerTree } from "../../../../actions/fetchLayerTree";

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function AddMap() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    const data = { mapName: values.mapName };
    setLoading(true);
    AXIOS_INSTANCE.post(`${BASE_URL}/map`, data)
      .then((res) => {
        setLoading(false);
        dispatch(fetchLayerTree());
        form.resetFields();
        message.success(res.data.msg);
      })
      .catch((err) => {
        message.error(err.response.data.msg);
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Vui lòng nhập tên map!");
  };

  return (
    <Form
      form={form}
      name="addMap"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Map name"
        name="mapName"
        // value={name}
        rules={[{ required: true, message: "Map name is required" }]}
        // onChange={event => setName(event.target.value)}
      >
        <Input placeholder="Enter new map name" />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}

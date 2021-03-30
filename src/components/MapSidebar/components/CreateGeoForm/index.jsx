import React, { useEffect } from "react";
import { Form, Input, Button, Select } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../../../constants/endpoint";
import ColorPicker from "rc-color-picker";
import "rc-color-picker/assets/index.css";

const { Option, OptGroup } = Select;

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const types = ["Line", "Polygon", "Marker"];

const AddForm = () => {
  const mapList = useSelector((state) => state.treeReducer.layerTree) || null;
  const { geom = null } = useSelector((state) => state.storeGeom);
  const [form] = Form.useForm();

  useEffect(() => {
    const { type = "Line" } = geom;
    form.setFieldsValue({
      geom: JSON.stringify(geom),
      categoryID: type,
    });
  }, [geom, form]);

  const onFinish = (values) => {
    let newGeom = JSON.parse(values.geom);
    const params = {
      ...values,
      geom: JSON.stringify(geom),
    }

    if (newGeom.type === "Point" && newGeom.properties.radius) {
      params.radius = newGeom.properties.radius
    }

    axios
      .post(`${BASE_URL}/data`, params)
      .then((res) => {
        // form.resetFields()
      });
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      form={form}
      {...layout}
      name="basic"
      labelAlign="left"
      initialValues={{
        remember: true,
        categoryID: types[0],
        color: "#333",
        description: "",
      }}
      style={{ marginTop: 20 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Layer"
        name="layerID"
        rules={[
          {
            required: true,
            message: "Please choose layer!",
          },
        ]}
      >
        <Select style={{ width: "100%" }}>
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
      </Form.Item>

      <Form.Item
        label="Name"
        name="geoName"
        rules={[
          {
            required: true,
            message: "Please input name!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Type"
        name="categoryID"
        rules={[
          {
            required: true,
            message: "Please input type!",
          },
        ]}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="Geom" name="geom">
        <Input.TextArea disabled />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddForm;

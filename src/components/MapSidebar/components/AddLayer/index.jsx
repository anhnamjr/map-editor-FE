import React, { useState } from "react";
import { BASE_URL } from "../../../../../src/constants/endpoint";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { Form, Input, Select, Button, Row, message, Col } from "antd";
import { useDispatch } from "react-redux";
import { fetchLayerTree } from "../../../../actions/fetchLayerTree";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function LayerMap() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onClick = () => {
    AXIOS_INSTANCE.get(`${BASE_URL}/maps`).then((res) => {
      let optionArr = [];
      res.data.maps.forEach((item) => {
        optionArr.push(item);
      });
      setOptions(optionArr);
    });
  };

  const onFinish = (values) => {
    console.log(values);
    setLoading(true);
    const data = {
      mapID: values.Map,
      layerName: values.name,
      columns: values.columns,
    };
    // AXIOS_INSTANCE.post(`${BASE_URL}/layer`, data)
    //   .then((res) => {
    //     dispatch(fetchLayerTree());
    //     setLoading(false);
    //     form.resetFields();
    //     message.success("Add Layer Successfully!");
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     message.error(err.response.data.msg);
    //   });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="addLayer"
      layout="vertical"
      form={form}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item name="Map" label="Select map" rules={[{ required: true }]}>
        <Select
          placeholder="Select a option and change input text above"
          //onChange={onGenderChange}
          onClick={onClick}
          allowClear
        >
          {options &&
            options.map((item) => {
              return (
                <Option value={item.key} key={item.key}>
                  {" "}
                  {item.title}
                </Option>
              );
            })}
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label="Layer name"
        rules={[{ required: true, message: "Enter new layer name" }]}
      >
        <Input placeholder="Layer name" />
      </Form.Item>

      <Form.List name="columns">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Row
                key={key}
                style={{ display: "flex", marginBottom: 8, width: "100%" }}
                align="baseline"
              >
                <Col span={12}>
                  <Form.Item
                    {...restField}
                    name={[name, "attribute"]}
                    fieldKey={[fieldKey, "attribute"]}
                    rules={[
                      { required: true, message: "Missing attribute name" },
                    ]}
                  >
                    <Input placeholder="Attribute name" />
                  </Form.Item>
                </Col>
                <Col span={8} offset={1}>
                  <Form.Item
                    {...restField}
                    name={[name, "datatype"]}
                    fieldKey={[fieldKey, "datatype"]}
                    rules={[{ required: true, message: "Missing datatype" }]}
                  >
                    <Select placeholder="datatype">
                      <Option value="numberic">Number</Option>
                      <Option value="text">String</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={2} offset={1}>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}

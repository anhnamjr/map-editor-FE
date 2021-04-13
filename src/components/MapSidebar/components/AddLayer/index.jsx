import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../../../src/constants/endpoint";
import axios from "axios";
import { Form, Input, Select, Button, message } from 'antd';
import { useDispatch } from "react-redux";
import { fetchLayerTree } from "../../../../actions/fetchLayerTree";

const { Option } = Select;
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};



export default function LayerMap() {
  const [options, setOptions] = useState(([]));
  const dispatch = useDispatch()
  const [form] = Form.useForm();

  const onClick = () => {
    axios.get(`${BASE_URL}/maps`).then((res) => {
      let optionArr = [];
      res.data.maps.forEach((item) => {
        optionArr.push(item);
      })
      setOptions(optionArr)
    })
  }

  const onFinish = (values) => {
    const data = { mapID: values.Map, layerName: values.name }
    axios.post(`${BASE_URL}/layer`, data).then((res) => {
      dispatch(fetchLayerTree())
      form.resetFields()
      message.success("Add Layer Successfully!")
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
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
          {
            options && options.map((item) => {
              return <Option value={item.key} key={item.key}> {item.title}</Option>
            })
          }
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label='Layer name'

        rules={[{ required: true, message: 'Enter new layer name' }]}
      >
        <Input placeholder="Layer name" />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form >

  )
}
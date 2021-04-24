import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../../../src/constants/endpoint";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { Form, Input, Select, Button, message, Space } from 'antd';
import { useDispatch } from "react-redux";
import { fetchLayerTree } from "../../../../actions/fetchLayerTree";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function LayerMap() {
  const [options, setOptions] = useState(([]));
  const dispatch = useDispatch()
  const [form] = Form.useForm();

  const onClick = () => {
    AXIOS_INSTANCE.get(`${BASE_URL}/maps`).then((res) => {
      let optionArr = [];
      res.data.maps.forEach((item) => {
        optionArr.push(item);
      })
      setOptions(optionArr)
    })
  }

  const onFinish = (values) => {
    // const data = { mapID: values.Map, layerName: values.name }
    // AXIOS_INSTANCE.post(`${BASE_URL}/layer`, data).then((res) => {
    //   dispatch(fetchLayerTree())
    //   form.resetFields()
    //   message.success("Add Layer Successfully!")
    // })
    console.log(values)
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

      <Form.List name="columns">
        {(fields, {add, remove}) => (
          <>
            {fields.map(({key, name, fieldKey, ...restField}) => (
              <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                <Form.Item
                  {...restField} 
                  name={[name, 'attribute']}
                  fieldKey={[fieldKey, 'attribute']}
                  rules={[{ required: true, message: 'Missing attribute name' }]}
                >
                  <Input placeholder="Attribute name" />
                </Form.Item>
                <Form.Item
                  {...restField} 
                  name={[name, 'datatype']}
                  fieldKey={[fieldKey, 'datatype']}
                  rules={[{ required: true, message: 'Missing datatype' }]}
                >
                  <Input placeholder="Datatype" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form >

  )
}
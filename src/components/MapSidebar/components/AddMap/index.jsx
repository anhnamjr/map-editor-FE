import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../../../src/constants/endpoint";
import axios from "axios";
import { Form, Input, Button } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};


export default function AddMap() {

  // const [name, setName] = useState['']

  // useEffect(() => {
  //   const timeOutId = setTimeout(() => {
  //     console.log(name)
  //     const req = { mapName: name }
  //     axios.post(`${BASE_URL}/checkMapName`, req).then((res) => {
  //       console.log(res)
  //     })
  //   }, 300);
  //   return () => clearTimeout(timeOutId);
  // }, [name]);


  const onFinish = (values) => {
    const data = { mapName: values.mapName }
    axios.post(`${BASE_URL}/map`, data).then((res) => {
      alert(res.data.msg)
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };





  return (

    <Form
      // {...layout}
      name="addMap"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}

    >
      <Form.Item

        label="Map name"
        name="mapName"
        // value={name}
        rules={[{ required: true, message: 'Enter new map name' }]}
      // onChange={event => setName(event.target.value)}
      >
        <Input placeholder="Enter new map name" />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>

  )
}
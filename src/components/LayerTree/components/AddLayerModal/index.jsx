import React from "react";
import { Button, Form, Modal, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { fetchLayerTree } from "../../../../actions/fetchLayerTree";
import { BASE_URL } from "../../../../constants/endpoint";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";


const AddLayerModal = ({ showAddLayerModal, setShowAddLayerModal, currentNode }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm();

  const handleAddLayer = (values) => {
    const data = { mapID: currentNode.key, layerName: values.name }
    AXIOS_INSTANCE.post(`${BASE_URL}/layer`, data).then((res) => {
      dispatch(fetchLayerTree())
      form.resetFields()
      message.success("Add Layer Successfully!")
    })
  }

  const handleCancel = () => {
    setShowAddLayerModal(false);
  };

  return (
    <Modal
      title={`Add a Layer`}
      visible={showAddLayerModal}
      onCancel={handleCancel}
      footer={null}
    >
      <Form onFinish={handleAddLayer} form={form}>
        <Form.Item
          label={`Layer name`}
          name="name"
        >
          <Input allowClear placeholder={`Layer name`} />
        </Form.Item>
        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }} onClick={handleAddLayer}>
            Save
            </Button>
          <Button type="primary" htmlType="submit" danger onClick={handleCancel}>
            Close
            </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddLayerModal
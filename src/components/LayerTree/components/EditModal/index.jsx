import React, { useState, useEffect } from "react";
import { Button, Form, Select, Modal, Input, message } from "antd";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { BASE_URL } from "../../../../constants/endpoint";
import { useDispatch } from "react-redux"
import { fetchLayerTree } from "../../../../actions/fetchLayerTree";

const { Option } = Select;

const EditModal = ({ showEditModal, setShowEditModal, editItemType, currentNode, treeData }) => {
  const [nodeData, setNodeData] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentNode) {
      let mapID = ""
      if (!currentNode.children) {
        // find the map of layer
        treeData.forEach(map => {
          if (map.children.length !== 0) {
            map.children.forEach(layer => {
              if (layer.key === currentNode.key) {
                mapID = map.key
                return
              }
            })
          }
        })
      }
      setNodeData({ ...currentNode })
      form.setFieldsValue({
        name: currentNode.title,
        Map: mapID
      })
    }
  }, [currentNode])

  const handleEdit = (values) => {
    setLoading(true)
    if (currentNode.children) {
      // edit map
      AXIOS_INSTANCE.post(`${BASE_URL}/edit-map`, {
        mapID: nodeData.key,
        mapName: values.name
      }).then(res => {
        dispatch(fetchLayerTree())
        setLoading(false)
        message.success("Update Successfully UwU")
      })
    } else {
      // edit layer
      AXIOS_INSTANCE.post(`${BASE_URL}/edit-layer`, {
        layerID: nodeData.key,
        layerName: values.name,
        mapID: values.Map,
      }).then(res => {
        dispatch(fetchLayerTree())
        setLoading(false)
        message.success("Update Successfully UwU")
      })
    }

    setShowEditModal(false);
  }

  const handleOk = (e) => {
    console.log(e)
    setShowEditModal(false);
  };

  const handleCancel = () => {
    setShowEditModal(false);
  };

  return (
    <Modal
      title={`Edit ${editItemType}`}
      visible={showEditModal}
      // onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Form onFinish={handleEdit} form={form}>
        <Form.Item
          label={`${editItemType} name`}
          name="name"
        >
          <Input allowClear placeholder={`${editItemType} name`} />

        </Form.Item>
        {editItemType === "Layer"
          && (
            <Form.Item name="Map" label="Select map" value={nodeData ? nodeData.key : ""}>
              <Select
                placeholder="Select a option and change input text above"
                allowClear
              // value={nodeData ? nodeData.key : ""}
              >
                {
                  treeData && treeData.map((item) => {
                    return <Option value={item.key} key={item.key}> {item.title}</Option>
                  })
                }
              </Select>
            </Form.Item>
          )
        }
        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }} onClick={handleEdit} loading={loading}>
            Save
            </Button>
          <Button type="primary" danger onClick={handleCancel}>
            Close
            </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditModal
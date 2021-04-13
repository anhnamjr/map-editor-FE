import React, { useState, useEffect } from "react";
import { Tree, Button, Form, Dropdown, Menu, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
// import { AppstoreAddOutlined } from "@ant-design/icons"
import axios from "axios";
import { FETCH_LAYER_DATA, FETCH_LAYER_TREE, CLEAR_LAYER_DATA } from "../../constants/actions";
import { BASE_URL } from "../../constants/endpoint";
// import AddMap from "../MapSidebar/components/AddMap";
import { Modal, Input } from "antd"

const { Option } = Select;

const LayerTree = () => {
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [mapName, setMapName] = useState('')
  const [editItemType, setEditItemType] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();

  const data = useSelector((state) => state.treeReducer.layerTree) || null;

  const showModal = (nodeData) => {
    setMapName(nodeData.title);
    setIsModalVisible(true);
    setEditItemType(nodeData.children ? "Map" : "Layer")
  };

  const handleOk = (e) => {
    console.log(e)
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setMapName("");
    setIsModalVisible(false);
  };

  const handleEdit = (values) => {
    console.log(values)
    setIsModalVisible(false);
  }

  useEffect(() => {
    axios.get(`${BASE_URL}/maps`).then((res) => {
      dispatch({ type: FETCH_LAYER_TREE, payload: res.data.maps });
    });
  }, [dispatch]);

  useEffect(() => {
    if (data) setTreeData(data);
  }, [data]);

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeys) => {
    setCheckedKeys(checkedKeys);
    axios
      .get(`${BASE_URL}/data?layerId=${checkedKeys.join(",")}`)
      .then((res) => {
        dispatch({ type: FETCH_LAYER_DATA, payload: res.data });
      });
  };


  const handleClearTree = () => {
    dispatch({ type: CLEAR_LAYER_DATA });
    setCheckedKeys([])
    setSelectedKeys([])
  }

  const renderTreeItem = nodeData => {
    console.log(nodeData)
    const menu = (
      <Menu style={{ width: 150 }}>
        {
          nodeData.children.length !== 0 &&
          <Menu.Item key="1" onClick={() => showModal(nodeData)}>
            Add Layer
          </Menu.Item>
        }
        <Menu.Item key="2" onClick={() => showModal(nodeData)}>Edit</Menu.Item>
        {/* {!nodeData.children && <Menu.Item key="2" onClick={() => handleChangeMap(nodeData)}>Move</Menu.Item>} */}
        <Menu.Item key="3">Delete</Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} trigger={['contextMenu']}>
        <div
          className="site-dropdown-context-menu"
        >
          {nodeData.title}
        </div>
      </Dropdown>
    )
  }

  return (
    <>
      <Button onClick={handleClearTree}>
        Clear All Layers
      </Button>


      <Modal
        title={`Edit ${editItemType}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={handleEdit}>
          <Form.Item
            label={`${editItemType} name`}
            name="name"

          >
            <Input allowClear placeholder={`${editItemType} name`} value={mapName}
              onChange={(e) => setMapName(e.target.value)} />

          </Form.Item>
          {editItemType === "Layer"
            && (
              <Form.Item name="Map" label="Select map">
                <Select
                  placeholder="Select a option and change input text above"
                  //onChange={onGenderChange}
                  // onClick={onClick}
                  allowClear
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
            <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
              Save
            </Button>
            <Button type="primary" htmlType="submit" danger onClick={handleCancel}>
              Close
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Tree
        treeData={treeData}
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        titleRender={renderTreeItem}
        // onClick={(e) => console.log(e)}
        // onRightClick={e => showModal(e)}
        selectedKeys={selectedKeys}
      />
    </>
  );
};

export default LayerTree;

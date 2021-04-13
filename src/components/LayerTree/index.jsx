import React, { useState, useEffect } from "react";
import { Tree, Button, Dropdown, Menu, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FETCH_LAYER_DATA, FETCH_LAYER_TREE, CLEAR_LAYER_DATA } from "../../constants/actions";
import { BASE_URL } from "../../constants/endpoint";
import EditModal from "./components/EditModal";
import AddLayerModal from "./components/AddLayerModal";
import { fetchLayerTree } from "../../actions/fetchLayerTree"



const LayerTree = () => {
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [editItemType, setEditItemType] = useState("")
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddLayerModal, setShowAddLayerModal] = useState(false);
  const [currentNode, setCurrentNode] = useState(null)

  const dispatch = useDispatch();

  const data = useSelector((state) => state.treeReducer.layerTree) || null;

  const openEditModal = (nodeData) => {
    setCurrentNode({ ...nodeData })
    setEditItemType(nodeData.children ? "Map" : "Layer")
    setShowEditModal(true);
  };

  const openAddLayerModal = (nodeData) => {
    setCurrentNode({ ...nodeData })
    setShowAddLayerModal(true)
  }

  const handleDelete = (nodeData) => {
    if (nodeData.children) {
      // delete map
      axios.post(`${BASE_URL}/delete-map`, { mapID: nodeData.key })
        .then(res => {
          dispatch(fetchLayerTree())
          message.success("Delete Successfully");
        })
    } else {
      // delete layer
      axios.post(`${BASE_URL}/delete-layer`, { layerID: nodeData.key })
        .then(res => {
          dispatch(fetchLayerTree())
          message.success("Delete Successfully");
        })
    }
  }

  useEffect(() => {
    dispatch(fetchLayerTree())
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
    const menu = (
      <Menu style={{ width: 150 }}>
        {
          nodeData.children &&
          <Menu.Item key="1" onClick={() => openAddLayerModal(nodeData)}>
            Add Layer
          </Menu.Item>
        }
        <Menu.Item key="2" onClick={() => openEditModal(nodeData)}>Edit</Menu.Item>
        {/* {!nodeData.children && <Menu.Item key="2" onClick={() => handleChangeMap(nodeData)}>Move</Menu.Item>} */}
        <Menu.Item key="3" onClick={() => handleDelete(nodeData)} >Delete</Menu.Item>
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
      <Button onClick={handleClearTree} style={{ marginBottom: 20 }}>
        Clear All Layers
      </Button>
      <EditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editItemType={editItemType}
        currentNode={currentNode}
        treeData={treeData}
      />
      <AddLayerModal
        showAddLayerModal={showAddLayerModal}
        setShowAddLayerModal={setShowAddLayerModal}
        currentNode={currentNode}
      />
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

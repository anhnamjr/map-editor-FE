import React, { useState, useEffect } from "react";
import { Tree, Button, Dropdown, Menu, message } from "antd";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AXIOS_INSTANCE } from "../../config/requestInterceptor";
import {
  FETCH_LAYER_DATA,
  CLEAR_LAYER_DATA,
  TOGGLE_UNSAVE,
  SET_CURRENT_EDIT_LAYER,
  SET_R_TREE,
  SET_MID_POINT,
} from "../../constants/actions";
import { BASE_URL } from "../../constants/endpoint";
import EditModal from "./components/EditModal";
import { fetchLayerTree, fetchLayerCols } from "../../actions/fetchLayerTree";
import "./style.scss";
import RBush from "rbush";
import { get, size, map } from "lodash";
import { getMidPoint, getMidPointNearest } from "../../utils";

const LayerTree = () => {
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [editItemType, setEditItemType] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);

  const dispatch = useDispatch();

  const data = useSelector((state) => state.treeReducer.layerTree) || null;
  const { tree, mousePosition, mouseBound } = useSelector(
    (state) => state.snap,
    shallowEqual
  );
  const { currentEditLayer } = useSelector((state) => state.treeReducer) || "";
  const { showUnsave, unSaveGeom } =
    useSelector((state) => state.unSaveReducer) || false;

  const openEditModal = (nodeData) => {
    setCurrentNode({ ...nodeData });
    setEditItemType(nodeData.children ? "Map" : "Layer");
    setShowEditModal(true);
  };

  const handleDelete = (nodeData) => {
    const userConfirm = window.confirm(
      `Are you sure to delete this ${nodeData.children ? "map" : "layer"}`
    );
    if (userConfirm) {
      if (nodeData.children) {
        // delete map
        AXIOS_INSTANCE.delete(`${BASE_URL}/map?mapID=${nodeData.key}`).then(
          (res) => {
            dispatch(fetchLayerTree());
            message.success("Delete Successfully");
          }
        );
      } else {
        // delete layer
        AXIOS_INSTANCE.delete(`${BASE_URL}/layer?layerID=${nodeData.key}`).then(
          (res) => {
            dispatch(fetchLayerTree());
            message.success("Delete Successfully");
          }
        );
      }
    }
  };

  useEffect(() => {
    dispatch(fetchLayerTree());
    // const localUnsave = JSON.parse(localStorage.getItem("unsave")) || []
    // dispatch({ type: SET_UNSAVE, payload: localUnsave })
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setTreeData(data);
      const initRTree = new RBush(size(data.features));
      dispatch({ type: SET_R_TREE, payload: initRTree });
    }
  }, [data]);

  useEffect(() => {
    if (tree) {
      const mouseBound = {
        minX: mousePosition[0] - 0.0005 * (18 - 13),
        minY: mousePosition[1] - 0.0005 * (18 - 13),
        maxX: mousePosition[0] + 0.0005 * (18 - 13),
        maxY: mousePosition[1] + 0.0005 * (18 - 13),
      };
      const searchResult = tree.search(mouseBound);
      let midPoints = [];
      map(searchResult, (item) => {
        const coordinates = get(item, "geom.geometry.coordinates", []);
        // Case Polygon
        if (size(coordinates) === 1) {
          for (let i = 0; i < size(coordinates[0]) - 1; i++) {
            const midPoint = getMidPoint(
              coordinates[0][i],
              coordinates[0][i + 1]
            );
            midPoints.push(midPoint);
          }
        } else if (size(coordinates) > 1 && size(coordinates[0] > 1)) {
          for (let i = 0; i < size(coordinates) - 1; i++) {
            const midPoint = getMidPoint(coordinates[i], coordinates[i + 1]);
            midPoints.push(midPoint);
          }
        }
      });

      if (size(midPoints) > 0) {
        const midPointNearest = getMidPointNearest(mousePosition, midPoints);
        dispatch({ type: SET_MID_POINT, payload: midPointNearest });
      } else {
        dispatch({ type: SET_MID_POINT, payload: null });
      }
    }
  }, [mousePosition]);

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeys) => {
    setCheckedKeys(checkedKeys);
    AXIOS_INSTANCE.get(
      `${BASE_URL}/data?layerId=${checkedKeys.join(",")}`
    ).then((res) => {
      dispatch({ type: FETCH_LAYER_DATA, payload: res.data });
    });
  };

  const handleClearTree = () => {
    dispatch({ type: CLEAR_LAYER_DATA });
    setCheckedKeys([]);
    setSelectedKeys([]);
  };

  const handleClickLayer = (nodeData) => {
    if (!nodeData.children) {
      setCheckedKeys([...checkedKeys, nodeData.key]);
      onCheck([...checkedKeys, nodeData.key]);
      dispatch({ type: SET_CURRENT_EDIT_LAYER, payload: nodeData.key });
      dispatch(fetchLayerCols(nodeData.key));
    }
  };

  const toggleUnsave = () => {
    dispatch({
      type: TOGGLE_UNSAVE,
      payload: !showUnsave,
    });
  };

  const renderTreeItem = (nodeData) => {
    const menu = (
      <Menu style={{ width: 150, zIndex: 10000 }}>
        {/* {nodeData.children && (
          <Menu.Item key="1" onClick={() => openAddLayerModal(nodeData)}>
            Add Layer
          </Menu.Item>
        )} */}
        <Menu.Item key="2" onClick={() => openEditModal(nodeData)}>
          Edit
        </Menu.Item>
        {/* {!nodeData.children && <Menu.Item key="2" onClick={() => handleChangeMap(nodeData)}>Move</Menu.Item>} */}
        <Menu.Item key="3" onClick={() => handleDelete(nodeData)}>
          Delete
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div
          className={`site-dropdown-context-menu ${
            currentEditLayer === nodeData.key ? "active" : ""
          }`}
          onClick={() => handleClickLayer(nodeData)}
        >
          {nodeData.title}
        </div>
      </Dropdown>
    );
  };

  return (
    <>
      <div
        style={{
          marginBottom: 20,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridGap: 10,
        }}
      >
        <Button onClick={handleClearTree}>Clear All Layers</Button>
        <Button
          type="primary"
          onClick={toggleUnsave}
          disabled={unSaveGeom.length === 0}
        >
          {showUnsave ? "Hide" : "Show"} Unsave
        </Button>
      </div>
      <EditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editItemType={editItemType}
        currentNode={currentNode}
        treeData={treeData}
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
        selectedKeys={selectedKeys}
      />
    </>
  );
};

export default LayerTree;

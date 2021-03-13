import React, { useState, useEffect } from "react";
import { Tree } from "antd";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { FETCH_LAYER_DATA, FETCH_LAYER_TREE } from "../../constants/actions";
import { BASE_URL } from "../../constants/endpoint";

const LayerTree = () => {
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const dispatch = useDispatch();

  const data = useSelector((state) => state.treeReducer.layerTree) || null;

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
    // dispatch({type: CLEAR_LAYER_DATA, payload: {} })
    setCheckedKeys(checkedKeys);
    axios
      .get(`${BASE_URL}/data?layerId=${checkedKeys.join(",")}`)
      .then((res) => {
        dispatch({ type: FETCH_LAYER_DATA, payload: res.data });
      });
  };

  // const onSelect = (selectedKeys, info) => {
  // console.log('onSelect', info);
  // setSelectedKeys(selectedKeys);
  // };

  return (
    // {
    <Tree
      treeData={treeData}
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      // onSelect={onSelect}
      selectedKeys={selectedKeys}
    />
    // }
  );
};

export default LayerTree;

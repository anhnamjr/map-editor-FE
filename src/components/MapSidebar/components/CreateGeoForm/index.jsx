import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Empty,
  Typography,
  message,
  Tooltip,
  Divider
} from "antd";
import InputColor from "../../../InputColor";
import { useSelector, useDispatch } from "react-redux";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { BASE_URL } from "../../../../constants/endpoint";
import "rc-color-picker/assets/index.css";
import "leaflet.pm";
import "leaflet.pm/dist/leaflet.pm.css";
import { DeleteFilled } from "@ant-design/icons"
import { get, uniq, without, omit, isEmpty } from "lodash";
import {
  STORE_SHAPE_REF,
  SET_EDIT,
  SET_NOT_EDIT,
  SET_PROPERTIES,
  REMOVE_FROM_UNSAVE,
  UPDATE_LAYER_DATA,
  ADD_LAYER_DATA,
  RESET_GEOM_DATA,
  UPDATE_UNSAVE_LAYER_DATA,
  DELETE_GEOM,
  CLEAR_UNSAVE,
  CLEAR_SHAPE_REF,
  UPDATE_FROM_UNSAVE
} from "../../../../constants/actions";
import "./styles.scss";
import Restful from "../../../../service/Restful";

const { Option, OptGroup } = Select;
const { Text } = Typography;

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const types = ["Line", "Polygon", "Marker"];

const AddForm = () => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const mapList = useSelector((state) => state.treeReducer.layerTree) || null;
  const currentLayerId = useSelector(
    (state) => state.treeReducer.currentEditLayer
  );
  const { unSaveGeom } = useSelector((state) => state.unSaveReducer)
  const { geom = null, isEditing } = useSelector((state) => state.storeGeom);
  const layerCols = useSelector((state) => state.treeReducer.currentLayerCol);
  const color = useSelector((state) => state.colorReducer);
  const { deletedGeomId, editedGeomId, layerData } = useSelector((state) => state.layerReducer)
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  var geoID = null;

  if (geom && geom.properties) {
    geoID = geom.properties.geoID ? geom.properties.geoID : null;
  }

  const onEditCoordinate = () => {
    dispatch({
      type: SET_EDIT,
    });
  };

  const onSaveCoordinate = () => {
    if (typeof geom.properties.geoID === "number") {
      dispatch({
        type: UPDATE_UNSAVE_LAYER_DATA,
        payload: { geom },
      });
    } else {
      dispatch({
        type: UPDATE_LAYER_DATA,
        payload: { geom },
      });
    }
    dispatch({
      type: SET_NOT_EDIT,
    });
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    if (typeof geom.properties.geoID !== "number") {
      dispatch({
        type: DELETE_GEOM,
        payload: geom.properties.geoID
      });
    } else {
      dispatch({
        type: RESET_GEOM_DATA
      });
      dispatch({
        type: CLEAR_SHAPE_REF
      });
      dispatch({
        type: REMOVE_FROM_UNSAVE,
        payload: geom.properties.geoID,
      });
      setDeleteLoading(false);
    }
  };

  const onSave = (values) => {
    setSaveLoading(true);
    if (typeof geom.properties.geoID === "number") {
      const newValues = { ...values, radius: geom.properties.radius };
      AXIOS_INSTANCE.post(`${BASE_URL}/geom`, { properties: newValues }).then(
        (res) => {
          setSaveLoading(false);
          message.success(res.data.msg);
          form.resetFields();
          dispatch({
            type: ADD_LAYER_DATA,
            payload: res.data.geom.geom.features[0],
          });
          dispatch({
            type: STORE_SHAPE_REF,
            payload: "",
          });
          dispatch({
            type: SET_NOT_EDIT,
          });
          dispatch({
            type: REMOVE_FROM_UNSAVE,
            payload: geoID,
          });
        }
      );
    } else {
      let properties = {
        ...values,
        radius: geom.properties.radius,
      };
      properties = omit(properties, ["layerID", "geometry"]);
      const newValues = {
        properties,
        geoID: geom.properties.geoID,
        layerID: values.layerID,
        geometry: values.geometry,
      };

      AXIOS_INSTANCE.put(`${BASE_URL}/geom`, newValues).then((res) => {
        setSaveLoading(false);
        message.success(res.data.msg);
        form.resetFields();
        dispatch({
          type: UPDATE_LAYER_DATA,
          payload: { geom },
        });
        dispatch({
          type: STORE_SHAPE_REF,
          payload: "",
        });
        dispatch({
          type: SET_NOT_EDIT,
        });
        dispatch({
          type: RESET_GEOM_DATA,
        });
      });
    }
  };

  useEffect(() => {
    const obj = Object.values(layerCols.map((item) => item.column_name));
    let a = {};
    obj.forEach((item) => {
      a[item] = get(geom, `properties['${item}']`, "");
    });
    form.setFieldsValue({
      ...a,
      geometry: JSON.stringify(geom ? geom.geometry : ""),
      layerID: currentLayerId,
      fill: color.fill,
      color: color.color,
      weight: color.weight,
      fillOpacity: color.fillOpacity,
    });
  }, [geom, form, color, currentLayerId, layerCols]);

  const handleChangeDefaultProps = (name, val) => {
    dispatch({
      type: SET_PROPERTIES,
      payload: { [name]: val }
    })
  }

  const handleOptionalChange = (name, val, type) => {
    if (type === "numeric") {
      form.setFieldsValue({ [name]: val })
      geom.properties[name] = val
      handleChangeDefaultProps(name, val)
    } else {
      form.setFieldsValue({ [name]: val.target.value })
      geom.properties[name] = val.target.value
      handleChangeDefaultProps(name, val.target.value)
    }
  }

  const handleSaveLayer = async () => {
    setSaveLoading(true)
    if (!isEmpty(unSaveGeom)) {
      const data1 = await Restful.post(`${BASE_URL}/geom`, {
        arrGeom: unSaveGeom
      })
      dispatch({ type: UPDATE_FROM_UNSAVE, payload: data1.geom.geom.features });
      dispatch({ type: CLEAR_UNSAVE });
      localStorage.setItem("unsave", JSON.stringify([]))
    }
    if (!isEmpty(deletedGeomId)) {
      const data2 = await Restful.delete(`${BASE_URL}/geom`, { layerID: currentLayerId, geoID: deletedGeomId.join(",") });
    }
    const onlyEdited = uniq(without(editedGeomId, ...deletedGeomId));
    const editedGeom = layerData.features.filter(item => onlyEdited.indexOf(item.properties.geoID) !== -1)
    if (editedGeom.length > 0) {
      const data3 = await Restful.put(`${BASE_URL}/geom`, { arrGeom: editedGeom })
    }
    setSaveLoading(false)

  }

  return currentLayerId ? (
    <>
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>
        <Button loading={saveLoading} type="primary" onClick={handleSaveLayer}>Save Layer Data</Button>
      </div>
      <Divider />
      <h2 style={{ textAlign: "center" }}>Geom Detail</h2>
      <Form
        form={form}
        {...layout}
        name="basic"
        labelAlign="left"
        initialValues={{
          remember: true,
          categoryID: types[0],
          color: "#333",
          description: "",
        }}
        style={{ marginTop: 20 }}
        onFinish={onSave}
        className="geom-form"
      // onValuesChange={handleValuesChange}
      >
        <Form.Item label="Layer" name="layerID">
          <Select disabled style={{ width: "100%" }}>
            {mapList &&
              mapList.map((item) => (
                <OptGroup key={item.key} label={item.title}>
                  {item.children.length !== 0 &&
                    item.children.map((child) => (
                      <Option key={child.key} value={child.key}>
                        {child.title}
                      </Option>
                    ))}
                </OptGroup>
              ))}
          </Select>
        </Form.Item>
        {geom.geometry ? (
          <>
            {layerCols.map((col, idx) => {
              if (col.column_name !== "layerID") {
                return (
                  <Form.Item label={col.column_name} key={idx} name={col.column_name}>
                    {col.data_type === "numeric" ? (
                      <InputNumber disabled={isEditing}
                        value={geom.properties[col.column_name]}
                        onChange={(val) => handleOptionalChange([col.column_name], val, col.data_type)}
                      />
                    ) : (
                        <Input disabled={isEditing}
                          value={geom.properties[col.column_name]}
                          onChange={(val) => handleOptionalChange([col.column_name], val, col.data_type)}
                        />
                      )}
                  </Form.Item>
                )
              }
            })}

            <Form.Item label="Geom" name="geometry">
              <Input.TextArea disabled />
            </Form.Item>
            <Form.Item label="Fill Color" name="fill">
              <InputColor
                isEditing={isEditing}
                color={color.fill}
                onChange={(val) => handleChangeDefaultProps("fill", val.color)}
              />
            </Form.Item>
            <Form.Item label="Color" name="color">
              <InputColor
                isEditing={isEditing}
                color={color.color}
                onChange={(val) => handleChangeDefaultProps("color", val.color)}
              />
            </Form.Item>
            <Form.Item label="Weight" name="weight">
              <InputNumber
                disabled={isEditing}
                className="form-item-color"
                min={1}
                max={5}
                step={1}
                onChange={(val) => handleChangeDefaultProps("weight", val)}
              />
            </Form.Item>
            <Form.Item label="Fill Opacity" name="fillOpacity">
              <InputNumber
                disabled={isEditing}
                className="form-item-color"
                min={0.1}
                max={1}
                step={0.1}
                onChange={(val) => handleChangeDefaultProps("fillOpacity", val)}
              />
            </Form.Item>
            {/* <Form.Item {...tailLayout}>
              <Button type="primary" style={{ marginRight: "10px" }} onClick={onEdit}>
                Edit
        </Button>
              <Button type="primary" htmlType="submit">
                Save
        </Button>
            </Form.Item> */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Tooltip title="Delete">
                <Button
                  type="primary"
                  onClick={handleDelete}
                  danger
                >
                  <DeleteFilled />
                </Button>
              </Tooltip>
            </div>
          </>
        ) : null}
      </Form>
    </>
  ) : (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<Text>Vui lòng chọn layer</Text>}
      />
    );
};

export default AddForm;

import React, { useEffect } from "react";
import { Form, Input, Button, Select, InputNumber, Empty, Typography, message } from "antd";
import InputColor from "../../../InputColor"
import { useSelector, useDispatch } from "react-redux";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { BASE_URL } from "../../../../constants/endpoint";
import "rc-color-picker/assets/index.css";
import "leaflet.pm";
import "leaflet.pm/dist/leaflet.pm.css";
import {
  SET_FILL_COLOR,
  STORE_SHAPE_REF,
  SET_EDIT,
  SET_NOT_EDIT,
  SET_COLOR,
  SET_WEIGHT,
  SET_FILL_OPACITY,
  REMOVE_FROM_UNSAVE,
  UPDATE_LAYER_DATA
} from "../../../../constants/actions";
import "./styles.css";

const { Option, OptGroup } = Select;
const { Text } = Typography

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const types = ["Line", "Polygon", "Marker"];

const AddForm = () => {
  const mapList = useSelector((state) => state.treeReducer.layerTree) || null;
  const currentLayerId = useSelector((state) => state.treeReducer.currentEditLayer);
  const { geom = null } = useSelector((state) => state.storeGeom);
  const layerCols = useSelector((state) => state.treeReducer.currentLayerCol);
  const color = useSelector((state) => state.colorReducer);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  var geoID = null;

  if (geom && geom.properties) {
    geoID = geom.properties.geoID ? geom.properties.geoID : null;
  }

  const onEdit = () => {
    dispatch({
      type: SET_EDIT
    });
  };

  const onSave = (values) => {
    // let newGeom = JSON.parse(values.geom);
    // const params = {
    //   ...values,
    //   // color: values.color.color || values.color || '#FF00FF',
    //   geom: JSON.stringify(geom),
    // };

    // if (newGeom.type === "Point" && newGeom.properties.radius) {
    //   params.radius = newGeom.properties.radius;
    // }
    AXIOS_INSTANCE.post(`${BASE_URL}/geom`, { properties: values }).then((res) => {
      message.success(res.data.msg);
      form.resetFields()
      dispatch({
        type: UPDATE_LAYER_DATA,
        payload: res.data.geom.geom.features[0]
      })
      dispatch({
        type: STORE_SHAPE_REF,
        payload: ""
      });
      dispatch({
        type: SET_NOT_EDIT
      })
      dispatch({
        type: REMOVE_FROM_UNSAVE,
        payload: geoID
      })
    });
    form.resetFields()
  };

  useEffect(() => {
    const obj = Object.values(layerCols.map(item => item.column_name))
    let a = {}
    obj.forEach(item => {
      a[item] = "hello"
    })
    form.setFieldsValue({
      ...a,
      geometry: JSON.stringify(geom ? geom.geometry : ""),
      layerID: currentLayerId,
      fill: color.fill,
      color: color.color,
      weight: color.weight,
      fillOpacity: color.fillOpacity
    });
  }, [geom, form, color, currentLayerId, layerCols]);

  const onFinish = (values) => {
    let newGeom = JSON.parse(values.geom);
    const params = {
      ...values,
      // color: values.color.color || values.color || '#FF00FF',
      geom: JSON.stringify(geom),
    };

    if (newGeom.type === "Point" && newGeom.properties.radius) {
      params.radius = newGeom.properties.radius;
    }

    AXIOS_INSTANCE.post(`${BASE_URL}/geom`, {}).then((res) => {
      alert(res.data.msg);
      // form.resetFields()
    });
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {

  };

  const onChangeFillColor = (color) => {
    dispatch({ type: SET_FILL_COLOR, payload: color.color })
  }

  const onChangeColor = (color) => {
    dispatch({ type: SET_COLOR, payload: color.color })
  }

  const onChangeWeight = (value) => {
    dispatch({ type: SET_WEIGHT, payload: value })
  }

  const onChangeFillOpacity = (value) => {
    dispatch({ type: SET_FILL_OPACITY, payload: value })
  }

  return (
    currentLayerId ? (
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
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Layer"
          name="layerID"
        >
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

            {layerCols.map((col, idx) => (
              <Form.Item label={col.column_name} key={idx} name={col.column_name} >
                {col.data_type === "numeric" ? (
                  <InputNumber />
                ) : (
                  <Input />
                )}
              </Form.Item>
            ))}

            <Form.Item label="Geom" name="geometry">
              <Input.TextArea disabled />
            </Form.Item>
            <Form.Item label="Fill Color" name="fill">
              <InputColor color={color.fill} onChange={onChangeFillColor} />
            </Form.Item>
            <Form.Item label="Color" name="color">
              <InputColor color={color.color} onChange={onChangeColor} />
            </Form.Item>
            <Form.Item label="Weight" name="weight">
              <InputNumber className="form-item-color" min={1} max={5} step={1} onChange={onChangeWeight} />
            </Form.Item>
            <Form.Item label="Fill Opacity" name="fillOpacity">
              <InputNumber className="form-item-color" min={0.1} max={1} step={0.1} onChange={onChangeFillOpacity} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" style={{ marginRight: "10px" }} onClick={onEdit}>
                Edit
        </Button>
              <Button type="primary" htmlType="submit">
                Save
        </Button>
            </Form.Item>
          </>
        ) : null}
      </Form>
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text>Vui lòng chọn layer</Text>} />
    )
  );
};

export default AddForm;

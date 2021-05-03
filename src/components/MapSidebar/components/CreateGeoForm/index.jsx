import React, { useEffect } from "react";
import { Form, Input, Button, Select, InputNumber } from "antd";
import InputColor from "../../../InputColor";
import { useSelector, useDispatch } from "react-redux";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { BASE_URL } from "../../../../constants/endpoint";
import "rc-color-picker/assets/index.css";
import "leaflet.pm";
import "leaflet.pm/dist/leaflet.pm.css";
import { FaLocationArrow } from "react-icons/fa";
import {
  SET_FILL_COLOR,
  STORE_SHAPE_REF,
  SET_EDIT,
  SET_NOT_EDIT,
  SET_COLOR,
} from "../../../../constants/actions";

const { Option, OptGroup } = Select;

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
  const mapList = useSelector((state) => state.treeReducer.layerTree) || null;
  const { geom = null } = useSelector((state) => state.storeGeom);
  const { currentEditLayer } = useSelector((state) => state.treeReducer) || "";
  // const { shapeRef = null } = useSelector((state) => state.storeShapeRef);
  const [form] = Form.useForm();
  var geoID = null;

  const color = useSelector((state) => state.colorReducer);
  const dispatch = useDispatch();

  if (geom && geom.properties) {
    geoID = geom.properties.geoID ? geom.properties.geoID : null;
  }

  const onEdit = () => {
    dispatch({
      type: SET_EDIT,
    });
  };

  const onSave = (values) => {
    dispatch({
      type: STORE_SHAPE_REF,
      payload: "",
    });
    dispatch({
      type: SET_NOT_EDIT,
    });
    console.log(values);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue({
      geom: JSON.stringify(geom ? geom.geometry : ""),
      category: geom && geom.geometry ? geom.geometry.type : "",
      layer:
        geom && geom.properties && geom.properties.layerID
          ? geom.properties.layerID
          : currentEditLayer,
      geoName: geom && geom.properties ? geom.properties.geoName : "",
      description: geom && geom.properties ? geom.properties.description : "",
      fill: color.fill || "#333",
      color: color.color || "#333",
      weight: color.weight || 3,
    });
  }, [geom, form, currentEditLayer, color]);

  // const onCreateGeom = () => {

  // }
  // }, [geom, form, color]);

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

    AXIOS_INSTANCE.post(`${BASE_URL}/create-geom`, params).then((res) => {
      alert(res.data.msg);
      // form.resetFields()
    });
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onChangeFillColor = (color) => {
    dispatch({ type: SET_FILL_COLOR, payload: color.color });
  };

  const onChangeColor = (color) => {
    dispatch({ type: SET_COLOR, payload: color.color });
  };

  return (
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
      style={{ marginTop: 20, marginRight: 10 }}
      onFinish={onSave}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Layer"
        name="layer"
        rules={[
          {
            required: true,
            message: "Please choose layer!",
          },
        ]}
      >
        <Select style={{ width: "100%" }}>
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
      <Form.Item
        label="Name"
        name="geoName"
        rules={[
          {
            required: true,
            message: "Please input name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Type"
        name="category"
        rules={[
          {
            required: true,
            message: "Please input type!",
          },
        ]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Geom" name="geom">
        <Input.TextArea disabled />
      </Form.Item>
      .
      <Form.Item label="Fill Color" name="fill">
        <InputColor color={color.fill} onChange={onChangeFillColor} />
      </Form.Item>
      <Form.Item label="Color" name="color">
        <InputColor color={color.color} onChange={onChangeColor} />
      </Form.Item>
      <Form.Item label="Weight" name="weight">
        <InputNumber />
      </Form.Item>
      {/* <Form.Item> */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Button
          style={{ marginBottom: "10px" }}
          type="primary"
          onClick={onEdit}
        >
          <FaLocationArrow style={{ marginRight: "10px" }} /> Edit Coordinates
        </Button>
        <Button type="primary" htmlType="submit">
          {geom && geom.properties && typeof geom.properties.geoID === "string"
            ? "Save"
            : "Create"}
        </Button>
      </div>
      {/* </Form.Item> */}
    </Form>
  );
};

export default AddForm;

import React, { useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AXIOS_INSTANCE } from "../../../../config/requestInterceptor";
import { BASE_URL } from "../../../../constants/endpoint";
import "rc-color-picker/assets/index.css";
import "leaflet.pm";
import "leaflet.pm/dist/leaflet.pm.css";
import { STORE_SHAPE_REF } from "../../../../constants/actions";

const { Option, OptGroup } = Select;

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

const AddForm = ({ map }) => {
  const mapList = useSelector((state) => state.treeReducer.layerTree) || null;
  const { geom = null } = useSelector((state) => state.storeGeom);
  const { shapeRef = null } = useSelector((state) => state.storeShapeRef);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  var geoID = null;
  var layerItem = null;

  console.log("Add form")

  if (geom && geom.properties) {
    geoID = geom.properties.geoID ? geom.properties.geoID : null;
  }

  const onEdit = () => {
    dispatch({
      type: STORE_SHAPE_REF,
      payload: geom.properties.geoID
    });
  };

  const onSave = (e) => {
    dispatch({
      type: STORE_SHAPE_REF,
      payload: ""
    });

    // if (geoID) {
    //   AXIOS_INSTANCE.post("/edit-geom", {
    //     editedGeom
    //   })
    //     .then(res => {
    //       message.success("Edit successfully!")
    //     })
    // } else {
    //   AXIOS_INSTANCE.post("/create-geom", {
    //     editedGeom
    //   })
    //     .then(res => {
    //       message.success("Edit successfully!")
    //       shapeRef._layer.remove()
    //     })
    // }

    // form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue({
      geom: JSON.stringify(geom ? geom.geometry : ""),
      category: geom && geom.geometry ? geom.geometry.type : "",
      layer: geom && geom.properties ? geom.properties.layerID : "",
      geoName: geom && geom.properties ? geom.properties.geoName : "",
      description: geom && geom.properties ? geom.properties.description : "",
    });
  }, [geom, form]);

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
      style={{ marginTop: 20 }}
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

      <Form.Item {...tailLayout}>
        {/* <Button type="primary" htmlType="submit">
          Create
        </Button> */}
        <Button type="primary" style={{ marginRight: "10px" }} onClick={onEdit}>
          Edit
        </Button>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        {/* {geoID && (
          <>
           
          </>
        )} */}
      </Form.Item>
    </Form>
  );
};

export default AddForm;

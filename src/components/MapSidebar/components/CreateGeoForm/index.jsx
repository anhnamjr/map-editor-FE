import React, { useEffect, useContext } from "react";
import { Form, Input, Button, Select } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../../../constants/endpoint";
import "rc-color-picker/assets/index.css";
import { ShapeContext } from "../../../../context/ShapeContext";
import L from "leaflet";
import "leaflet.pm";
import "leaflet.pm/dist/leaflet.pm.css";
// import {useLeaflet} from "react-leaflet"

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
  const { shapeItem } = useContext(ShapeContext);
  const [form] = Form.useForm();
  var geoID = null;
  var layerItem = null;

  if (shapeItem && shapeItem.properties) {
    geoID = shapeItem.properties.geoID ? shapeItem.properties.geoID : null;
  }

  const onEdit = () => {
    const mymap = map.current.leafletElement;
    layerItem = new L.GeoJSON(shapeItem, {
      pointToLayer: (feature, latlng) => {
        if (feature.properties.radius) {
          return new L.Circle(latlng, feature.properties.radius);
        } else {
          return new L.Marker(latlng);
        }
      },
    }).addTo(mymap);
    layerItem.pm.enable();
  };

  const onSave = (e) => {
    window.confirm("Are you sure to delete a entry?")
    // API call here
    layerItem.pm.disable();
    layerItem.remove()
  };

  useEffect(() => {
    const { type = "Line" } = geom;
    form.setFieldsValue({
      geom: JSON.stringify(geom),
      categoryID: type,
    });
  }, [geom, form]);

  const onFinish = (values) => {
    let newGeom = JSON.parse(values.geom);
    const params = {
      ...values,
      color: values.color.color || values.color,
      geom: JSON.stringify(geom),
    };

    if (newGeom.type === "Point" && newGeom.properties.radius) {
      params.radius = newGeom.properties.radius;
    }

    axios.post(`${BASE_URL}/data`, params).then((res) => {
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
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Layer"
        name="layerID"
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
        name="categoryID"
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
        {geoID && (
          <>
            <Button type="primary" onClick={onEdit}>
              Edit
            </Button>
            <Button type="primary" onClick={onSave}>
              Save
            </Button>
          </>
        )}
      </Form.Item>
    </Form>
  );
};

export default AddForm;

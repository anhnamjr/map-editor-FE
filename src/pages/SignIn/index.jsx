import React, { useEffect } from "react";
import "./style.css";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { AUTH_URL } from "../../constants/endpoint";

export default function SignIn() {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    if (token) {
      history.push("/");
    }
  }, []);

  const onFinish = (values) => {
    axios
      .post(`${AUTH_URL}/sign-in`, values)
      .then((res) => {
        const { token } = res.data;
        localStorage.setItem("token", token);
        history.push("/");
        console.log("Redirect");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <h1>Sign in</h1>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <Link to="/signup">register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
}

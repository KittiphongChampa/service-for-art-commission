import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../css/indexx.css";
import "../css/allbutton.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
// import Navbar from "../components/Navbar";
import BgBody from "../components/BgBody";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../alertdata/alertData";
import {NavbarGuest} from "../components/Navbar";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { AuthProvider, useAuth } from "../context/AuthContext";

import { host } from "../utils/api";


const title = "เข้าสู่ระบบ";
const bgImg = "url('images/mainmoon.jpg')";
const body = { backgroundImage: bgImg };

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/");
    }
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${host}/login`, {
        email: values.email,
        password: values.password
      });
      const data = response.data;
      if (data.status === 'ok') {
        login(data);
        localStorage.setItem('token', data.token);
        navigate(data.type === 'admin' ? '/admin' : '/');
      } else if (data.status === 'hasDelete') {
        alert(data.message);
      } else {
        Swal.fire({ ...alertData.LoginError }).then(() => {
          window.location.reload(false);
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('เกิดปัญหาการ login');
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="body-con">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <NavbarGuest />
      <div className="body" style={body}>
        <div className="container-xl">
          <div className="login-soloCard">
            <div className="login-col-img">
              <img className="login-img" src="images/ภาพตัด.png" alt="" />
            </div>
            <div className="login-col-text">
              <div className="input-login-box">
                <h1>เข้าสู่ระบบ </h1>
                <Form
                  layout="vertical"
                  name="login"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="อีเมล"
                    name="email"
                    id="email"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกอีเมล",
                      },
                      {
                        type: "email",
                        message: "กรุณากรอกอีเมล"
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="รหัสผ่าน"
                    name="password"
                    id="password"
                    className="to"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกรหัสผ่าน",
                      },
                      { type: "password" },
                    ]}
                  >
                    <Input.Password style={{ borderRadius: "1rem", padding:"0.5rem 1rem"}}/>
                  </Form.Item>
                  <div className="text-align-right">
                    <a href="/forgot-password">ลืมรหัสผ่าน</a>
                  </div>
                  <div className="login-btn-group">
                    <Button htmlType="submit" type="primary" shape="round" size="large">เข้าสู่ระบบ</Button>
                    <a href="/verify">สมัครสมาชิก</a>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { NavbarGuest } from "../components/Navbar";
import { Button, Space, Form, Input, Checkbox, Flex, Col, Row } from "antd";

import "../css/indexx.css";
import "../css/allbutton.css";
//import { Button } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../alertdata/alertData";
import { host } from "../utils/api";


const title = "เปลี่ยนรหัสผ่าน";
const bgImg = "url('images/mainmoon.jpg')";
const body = { backgroundImage: bgImg };

const toastOptions = {
  position: "bottom-right",
  autoClose: 1000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");
  // useEffect(() => {
  //   getAPI();
  // }, []);
  // const getAPI = async () => {
  //   await axios
  //     .get("http://localhost:3333/reset-password/:token")
  //     .then((response) => {
  //       const data = response.data;
  //       if (data.status === "ok") {
  //         alert(data.message);
  //       } else {
  //         alert(data.message);
  //       }
  //     });
  // };

  // const userId = new URLSearchParams(location.search).get("userId");

  //mint
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
  } = useForm();


  const changePassword = async (values) => {
    console.log(values.newPassword);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("newPassword", values.newPassword);
    await axios
      .put(`${host}/reset-password`, formData, {})
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          Swal.fire({ ...alertData.changePassIsConfirmed }).then(() => {
            window.location = "/login";
          })
          // alert(data.message);
          // navigate("/login");
        } else {
          toast.error(data.message, toastOptions);
        }
      });
  };
  const [form] = Form.useForm();

  return (
    <>
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
                  <h1>{title} </h1>
                  {/* <form onSubmit={handleSubmit(changePassword)}>
                    <label className="onInput">รหัสผ่านใหม่</label>
                    <input
                      {...register("newPassword", { required: true, minLength: 8 })}
                      type="password"
                      className={`defInput ${errors.newPassword ? "border-danger" : ""
                        }`}
                    />
                    {errors.newPassword &&
                      errors.newPassword.type === "minLength" && (
                        <p className="validate-input">
                          รหัสผ่านใหม่ตัวอักษรไม่ต่ำกว่า 8 ตัว
                        </p>
                      )}

                    <label className="onInput">ยืนยันรหัสผ่านใหม่</label>
                    <input
                      {...register("verifyPassword", {
                        required: true,
                        validate: {
                          passwordEqual: (value) =>
                            value === getValues().newPassword || "รหัสผ่านไม่ตรงกัน",
                        },
                      })}
                      type="password"
                      className={`defInput ${errors.verifyPassword ? "border-danger" : ""
                        }`}
                    />
                    {errors.verifyPassword &&
                      errors.verifyPassword.type === "passwordEqual" && (
                        <p className="validate-input">
                          {errors.verifyPassword.message}
                        </p>
                      )}
                    <div className="text-align-center">
                      <button className={`gradiant-btn`} type="submit">
                        เปลี่ยนรหัสผ่าน
                      </button>
                    
                    </div>

                  </form> */}
                  <Form
                    onFinish={changePassword}
                    name="submit"
                    form={form}
                    layout="vertical"
                  >
                    <Form.Item
                      label="รหัสผ่าน"
                      name="newPassword"
                      id="newPassword"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกรหัสผ่าน",
                        },
                        {
                          min: 8,
                          message: "กรุณากรอกรหัสผ่านอย่างน้อย 8 ตัว",
                        },
                        { type: "password" },
                      ]}
                    >
                      <Input.Password style={{ borderRadius: "1rem", padding: "0.5rem 1rem" }} />
                    </Form.Item>

                    {/* Field */}
                    <Form.Item
                      label="ยืนยันรหัสผ่าน"
                      name="verifyPassword"
                      dependencies={['newPassword']}
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกรหัสผ่าน",
                        },
                        { type: "password" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password style={{ borderRadius: "1rem", padding: "0.5rem 1rem" }} />
                    </Form.Item>

                    <Flex justify="center">
                      <Button htmlType="submit" shape="round" size="large" type="primary">เปลี่ยนรหัสผ่าน</Button>
                    </Flex>
                  </Form>


                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

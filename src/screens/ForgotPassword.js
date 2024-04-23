import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import DefaultInput from "../components/DefaultInput";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../alertdata/alertData";
import { host } from "../utils/api";
import { NavbarGuest } from "../components/Navbar";
import { Button, Space, Form, Input } from "antd";

const toastOptions = {
  position: "bottom-right",
  autoClose: 1000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export default function ForgotPassword() {
  const title = "ลืมรหัสผ่าน";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [values, setValues] = useState({
    email: "",
    otp: "",
  });
  console.log(values);

  // const handleChange = (event) => {
  //   setValues({ ...values, [event.target.name]: event.target.value });
  // };
  const handleChangeEmail = (event) => {
    setValues({ ...values, email: event.target.value });
    // console.log(event.target.value)
  };

  const handleChangeOtp = (event) => {
    setValues({ ...values, otp: event.target.value });
    // console.log(event.target.value)
  };

  const handleValidationOTP = () => {
    const { otp } = values;
    if (otp === "") {
      toast.error("otp is required", toastOptions);
      return false;
    }
    return true;
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitotp = async () => {
    setIsLoading(true);
    const { email } = values;
    try {
      await axios
        .post(`${host}/forgot-password`, { email })
        .then((response) => {
          const data = response.data;
          if (data.status === "ok") {
            // alert("ส่งข้อมูลสำเร็จ");
            Swal.fire({ ...alertData.verifyEmainSuccess })
            setIsLoading(false);

          } else {
            Swal.fire({
              title: 'ส่ง otp ล้มเหลว',
              icon: 'error',
              iconColor: 'red',
              confirmButtonText: 'ตกลง'
            })
            setIsLoading(false);
          }
        });
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    // if (handleValidationOTP()) {
    const { otp, email } = values;
    const jsondata = {
      otp,
      email,
    };
    fetch(`${host}/check_otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsondata),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          // Swal.fire({ ...alertData.sendOtpSuccess }).then(() => {
          const queryParams = new URLSearchParams({ email });
          window.location = `/reset-password?${queryParams.toString()}`;
          // })
        } else {
          Swal.fire({ ...alertData.otpisnotcorrect })
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // }
  };
  const bgImg = "url('images/mainmoon.jpg')";

  const body = { backgroundImage: bgImg };

  return (
    <>
      {/* <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Reset password</button>
      </form> */}
      <div className="body-con">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <NavbarGuest />
        <div
          className="body"
          style={body}
        >
          {/* <Navbar /> */}
          <div className="container">
            <div className="login-soloCard">
              <div className="login-col-img">
                <img className="login-img" src="images/ภาพตัด.png" alt="" />
              </div>

              <div className="login-col-text">
                <div className="input-login-box">
                  <h1>{title} </h1>
                  {/* 
                  {isLoading ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Lottie animationData={loading} loop={true} />
                    </div>
                  ) : ( */}

                  {/* <form onSubmit={handleSubmitotp}>
                    <label className="onInput">อีเมล</label>
                    <div className="verify-email">
                      <input
                        id="email"
                        name="email"
                        className="defInput"
                        onChange={(e) => handleChange(e)}
                      />
                      <button type="submit">ส่งรหัสยืนยัน</button>
                    </div>
                  </form> */}
                  <Form
                    layout="vertical"
                    name="subotp"
                    onFinish={handleSubmitotp}
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
                        { type: "email" },
                      ]}
                    >
                      <Space.Compact
                        style={{
                          width: '100%',
                        }}
                      >
                        <Input onChange={(e) => handleChangeEmail(e)} />
                        <Button size="large" htmlType="submit" loading={isLoading}>ส่งรหัสยืนยัน</Button>
                      </Space.Compact>
                    </Form.Item>
                  </Form>

                  {/* <form onSubmit={handleSubmit}>
                    <DefaultInput
                      headding="ใส่รหัสยืนยัน"
                      type="text"
                      id="otp"
                      name="otp"
                      onChange={(e) => handleChange(e)}
                    />
                    <div className="text-align-center">
                      <button
                        className="lightblue-btn disabled-btn"
                        id="submit-otp-btn"
                        disabled
                        type="submit"
                      >
                        เปลี่ยนรหัสผ่าน
                      </button>
                    </div>
                  </form> */}
                  <Form
                    name="verify"
                    layout="vertical"
                    onFinish={handleSubmit}>
                    <Form.Item
                      label="รหัสยืนยัน"
                      id="otp"
                      name="otp"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกรหัสยืนยัน",
                        },
                        { type: "text" },
                      ]}
                    >
                      <Input onChange={(e) => handleChangeOtp(e)} />
                    </Form.Item>
                    <div className="login-btn-group">
                      <Button htmlType="submit" type="primary" shape="round" size="large" disabled={values.otp == '' || values.email == ''}>เปลี่ยนรหัสผ่าน</Button>
                    </div>
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

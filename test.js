import "../css/indexx.css";
import "../css/allbutton.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import DefaultInput from "../components/DefaultInput";

// import Navbar from "../components/Navbar";
import { Button, Space, Form, Input } from "antd";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
// import loading from "../loading.json";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../alertdata/alertData";
import { NavbarUser, NavbarAdmin, NavbarHomepage, NavbarGuest } from "../components/Navbar";
import { host } from "../utils/api";

const toastOptions = {
  position: "bottom-right",
  autoClose: 1000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const theme = createTheme();
const title = "สมัครสมาชิก";
const bgImg = "url('images/mainmoon.jpg')"
const body = { backgroundImage: bgImg }

export default function Verify() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (window.location.pathname === "/verify") {
        navigate("/");
      }
    }
  }, []);

  const [values, setValues] = useState({
    email: "",
    otp: "",
  });

  const handleChangeEmail = (event) => {
    setValues({ ...values, email: event.target.value });
    // console.log(event.target.value)
  };

  const handleChangeOtp = (event) => {
    setValues({ ...values, otp: event.target.value });
    // console.log(event.target.value)
  };

  const handleValidation = () => {
    const { email } = values;
    if (email === "") {
      toast.error("email is required", toastOptions);
      return false;
    }
    return true;
  };

  const handleValidationOTP = () => {
    const { otp } = values;
    if (otp === "") {
      toast.error("otp is required", toastOptions);
      return false;
    }
    return true;
  };

  const [userID, setuserID] = useState('');

  const handleSubmit = async () => {
    if (handleValidationOTP()) {
      const { otp, email } = values;
      const jsondata = {
        otp,
        email,
        userID
      };
      fetch(`${host}/verify/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsondata),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "ok") {
            const queryParams = new URLSearchParams({ email, userID });
            window.location = `/register?${queryParams.toString()}`;
          } else {
            setValues({ ...values, otp: "" });
            Swal.fire({ ...alertData.otpisnotcorrect })
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleSubmitotp = async () => {
    setIsLoading(true);
    if (handleValidation()) {
      const { email } = values;
      const jsondata = {
        email,
      };
      await fetch(`${host}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsondata),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "ok") {
            Swal.fire({ ...alertData.verifyEmainSuccess })
            setuserID(data.insertedUserID);
          } else {
            // alert("Send OTP Failed " + data.message);
            Swal.fire({
              title: 'ส่ง otp ล้มเหลว',
              icon: 'error',
              iconColor: 'red',
              confirmButtonText: 'ตกลง'
            })
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
  }, [values]);


  return (
    <div className="body-con">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <NavbarGuest />
      <div className='body' style={body}>
        <div className="container-xl">
          <div className="login-soloCard">
            <div className="login-col-img">
              <img className="login-img" src="images/ภาพตัด.png" alt="" />
            </div>
            <div className="login-col-text">
              <div className="input-login-box">
                <h1>{title} </h1>
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
                    <Input 
                      onChange={(e) => handleChangeOtp(e)} 
                    />
                  </Form.Item>
                  <div className="login-btn-group">
                    <Button htmlType="submit" type="primary" shape="round" size="large" disabled={values.otp == ''|| values.otp.length < 6 || values.otp.length > 6 || values.email == ''}>ยืนยันอีเมล</Button>
                  </div>
                </Form>
                {/* 
                  {isLoading ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Lottie animationData={loading} loop={true} />
                    </div>
                  ) : ( */}

                {/* <form onSubmit={handleSubmitotp}>
                  <label class="onInput">อีเมล</label>
                  <div className="verify-email">
                    <input
                      id="email"
                      name="email"
                      class="defInput"
                      onChange={(e) => handleChange(e)}
                    />
                    <button type="submit">ส่งรหัสยืนยัน</button>
                  </div>
                </form> */}

                {/* )} */}

                {/* <form onSubmit={handleSubmit}>
                  <DefaultInput
                    headding="ใส่รหัสยืนยัน"
                    type="text"
                    id="otp"
                    name="otp"
                    onChange={(e) => handleChangeOtp(e)}
                  />

                  <div className="text-align-center">
                    <button
                      className="lightblue-btn disabled-btn"
                      id="submit-otp-btn"
                      disabled
                      type="submit"
                    >
                      ยืนยันอีเมล
                    </button>
                  </div>
                </form> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
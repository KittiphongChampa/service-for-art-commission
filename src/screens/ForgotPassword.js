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

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidationOTP = () => {
    const { otp } = values;
    if (otp === "") {
      toast.error("otp is required", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmitotp = async (e) => {
    e.preventDefault();
    const { email } = values;
    try {
      await axios
        .post(`${host}/forgot-password`, { email })
        .then((response) => {
          const data = response.data;
          if (data.status === "ok") {
            // alert("ส่งข้อมูลสำเร็จ");
            toast.success("Send OTP success", toastOptions);
            const submitOtpBtn = document.getElementById("submit-otp-btn");
            submitOtpBtn.classList.remove("disabled-btn");
            submitOtpBtn.removeAttribute("disabled");
            // const queryParams = new URLSearchParams({ email });
            // window.location = `/verify-resetPassword?${queryParams.toString()}`;
            // navigate(`/reset-password?${queryParams.toString()}`);
          } else {
            toast.error(data.message, toastOptions);
          }
        });
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (handleValidationOTP()) {
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
            Swal.fire({ ...alertData.sendOtpSuccess }).then(() => {
              const queryParams = new URLSearchParams({ email });
              window.location = `/reset-password?${queryParams.toString()}`;
            })
          } else {
            toast.error(data.message, toastOptions);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

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

      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div
        className="body"
        style={{
          backgroundImage: "url('images/mainmoon.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* <Navbar /> */}
        <div className="container">
          <div className="login-soloCard">
            <div className="">
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

                <form onSubmit={handleSubmitotp}>
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
                </form>

                <form onSubmit={handleSubmit}>
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

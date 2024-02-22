import "../css/indexx.css";
import "../css/allbutton.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import DefaultInput from "../components/DefaultInput";

// import Navbar from "../components/Navbar";

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
import { NavbarUser, NavbarAdmin, NavbarHomepage, NavbarGuest} from "../components/Navbar";
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
  console.log(values.otp);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
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

  const [userID,setuserID] = useState('');

  const handleSubmitotp = async (event) => {
    event.preventDefault();
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
            const submitOtpBtn = document.getElementById("submit-otp-btn");
            submitOtpBtn.classList.remove("disabled-btn");
            submitOtpBtn.removeAttribute("disabled");
          } else {
            toast.error("Send OTP Failed " + data.message, toastOptions);
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

  const handleSubmit = (event) => {
    event.preventDefault();
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
            Swal.fire({ ...alertData.otpisnotcorrect })
            setValues("");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };



  return (
    <div className="body-con">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <NavbarGuest />
      <div className='body' style={body}>
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

                {/* )} */}

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
                      ยืนยันอีเมล
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
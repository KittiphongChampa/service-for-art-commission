import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

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
  
    const func = {
      register: register,
      errors: errors,
      setValue: setValue,
    };
  const changePassword = async (data) => {
    console.log(data.newPassword);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("newPassword", data.newPassword);
    await axios
      .put(`${host}/reset-password`, formData,{})
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

  const returnLogin = {

  }


  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div class="body" style={body}>
          <div class="container">
              <div class="login-soloCard">
                  <div class="">
                      <img class="login-img" src="images/ภาพตัด.png" alt="" />
                  </div>
                  <div class="login-col-text">
                      <div class="input-login-box">
                          <h1>{title} </h1>
                          <form onSubmit={handleSubmit(changePassword)}>
                            <label class="onInput">รหัสผ่านใหม่</label>
                            <input
                              {...register("newPassword", { required: true, minLength: 8 })}
                              type="password"
                              className={`defInput ${
                                errors.newPassword ? "border-danger" : ""
                              }`}
                            />
                            {errors.newPassword &&
                              errors.newPassword.type === "minLength" && (
                                <p class="validate-input">
                                  รหัสผ่านใหม่ตัวอักษรไม่ต่ำกว่า 8 ตัว
                                </p>
                              )}

                            <label class="onInput">ยืนยันรหัสผ่านใหม่</label>
                            <input
                              {...register("verifyPassword", {
                                required: true,
                                validate: {
                                  passwordEqual: (value) =>
                                    value === getValues().newPassword || "รหัสผ่านไม่ตรงกัน",
                                },
                              })}
                              type="password"
                              className={`defInput ${
                                errors.verifyPassword ? "border-danger" : ""
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
                                {/* <button
                                  className="cancle-btn"
                                  type="button"
                                >
                                  ยกเลิก
                                </button> */}
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

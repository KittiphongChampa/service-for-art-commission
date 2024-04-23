import "../css/allinput.css";
import { useForm } from "react-hook-form";
// import inputSetting from "../function/function";
// import NewInput from "../components/NewInput";
import * as Icon from "react-feather";
import ReactDOM from "react-dom";
import axios from "axios";

import "../css/allinput.css";
import TextareaAutosize from "react-textarea-autosize";
import React, { forwardRef } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../alertdata/alertData";
import { host } from "../utils/api";

const ChangePasswordModal = (props, ref) => {
  const token = localStorage.getItem("token");
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

  const submitChangePassForm = (data) => {
    const formData = new FormData();
    formData.append("oldPassword", data.nowPassword);
    formData.append("newPassword", data.newPassword);
    Swal.fire({ ...alertData.changePassConfirm }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`${host}/profile/password/change`, formData, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            const data = response.data;
            if (data.status === "ok") {
              Swal.fire({ ...alertData.changePassIsConfirmed }).then(() => {
                window.location.reload(false);
              })
            } else {
              //   toast.error(data.message, toastOptions);
              Swal.fire({ ...alertData.changePassIsError }).then(() => {
                // window.location.reload(false);
              })
            }
          });
      }
    })
  };

  const closeModal = () => {
    const closeBtn = document.getElementsByClassName("form-modal")[0];
    closeBtn.classList.add("closing");

    setTimeout(() => {
      props.setShowPsswordModal(null);
      closeBtn.remove("closing");
    }, 300);
  };

  return (
    <div className="modal-area" id="modalArea">
      <div className="container">
        <div className="form-modal">
          <div className="text-align-right close-btn" onClick={closeModal}>
            <Icon.X />
          </div>
          <div className="form-area">
            <form onSubmit={handleSubmit(submitChangePassForm)}>
              <h2 className="text-align-center">เปลี่ยนรหัสผ่านใหม่</h2>
              <label className="onInput">รหัสผ่านปัจจุบัน</label>
              <input
                {...register("nowPassword", { required: true })}
                type="password"
                className={`defInput ${errors.nowPassword ? "border-danger" : ""
                  }`}
              />

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
                  บันทึกข้อมูล
                </button>
                <button
                  className="cancle-btn"
                  type="button"
                  onClick={closeModal}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

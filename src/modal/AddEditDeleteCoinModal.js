import "../css/allinput.css";
import { useForm } from "react-hook-form";
import inputSetting from "../function/function";
import NewInput from "../components/NewInput";
import ReactDOM from "react-dom";

import "../css/allinput.css";
import TextareaAutosize from "react-textarea-autosize";
import React, { forwardRef, useEffect, useState } from "react";
import axios from "axios";
// import { ,useEffect, useState, } from "react";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../alertdata/alertData";
import { host } from "../../utils/api";

const AddEditDeleteCoinModal = (props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
  } = useForm({
    defaultValues: {
      coins: props.coinValue,
      price: props.priceValue
    }
  });



  useEffect(() => {
    // setValue("coins", props.coinValue);
    // setValue("price", props.priceValue);
  }, []);


  let headding = props.headding;

  const submitChangePassForm = async (data) => {
    console.log(data);
    // alert("ส่งข้อมูลเรียบร้อย")
    const coins = data.coins;
    const price = data.price;
    const package_Id = props.package_Id;
    console.log(package_Id);

    if (headding === "เพิ่มแพ็กเกจเติมเงิน") {
      await axios
        .post(`${host}/packagetoken/add`, {
          coins,
          price,
        })
        .then((response) => {
          const data = response.data;
          if (data.status === "ok") {
            // alert(data.message);
            // window.location = "/editcoin";
            Swal.fire({ ...alertData.addCoinIsConfirmed }).then(() => {
              window.location.reload(false);
            });
          } else {
            alert(data.message);
            window.location = "/editcoin";
          }
        });
    } else {
      await axios
        .patch(`${host}/packagetoken/update/${package_Id}`, {
          coins,
          price,
        })
        .then((response) => {
          const data = response.data;
          
          if (data.status === "ok") {
            // alert(data.message);
            // window.location = "/editcoin";
            Swal.fire({ ...alertData.editCoinIsConfirmed }).then(() => {
              window.location.reload(false);
            });
          } else {
            // alert(data.message);
            // window.location = "/editcoin";
            Swal.fire({ ...alertData.IsError }).then(() => {
              window.location.reload(false);
            });
          }
        });
    }
  };

  const closeModal = () => {
    // const cancleBtn = document.getElementById("modalArea").classList;
    const cancleBtn = document.getElementById("formModal")
    cancleBtn.classList.add("closing")
    // cancleBtn.add("closing");
    // props.setShowModal(null);
    // reset();
    // setTimeout(() => {
        //     props.setModal(null);
        //     cancleBtn.remove("closing")
        // }, 1000);
    setTimeout(() => {
            props.setShowModal(null);
            cancleBtn.remove("closing")
        }, 300);
  };
  return (
    <div className="modal-area" id="modalArea" >
      <div className="container">
        <div className="form-modal" id="formModal">
          <div className="text-align-right close-btn" onClick={closeModal}>
            X
          </div>
          <div className="form-area">
            <form onSubmit={handleSubmit(submitChangePassForm)}>
              <h2 className="text-align-center">{headding}</h2>
              {/* <NewInput
                inputSetting={inputSetting(
                  "coins",
                  "coin ที่ได้",
                  "number",
                  null,
                  true
                )}
                {...func}
                defaultValue={props.coinValue}
              />
              <NewInput
                inputSetting={inputSetting(
                  "price",
                  "ราคา",
                  "number",
                  null,
                  true
                )}
                {...func}
                defaultValue={props.priceValue}
              /> */}
              <label class="onInput">coin ที่ได้</label>
              <input
                type="number"
                // value={coinValue}
                // onChange={(e) => setCoinValue(e.target.value)}
                {...register("coins", { required: true })}
                className={`defInput ${errors.coins ? "border-danger" : ""}`}
              />
              {errors.coins && errors.coins.type === "required" && (
                <p class="validate-input"> กรุณากรอกฟิลด์นี้</p>
              )}
              <label class="onInput">ราคา</label>
              <input
                type="number"
                // value={priceValue}
                // onChange={(e) => setPriceValue(e.target.value)}
                {...register("price", { required: true })}
                className={`defInput ${errors.coins ? "border-danger" : ""}`}
              />
              {errors.coins && errors.coins.type === "required" && (
                <p class="validate-input"> กรุณากรอกฟิลด์นี้</p>
              )}

              <div className="text-align-center">
                <button className={`gradiant-btn ${!isValid ? "disabled-btn" : ""}`} type="submit" disabled={!isValid} >
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

export default AddEditDeleteCoinModal

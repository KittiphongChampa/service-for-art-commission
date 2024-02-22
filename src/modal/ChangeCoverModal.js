import "../css/allinput.css";
import { useForm } from "react-hook-form"
// import inputSetting from "../function/function";
// import NewInput from "../components/NewInput";
import * as Icon from 'react-feather';
import ReactDOM from 'react-dom';

import "../css/allinput.css";
import TextareaAutosize from 'react-textarea-autosize';
import React, { forwardRef, useEffect, useState } from "react";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import * as alertData from '../alertdata/alertData';
import ProfileImg from "../components/ProfileImg";
import axios from "axios";
import { host } from "../utils/api";


const openInputColor = () => {

}
const token = localStorage.getItem("token");

const ChangeCoverModal = (props) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        setTimeout(() => {
            const colorInput = document.getElementById("color-input")
            colorInput.click();
        }, 300);

    }, [])

    const submitChangeCoverForm = (data) => {
        // const colorPicker = document.getElementById("color-input");
        // const colorValue = colorPicker.value;
        const formData = new FormData();
        formData.append("cover_color", data.cover);
        Swal.fire({ ...alertData.changeProfileImgConfirm }).then((result) => {
            if (result.isConfirmed) {
                axios.patch(`${host}/cover_color/update`, formData,{
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }).then((response) => {
                    if(response.data.status === "ok"){
                        Swal.fire({ ...alertData.changeCoverColorIsConfirmed }).then(() => {
                            window.location.reload(false);
                        })
                    }else{
                        Swal.fire({ ...alertData.changeCoverIsError })
                    }
                })
            }
        })
    }

    const closeModal = () => {
        const closeBtn = document.getElementsByClassName("form-modal")[0]
        closeBtn.classList.add("closing")

        setTimeout(() => {
            props.setShowCoverModal(null);
            closeBtn.remove("closing")
        }, 300);
    }




    return (
        <div className="modal-area" id="modalArea" onClick={props.onClick}>
            <div className="container">
                <div className="form-modal">
                    <div className="close-tab" onClick={closeModal}><Icon.X /></div>
                    {/* <div className="text-align-right close-btn" onClick={closeModal}><Icon.X /></div> */}
                    <div className="form-area">
                        <form onSubmit={handleSubmit(submitChangeCoverForm)}>
                            <h2 style={{display:"flex",justifyContent: "center",marginBottom:"1rem"}}>เปลี่ยนสีปก</h2>
                            <div className="setting-img-box">
                                <div className="setting-cover">
                                    <input {...register("cover")} type="color" id="color-input" style={{ cursor: "pointer" }} />
                                </div>
                                <ProfileImg src={props.profile} type="only-show" />
                                <div className="submit-color-btn-area" >
                                    <button className="submit-color-btn" type="submit">บันทึกข้อมูล</button>
                                </div>

                            </div>
                            <div className="text-align-center">
                                <button className="gradiant-btn" type="submit">บันทึก</button>
                                <button className="cancle-btn" type="button" onClick={closeModal}>ยกเลิก</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}



export { ChangeCoverModal, openInputColor };



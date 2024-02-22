import "../css/allinput.css";
import { useForm } from "react-hook-form";
// import inputSetting from "../function/function";
// import NewInput from "../components/NewInput";
import * as Icon from 'react-feather';
import ReactDOM from 'react-dom';
import axios from "axios";

import "../css/allinput.css";
import TextareaAutosize from 'react-textarea-autosize';
import React, { forwardRef, useState, useEffect } from "react";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import * as alertData from '../alertdata/alertData';
import ProfileImg from "../components/ProfileImg.js";
import { host } from "../utils/api.js";

const ChangeProfileImgModal = (props) => {
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting, isDirty, isValid }, reset } = useForm();
    
    const submitChangeProfileForm = (data) => {
        Swal.fire({ ...alertData.changeProfileImgConfirm }).then((result) => {
            if (result.isConfirmed) {
                console.log()
                Swal.fire({ ...alertData.changeProfileImgIsConfirmed }).then(() => {
                    window.location.reload(false);
                })
            }
        })
    }

    const closeModal = () => {
        const closeBtn = document.getElementsByClassName("form-modal")[0]
        closeBtn.classList.add("closing")

        setTimeout(() => {
            props.setShowProfileModal(null);
            closeBtn.remove("closing")
        }, 300);
    }

    const [file, setFile] = useState("");
    const [previewUrl, setPreviewUrl] = useState(props.profile);
        
    const handleFileChange = (event) => {
        const image = event.target.files[0];
        setFile(image);
        setPreviewUrl(URL.createObjectURL(image));
    };
    // const addProfileImg = () => {
    //     let input = document.createElement('input');
    //     input.type = 'file';
    //     input.onchange = (e) => {
    //         const image = e.target.files[0];
    //         setFile(image);
    //         setPreviewUrl(URL.createObjectURL(image));
    //     }
    //     input.accept="image/png ,image/gif ,image/jpeg";
    //     input.click();
    // }
    const token = localStorage.getItem("token");
    const profileupdate_img = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        await axios
          .put(`${host}/profile_img/update`, formData, {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            const data = response.data;
            if (data.status === "ok") {
                Swal.fire({ ...alertData.changeProfileImgIsConfirmed }).then(() => {
                    window.location.reload(false);
                });
            //   alert("Update Success");
            //   window.location = "/userprofile";
            } else {
            //   toast.error(data.message, toastOptions);
                Swal.fire({ ...alertData.IsError }).then(() => {
                    window.location.reload(false);
                });
            }
          });
      };

    return (
        <div className="modal-area" id="modalArea2">
            <div className="container">
                <div className="form-modal">
                    <div className="text-align-right close-btn" onClick={closeModal}><Icon.X /></div>
                    <div className="form-area">
                        <form onSubmit={profileupdate_img}>
                            <h2 style={{ display: "flex", justifyContent: "center",marginBottom:"1rem" }}>เปลี่ยนภาพโปรไฟล์</h2>
                            <ProfileImg type="only-show" src={previewUrl}/>
                            {/* <ProfileImg src={previewUrl} onPress={addProfileImg}/> */}
                            <div class="input-group mb-1 mt-5">
                                <input {...register("profileImg", { required: true })} accept="image/png, image/jpeg" onChange={handleFileChange}
                                    type="file" class="form-control" id="inputGroupFile02" />
                                {/* <label class="input-group-text" for="inputGroupFile02">Upload</label> */}
                                
                            </div>
                            <div className="text-align-right">
                                {errors.profileImg && errors.profileImg.type === "required" && (<p class="validate-input"> กรุณาเลือกไฟล์ภาพ</p>)}
                                {errors.profileImg && errors.profileImg.type === "accept" && (<p class="validate-input">อัปโหลดได้แค่ไฟล์ภาพเท่านั้น</p>)}
                            </div>
                            <div className="text-align-center">
                                <button className={`gradiant-btn`} type="submit" >บันทึก</button>
                                <button className="cancle-btn" type="button" onClick={closeModal}>ยกเลิก</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default ChangeProfileImgModal;


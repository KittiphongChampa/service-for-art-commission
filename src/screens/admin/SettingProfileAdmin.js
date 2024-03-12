import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import "../../css/indexx.css";
import "../../css/allinput.css";
import "../../css/allbutton.css";
import ProfileImg from "../../components/ProfileImg";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../../components/Navbar";
import SettingAside from "../../components/SettingAside";

import ChangePasswordModal from "../../modal/ChangePasswordModal";
import { ChangeCoverModal, openInputColor } from "../../modal/ChangeCoverModal";

import ChangeProfileImgModal from "../../modal/ChangeProfileImgModal";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Space, Form, Input, Modal, Flex, Col, Row } from "antd";

// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
// import Modal from "react-bootstrap/Modal";
import { Helmet } from "react-helmet";

import * as alertData from "../../alertdata/alertData";
import { useAuth } from '../../context/AuthContext';
import { host } from "../../utils/api";

const title = "ตั้งค่าโปรไฟล์";
const toastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

export default function SettingProfileAdmin() {


    const [showPsswordModal, setShowPsswordModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(null);
    const [showCoverModal, setShowCoverModal] = useState(null);
    return (
        <div className="body-con">
            <Helmet>
                <title>{title}</title>
            </Helmet>

            {/* <Navbar /> */}
            <NavbarAdmin />

            {/* <div className="setting-container"> */}
            <div className="body-lesspadding" style={{ backgroundColor: "white" }}>
                <div className="container-xl">
                    <div className="content-card">
                        <h1 className="h3">การตั้งค่า</h1>
                        {/* <SettingAside onActive="profile" /> */}
                        <div className="setting-content-box">
                            <div className="settingCard profile-card">
                                <div>
                                    <h2 className="h3">โปรไฟล์</h2>
                                </div>
                                <div className="in-setting-page">
                                    <form onSubmit=''>
                                        {/* <div className="setting-img-box"> */}
                                        <ProfileImg
                                        // src={userdata.urs_profile_img}
                                        // onPress={openProfileModal}
                                        />
                                        <div className="submit-color-btn-area">
                                            <Button shape="round" size="large" type="primary" className="submit-color-btn" htmlType="submit" >
                                                บันทึกข้อมูล
                                            </Button>
                                        </div>
                                        {/* </div> */}

                                        {/* มีปัญหา */}
                                        <div>
                                            <label>ชื่อผู้ใช้</label>
                                            {/* <TextareaAutosize
                                                className="txtarea"
                                                id="username"
                                                maxlength="50"
                                                disabled={editProfileBtn}
                                                style={{ border: !editProfileBtn && '1px solid black' }}
                                                {...register("username", { maxLength: 50 })}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            <p
                                                className="text-align-right"
                                                style={{ display: editProfileBtn ? 'none' : 'block' }}
                                            >
                                                {name.length}/50
                                            </p> */}
                                        </div>

                                        <div className="" id="sendDataBtn" style={{ display: "flex", justifyContent: "center" }}>
                                            <Button shape="round" size="large" className="edit-profile-btn">
                                                แก้ไขโปรไฟล์
                                            </Button>
                                            {/* {!editProfileBtn && <><Button shape="round" size="large" className="gradiant-btn" htmlType="submit">
                                                บันทึกข้อมูล
                                            </Button>
                                                <Button shape="round" size="large" className="cancle-btn" onClick={editProfile}>
                                                    ยกเลิก
                                                </Button></>}
                                            {editProfileBtn && <Button shape="round" size="large" className="edit-profile-btn" onClick={editProfile}>
                                                แก้ไขโปรไฟล์
                                            </Button>} */}
                                        </div>
                                    </form>
                                    {/* <Form
                    onFinish={profileupdate}
                    layout="vertical"
                    name="updateProfile"
                    initialValues={
                      {
                        username: name,
                      }
                    }
                  >
                    <Form.Item
                      label="ชื่อผู้ใช้"
                      name="username">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="คำอธิบายตัวเอง">
                      <Input />
                    </Form.Item>
                  </Form> */}
                                </div>
                            </div>

                            <div className="settingCard">
                                <div>
                                    <h2 className="h3">อีเมลและรหัสผ่าน</h2>
                                </div>
                                <div className="in-setting-page">
                                    <div>
                                        <label >อีเมล</label>
                                        <p>
                                            {/* {userdata.urs_email}{" "} */}
                                            {/* <Button className="change-email gradient-border-btn">
                    <p>เปลี่ยนอีเมล</p>
                  </Button> */}
                                        </p>
                                        <label>รหัสผ่าน</label>
                                        <Button
                                            // className="change-pass gradient-border-btn"
                                            // onClick={handleModalPass}
                                            shape="round"
                                        >
                                            <p>เปลี่ยนรหัสผ่าน</p>
                                        </Button>
                                    </div>
                                </div>
                            </div>


                            {/* <div style={{ border: "none", padding: "0",width: "100%",height: "fit-content"}}> */}
                            <Button
                                variant="outline-danger"
                                className="text-align-center"
                                // onClick={UserDelete}
                                danger
                            >
                                ลบบัญชีผู้ใช้
                            </Button>
                            {/* </div> */}
                        </div>
                    </div>
                    <Modal title="เปลี่ยนรหัสผ่านใหม่" open={showPsswordModal} onCancel='' width={1000} footer=''>
                        <Form
                            // onFinish={submitChangePassForm}
                            layout="vertical">
                            <Form.Item
                                label="รหัสผ่านปัจจุบัน"
                                name='nowPassword'
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
                                ]}>
                                <Input.Password style={{ borderRadius: "1rem", padding: "0.5rem 1rem" }} />
                            </Form.Item>
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
                            <Flex gap='small' justify="center">
                                <Button type="primary" htmlType="submit" shape='round' size="large">บันทึกข้อมูล</Button>
                                {/* <Button shape='round' size="large" onClick={handleModalPass}>ยกเลิก</Button> */}
                            </Flex>
                        </Form>

                    </Modal>


                </div>
            </div>

        </div>
    );
}

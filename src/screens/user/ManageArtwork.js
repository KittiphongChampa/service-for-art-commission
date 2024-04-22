import React, { useState, useEffect, useRef } from "react";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../../components/Navbar";
import "../../css/manageCommission.css";
import * as alertData from "../../alertdata/alertData";

import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

import { Helmet } from "react-helmet";

import {
    UploadOutlined, CloseOutlined, MinusCircleOutlined, PlusOutlined, RadiusBottomleftOutlined,
} from '@ant-design/icons';
import { Modal, Progress, notification, Button, Upload, Checkbox, Form, Input, Space, Flex, Tooltip, Alert, Select, message, Tabs } from 'antd';
import 'react-quill/dist/quill.snow.css';
// import 'animate.css';

import { useAuth } from '../../context/AuthContext';
import { host } from "../../utils/api";

const title = 'ManageCommission';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

export default function ManageArtwork() {
    const navigate = useNavigate();
    const { userdata, isLoggedIn, socket } = useAuth();
    const jwt_token = localStorage.getItem("token");
    const [isLoading, setLoading] = useState(false);
    const [topics, setTopics] = useState([]);

    //---------------------------------------------------------------------
    useEffect(() => {
        if (jwt_token) {
            topic();
        } else {
            navigate("/login");
        }
    }, []);

    const topic = () => {
        axios.get(`${host}/getTopic`).then((response) => {
          const data = response.data;
          setTopics(data.topics)
        });
    }

    const { TextArea } = Input;
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [cmsArtworkModalOpen, setCmsArtworkModalOpen] = useState(false);
    const handleCancelModal = () => setUploadModalOpen(false);
    const handleCmsArtworkModal = () => {
        //
        if(!cmsArtworkModalOpen){
            selectgallory();
        }
        setUploadModalOpen(false)
        setCmsArtworkModalOpen(!cmsArtworkModalOpen)
        
    }
    const [gallery, setGallery] = useState([])
    const selectgallory = async() => {
        const token = localStorage.getItem("token");
        await axios.get(`${host}/gallerry/select-cms`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        }).then((response) => {
            const data = response.data;
            if (data.status === "ok") {
                setGallery(data.results)
            } else {
                console.log('เกิดข้อผิดพลาด')
            }
        })
    }


    const all_option = [
        ...topics.map((data) => ({
          value: data.tp_id,
          label: data.tp_name,
        })),
    ]


    const [imageId, setImageId] = useState();
    const [imageUrl, setImageUrl] = useState();
    const [fileList, setFileList] = useState([]);
    const handleChange = (info) => {
        setFileList(info.fileList);
        getBase64(info.file.originFileObj, (url) => {
            // setLoading(false);
            setUploadModalOpen(false)
            setImageUrl(url);
        });
    };

    function selectPic(ex_img_id, ex_img_path) {
        // Swal.fire({
        //     imageUrl: ex_img_path,
        //     imageHeight: 300,
        //     imageAlt: "ภาพที่คุณเลือก",
        //     title: "เลือกภาพนี้หรือไม่?",
        //     showCancelButton: true,
        //     confirmButtonText: "ตกลง",
        //     cancelButtonText: "ยกเลิก"
        // }).then(async (result) => {
        //     if (result.isConfirmed) {
                setImageId(ex_img_id)
                setImageUrl(ex_img_path)
                handleCmsArtworkModal()
        //     }
        // });
    }

    const [topicValues, setTopicValues] = useState([]);
    function handleTopic(value) {
        setTopicValues(value);
    }
    const onFinish = (values) => {
        const formData = new FormData();
        if (imageId === undefined) {
            formData.append("image_file", fileList[0].originFileObj);
        }
        formData.append("ex_img_id", imageId);
        formData.append("artworkDesc", values.artworkDesc);
        formData.append("artworkTopic", topicValues);
        axios.post(`${host}/gallerry/add`, formData, {
            headers: {
                Authorization: "Bearer " + jwt_token,
                "Content-type": "multipart/form-data",
            },
        }).then((response) => {
            const data = response.data;
            console.log(data);
            if (data.status === 'ok') {
                Swal.fire({
                    title: "สำเร็จ",
                    icon: "success"
                }).then(() => {
                    window.location.reload(false);
                });
            } else {
                // console.log('เกิดข้อผิดพลาดบางอย่าง');
                Swal.fire({
                    title: "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่",
                    icon: "error"
                }).then(() => {
                    window.location.reload(false);
                });
            }
        })

        const btn = (
            <Space>
                <Button type="link" danger size="small">
                    ยกเลิกการอัปโหลด
                </Button>
            </Space>
        );

        // api.info({
        //     message: 'กำลังตรวจสอบรูปภาพ',
        //     description:
        //         'กำลังตรวจสอบรูปภาพซ้ำ', btn,
        //     duration: 0,
        //     placement: 'bottomRight',
        //     // icon: <LoadingOutlined style={{ color: '#108ee9' }} />
        //     icon: <Progress type="circle" percent={50} size={20} />
        // });
    }

    const menus = [
        {
            key: "1",
            label: <Link to="/manage-commission">คอมมิชชัน</Link>
        },
        {
            key: "2",
            label:"งานวาด"
        }
    ]

    return (
        <div className="body-con">
            {contextHolder}
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <NavbarUser />

            <div class="body-nopadding" style={{ backgroundColor: "white" }}>
                <div className="container-xl">
                    <div className="content-container">

                        <div className="content-body preview-cms">
                            <Tabs defaultActiveKey="2" items={menus} />
                            <h3 className="content-header d-flex justify-content-center mt-4">เพิ่มงานวาด</h3>
                            <Form
                                form={form}
                                layout="vertical"
                                name="login"
                                onFinish={onFinish}
                                autoComplete="off"
                                initialValues={{
                                    final: 3,
                                }}
                            >
                                <Form.Item
                                    label=""
                                    name=""
                                >
                                    <div className="artwork-uploader" onClick={() => setUploadModalOpen(true)}>
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            beforeUpload={beforeUpload}
                                            // onChange={handleChange}
                                            openFileDialogOnClick={false}
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt="avatar"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                />
                                            ) : (
                                                <div>
                                                    <PlusOutlined />
                                                    <div
                                                        style={{
                                                            marginTop: 8,
                                                        }}
                                                    >
                                                        Upload
                                                    </div>
                                                </div>
                                            )}
                                        </Upload>
                                    </div>
                                </Form.Item>

                                <Modal open={uploadModalOpen} title="" footer={null} onCancel={handleCancelModal} width={"fit-content"}>
                                    <Flex gap="small">
                                        <>
                                            <Upload
                                                onChange={handleChange}
                                                multiple={false}
                                                showUploadList={false}
                                            >
                                                <Button shape="round" size="large" icon={<UploadOutlined />}>อัปโหลดรูปภาพจากเครื่อง</Button>
                                            </Upload>
                                            <Button shape="round" size="large" onClick={handleCmsArtworkModal}>เลือกรูปภาพจากคอมมิชชัน</Button>
                                        </>
                                    </Flex>
                                </Modal>

                                <Modal open={cmsArtworkModalOpen} title="เลือกรูปภาพจากคอมมิชชัน" footer={null} onCancel={handleCmsArtworkModal} width={"fit-content"}>
                                    <div className="cms-to-artwork-modal">
                                        {gallery.map(data=>(
                                            <div key={data.ex_img_id} className="pic-wrapper" onClick={() => selectPic(data.ex_img_id, data.ex_img_path)}>
                                                <img src={data.ex_img_path} />
                                            </div>
                                        ))}

                                    </div>
                                </Modal>

                                <Form.Item label="คำอธิบายงานวาด" name='artworkDesc'
                                    rules={[
                                        {
                                            required: false,
                                            message: "กรุณาใส่รายละเอียด",
                                        },
                                    ]}>
                                    <TextArea
                                        placeholder=""
                                        showCount maxLength={200}
                                        autoSize={{
                                            minRows: 3,
                                            maxRows: 5,
                                        }} />
                                </Form.Item>

                                <Form.Item
                                    label="หัวข้อ"
                                    name="cmsTopic"

                                    rules={[
                                        {
                                            required: true,
                                            message: "กรุณาเลือกหัวข้อ",
                                        }
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="เลือกหัวข้อ"
                                        value={topicValues}
                                        id="topicSelector"
                                        onChange={handleTopic}
                                        options={all_option}
                                        allowClear
                                    // maxTagCount={3}
                                    >
                                    </Select>
                                </Form.Item>
                                <Flex justify="right" gap="small" >
                                    <>
                                        {/* <Button shape="round" size="large">ยกเลิก</Button> */}
                                        <Button type="primary" shape="round" size="large" htmlType="submit">บันทึก</Button>
                                    </>
                                </Flex>
                            </Form>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


import React, { useState, useEffect, useRef, createElement } from "react";
import { Modal, Button, Input, Select, Space, Upload, Flex, Radio, InputNumber, Form, Timeline,message, Badge } from 'antd';
import * as Icon from 'react-feather';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import "../css/indexx.css";
import '../styles/main.css';
import "../css/allbutton.css";
import "../css/profileimg.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format, isToday, isYesterday, addHours } from 'date-fns';
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import axios from "axios";
import { host } from "../utils/api";
import {
    UploadOutlined,
    CloseOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    RadiusBottomleftOutlined,
    RadiusBottomrightOutlined,
    RadiusUpleftOutlined,
    RadiusUprightOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import Switch from 'react-switch';
// import 'rsuite/styles/index.less';
import TextareaAutosize from "react-textarea-autosize";
// import ImgFullscreen from '../function/openFullPic'
import 'animate.css'
import { waitFor } from "@testing-library/react";
import { Container } from 'react-bootstrap/Container';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export default function ChatOrderDetail({socket, userdata , myId, cancelReq2, isBriefOpen, handleBrief, currentStep, messages, showOderDetailModal, handleOdModal, orderDetail, allSteps, currentStepName }) {
    
    const token = localStorage.getItem("token");

    function isTodayUTC7(date) {
        const dateUTC7 = addHours(date, 7); // เพิ่ม 7 ชั่วโมงเพื่อเปลี่ยนเป็นเวลาในโซนเวลา UTC+7
        return isToday(dateUTC7);
    }

    const handleCancel = () => setPreviewOpen(false);
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const odModalRef = useRef();
    const briefModalRef = useRef();
    const historyModalRef = useRef();
    const fullImgRef = useRef();
    const reportModalRef = useRef();

    useEffect(() => {
        let handler = (event) => {
            if (!odModalRef.current.contains(event.target)) {
                if (!formModalOpened && !isHistoryModalOpen && !isBriefOpen && !reportModalIsOpened) {
                    const myElement = odModalRef?.current;
                    myElement?.classList.add('animate__animated', 'animate__fadeOutRight', 'animate__faster');
                    myElement?.style.setProperty('--animate-duration', '0.3s');

                    setTimeout(() => {
                        handleOdModal();
                    }, 300);
                }
            }
        }
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    })

    const [formModalOpened, setFormModalOpened] = useState(false)
    const [historyModalOpened, setHistoryModalOpened] = useState(false)
    const [reportModalIsOpened, setReportModalIsOpened] = useState(false)

    useEffect(() => {

        const myElement = odModalRef?.current;
        if (showOderDetailModal) {
            myElement?.classList.add('animate__animated', 'animate__fadeInRight', 'animate__faster');
            myElement?.style.setProperty('--animate-duration', '0.3s');
        } else {
        }
    }, [showOderDetailModal])


    const FormModal = (props) => {
        const [attImgComponents, setAttImgComponents] = useState([])

        function addNewAttImg(props) {
            setAttImgComponents([...attImgComponents, { text: "", pic: "" }])
            console.log(attImgComponents)
        }

        function removeAttImg(componentKey) {
            const update = attImgComponents.filter((_, i) => i !== componentKey);
            setAttImgComponents(update)
        }

        const handleChangeText = (index, newText) => {
            const updatedComponents = attImgComponents.map((component, i) => {
                if (index === i) {
                    return { ...component, text: newText };
                }
                return component;
            });
            setAttImgComponents(updatedComponents);
        };
        // function openFormModal() {
        //     setFormModalOpened(prevState => !prevState)
        // }

        // function openHistoryModal() {
        //     setFormModalOpened(prevState => !prevState)
        // }

        const [fullImgOpened, setFullImgOpened] = useState(false)
        const [src, setSrc] = useState("")

        const handleFullImg = (imgsrc) => {
            console.log("คลิกฟังชันโชว์", imgsrc)
            setFullImgOpened(prevState => !prevState)
            setSrc(imgsrc)

        }

        return <>
            {/* <ImgFullscreen src={src} opened={fullImgOpened} handleFullImg={handleFullImg} /> */}
            <div className="modal cms-detail" ref={briefModalRef}>
                <div className="form-order-card">
                    <div className="close-tab"><button onClick={openFormModal}><Icon.X /></button></div>
                    <div className="form-order">
                        <h1 className="h4">รายละเอียดคำขอจ้าง</h1>
                        {/* <p className="selected-packgage">Full color by boobii : Bust-up full color เริ่มต้น 500 P</p> */}
                        <div className="form-item">
                            <label>ประเภทการใช้งาน</label>  Personal use (ใช้ส่วนตัว)
                        </div>
                        <div className="form-item">
                            <label>จุดประสงค์การใช้ภาพ</label> จะนำไป print เป็น poster ให้เป็นของขวัญวันเกิดเพื่อน
                        </div>
                        <div className="form-item">
                            <label>รายละเอียด</label>ผู้หญิงตาสีน้ำตาลอ่อน ผมยาวสีดำประบ่าใส่แว่นทรงกลมสีชมพู มีผิวขาวอุ้มแมวส้มใส่วิก ผู้หญิงใส่เสื้อยืดคอกลมสีขาวมองกล้องและยิ้มสดใส พื้นหลังมีลูกโป่งตัวอักษร Happy Birthday
                        </div>

                        {/* <AttImgInput/> */}
                        <div className="form-item">
                            <label>ภาพประกอบ</label>
                            <div className="att-img-item mt-2 mb-2">
                                <div className="number"></div>
                                <div onClick={() => handleFullImg("../เหมียวเวห์.jpg")} className="small-show-att-img" style={{ backgroundImage: "url(../เหมียวเวห์.jpg)" }}></div>
                                <div className="desc-box">
                                    <label style={{ fontWeight: "400" }}>คำอธิบายเพิ่มเติม</label> แมวส้มใส่วิก ขอหน้าตาแบบนี้เป๊ะๆเลยค่ะไม่ต้องเปลี่ยนอะไร
                                </div>
                            </div>
                            <div className="att-img-item mt-2 mb-2">
                                <div className="number"></div>
                                <div onClick={() => handleFullImg("../ท่าแมว.jpg")} className="small-show-att-img" style={{ backgroundImage: "url(../ท่าแมว.jpg)" }}></div>
                                <div className="desc-box">
                                    <label style={{ fontWeight: "400" }}>คำอธิบายเพิ่มเติม </label> ท่าอุ้มแมว ส่วนพื้นหลังสีอะไรก็ได้ค่ะ สีไหนเข้าก็เอาสีนั้น
                                </div>
                            </div>
                            <div className="att-img-item mt-2 mb-2">
                                <div className="number"></div>
                                <div onClick={() => handleFullImg("../ทรงผม.jpg")} className="small-show-att-img" style={{ backgroundImage: "url(../ทรงผม.jpg)" }}></div>
                                <div className="desc-box">
                                    <label style={{ fontWeight: "400" }}>คำอธิบายเพิ่มเติม</label>
                                    ทรงผมผู้หญิง
                                </div>
                            </div>
                            <div className="att-img-item mt-2 mb-2">
                                <div className="number"></div>
                                <div onClick={() => handleFullImg("../ลูกโป่ง.jpg")} className="small-show-att-img" style={{ backgroundImage: "url(../ลูกโป่ง.jpg)" }}></div>
                                <div className="desc-box">
                                    <label style={{ fontWeight: "400" }}>คำอธิบายเพิ่มเติม</label>
                                    ลูกโป่งที่อยู่พื้นหลัง เอาสีอะไรก็ได้ที่เข้ากับพื้นหลัง
                                </div>
                            </div>

                            {/* {attImgComponents.map((component, index) => (

                                <div key={index} className="att-img-item mt-2 mb-2">
                                    <div className="number"></div>
                                    <div className="small-show-att-img" style={{ backgroundImage: "url(เหมียวเวห์.jpg)" }}></div>
                                    <div className="desc-box">
                                        <label style={{ fontWeight: "400" }}>คำอธิบายเพิ่มเติม</label>
                                        <input placeholder="เช่น ส่วนที่อยากให้ปรับนอกเหนือจากรูปที่แนบมา " className="txtarea-input" type="text" value={component.text}
                                            onChange={(e) => handleChangeText(index, e.target.value)} />
                                    </div>
                                    <button className="remove-img-item" onClick={() => removeAttImg(index)}><Icon.X /></button>
                                </div>
                            ))} */}
                        </div>

                        {/* <button className="addNewAttImgBtn" onClick={addNewAttImg}><Icon.Plus />เพิ่มภาพประกอบ</button>
                        <button className="orderSubmitBtn">ส่งคำขอขอจ้าง</button> */}
                    </div>
                </div>
            </div>
        </>
    }

    function openFormModal() {
        setFormModalOpened(prevState => !prevState)
    }


    useEffect(() => {
        let container2 = document.getElementsByClassName("text-wraper");
        if (container2) {
            const arr = Array.from(container2);
            console.log(container2)
            arr.forEach(container => {
                const p = container.querySelector('p')
                if (container.clientWidth < p.clientWidth) {
                    p.classList.add("anima");
                    console.log("container.clientWidth =" + container.clientWidth)
                    console.log("p.clientWidth =" + p.clientWidth)
                }
            })
        }
    }, [])

    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

    function handleHistoryModal() {
        setIsHistoryModalOpen(!isHistoryModalOpen)
    }
    const [fileList, setFileList] = useState([]);
    const handleChange = ({ fileList: newFileList }) => {
        let array = newFileList.filter(file => (file.type === 'image/jpeg' || file.type === 'image/png') && (file.size / 1024 / 1024 < 5))
        setFileList(array)
    };

    function handleReportModal() {
        setReportModalIsOpened(preveState => !preveState)
        // alert(isOpened)
    }

    const beforeUpload = (file, { fileList: newFileList }) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('อัปโหลดได้แค่ไฟล์ JPG/PNG เท่านั้น');
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
            message.error('ขนาดของรูปภาพต้องไม่เกิน 5 MB');
        }
        return isJpgOrPng && isLt2M && false;
    };

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
        );
    };

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append("image_file", file.originFileObj);
            });
            formData.append("rpheader", values.header);
            formData.append("rpdetail", values.detail);
            formData.append("rpemail", values.email);
            formData.append("usr_reported_id", orderDetail.artist_id)
            const response = await axios.post(`${host}/report/order/${orderDetail.od_id}`, formData, {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                // เพิ่มการส่งข้อมูลไปยัง socket server
                const reportData = {
                    sender_id: userdata.id,
                    sender_name: userdata.urs_name,
                    sender_img: userdata.urs_profile_img,
                    artworkId: orderDetail.artist_id,
                    reportId: response.data.reportId,
                    msg: "ได้รายงานออเดอร์"
                };
                socket.emit('reportOrder', reportData);

                // บันทึก notification
                await axios.post(`${host}/admin/noti/add`, {
                    reporter: myId,
                    reported: 0,
                    reportId: response.data.reportId,
                    msg: "ได้รายงานออเดอร์"
                }).then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            title: "รายงานสำเร็จ",
                            icon: "success"
                        }).then(() => {
                            window.location.reload(false);
                        });
                    } else {
                        console.log("เกิดข้อผิดพลาดในการบันทึกข้อมูลการแจ้งเตือนของแอดมิน");
                    }
                });
            } else {
                Swal.fire({
                    title: "เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่",
                    icon: "error"
                }).then(() => {
                    window.location.reload(false);
                });
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาด', error);
        }
    };

    const [reported, setReported] = useState(false);

    const report = async() => {
        await axios.get(`${host}/get/reported/${orderDetail.od_id}`).then((response) => {
            if (response.data.msg == "true") {
                setReported(true)
            } else {
                setReported(false)
            }
        })
    }

    useEffect(() => {
        report();
    },[reported])

    return (
        <>
            {formModalOpened ? <FormModal /> : null}
            {/* {historyModalOpened ? <HistoryModal /> : null} */}
            <div className="backdrop-modal-area" ref={odModalRef} >
                <div className="od-modal-card">
                    {/* <div className="od-headder">
                        <img src="เหมียวเวห์.jpg" />
                        <div style={{ width: '100%' }}>
                            <div className="text-wraper"><p>{orderDetail?.cms_name}</p></div>
                            <div className="text-wraper"><p>{orderDetail?.pkg_name}</p></div>
                        </div>
                    </div> */}
                    <div className="od-all-status">
                        <p className="od-q">คิวที่ {orderDetail?.od_q_number}</p>
                        <p className="od-stat">{currentStepName}</p>
                    </div>

                    {/* <p>01:23:58</p> */}


                    <Flex gap="small" className="od-edit-brief" wrap="wrap" justify="center">
                        <Button shape="round" onClick={handleBrief}>ดูบรีฟ</Button>
                        <Button shape="round" onClick={handleHistoryModal}>ดูประวัติการดำเนินการ</Button>
                        {!orderDetail.od_cancel_by && !orderDetail.finished_at && <Button shape="round" danger onClick={cancelReq2} >ยกเลิกออเดอร์</Button>}
                        
                        {/* <Icon.Info className="ms-2" /> */}
                    </Flex>
                    <div className="od-quota-grid">
                        <p className="quota-headding">ระยะเวลาทำงาน</p>
                        <p className="quota-amount">{orderDetail?.pkg_duration} วัน</p>
                        <p className="quota-headding">จำนวนครั้งที่แก้ไข</p>
                        <p className="quota-amount">({orderDetail?.od_number_of_edit}/{orderDetail?.pkg_edits})</p>
                        <p className="quota-headding">ประเภทงาน</p>
                        <p className="quota-amount">{orderDetail?.tou}</p>
                        <p className="quota-headding">กำหนดส่ง</p>
                        <p className="quota-amount">{format(new Date(orderDetail?.od_deadline),'dd/MM/yyyy')}</p>
                    </div>
                    <Flex justify="flex-start" style={{ width: "100%" }}>

                        <Timeline
                            items={
                                allSteps?.map((step) => {
                                    let color, prefix = ""
                                    currentStep <= step.step_id ? color = 'gray' : color = 'green'
                                    if (step.step_name.includes('ภาพ')) {
                                        prefix = "อนุมัติ"
                                    }
                                    return { children: `${prefix}${step.step_name}`, color: color }
                                })}
                        />
                    </Flex>
                     <Flex>
                        {myId != orderDetail.artist_id ? 
                            (reported == true ?  
                                <p>รายงานออเดอร์แล้ว</p>
                                :
                                <Button danger type="text" shape="round" onClick={handleReportModal}>
                                    รายงานออเดอร์นี้
                                </Button>
                            )
                        :
                            <></>
                        }
                        
                    </Flex>


                </div>
            </div>


            <Modal title="ประวัติการดำเนินการ" ref={historyModalRef} open={isHistoryModalOpen} footer="" onCancel={handleHistoryModal} width={1000} >
                <table className="history-order-detail">

                    {messages.map((message, index) => {
                        // let currentDate = message.created_at
                        let currentDate = message.created_at;
                        if (!Number.isNaN(new Date(message.created_at).getTime())) {
                            currentDate = format(new Date(message.created_at), 'dd/MM HH:mm น.');
                            if (isToday(new Date(message.created_at))) {
                                currentDate = format(new Date(message.created_at), 'วันนี้ HH:mm น.')
                            } else if (isYesterday(new Date(message.created_at))) {
                                currentDate = format(new Date(message.created_at), 'เมื่อวานนี้ HH:mm น.')
                            }
                        }
                        return message.step_id !== 0 && message.step_id !== undefined && message.message != null && !message.message.includes("แนบ") ? (
                            <tr key={index}>
                                <td>{currentDate}</td>
                                <td>{message.sender == myId && 'คุณ'}{message.message}</td>
                            </tr>
                        ) : null;
                    })}

                </table>
            </Modal>

            <Modal width={1000} title="รายงานออเดอร์" open={reportModalIsOpened} onCancel={handleReportModal} footer="" ref={reportModalRef}>
                <Space gap="small" direction="vertical" style={{ width: "100%" }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish} 
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        className="ant-form"
                    >

                        <Form.Item
                            name="header"
                            label="ปัญหาที่พบ"
                            rules={[{ required: true, message: "กรุณากรอกฟิลด์นี้" }, { type: 'string', max: 100 }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="detail"
                            label="รายละเอียดของปัญหา"
                            rules={[{ required: true, message: "กรุณากรอกฟิลด์นี้" }, { type: 'string', max: 455 }]}
                        >
                            <TextArea />
                        </Form.Item>

                        {/* <Button onClick={()=> console.log(fileList.length)}>click</Button> */}
                        

                        <Form.Item
                            name=""
                            label="แนบรูปภาพของปัญหา"
                            rules={[
                                {
                                    required: true,
                                    message:null
                                },
                                ({}) => ({
                                    validator(_,value) {
                                        if (fileList.length == 0 ) {
                                            return Promise.reject(new Error('กรุณาแนบไฟล์ภาพ'));
                                        } else {
                                            return Promise.resolve();
                                        }
                                    },
                                }),
                                
                            ]}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                multiple={true}
                                beforeUpload={beforeUpload}
                            >
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
                            </Upload>
                        </Form.Item>

                        <Modal
                            open={previewOpen}
                            title={previewTitle}
                            footer={null}
                            onCancel={handleCancel}
                        >
                            <img
                                alt="example"
                                style={{
                                    width: "100%",
                                }}
                                src={previewImage}
                            />
                        </Modal>

                        {/* <Form.Item
                            name="email"
                            label="อีเมลติดต่อกลับ"
                            rules={[{ required: true, message: "กรุณากรอกฟิลด์นี้" }, { type: 'email', max: 100 }]}
                        >
                            <Input />
                        </Form.Item> */}
                        
                        <Flex gap="small" justify="flex-end">
                            {/* <Button shape="round" size="large" onClick={handleNext}>ย้อนกลับ</Button> */}
                            <Button shape="round" size="large" type="primary" htmlType="submit" >รายงาน</Button>
                        </Flex>
                    </Form>
                </Space>
            </Modal>

        </>
    );
}



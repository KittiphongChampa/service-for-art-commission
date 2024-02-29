
import React, { useState, useEffect, useRef, createElement } from "react";
import { Modal, Button, Input, Select, Space, Upload, Flex, Radio, InputNumber, Form, Timeline } from 'antd';
import * as Icon from 'react-feather';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import "../css/indexx.css";
import '../styles/main.css';
import "../css/allbutton.css";
import "../css/profileimg.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format, isToday, isYesterday } from 'date-fns';

import Switch from 'react-switch';
// import 'rsuite/styles/index.less';
import TextareaAutosize from "react-textarea-autosize";
// import ImgFullscreen from '../function/openFullPic'
import 'animate.css'
import { waitFor } from "@testing-library/react";
import { Container } from 'react-bootstrap/Container';

export default function ChatOrderDetail({ myId, isBriefOpen, handleBrief, currentStep, messages, showOderDetailModal, handleOdModal, orderDetail, allSteps, currentStepName }) {

    const odModalRef = useRef();
    const briefModalRef = useRef();
    const historyModalRef = useRef();
    const fullImgRef = useRef();

    useEffect(() => {
        let handler = (event) => {
            if (!odModalRef.current.contains(event.target)) {
                if (!formModalOpened && !isHistoryModalOpen && !isBriefOpen) {
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

    return (
        <>
            {formModalOpened ? <FormModal /> : null}
            {/* {historyModalOpened ? <HistoryModal /> : null} */}
            <div className="backdrop-modal-area" ref={odModalRef} >
                <div className="od-modal-card">
                    <div className="od-headder">
                        <img src="เหมียวเวห์.jpg" />
                        <div style={{ width: '100%' }}>
                            <div className="text-wraper"><p>{orderDetail?.cms_name}</p></div>
                            <div className="text-wraper"><p>{orderDetail?.pkg_name}</p></div>
                        </div>
                    </div>
                    <div className="od-all-status">
                        <p className="od-q">คิวที่ {orderDetail?.od_q_number}</p>
                        <p className="od-stat">{currentStepName}</p>
                    </div>

                    {/* <p>01:23:58</p> */}


                    <Flex gap="small" className="od-edit-brief">
                        <Button shape="round" onClick={handleBrief}>ดูบรีฟ</Button>
                        <Button shape="round" onClick={handleHistoryModal}>ดูประวัติการดำเนินการ</Button>
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
                        <p className="quota-amount">xxxxxx</p>
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


                </div>
            </div>


            <Modal title="ประวัติการดำเนินการ" ref={historyModalRef} open={isHistoryModalOpen} footer="" onCancel={handleHistoryModal} width={"50vw"} style={{ maxWidth: "1000px" }}>
                <table className="history-order-detail">

                    {messages.map((message, index) => {
                        // let currentDate = message.created_at
                        let currentDate;
                        if (!Number.isNaN(new Date(message.created_at).getTime())) {
                            currentDate = format(message.created_at, 'dd/MM HH:mm น.');
                            if (isToday(message.created_at)) {
                                currentDate = format(message.created_at, 'วันนี้ HH:mm น.')
                            } else if (isYesterday(message.created_at)) {
                                currentDate = format(message.created_at, 'เมื่อวานนี้ HH:mm น.')
                            }

                        } else if (!Number.isNaN(new Date(message.current_time).getTime())) {
                            currentDate = format(message.current_time, 'dd/MM HH:mm น.');
                            if (isToday(message.current_time)) {
                                currentDate = format(message.current_time, 'วันนี้ HH:mm น.')
                            } else if (isYesterday(message.current_time)) {
                                currentDate = format(message.current_time, 'เมื่อวานนี้ HH:mm น.')
                            }
                        } else {
                            currentDate = message.current_time;
                        }


                        return currentDate != null && currentDate != undefined && message.step_id !== 0 && message.step_id !== undefined && message.message != null && !message.message.includes("แนบ") ? (
                            <tr key={index}>
                                <td>{currentDate}</td>
                                <td>{message.sender == myId && 'คุณ'}{message.message}</td>
                            </tr>
                        ) : null;
                    })}

                </table>
            </Modal>

        </>
    );
}



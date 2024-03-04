import React, { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "../css/chat.css";
import * as Icon from "react-feather";
import * as ggIcon from "@mui/icons-material";
import "../styles/main.css";
import Scrollbars from 'react-scrollbars-custom';

import ImgFullscreen from './openFullPic'
import ChatOrderDetail from '../components/ChatOrderDetail'
import ChatAddModal from '../components/ChatAddModal'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Button, Checkbox, Input, Select, Space, Upload, Switch, Flex, Radio, InputNumber, Form } from 'antd';
import OrderSystemMsg from "./OrderSystemMsg";
import 'animate.css'
// import { format } from 'date-fns';
import QRCode from "qrcode.react";
import io from "socket.io-client";
import { useAuth } from '../context/AuthContext';

import { host } from "../utils/api";

const generatePayload = require("promptpay-qr");


const getBase64 = (file) =>
    new Promise((resolve, rreject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => rreject(error);
    });

export default function ChatContainer({ currentChat, test }) {
    const { userdata, socket } = useAuth();
    const token = localStorage.getItem("token");
    const [userid, setUserid] = useState();

    const [messages, setMessages] = useState([]);


    const scrollRef = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const queryParams = new URLSearchParams(window.location.search);

    const chat_order_id = queryParams.get("od_id");
    const partnerChat = queryParams.get("id");

    // เวลา วันที่
    const currentDate = new Date();
    const date = new Date();
    const date_now = date.toLocaleDateString("th-TH", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: "2-digit",
        minute: "2-digit",
    });
    const timestamp_chat = date_now.split(" ")[1];
    // const timestamp_chat = date_now;

    const [allSteps, setAllSteps] = useState()
    const [orderDetail, setOrderDetail] = useState()
    const orderId = useRef()
    const chatId = useRef()
    // console.log(chatId);
    const [form] = Form.useForm();
    const [allTou, setAllTou] = useState()
    const [touValue, setTouValue] = useState()
    const useridRef = useRef();

    // -------------------------------------------------qrgen-----------------------------------------------
    const [qrCode, setQrCode] = useState("sample");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [amount, setAmount] = useState();
    const [accName, setAccName] = useState();
    const payPrice = useRef();
    const firstPayPaid = useRef();

    // const getPayment = async () => {
    //   axios.get(`${host}/getPayment/order/${chat_order_id}`).then((response) => {
    //     const data = response.data;
    //     var pay;
    //     if (data.status === 'ok') {

    //       const payData = data.PaymentData[0];

    //       //ราคาทั้งหมดบวกกับค่าแก้ไข
    //       // setAmount(payData.allprice)
    //       setPhoneNumber(payData.urs_promptpay_number)
    //       setAccName(payData.urs_account_name)
    //       firstPayPaid.current = payData.od_first_pay //เชคว่าจ่ายยัง
    //       if (firstPayPaid.current == null) {
    //         //ถ้ายังไม่จ่ายครั้งแรก
    //         payPrice.current = payData.allprice / 2
    //         pay = payData.allprice / 2
    //         setQrCode(generatePayload(payData.urs_promptpay_number, { pay }));
    //         console.log(pay)

    //       } else {
    //         //ถ้าจ่ายครั้งแรกแล้ว ให้เอาราคาทั้งหมดไปรวมกันเลย
    //         payPrice.current = payData.allprice
    //         pay = payData.allprice
    //         setQrCode(generatePayload(payData.urs_promptpay_number, { pay }));
    //         console.log(pay)

    //       }
    //     } else {
    //       console.log('error');
    //     }
    //   })
    // }

    const getPayment = async () => {
        return new Promise((resolve, reject) => {
            axios.get(`${host}/getPayment/order/${chat_order_id}`).then((response) => {
                const data = response.data;
                var pay;
                if (data.status === 'ok') {
                    const payData = data.PaymentData[0];
                    //ราคาทั้งหมดบวกกับค่าแก้ไข
                    setAmount(payData?.allprice)
                    setPhoneNumber(payData?.urs_promptpay_number)
                    setAccName(payData?.urs_account_name)
                    firstPayPaid.current = payData?.od_first_pay //เชคว่าจ่ายยัง
                    if (firstPayPaid.current == null) {
                        //ถ้ายังไม่จ่ายครั้งแรก
                        payPrice.current = payData?.allprice / 2
                        pay = payData?.allprice / 2
                        setQrCode(generatePayload(payData.urs_promptpay_number, { pay }));
                        console.log(pay)
                    } else {
                        //ถ้าจ่ายครั้งแรกแล้ว ให้เอาราคาทั้งหมดไปรวมกันเลย
                        payPrice.current = payData?.allprice
                        pay = payData?.allprice
                        setQrCode(generatePayload(payData.urs_promptpay_number, { pay }));
                        console.log(pay)
                    }
                    resolve(); // Resolve เมื่อทำงานเสร็จสิ้น
                } else {
                    reject('Error fetching payment data'); // Reject หากเกิดข้อผิดพลาด
                }
            }).catch(error => {
                reject(error); // Reject หากเกิดข้อผิดพลาดในการเรียก API
            });
        });
    }
    // ทำงานเมื่อเปลี่ยน currentChat
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${host}/index`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                });
                const data = response.data;
                if (data.status === "ok") {
                    setUserid(data.users[0].id);
                    useridRef.current = data.users[0].id
                    console.log('ก็หาไอดีเจออยู่-------------' + data.users[0].id)
                }
                const getChatdata = await axios.post(
                    `${host}/messages/getmsg`,
                    {
                        from: data.users[0].id,
                        to: currentChat.id,
                        od_id: chat_order_id
                    }
                )
                const getOrderData = await axios.post(
                    `${host}/getorderdata`,
                    {
                        od_id: chat_order_id
                    }
                )
                if (chat_order_id !== 0) {
                    setOrderDetail(getOrderData.data);
                    await getCurrentStep()
                    await getAllSteps()
                }
                setMessages(getChatdata.data);
                orderId.current = chat_order_id
            } catch (error) {
                console.log("catch", error);
            }
        };
        const getTou = async () => {
            axios.get(`${host}/getalltou/${chat_order_id}`).then((response) => {
                setAllTou(response.data)
                setTouValue(response.data[0].old_tou)
                console.log(response.data)
            }
            )
        }

        getUser();
        getTou()
        if (chat_order_id !== null) {
            getPayment()
        }
    }, [currentChat]);

    const handleSendMsg = async (msg) => {
        //รับค่ามาและส่งแชทและแสดงผลแชทบนหน้าจอ
        socket.emit("send-msg", {
            to: currentChat.id,
            from: userid,
            msg,
            od_id: chat_order_id,
            timestamp_chat,
        });
        await axios.post(`${host}/messages/addmsg`, {
            from: userid,
            to: currentChat.id,
            message: msg,
            od_id: chat_order_id
        });
        setMessages((prevMessages) => [
            ...prevMessages,
            { fromSelf: true, message: msg, timestamp_chat: timestamp_chat },
        ]);
    }

    const [isBriefOpen, setIsBriefOpen] = useState(false)
    function handleBrief() {
        setIsBriefOpen(!isBriefOpen)
    }

    // รับข้อความ จะทำงานเมื่อมีการรับข้อความเท่านั้น
    useEffect(() => {
        if (socket) {
            socket.on("msg-receive", ({ img, msgId, msg, to, od_id, step_id, step_name, status, checked, isSystemMsg, from }) => {
                console.log("partnerChat : ", partnerChat);
                console.log("from : ", from);
                // เช็คเพื่อไม่ให้แชทไปแสดงที่คนอื่น
                if (partnerChat == from) {
                    if (od_id === orderId.current) {
                        setArrivalMessage({
                            img: img,
                            msgId: msgId,
                            fromSelf: false,
                            message: msg,
                            timestamp_chat: timestamp_chat,
                            created_at: currentDate,
                            step_id: step_id,
                            step_name: step_name,
                            od_id: od_id,
                            status: status,
                            checked: checked,
                            isSystemMsg: isSystemMsg
                        });
                    } else { // ข้อความแสดงกับแชทธรรมดา
                        setArrivalMessage({
                            img: img,
                            msgId: msgId,
                            fromSelf: false,
                            message: msg,
                            timestamp_chat: timestamp_chat,
                        })
                    }
                }
            })

            socket.on("update-order", async ({ msgId, to, od_id, deleted }) => {
                // setCurStepId(nowCurId)
                console.log(od_id + to === orderId.current + useridRef.current)
                console.log('เขา' + od_id + to)
                console.log('เรา' + orderId.current + useridRef.current)
                // userid หาไม่เจอ
                if (od_id + to === orderId.current + useridRef.current) {
                    await getCurrentStep()
                    setMessages((current) =>
                        current?.map((message) => (
                            message.msgId == msgId ? { ...message, checked: 1 } : message
                        ))
                    );
                    console.log('update-order ทำงาน')
                }
                if (deleted != undefined || deleted != null) {
                    setMessages((current) =>
                        current.filter((msg) => msg.msgId != msgId)
                    )
                }
                //ทุกครั้งที่มีการอัปเดตออเดอร์ให้เอาค่าปจบ.มา
            });

            socket.on("update-timeline", ({ to, od_id, nowCurId }) => {
                // alert("ฟังก์ชันปุ่มเขียวทำงาน" + od_id + orderId.current)
                if (od_id === orderId.current) {
                    setCurStepId(nowCurId)
                    // alert(nowCurId)
                }
            });

            socket.on("update-payment", async ({ to }) => {
                try {
                    getPayment()
                } catch (error) {

                }

            })
        }
    }, [socket]);

    useEffect(() => {
        arrivalMessage &&
            setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }, [arrivalMessage]);

    const chatbottom = useRef()
    useEffect(() => {
        chatbottom?.current.scrollIntoView({ behavior: 'smooth', block: "end" }); // เลื่อนมุมมองไปยังตำแหน่งสุดท้ายของข้อความทั้งหมด
    }, [messages.length]);
    useEffect(() => {
        orderId.current = chat_order_id
        chatbottom?.current.scrollIntoView({ behavior: 'smooth', block: "end" }); // เลื่อนมุมมองไปยังตำแหน่งสุดท้ายของข้อความทั้งหมด
    }, []);


    //*------------------------การดึงค่าสถานะ---------------------------------------------
    //stepid ปจบ.อันนี้สำหรับตุ่มเขียว
    const [curStepId, setCurStepId] = useState()

    const currentStepId = useRef()
    const currentStepName = useRef()
    const msgId = useRef()
    const [msgidUi, setMsgidUi] = useState();
    useEffect(() => {
        setMsgidUi(msgId.current)
    }, [msgId.current])
    //ดึงข้อมูลสเตปปัจจุบัน
    const getCurrentStep = async () => {
        try {
            const result = await axios.post(
                `${host}/getcurrentstep`,
                {
                    od_id: chat_order_id
                }
            );
            currentStepId.current = result.data.step_id;
            currentStepName.current = result.data.step_name;
            msgId.current = result.data.msgId;
        } catch (error) {
            console.error("Error fetching current stat:", error);
        }
    }

    useEffect(() => {
        //ที่ต้องมีเคอร์อันนี้สำหรับอัปเดตตุ่มเขียว
        //ของตัวเอง
        setCurStepId(currentStepId.current)
    }, [currentStepId.current])

    //ดึงสเตปทั้งหมดมา สำหรับโชว์
    const getAllSteps = async () => {
        const result = await axios.post(
            `${host}/getAllSteps`,
            {
                od_id: chat_order_id
            }
        )
        setAllSteps(result.data)
    }

    //อัปเดตสถานะปัจจุบัน
    //ถ้ามี msgid ส่งมา = เลือกลบ
    const updateMsg = (msgid) => {
        // alert(msgid)
        msgid == null || msgid == undefined ?
            setMessages(
                messages.map((message) => (
                    //ของเขาอัปแล้วแต่ของเรายังไม่อัปในกรณีที่เขาอนุมัติภาพแล้วและเรายังไม่อัปไอดีปัจจุบัน
                    message.msgId === msgId.current ? { ...message, checked: 1 } : message
                ))
            )

            //ลบภาพโปรเกสทิ้ง
            : setMessages((current) =>
                current.filter((msg) => msg.msgId != msgid)
            )
        console.log("updateMsg ทำงาน msgid = " + msgId.current)

        socket.emit("update-order", {
            to: currentChat.id,
            msgId: msgid == null || msgid == undefined ? msgId.current : msgid,
            od_id: chat_order_id,
            nowCurId: currentStepId.current,
            deleted: msgid
        });
        // console.log(messages);
    };



    //*--------------------------------------------------------------------

    //*------------------------อัปเดตสถานะ---------------------------------------------


    const updateSystemMsg = async ({ message, step_id, step_name, status, checked }) => {

        socket.emit("send-msg", {
            to: currentChat.id,
            from: userid,
            msg: message,
            timestamp_chat,
            step_id: step_id,
            step_name: step_name,
            od_id: chat_order_id,
            status: status,
            checked: checked,
            isSystemMsg: true,
            created_at: currentDate
        });

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                to: currentChat.id,
                from: userid,
                message: message,
                timestamp_chat,
                step_id: step_id,
                step_name: step_name,
                od_id: chat_order_id,
                status: status,
                checked: checked,
                isSystemMsg: true,
                created_at: currentDate
            },
        ]);

        await axios.post(`${host}/messages/addmsg`, {
            from: userid,
            to: currentChat.id,
            message: message,
            step_id: step_id,
            od_id: chat_order_id,
            status: status,
            checked: checked,
        })

        // setMessages((prevMessages) => [
        //   ...prevMessages,
        //   {
        //     to: currentChat.id,
        //     from: userid,
        //     message: "รับคำขอจ้างแล้ว",
        //     timestamp_chat,
        //     step_id: currentStepId.current,
        //     step_name: currentStepName.current,
        //     od_id: chat_order_id,
        //     status: "a",
        //     checked: 1,
        //     isSystemMsg: true,
        //     created_at: currentDate
        //   },
        // ]);

    }

    async function updateOrder({ step_id }) {
        const res = await axios.post(
            `${host}/messages/updatestep`,
            {
                step_id: step_id,
                od_id: chat_order_id,
            }
        );
        //res จะส่งค่าข้อมูลปัจจุบันออกมา
        //ไปอัปเดตตุ่มเขียว+ไปสเตปต่อไป
        currentStepId.current = res.data.step_id;
        currentStepName.current = res.data.step_name;
        msgId.current = res.data.msgId;


    }



    //รับคำขอจ้าง
    const acceptRequest = (step_id, step_name) => {
        Swal.fire({
            title: `ยอมรับคำขอจ้างนี้หรือไม่`,
            showCancelButton: true,
            icon: "question",
            confirmButtonText: "ยอมรับ",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                // getPayment();
                // แจ้งเตือนเมื่อยอมรับ
                const acceptOrder = {
                    sender_id: userid,
                    sender_name: userdata.urs_name,
                    sender_img: userdata.urs_profile_img,
                    order_id: chat_order_id,
                    receiver_id: currentChat.id,
                    msg: 'รับคำขอจ้าง'
                }
                socket.emit('acceptOrder', acceptOrder);
                await axios.post(`${host}/noti/order/add`, acceptOrder);

                //1.1 ไปอัปเดต ui ให้เป็นเช็ค 1
                updateMsg()
                //1.2 อัปเดตฐานข้อมูลเป็นเช็ค1
                await axios.post(
                    //แค่อัปเดตให้เป็น 1 พอ
                    `${host}/messages/updatestep`,
                    {
                        step_id: step_id,
                        od_id: chat_order_id,
                    }
                );
                //2.1 อัปเดตui ของเขา

                // socket.emit("send-msg", {
                //   to: currentChat.id,
                //   from: userid,
                //   msg: "รับคำขอจ้างแล้ว",
                //   timestamp_chat,
                //   step_id: currentStepId.current,
                //   step_name: currentStepName.current,
                //   od_id: chat_order_id,
                //   status: "a",
                //   checked: 1,
                //   isSystemMsg: true,
                //   created_at: currentDate
                // });

                //2.2 ส่งuiเราว่ารับคำขอจ้างแล้ว
                // setMessages((prevMessages) => [
                //   ...prevMessages,
                //   {
                //     to: currentChat.id,
                //     from: userid,
                //     message: "รับคำขอจ้างแล้ว",
                //     timestamp_chat,
                //     step_id: currentStepId.current,
                //     step_name: currentStepName.current,
                //     od_id: chat_order_id,
                //     status: "a",
                //     checked: 1,
                //     isSystemMsg: true,
                //     created_at: currentDate
                //   },
                // ]);

                await updateSystemMsg({
                    message: "รับคำขอจ้างแล้ว",
                    step_id: currentStepId.current,
                    step_name: currentStepName.current,
                    status: "a",
                    checked: 1,
                })

                //อัปเดตให้รับคำขอจ้างเสร็จ checked_at
                await updateOrder({
                    step_id: currentStepId.current,
                })
                Swal.fire("ยอมรับคำขอจ้างนี้แล้ว", "", "success");

            }
        });
    };

    //ไม่ยอมรับคำขอจ้าง
    const cancelRequest = (step_id, step_name) => {
        Swal.fire({
            title: `ปฏิเสธคำขอจ้างนี้หรือไม่`,
            showCancelButton: true,
            icon: "question",
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                // getPayment();
                // แจ้งเตือนเมื่อยอมรับ
                const acceptOrder = {
                    sender_id: userid,
                    sender_name: userdata.urs_name,
                    sender_img: userdata.urs_profile_img,
                    order_id: chat_order_id,
                    receiver_id: currentChat.id,
                    msg: 'รับคำขอจ้าง'
                }
                socket.emit('acceptOrder', acceptOrder);
                await axios.post(`${host}/noti/order/add`, acceptOrder);

                //1.1 ไปอัปเดต ui ให้เป็นเช็ค 1
                updateMsg()
                //1.2 อัปเดตฐานข้อมูลเป็นเช็ค1
                const result = await axios.post(
                    //แค่อัปเดตให้เป็น 1 พอ
                    `${host}/messages/updatestep`,
                    {
                        step_id: step_id,
                        od_id: chat_order_id,
                    }
                );

                //2.1 อัปเดตui ของเขา
                socket.emit("send-msg", {
                    to: currentChat.id,
                    from: userid,
                    msg: "ปฏิเสธคำขอจ้างแล้ว",
                    timestamp_chat,
                    step_id: currentStepId.current,
                    step_name: currentStepName.current,
                    od_id: chat_order_id,
                    status: "c",
                    checked: 1,
                    isSystemMsg: true,
                    created_at: currentDate
                });

                //2.2 ส่งuiเราว่คำขอจ้างแล้ว
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        to: currentChat.id,
                        from: userid,
                        message: "ปฏิเสธคำขอจ้างแล้ว",
                        timestamp_chat,
                        step_id: currentStepId.current,
                        step_name: currentStepName.current,
                        od_id: chat_order_id,
                        status: "c",
                        checked: 1,
                        isSystemMsg: true,
                        created_at: currentDate
                    },
                ]);
                //2.3 เพิ่มเข้าดาต้าเบส
                await axios.post(`${host}/messages/addmsg`, {
                    from: userid,
                    to: currentChat.id,
                    message: "ปฏิเสธคำขอจ้างแล้ว",
                    step_id: currentStepId.current,
                    od_id: chat_order_id,
                    status: "a",
                    checked: 1,
                })

                //! อัปเดตให้ยกเลิก ยังไม่เขียนน
                const res = await axios.post(
                    `${host}/messages/updatestep`,
                    {
                        step_id: currentStepId.current,
                        od_id: chat_order_id,
                    }
                );

                Swal.fire("ปฏิเสธคำขอจ้างนี้แล้ว", "", "success");
            }
        });
    };

    //อนุมัติโปรเกส
    const approveProgress = (step_id, step_name) => {
        let nextStep;
        Swal.fire({
            title: "อนุมัติภาพนี้หรือไม่",
            showCancelButton: true,
            icon: "question",
            confirmButtonText: "อนุมัติ",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {


                // socket.emit("send-msg", {
                //   msgId: msgId.current,
                //   to: currentChat.id,
                //   from: userid,
                //   msg: `อนุมัติ${step_name}แล้ว`,
                //   timestamp_chat,
                //   step_id: step_id,
                //   step_name: step_name,
                //   od_id: chat_order_id,
                //   status: "a",
                //   checked: 1,
                //   isSystemMsg: true,
                //   created_at: currentDate
                // });
                console.log(currentStepId.current)
                // await axios.post(`${host}/messages/addmsg`, {
                //   from: userid,
                //   to: currentChat.id,
                //   step_id: step_id,
                //   message: `อนุมัติ${step_name}แล้ว`,
                //   od_id: chat_order_id,
                //   status: "a",
                //   checked: 1,
                // })
                updateMsg()
                //อันนี้คือเพิ่มของตัวเอง
                // setMessages((prevMessages) => [
                //   ...prevMessages,
                //   {
                //     to: currentChat.id,
                //     from: userid,
                //     message: `อนุมัติ${step_name}แล้ว`,
                //     timestamp_chat,
                //     step_id: step_id,
                //     step_name: step_name,
                //     od_id: chat_order_id,
                //     status: "a",
                //     checked: 1,
                //     isSystemMsg: true,
                //     created_at: currentDate
                //   },
                // ]);

                await updateSystemMsg({
                    message: `อนุมัติ${step_name}แล้ว`,
                    step_id: step_id,
                    step_name: step_name,
                    status: "a",
                    checked: 1,
                })

                const result = await axios.post(
                    `${host}/messages/updatestep`,
                    {
                        step_id: step_id,
                        od_id: chat_order_id,
                    }
                );
                currentStepId.current = result.data.step_id;
                currentStepName.current = result.data.step_name;
                msgId.current = result.data.msgId;
                nextStep = result.data.step_name
                socket.emit("update-timeline", {
                    to: currentChat.id,
                    od_id: chat_order_id,
                    nowCurId: currentStepId.current
                })
                //ตรงนี้ msgId จะไม่มีแล้ว เพราะเสร็จหมดแล้ว


            }
            //ถ้าเป็นภาพร่างให้ส่งระบุราคาไป
            if (step_name.includes("ภาพร่าง")) {
                try {
                    await axios.post(`${host}/messages/addmsg`, {
                        from: userid,
                        to: currentChat.id,
                        step_id: currentStepId.current,
                        message: "ระบุราคาคอมมิชชัน",
                        od_id: chat_order_id,
                        checked: 0,
                    });
                    // ทำการ await ก่อนที่จะทำ getCurrentStep()
                    await getCurrentStep();
                    socket.emit("send-msg", {
                        msgId: msgId.current,
                        to: currentChat.id,
                        from: userid,
                        msg: `ระบุราคาคอมมิชชัน`,
                        timestamp_chat,
                        step_id: currentStepId.current,
                        step_name: currentStepName.current,
                        od_id: chat_order_id,
                        checked: 0,
                        isSystemMsg: true,
                        created_at: currentDate
                    });
                } catch (error) {
                    console.error("An error occurred:", error);
                }
            }

            else if (nextStep.includes("แนบสลิป2")) {
                try {
                    await axios.post(`${host}/messages/addmsg`, {
                        from: userid,
                        to: currentChat.id,
                        step_id: currentStepId.current,
                        message: `กรุณาแนบใบเสร็จชำระเงิน2`,
                        od_id: chat_order_id,
                        checked: 0,
                    })

                    await getCurrentStep();
                    socket.emit("send-msg", {
                        msgId: msgId.current,
                        to: currentChat.id,
                        from: userid,
                        msg: `กรุณาแนบใบเสร็จชำระเงิน2`,
                        timestamp_chat,
                        step_id: currentStepId.current,
                        step_name: currentStepName.current,
                        od_id: chat_order_id,
                        checked: 0,
                        isSystemMsg: true,
                        created_at: currentDate
                    })
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            msgId: msgId.current,
                            to: currentChat.id,
                            from: userid,
                            message: `กรุณาแนบใบเสร็จชำระเงิน2`,
                            timestamp_chat,
                            step_id: currentStepId.current,
                            step_name: currentStepName.current,
                            od_id: chat_order_id,
                            checked: 0,
                            isSystemMsg: true,
                            created_at: currentDate
                        }
                    ])

                } catch (error) {

                }

            }

            Swal.fire("อนุมัติภาพแล้ว", "", "success");
        });
    }

    //แก้ไขโปรเกส
    const editProgress = (step_id, step_name) => {
        let title;
        if (orderDetail.pkg_edits <= orderDetail.od_number_of_edit) {
            title = 'การแก้ไขครั้งนี้มีค่าใช้จ่าย ต้องการแจ้งแก้ไขภาพนี้หรือไม่'
        } else {
            title = 'ต้องการแจ้งแก้ไขภาพนี้หรือไม่'
        }
        Swal.fire({
            title: title,
            showCancelButton: true,
            icon: "question",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    socket.emit("send-msg", {
                        to: currentChat.id,
                        from: userid,
                        msg: `แจ้งแก้ไข${step_name}แล้ว`,
                        timestamp_chat,
                        step_id: step_id,
                        step_name: step_name,
                        od_id: chat_order_id,
                        status: "e",
                        checked: 1,
                        isSystemMsg: true,
                        created_at: currentDate
                    });
                    await axios.post(`${host}/messages/addmsg`, {
                        from: userid,
                        to: currentChat.id,
                        message: `แจ้งแก้ไข${step_name}แล้ว`,
                        step_id: step_id,
                        od_id: chat_order_id,
                        status: "e",
                        checked: 1,
                    })
                    updateMsg()

                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            to: currentChat.id,
                            from: userid,
                            isSystemMsg: true,
                            created_at: currentDate,
                            step_name: step_name,
                            step_id: step_id,
                            message: `แจ้งแก้ไข${step_name}แล้ว`,
                            od_id: chat_order_id,
                            status: "e",
                            checked: 1,
                            timestamp_chat: timestamp_chat
                        },
                    ]);

                    Swal.fire("แจ้งแก้ไขภาพแล้ว", "", "success");
                    const result = await axios.post(
                        `${host}/messages/updatestep`,
                        {
                            step_id: step_id,
                            od_id: chat_order_id,
                            od_edit: true
                        }
                    );
                }
            })


            ;
    }

    //ลบรูป
    const delProgress = (step_id, step_name, msgid) => {
        Swal.fire({
            title: "ลบภาพนี้หรือไม่",
            showCancelButton: true,
            icon: "question",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    setMessages((current) =>
                        current.filter((msg) => msg.msgId != msgid)
                    )
                    updateMsg(msgid)
                    Swal.fire("ลบภาพแล้ว", "", "success");
                    const result = await axios.post(
                        `${host}/messages/updatestep`,
                        {
                            step_id: step_id,
                            od_id: chat_order_id,
                            deleted: true
                        }
                    )
                    currentStepId.current = result.data.step_id;
                    currentStepName.current = result.data.step_name;
                    msgId.current = result.data.msgId;

                }
            });
    }

    // ตั้งราคา --------------------
    const setPrice = (step_id, step_name, price) => {
        console.log(price)
        Swal.fire({
            title: `กำหนดเป็นราคา ${price} บาทใช่หรือไม่`,
            // showDenyButton: true,
            showCancelButton: true,
            icon: "question",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await getCurrentStep()
                        socket.emit("send-msg", {
                            to: currentChat.id,
                            from: userid,
                            msg: `กำหนดราคาคอมมิชชันนี้ ${price} บาท`,
                            timestamp_chat,
                            step_id: step_id,
                            step_name: step_name,
                            od_id: chat_order_id,
                            status: "a",
                            checked: 1,
                            isSystemMsg: true,
                            created_at: currentDate
                        });
                        console.log(currentStepId.current)
                        updateMsg()
                        await axios.post(`${host}/messages/addmsg`, {
                            from: userid,
                            to: currentChat.id,
                            message: `กำหนดราคาคอมมิชชันนี้ ${price} บาท`,
                            step_id: step_id,
                            od_id: chat_order_id,
                            status: "a",
                            checked: 1,
                        })

                        setMessages((prevMessages) => [
                            ...prevMessages,
                            {
                                to: currentChat.id,
                                from: userid,
                                message: `กำหนดราคาคอมมิชชันนี้ ${price} บาท`,
                                timestamp_chat,
                                step_id: step_id,
                                step_name: step_name,
                                od_id: chat_order_id,
                                status: "a",
                                checked: 1,
                                isSystemMsg: true,
                                created_at: currentDate
                            },
                        ]);

                        const result = await axios.post(
                            `${host}/messages/updatestep`,
                            {
                                step_id: step_id,
                                od_id: chat_order_id,
                                od_price: price,
                            }
                        );
                        currentStepId.current = result.data.step_id;
                        currentStepName.current = result.data.step_name;
                        msgId.current = result.data.msgId;
                        socket.emit("update-timeline", {
                            to: currentChat.id,
                            od_id: chat_order_id,
                            nowCurId: currentStepId.current
                        })

                        //--ตั้งราคาสำเร็จและอัปเดตทุกอย่างแล้ว---
                        getPayment()
                        await socket.emit("update-payment", {
                            to: currentChat.id,
                        })
                        //ให้มันแนบสลิปต่อ

                        console.log("หลัง await")
                        await axios.post(`${host}/messages/addmsg`, {
                            from: userid,
                            to: currentChat.id,
                            step_id: currentStepId.current,
                            message: `กรุณาแนบใบเสร็จชำระเงิน`,
                            od_id: chat_order_id,
                            checked: 0,
                        }).then(
                            // console.log("ส่งแนบสลิป")
                            socket.emit("send-msg", {
                                msgId: msgId.current,
                                to: currentChat.id,
                                from: userid,
                                msg: `กรุณาแนบใบเสร็จชำระเงิน`,
                                timestamp_chat,
                                step_id: currentStepId.current,
                                step_name: currentStepName.current,
                                od_id: chat_order_id,
                                checked: 0,
                                isSystemMsg: true,
                                created_at: currentDate
                            }),
                            setMessages((prevMessages) => [
                                ...prevMessages,
                                {
                                    msgId: msgId.current,
                                    to: currentChat.id,
                                    from: userid,
                                    message: `กรุณาแนบใบเสร็จชำระเงิน`,
                                    timestamp_chat,
                                    step_id: currentStepId.current,
                                    step_name: currentStepName.current,
                                    od_id: chat_order_id,
                                    checked: 0,
                                    isSystemMsg: true,
                                    created_at: currentDate
                                }
                            ])
                        )
                        Swal.fire("ตั้งราคาแล้ว", "", "success");
                    } catch (error) {
                    }
                }
            });
    }

    //แนบสลิปแล้ว
    function submitSlip(step_id, step_name,) {
        return new Promise((resolve) => {
            Swal.fire({
                title: `อัปโหลดใบเสร็จชำระเงินนี้หรือไม่`,
                showCancelButton: true,
                icon: "question",
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire("อัปโหลดสลิปแล้ว", "", "success");
                    await getCurrentStep()
                    updateMsg()
                    const result = await axios.post(
                        `${host}/messages/updatestep`,
                        {
                            step_id: step_id,
                            od_id: chat_order_id,
                        }
                    );
                    currentStepId.current = result.data.step_id;
                    currentStepName.current = result.data.step_name;
                    msgId.current = result.data.msgId;
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            to: currentChat.id,
                            from: userid,
                            msgId: msgId.current,
                            isSystemMsg: true,
                            created_at: currentDate,
                            step_id: currentStepId.current,
                            step_name: currentStepName.current,
                            message: "แนบใบเสร็จชำระเงินแล้ว",
                            od_id: orderId.current,
                            checked: 0,
                            timestamp_chat: timestamp_chat,
                        },
                    ]);
                    socket.emit("send-msg", {
                        msgId: msgId.current,
                        to: currentChat.id,
                        from: userid,
                        msg: "แนบใบเสร็จชำระเงินแล้ว",
                        timestamp_chat,
                        step_id: currentStepId.current,
                        step_name: currentStepName.current,
                        od_id: chat_order_id,
                        checked: 0,
                        created_at: currentDate,
                        isSystemMsg: true
                    });

                    //ไปขั้นตอนใหม่แล้วคือขั้นชำระเงินขั้นแรก
                    await axios.post(`${host}/messages/addmsg`, {
                        from: userid,
                        to: currentChat.id,
                        step_id: currentStepId.current,
                        message: "แนบใบเสร็จชำระเงินแล้ว",
                        od_id: chat_order_id,
                        checked: 0,
                    })

                    socket.emit("update-timeline", {
                        to: currentChat.id,
                        od_id: chat_order_id,
                        nowCurId: currentStepId.current
                    })
                    Swal.fire("อัปโหลดสลิปแล้ว", "", "success");
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });


        // Swal.fire({
        //   title: `อัปโหลดใบเสร็จชำระเงินนี้หรือไม่${msgId.current}`,
        //   // showDenyButton: true,
        //   showCancelButton: true,
        // icon : "question",
        //   confirmButtonText: "ตกลง",
        //   cancelButtonText: "ปิด",
        // })
        //   .then(async (result) => {
        //     if (result.isConfirmed) {
        //       await updateMsg()
        //       const result = await axios.post(
        //         `${host}/messages/updatestep`,
        //         {
        //           step_id: step_id,
        //           od_id: chat_order_id,
        //         }
        //       );
        //       currentStepId.current = result.data.step_id;
        //       currentStepName.current = result.data.step_name;
        //       msgId.current = result.data.msgId;
        //       setMessages((prevMessages) => [
        //         ...prevMessages,
        //         {
        //           to: currentChat.id,
        //           from: userid,
        //           msgId: msgId.current,
        //           isSystemMsg: true,
        //           created_at: currentDate,
        //           step_id: currentStepId.current,
        //           step_name: currentStepName.current,
        //           message: "แนบใบเสร็จชำระเงินแล้ว",
        //           od_id: orderId.current,
        //           checked: 0,
        //           timestamp_chat: timestamp_chat,
        //         },
        //       ]);


        //       socket.current.emit("send-msg", {
        //         msgId: msgId.current,
        //         to: currentChat.id,
        //         from: userid,
        //         msg: "แนบใบเสร็จชำระเงินแล้ว",
        //         timestamp_chat,
        //         step_id: currentStepId.current,
        //         step_name: currentStepName.current,
        //         od_id: chat_order_id,
        //         checked: 0,
        //         created_at: currentDate,
        //         isSystemMsg: true
        //       });

        //       //ไปขั้นตอนใหม่แล้วคือขั้นชำระเงินขั้นแรก
        //       await axios.post(`${host}/messages/addmsg`, {
        //         from: userid,
        //         to: currentChat.id,
        //         step_id: currentStepId.current,
        //         message: "แนบใบเสร็จชำระเงินแล้ว",
        //         od_id: chat_order_id,
        //         checked: 0,
        //       })

        //       socket.current.emit("update-timeline", {
        //         to: currentChat.id,
        //         od_id: chat_order_id,
        //         nowCurId: currentStepId.current
        //       })
        //       Swal.fire("อัปโหลดสลิปแล้ว", "", "success");
        //       return true
        //     }
        //   });
    }

    //ยอมรับสลิป = ขั้นตอนชำระเงิน
    function approveSlip(step_id, step_name, time) {
        Swal.fire({
            title: `ยอมรับใบเสร็จชำระเงินนี้หรือไม่`,
            // showDenyButton: true,
            showCancelButton: true,
            icon: "question",
            confirmButtonText: "ยอมรับ",
            cancelButtonText: "ยกเลิก",
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    socket.emit("send-msg", {
                        to: currentChat.id,
                        from: userid,
                        msg: `ตรวจสอบใบเสร็จชำระเงินแล้ว ${!step_name?.includes('2') ? 'การชำระเงินครึ่งแรกสำเร็จ' : 'การชำระเงินครึ่งหลังสำเร็จ'}`,
                        timestamp_chat,
                        step_id: step_id,
                        step_name: step_name,
                        od_id: chat_order_id,
                        status: "a",
                        checked: 1,
                        isSystemMsg: true,
                        created_at: currentDate
                    });
                    console.log(currentStepId.current)
                    await axios.post(`${host}/messages/addmsg`, {
                        from: userid,
                        to: currentChat.id,
                        step_id: step_id,
                        message: `ตรวจสอบใบเสร็จชำระเงินแล้ว ${!step_name?.includes('2') ? 'การชำระเงินครึ่งแรกสำเร็จ' : 'การชำระเงินครึ่งหลังสำเร็จ'}`,
                        od_id: chat_order_id,
                        status: "a",
                        checked: 1,
                    })
                    updateMsg()
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            to: currentChat.id,
                            from: userid,
                            status: "a",
                            isSystemMsg: true,
                            created_at: currentDate,
                            step_name: step_name,
                            step_id: step_id,
                            message: `ตรวจสอบใบเสร็จชำระเงินแล้ว ${!step_name?.includes('2') ? 'การชำระเงินครึ่งแรกสำเร็จ' : 'การชำระเงินครึ่งหลัง'}`,
                            od_id: chat_order_id,
                            checked: 1,
                            timestamp_chat: timestamp_chat
                        },
                    ]);

                    const result = await axios.post(
                        `${host}/messages/updatestep`,
                        {
                            step_id: step_id,
                            od_id: chat_order_id,
                            paid: payPrice.current,
                            first_pay_paid: firstPayPaid.current
                        }
                    );
                    currentStepId.current = result.data.step_id;
                    currentStepName.current = result.data.step_name;
                    msgId.current = result.data.msgId;
                    socket.emit("update-timeline", {
                        to: currentChat.id,
                        od_id: chat_order_id,
                        nowCurId: currentStepId.current
                    })

                    Swal.fire("ยอมรับสลิปแล้ว", "", "success");
                }
            });
    }

    //ไม่ยอมรับสลิป = ขั้นตอนชำระเงิน
    function rejectSlip(step_id, step_name, time) {
        Swal.fire({
            title: `ปฏิเสธใบเสร็จชำระเงินนี้หรือไม่`,
            showCancelButton: true,
            icon: "question",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    socket.emit("send-msg", {
                        to: currentChat.id,
                        from: userid,
                        msg,
                        timestamp_chat,
                        step_id: step_id,
                        od_id: chat_order_id,
                        checked: 1,
                        created_at: currentDate
                    });
                    console.log(currentStepId.current)
                    await axios.post(`${host}/messages/addmsg`, {
                        from: userid,
                        to: currentChat.id,
                        step_id: step_id,
                        message: "ยกเลิกใบเสร็จชำระเงินแล้ว",
                        od_id: chat_order_id,
                        status: "e",
                        checked: 1,
                    })
                    currentStepId.current = result.data.step_id;
                    currentStepName.current = result.data.step_name;
                    msgId.current = result.data.msgId;
                    updateMsg()

                    console.log("เก้ทสแตทปจบ", currentStepId.current)
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { isSystemMsg: true, created_at: currentDate, step_name: stepName, step_id: step_id, message: "ยกเลิกใบเสร็จชำระเงินแล้ว", od_id: orderId.current, checked: 0, timestamp_chat: timestamp_chat },
                    ]);
                    Swal.fire("ยกเลิกสลิปแล้ว", "", "success");
                }
            });
    }

    const sendReview = async () => {

        //1.1 ไปอัปเดต ui ให้เป็นเช็ค 1
        updateMsg()

        //อัปเดตให้ checked_at
        await axios.post(
            `${host}/messages/updatestep`,
            {
                step_id: currentStepId.current,
                od_id: chat_order_id
            }
        );

        Swal.fire("รีวิวสำเร็จแล้ว", "", "success");
    }

    //*---------------------------------------------------------------------

    const handleSendImage = async (image) => {
        const formData = new FormData();
        formData.append("from", userid);
        formData.append("to", currentChat.id);
        formData.append("image", image);
        console.log(formData);
        await axios
            .post(`${host}/messages/addmsg`, formData, {})
            .then((response) => {
                const data = response.data;
                let msg = data.image_chat;
                socket.emit("send-msg", {
                    to: currentChat.id,
                    from: userid,
                    msg,
                    timestamp_chat,
                });
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { fromSelf: true, message: msg, timestamp_chat: timestamp_chat },
                ]);
            });
    };

    const [msg, setMsg] = useState("");
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("No selected file");
    const [previewUrl, setPreviewUrl] = useState("");

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setImage(file);
        setFileName(file.name);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("");
        } else {
            // console.log(image);
            handleSendImage(image);
        }
    };

    const [fullImgOpened, setFullImgOpened] = useState(false)
    const [src, setSrc] = useState("")

    const handleFullImg = (imgsrc) => {
        console.log("คลิกฟังชันโชว์", imgsrc)
        setFullImgOpened(prevState => !prevState)
        setSrc(imgsrc)
    }
    const [showOderDetailModal, setShowOrderDetailModal] = useState(false);
    const handleOdModal = () => {
        setShowOrderDetailModal(prevState => !prevState)
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        getAllSteps()
        setIsModalOpen(true);
        currentStepName?.current?.includes('ภาพ') && currentStepId?.current !== allSteps[0].wip_sent && setValue(currentStepId?.current)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setPage("0")
    };

    const [page, setPage] = useState("0")
    function handlePage(pagenumber) {
        setPage(pagenumber)
    }

    const [value, setValue] = useState();
    const [stepName, setStepName] = useState();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    const handleCancelPreview = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
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
    );

    const props = {
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    //ส่งโปรเกส
    const onFinish = async (values) => {
        // event.preventDefault();
        Swal.fire({
            title: "ส่ง" + currentStepName?.current + "หรือไม่",
            showCancelButton: true,
            icon: "question",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {

            if (result.isConfirmed) {
                axios.post(`${host}/messages/addmsg`, {
                    from: userid,
                    to: currentChat.id,
                    step_id: value,
                    message: `ส่ง${currentStepName.current}แล้ว`,
                    od_id: chat_order_id,
                    checked: 0,
                }).then(async () => {
                    console.log('ทำงาน');
                    await getCurrentStep()
                    console.log(msgId.current)
                    const formData = new FormData();
                    fileList.forEach((file) => {
                        formData.append("image_file", file.originFileObj);
                    });
                    axios
                        .post(`${host}/upload-img/progress/${msgId.current}`, formData, {
                            headers: {
                                Authorization: "Bearer " + token,
                                "Content-type": "multipart/form-data",
                            },
                        }).then((response) => {
                            const data = response.data;
                            console.log("data ", data);
                            if (data.status === 'ok') {
                                console.log(data.att_img_path);
                                socket.emit("send-msg", {
                                    img: data.att_img_paths == undefined ? data.att_img_path : data.att_img_paths,
                                    msgId: msgId.current,
                                    to: currentChat.id,
                                    from: userid,
                                    msg: `ส่ง${currentStepName.current}แล้ว`,
                                    timestamp_chat,
                                    step_id: value,
                                    step_name: currentStepName.current,
                                    od_id: chat_order_id,
                                    checked: 0,
                                    isSystemMsg: true,
                                    created_at: currentDate
                                });
                                // console.log(currentStepId.current)
                                //ใส่ไอดีแชทให้ตอนแสดงผลให้ตัวเอง
                                setMessages((prevMessages) => [
                                    ...prevMessages,
                                    {
                                        //เอาพาธมาใส่ตรงนี้
                                        img: data.att_img_paths == undefined ? data.att_img_path : data.att_img_paths,
                                        msgId: msgId.current,
                                        to: currentChat.id,
                                        from: userid,
                                        message: `ส่ง${currentStepName.current}แล้ว`,
                                        timestamp_chat,
                                        step_id: value,
                                        step_name: currentStepName.current,
                                        od_id: chat_order_id,
                                        checked: 0,
                                        status: null,
                                        isSystemMsg: true,
                                        created_at: currentDate
                                    },
                                ]);
                                Swal.fire("ส่งภาพแล้ว", "", "success");
                                handleCancel()
                                setFileList([])

                            } else {
                                // alert('ไม่ทำงาน')
                            }
                        })
                })


            }

        })

        //เอาสเตตัสปจบ.มา+เอาไอดีของแชทที่ดึงออกมาด้วย


    }


    // -------------------------------------------------changeOrder-----------------------------------------------
    const [checkPrice, setCheckPrice] = useState(false)
    const [checkTou, setCheckTou] = useState(false)
    function submitChangeOrder(values) {
        Swal.fire({
            title: `เปลี่ยนแปลงออเดอร์หรือไม่`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                var newTouName;
                allTou?.map((tou) => {
                    if (tou.tou_id == touValue) {
                        newTouName = tou.tou_name
                    }
                })
                handleCancel()
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        to: currentChat.id,
                        from: userid,
                        message:
                            (checkPrice ? `เปลี่ยนจากราคา ${orderDetail.od_price} บาท ⇒ ${values.new_price} บาท` : '') +
                            (checkTou && allTou[0].old_tou !== touValue ? ` เปลี่ยนประเภทการใช้งานจาก ${allTou[0].old_tou_name} ⇒ ${newTouName}` : ''),
                        timestamp_chat,
                        step_id: 0,
                        step_name: currentStepName.current,
                        od_id: chat_order_id,
                        status: "e",
                        checked: null,
                        isSystemMsg: true,
                        created_at: currentDate
                    }
                ])
                // setOrderDetail(orderDetail.od_price = values.new_price)
                socket.emit("send-msg", {
                    to: currentChat.id,
                    from: userid,
                    msg: (checkPrice ? `เปลี่ยนจากราคา ${orderDetail.od_price} บาท ⇒ ${values.new_price} บาท` : '') +
                        (checkTou && allTou[0].old_tou !== touValue ? ` เปลี่ยนประเภทการใช้งานจาก ${allTou[0].old_tou_name} ⇒ ${newTouName}` : ''),
                    timestamp_chat,
                    step_id: 0,
                    step_name: currentStepName.current,
                    od_id: chat_order_id,
                    status: "e",
                    checked: null,
                    isSystemMsg: true,
                    created_at: currentDate
                });

                await axios.post(`${host}/messages/addmsg`, {
                    from: userid,
                    to: currentChat.id,
                    message: (checkPrice ? `เปลี่ยนจากราคา ${orderDetail.od_price} บาท ⇒ ${values.new_price} บาท` : '') +
                        (checkTou && allTou[0].old_tou !== touValue ? ` เปลี่ยนประเภทการใช้งานจาก ${allTou[0].old_tou_name} ⇒ ${newTouName}` : ''),
                    step_id: 0,
                    od_id: chat_order_id,
                    status: "e",
                    checked: 1,
                });

                // setAllTou(allTou[0].old_tou = touValue)
                // setOrderDetail({ ...orderDetail, od_price: values.new_price });
                // setAllTou({ ...allTou, old_tou: touValue })
                var newold;
                await axios.post(
                    `${host}/changeorder`,
                    {
                        od_id: chat_order_id,
                        od_price: values.new_price,
                        tou_id: touValue,
                        checkPrice: checkPrice,
                        checkTou: checkTou
                    },
                    checkPrice && setOrderDetail({ ...orderDetail, od_price: values.new_price }),
                    checkTou && setAllTou({ ...allTou, old_tou: touValue }),
                    newold = allTou.map((item) => {
                        return { ...item, old_tou: touValue, old_tou_name: newTouName }
                    }),
                    setAllTou(newold),
                    Swal.fire("เปลี่ยนแปลงออเดอร์แล้ว", "", "success")
                )


            }


        })



    }

    return (
        <>
            {/* <div>
          <QRCode value={qrCode} />
        </div> */}
            <ImgFullscreen src={src} opened={fullImgOpened} handleFullImg={handleFullImg} acceptRequest={acceptRequest} />
            {showOderDetailModal ? <ChatOrderDetail myId={userid} isBriefOpen={isBriefOpen} handleBrief={handleBrief} currentStep={curStepId} messages={messages} currentStepName={currentStepName.current} allSteps={allSteps} orderDetail={orderDetail} handleOdModal={handleOdModal} showOderDetailModal={showOderDetailModal} /> : null}

            <Modal width={1000} title="" open={isModalOpen} footer="" onCancel={handleCancel}>
                {/* <ChatAddModal /> */}
                <div className="form-order">
                    {page == "0" && <>
                        <p className="h5">ส่งรูปภาพ</p>
                        <button className="add-item" onClick={() => handlePage("1")}>
                            <div className="icon-div"><Icon.Image /></div>
                            <p className="text">แนบไฟล์ภาพ</p>
                        </button>
                        {orderDetail?.artist_id == userid &&
                            <><p className="h5">เกี่ยวกับออเดอร์</p>
                                <button className="add-item" onClick={() => handlePage("2")}>
                                    <div className="icon-div"><Icon.Upload /></div>
                                    <p className="text">ส่งความคืบหน้าของงาน</p>
                                </button>
                                <button className="add-item" onClick={() => handlePage("3")} >
                                    <div className="icon-div"><Icon.Briefcase /></div>
                                    <p className="text">เปลี่ยนแปลงประเภทการใช้และราคา<Icon.Info /></p>
                                </button></>}


                    </>}
                    {page == "1" &&
                        <>
                            <form
                                id="sendImage"
                                onClick={() => document.querySelector(".input-field").click()}
                                className="dragNdrop"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onSubmit={(event) => sendChat(event)}
                                style={{ width: "100%", marginTop: "1rem" }}
                            >
                                <input
                                    type="file"
                                    accept="image/png ,image/gif ,image/jpeg"
                                    className="input-field"

                                    hidden
                                    onChange={({ target: { files } }) => {
                                        files[0] && setFileName(files[0].name);
                                        if (files) {
                                            setImage(files[0]);
                                            setPreviewUrl(URL.createObjectURL(files[0]));
                                        }
                                    }}
                                />
                                {previewUrl ? (
                                    <img src={previewUrl} alt={fileName} className="imagePreview" />
                                ) : (
                                    <h4>Drop images here</h4>
                                )}

                            </form>
                            <Button variant="danger" onClick={handleCancel}>
                                Close
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                form="sendImage"
                                onClick={handleCancel}
                            >
                                Send
                            </Button>
                        </>}
                    {page == "2" &&
                        <>
                            <p className="h5">ส่งความคืบหน้าของงาน</p>
                            <Radio.Group value={value}>
                                <Space direction="vertical">
                                    {allSteps.map((step) => {
                                        if (!step.step_name.includes("ภาพ")) {
                                            // enabledBtn()
                                            return null;
                                        }
                                        return (
                                            <Radio value={step.step_id} key={step.step_id} disabled={(currentStepId.current !== step.step_id) || (currentStepId.current == step.step_id && step.wip_sent != null)} step_name={step.step_name}>
                                                ส่ง{step.step_name} {currentStepId.current == step.step_id && step.wip_sent != null && '(ส่งภาพแล้วรอการอนุมัติ)'}
                                            </Radio>
                                        )
                                    })}

                                </Space>
                            </Radio.Group>


                            {/* ---------------------- */}
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

                                <Upload
                                    // {...props}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                    multiple
                                >
                                    {fileList.length >= 8 ? null : uploadButton}
                                </Upload>
                                <Modal width={1000} open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
                                    <img
                                        alt="example"
                                        style={{
                                            width: '100%',
                                        }}
                                        src={previewImage}
                                    />
                                </Modal>
                                <Flex justify="flex-end">
                                    <Button htmlType="submit" size="large" type="primary" shape="round" disabled={value == undefined} >ส่งความคืบหน้างาน</Button>
                                </Flex>

                            </Form>
                        </>
                    }
                    {page == "3" &&
                        <Flex gap="small" vertical>
                            <p className="h4">เปลี่ยนแปลงประเภทการใช้และราคา</p>
                            <div>
                                <p>ประเภทการใช้งานปัจจุบัน : {allTou[0].old_tou_name}</p>
                                <p>ราคาปัจจุบัน : {orderDetail.od_price == null ? "ยังไม่กำหนดราคา" : orderDetail.od_price + ' บาท'} </p>
                                {/* <p>ราคาขั้นต่ำ : 200 บาท</p> */}
                            </div>

                            <Form
                                name="changeOrder"
                                layout="vertical"
                                onFinish={submitChangeOrder}>
                                <Flex vertical>
                                    <Checkbox checked={checkTou}
                                        onChange={(event) => setCheckTou(event.target.checked)}>
                                        <p className="h6">เปลี่ยนประเภทการใช้งาน</p>
                                    </Checkbox>
                                    {checkTou && <>
                                        <Form.Item>
                                            <Radio.Group
                                                onChange={(event) => setTouValue(event.target.value)}
                                                value={touValue}>
                                                {allTou?.map((tou) =>
                                                    <Radio key={tou.id} value={tou.tou_id}>{tou.tou_name}</Radio>)}
                                            </Radio.Group>
                                        </Form.Item>
                                    </>}
                                    <Checkbox checked={checkPrice} disabled={orderDetail.od_price == null}
                                        onChange={(event) => setCheckPrice(event.target.checked)}>
                                        <p className="h6">เปลี่ยนราคาคอมมิชชัน {orderDetail.od_price == null && "เปลี่ยนแปลงราคาปัจจุบันได้หลังจากกำหนดราคาแล้ว"}</p>
                                    </Checkbox>
                                    {checkPrice && <Form.Item
                                        label=""
                                        name="new_price"
                                        rules={[
                                            {
                                                required: true,
                                                message: "กรุณาใส่ราคาคอมมิชชันใหม่",
                                            },
                                            { type: "number" },
                                        ]}
                                    >
                                        <InputNumber
                                            suffix="บาท"
                                            className="inputnumber-css"
                                        />
                                    </Form.Item>}
                                    <Flex justify="flex-end" gap="small">
                                        <Button htmlType="submit" shape="round" type="primary" size="large" disabled={!checkPrice && !checkTou || checkTou && allTou[0].old_tou == touValue}>เปลี่ยนแปลงออเดอร์</Button>
                                        {/* <Button shape="round" size="large" onClick={handleCancel}>ยกเลิก</Button> */}
                                    </Flex>
                                </Flex>
                            </Form>
                            {/* <div className="form-item">
                <div>
                  <input type="checkbox" id="tou" name="tou" value="tou" checked={isChecked.tou} onChange={handleIsChecked} />
                  <label className="ms-2" for="tou">เปลี่ยนประเภทการใช้งาน</label>
                </div>
                {isChecked.tou && <><div className="tou-radio-btn-group">
                  <div><input type="radio" id="Personal" name="type-of-use" value="Personal" />
                    <label className="ms-1" for="Personal">Personal use<span>(ใช้ส่วนตัว)</span></label></div>
                  <div><input type="radio" id="License" name="type-of-use" value="License" />
                    <label className="ms-1" for="License">License<span>(มีสิทธิ์บางส่วน)</span></label></div>
                  <div><input type="radio" id="Exclusive" name="type-of-use" value="Exclusive" />
                    <label className="ms-1" for="Exclusive">Exclusive right<span>(ซื้อขาด)</span></label></div>
                </div>
                  หมายเหตุ : <input></input>
                </>}
              </div>
              <div className="form-item mt-2">
                <div><input type="checkbox" id="price" name="price" value="price" checked={isChecked.price} onChange={handleIsChecked} />
                  <label className="ms-2" for="price">เปลี่ยนราคา</label></div>
                {isChecked.price && <><input />หมายเหตุ : <input></input></>}
              </div>
              <button className="orderSubmitBtn">ส่งคำขอ</button> */}

                        </Flex>
                    }
                </div>
            </Modal>
            <div className="chat-header">
                <div className="chat-name">
                    <img src={currentChat.urs_profile_img}></img>
                    <div>
                        {chat_order_id != 0 && <>
                            <p>{orderDetail?.cms_name} : {orderDetail?.pkg_name}</p>
                            {orderDetail?.artist_id == userid ? <p>สั่งโดย {orderDetail?.customer_name}</p> : <p>นักวาด {orderDetail?.artist_name}</p>}
                        </>}
                        {chat_order_id == 0 && <>
                            <p>{currentChat.urs_name}</p>
                        </>}
                    </div>
                </div>

                {chat_order_id != 0 && <><div className="status-chat-header">
                    <p>คิวที่ {orderDetail?.od_q_number} msgid ปจบ.{msgidUi}</p>
                    <p>{currentStepName?.current?.includes("แนบสลิป") || currentStepName?.current?.includes("ภาพ") ?
                        orderDetail?.artist_id == userid && 'รอ' //ถ้ามีคำว่าสลิปและเราเป็นนักวาด ให้ใส่คำว่ารอ แต่ถ้าไม่มีคำว่าสลิป และเราไม่ใช่นักวาด ให้ใส่คำว่ารอ
                        : orderDetail?.artist_id !== userid && 'รอ'}{currentStepName?.current?.includes("ภาพ") && 'อนุมัติ'}{currentStepName?.current}</p>
                </div>
                    <button className="menu-icon-chat" onClick={handleOdModal}><Icon.Menu className='' /></button></>}

            </div>

            <Scrollbars>

                <div className="chat">
                    {messages.map((message, index) => {
                        return (
                            <>
                                {message.isSystemMsg ?
                                    <>
                                        <Flex ref={scrollRef} justify="center" key={message.msgId}>
                                            <OrderSystemMsg
                                                orderDetail={orderDetail}
                                                message={message}
                                                acceptRequest={acceptRequest} cancelRequest={cancelRequest}
                                                approveProgress={approveProgress} editProgress={editProgress} delProgress={delProgress}
                                                setPrice={setPrice}
                                                submitSlip={submitSlip}
                                                approveSlip={approveSlip} rejectSlip={rejectSlip}
                                                sendReview={sendReview}
                                                myId={userid}
                                                handleBrief={handleBrief}
                                                qrCode={qrCode}
                                                phoneNumber={phoneNumber}
                                                amount={payPrice.current}
                                                accName={accName}
                                                curStepId={currentStepId.current}
                                            />
                                        </Flex>
                                    </>
                                    : <>
                                        {
                                            message.fromSelf ? (
                                                <>
                                                    <div className="user-message" ref={scrollRef} key={uuidv4()}>
                                                        <div className="my-message">
                                                            <div>
                                                                {message.message?.split("images")[0] ===
                                                                    `${host}/` ? (
                                                                    // <img src={message.message} width={100} />
                                                                    <div className="att-image" style={{ cursor: "pointer" }} onClick={() => handleFullImg(message.message)}><img src={message.message} /></div>
                                                                ) : (
                                                                    <p className="message">{message.message}</p>
                                                                )}
                                                                {/* <p className="time-sent">02.12</p> */}
                                                                <p className="time-sent">

                                                                    {new Date(message.created_at).toLocaleString("th-TH", {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    }) !== "Invalid Date" ? (
                                                                        <>
                                                                            {new Date(message.created_at).toLocaleString("th-TH", {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            })}
                                                                        </>
                                                                    ) : (
                                                                        message.timestamp_chat
                                                                    )}

                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="user-message" ref={scrollRef} key={uuidv4()}>
                                                        <div className="their-message">
                                                            <div>
                                                                {/* <div>{message.message}</div> */}
                                                                {message.message?.split("images")[0] ===
                                                                    `${host}/` ? (
                                                                    <div className="att-image" style={{ cursor: "pointer" }} onClick={() => handleFullImg(message.message)}><img src={message.message} /></div>
                                                                ) : (
                                                                    <p className="message">{message.message}</p>
                                                                )}
                                                                {/* <p className="time-sent">02.12</p> */}
                                                                <p className="time-sent">
                                                                    <span>
                                                                        {new Date(message.created_at).toLocaleString("th-TH", {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        }) !== "Invalid Date" ? (
                                                                            <span>
                                                                                {new Date(message.created_at).toLocaleString("th-TH", {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                })}
                                                                            </span>
                                                                        ) : (
                                                                            <span>{message.timestamp_chat}</span>
                                                                        )}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </>
                                            )}
                                    </>
                                }
                            </>
                        )
                    })}
                    <div ref={chatbottom}></div>
                </div>
            </Scrollbars>

            <form className="input-container" onSubmit={(event) => sendChat(event)}>
                <div className="chat-sender">
                    <Button shape="round" type="primary" icon={<PlusOutlined />}
                        onClick={showModal}
                        style={{ aspectRatio: "1/1", width: "48px", height: "48px", backgroundColor: "#222222" }}
                    ></Button>
                    <Input
                        type="text"
                        placeholder="พิมพ์ข้อความ..."
                        onChange={(e) => setMsg(e.target.value)}
                        value={msg}
                    />
                    <button type="submit">
                        <Icon.Send className="send-icon" />
                    </button>
                </div>
            </form>

            <Modal width={1000} title="รายละเอียดการจ้าง" footer='' open={isBriefOpen} onCancel={handleBrief}>
                <Flex vertical gap="small">
                    <div>
                        <p className="h6">ประเภทการใช้งาน</p>
                        <p>{orderDetail?.tou}</p>
                        {/* {console.log(orderDetail)} */}
                    </div>
                    <div>
                        <p className="h6">จุดประสงค์การใช้ภาพ</p>
                        <p>{orderDetail?.od_use_for}</p>
                    </div>
                    <div>
                        <p className="h6">รายละเอียด</p>
                        <p>{orderDetail?.od_detail}</p>
                    </div>
                </Flex>


            </Modal>


        </>
    );
}

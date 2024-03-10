import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import DefaultInput from "../../components/DefaultInput";
import {
    NavbarUser,
    NavbarAdmin,
    NavbarHomepage,
} from "../../components/Navbar";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../../alertdata/alertData";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
// import Modal from "react-bootstrap/Modal";
import "react-toastify/dist/ReactToastify.css";
import ProfileImg from "../../components/ProfileImg.js";
import Lottie from "lottie-react";
// import loading from "../../loading.json";
import * as Icon from "react-feather";
import { Input, Collapse, Space, Button, Modal, Form } from 'antd';
import { AdminBox, UserBox } from "../../components/UserBox";
import { host } from "../../utils/api.js";

export default function AdminManageFAQ() {

    const navigate = useNavigate();
    const jwt_token = localStorage.getItem("token");
    const [admin, setAdmin] = useState("");
    const [FAQ, setFAQdata] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (window.location.pathname === "/login") {
                navigate("/admin/allfaq");
            }
        } else {
            navigate("/login");
        }
        getFAQdata()
    }, []);

    const getFAQdata = async () => {
        await axios
            .get(`${host}/allfaq`, {
                headers: {
                    Authorization: "Bearer " + jwt_token,
                },
            })
            .then((response) => {
                const data = response.data;
                if (data.status === "ok") {
                    setFAQdata(data.results);
                } else if (data.status === "no_access") {
                    alert(data.message);
                    navigate("/");
                } else {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            });
    }

    const [faqID, setFaqID] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    // console.log(question,":",answer);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isFormVisible2, setIsFormVisible2] = useState(false);
    const toggleForm = () => { setIsFormVisible(!isFormVisible) }
    const toggleForm2 = (faqID) => {
        // setIsFormVisible2(!isFormVisible2)
        const faq = FAQ.find(item => item.faq_id === faqID);
        if (faq) {
            setFaqID(faq.faq_id)
            setQuestion(faq.faq_heading);
            setAnswer(faq.faq_desc);
            setOpen(true)
        }

    }

    const formData = new FormData();


    const handleAddFAQ = async (values) => {
        console.log("เพิ่มฟอร์ม")

        formData.append("question", values.question);
        formData.append("answer", values.answer);
        await axios
            .post(`${host}/faq/add`, formData, {
                headers: {
                    Authorization: "Bearer " + jwt_token,
                },
            })
            .then((response) => {
                const data = response.data;
                if (data.status === "ok") {
                    alert('สำเร็จ')
                    window.location.reload(false);
                } else {
                    alert('ไม่สำเร็จ : ' + data.message);
                    window.location.reload(false);
                }
            });
    };
    const handleEditFAQ = async (values) => {
        console.log("แก้ไขฟอร์ม")
        // e.preventDefault();
        await axios
            .patch(`${host}/faq/update/${faqID}`, { // ใช้ค่าจาก state ที่เก็บ faq_id
                question: values.question, // ใช้ค่าจาก state ที่เก็บคำถาม
                answer: values.answer, // ใช้ค่าจาก state ที่เก็บคำตอบ
            }, {
                headers: {
                    Authorization: "Bearer " + jwt_token,
                },
            })
            .then((response) => {
                const data = response.data;
                if (data.status === "ok") {
                    alert('สำเร็จ')
                    window.location.reload(false);
                } else {
                    alert('ไม่สำเร็จ : ' + data.message);
                    window.location.reload(false);
                }
            });
    };

    const handleDeleteFAQ = async (faqID) => {
        await axios
            .patch(`${host}/faq/delete/${faqID}`, {
                headers: {
                    Authorization: "Bearer " + jwt_token,
                },
            })
            .then((response) => {
                const data = response.data;
                if (data.status === "ok") {
                    alert('สำเร็จ')
                    window.location.reload(false);
                } else {
                    alert('ไม่สำเร็จ : ' + data.message);
                    window.location.reload(false);
                }
            });
    };

    const text = `
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
    `;


    const [initialValues, setInitialValues] = useState()


    function editFAQ(id, question, ans) {
        // const initialValues = {
        //     username: 'initialValueForUsername',
        //     email: 'initialValueForEmail',
        // };
        console.log(id, question, ans);



        setInitialValues({
            username: 'initialValueForUsername',
            email: 'initialValueForEmail',
        })

        setOpen(true)

    }

    //ลูปข้อมูลออกมาแสดง โดยเก็บ ID เป็นตัวบอกว่าอันนี้คือคำถามไหน
    const items = FAQ.map((item, index) => (
        {
            key: item.faq_id,
            label: item.faq_heading,
            children: <p>{item.faq_desc}</p>,
            extra:
                <Space size="middle">
                    <Icon.Edit style={{ width: "1.2rem" }} onClick={(event) => {
                        setFaqID(item.faq_id)
                        // setQuestion(item.faq_heading);
                        // setAnswer(item.faq_desc);

                        form.setFieldsValue({
                            question: item.faq_heading,
                            answer: item.faq_desc,

                        });
                        setIsEditting(true);
                        // alert(item.faq_heading)
                        // editFAQ(item.faq_id, item.faq_heading, item.faq_desc)
                        setOpen(true)
                        console.log("โดนกดแล้วว")
                        console.log(faqID, question, answer)
                        event.stopPropagation();
                    }} />
                    <Icon.Trash style={{ width: "1.2rem" }} onClick={(event) => {
                        // If you don't want click extra trigger collapse, you can prevent this:
                        handleDeleteFAQ(item.faq_id)
                        event.stopPropagation();
                    }} />

                </Space>
        }
    ))


    // console.log("items = ", items)



    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };
    const handleCancel = () => {
        form.setFieldsValue({
            question: null,
            answer: null,
        });
        setIsEditting(false)
        setOpen(false);
    };

    const [isEditting, setIsEditting] = useState(false)


    return (
        <>
            <Space
                direction="vertical"
                size="middle"
                style={{
                    display: 'flex',
                }}
            >

                <h1 className="h3">คำถามที่พบบ่อย</h1>

                <Space>
                    <Button onClick={showModal} type="primary" shape="round" icon={<Icon.Plus />} size='large'>
                        เพิ่มคำถามที่พบบ่อย
                    </Button>
                </Space>

                <Collapse items={items} bordered={false}
                    style={{
                        backgroundColor: "transparent",
                    }} />
            </Space>
            <p>{faqID} {question} {answer}</p>

            <Modal
                title="แก้ไขคำถามที่พบบ่อย"
                open={open}
                onCancel={handleCancel}
                footer={[

                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="editfaq"
                    onFinish={isEditting ? handleEditFAQ : handleAddFAQ} // ใช้ฟังก์ชัน handleEditFAQ สำหรับการบันทึกการแก้ไข
                // initialValues={{
                //     question: Form.getFieldValue('question'),
                //     answer: Form.getFieldValue('answer'),
                // }}
                >
                    <Form.Item
                        label="คำถาม"
                        name="question"
                        rules={[
                            {
                                required: true,
                                message: "กรุณาใส่คำถาม",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="คำตอบ"
                        name="answer"
                        rules={[
                            {
                                required: true,
                                message: "กรุณาใส่คำตอบ",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Button htmlType="submit" shape="round" type="primary">
                        บันทึก
                    </Button>
                </Form>
            </Modal>
            {/* </Space> */}
            {/* </div> */}
        </>
    )
}
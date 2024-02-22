import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import DefaultInput from "../../components/DefaultInput";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../../components/Navbar";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../../alertdata/alertData";
// import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileImg from "../../components/ProfileImg.js";
import Lottie from "lottie-react";
// import loading from "../../loading.json";
import * as Icon from 'react-feather';
import { Typography,Button,Input } from 'antd';
import { AdminBox, UserBox } from "../../components/UserBox";
import { useAuth } from '../../context/AuthContext';
import { host } from "../../utils/api.js";

const {Title} = Typography;
const title = 'จัดการแอดมิน';
const bgImg = ""
const body = { backgroundColor: "#F1F5F9" }

const toastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const jwt_token = localStorage.getItem("token");
const type = localStorage.getItem("type");

export default function AdminManageAdmin(props) {
    const navigate = useNavigate();
    const [id, setID] = useState("");
    const [admins, setAdmins] = useState([]);
    const [bigadmin, setBigAdmin] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [profileImg, setProfileImage] = useState("");
    const [name, setName] = useState("");
    const [filteredUser, setFilteredUser] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const [file, setFile] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const addProfileImg = () => {
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
            const image = e.target.files[0];
            setFile(image);
            setPreviewUrl(URL.createObjectURL(image));
        }
        input.accept = "image/png ,image/gif ,image/jpeg";
        input.click();
    }

    useEffect(() => {
        if (jwt_token && type === "admin") {
            getAdminData();
        } else {
            navigate("/login");
        }
    }, []);
    
    useEffect(() => {
        // update filtered user when user state changes
        setFilteredUser(admins);
    }, [admins]);

    const getAdminData = async () => {
        await axios
            .get(`${host}/alladmin`, {
                headers: {
                    Authorization: "Bearer " + jwt_token,
                },
            })
            .then((response) => {
                const data = response.data;
                if (data.status === "ok") {
                    setAdmins(data.admins);
                    setBigAdmin(data.results[0]);
                } else if (data.status === "no_access") {
                    alert(data.message);
                    navigate("/");
                } else {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            });
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filtered = admins.filter(
            (item) =>
                item.admin_name.toLowerCase().includes(query) || 
                item.admin_email.toLowerCase().includes(query)
        );
        setFilteredUser(filtered);
    };

    const [selectedItem, setSelectedItem] = useState({});
    const [popup, setpopup_verifyEmail] = useState(false);
    const Close = () => setpopup_verifyEmail(false);
    const handleClick = () => setpopup_verifyEmail(true);

    const [popup_otp, setpopup_verifyOTP] = useState(false);
    const CloseOTP = () => setpopup_verifyOTP(false);

    const [popup_setData, setpopup_setDataadmin] = useState(false);
    const CloseSetData = () => setpopup_setDataadmin(false);

    const manageAdmin = (event) => { }

    const handleValidation = () => {
        if (email === "") {
            toast.error("email is required", toastOptions);
            return false;
        }
        return true;
    };
    const handleValidationOTP = () => {
        if (otp === "") {
            toast.error("otp is required", toastOptions);
            return false;
        }
        return true;
    };
    const handleValidationData = () => {
        if (email === "") {
            toast.error("email is required", toastOptions);
            return false;
        } else if (password === "") {
            toast.error("password is required", toastOptions);
            return false;
        } else if (file === "") {
            toast.error("image is required", toastOptions);
            return false;
        }
        return true;
    };
    const AddEmailAdmin = async () => {
        setpopup_verifyEmail(false);
        if (handleValidation()) {
            setLoading(true);
            await axios
                .post(`${host}/alladmin/email/verify`, {
                    headers: {
                        Authorization: "Bearer " + jwt_token,
                    },
                    "email": email,
                })
                .then((response) => {
                    const data = response.data;
                    setLoading(false);
                    if (data.status === "ok") {
                        // Swal.fire({ ...alertData.verifyEmainSuccess }).then(() => {});
                        setID(data.insertedAdminID);
                        setpopup_verifyOTP(true);
                    }
                    else if (data.status === "used") {
                        Swal.fire({ ...alertData.verifyEmainFailed }).then(() => {
                            window.location.reload(false);
                        });
                    } else {
                        Swal.fire({ ...alertData.otpisnotcorrect }).then(() => {
                            window.location.reload(false);
                        });
                    }
                });
        }

    }
    const verifyOTP = async () => {
        setpopup_verifyOTP(false);
        if (handleValidationOTP()) {
            await axios
                .post(`${host}/alladmin/otp/verify/`, {
                    headers: {
                        Authorization: "Bearer " + jwt_token,
                    },
                    "otp": otp,
                    "id": id,
                })
                .then((response) => {
                    const data = response.data;
                    if (data.status === "ok") {
                        setpopup_setDataadmin(true);
                    } else if (data.status === "error") {
                        Swal.fire({ ...alertData.otpisnotcorrect }).then(() => {
                            window.location.reload(false);
                        });
                    } else {
                        Swal.fire({ ...alertData.IsError }).then(() => {
                            window.location.reload(false);
                        });
                    }
                });
        }

    }

    const handleSendData = async () => {
        setpopup_setDataadmin(false)
        if (handleValidationData()) {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("file", file);
            await axios
                .patch(`${host}/alladmin/add/${id}`, formData, {
                    headers: {
                        Authorization: "Bearer " + jwt_token,
                    },
                })
                .then((response) => {
                    const data = response.data;
                    if (data.status === "ok") {
                        Swal.fire({ ...alertData.addadminSuccess }).then(() => {
                            window.location.reload(false);
                        });
                    } else {
                        Swal.fire({ ...alertData.IsError }).then(() => {
                            window.location.reload(false);
                        });
                    }
                })
        }

    }

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
                <h1 className="">ผู้ดูแลระบบ</h1>
                
                <div className="all-user-head">
                    <h2>รายชื่อแอดมิน ({admins.length})</h2>
                    <div>
                    <Button onClick={handleClick} type="primary" shape="round" icon={<Icon.Plus />} size='large'>
                        เพิ่มแอดมิน
                    </Button>
                        <Input type="search" onChange={handleSearch} placeholder=" ค้นหา..." />
                    </div>
                </div>
                <div className="user-item-area">
                    {filteredUser.map((item, index) => (
                        <div key={index} onClick={manageAdmin}>
                            <AdminBox src={item.admin_profile} username={item.admin_name} userid={item.admin_id} email={item.admin_email} />
                        </div>
                    ))}
                </div>
            <Modal show={popup} onHide={Close}>
                <Modal.Body>
                    <Form>
                        <Form.Label>กรุณาใส่อีเมลที่ต้องการเพิ่ม</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="example@gmail.com..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <button variant="secondary" onClick={Close}>
                        ปิด
                    </button>
                    <button
                        variant="primary"
                        onClick={AddEmailAdmin}
                    >
                        ยืนยัน
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal show={popup_otp} onHide={CloseOTP}>
                <Modal.Body>
                    <Form>
                        <Form.Label>กรุณาใส่รหัสยืนยันบนอีเมลของท่าน</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <button variant="secondary" onClick={CloseOTP}>
                        ปิด
                    </button>
                    <button
                        variant="primary"
                        onClick={verifyOTP}
                    >
                        ยืนยัน
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal show={popup_setData} onHide={CloseSetData}>
                <Modal.Body>
                    <Form>
                        <Form.Label>กรุณากรอกข้อมูล</Form.Label>
                        <ProfileImg src={previewUrl} onPress={addProfileImg} />
                        <Form.Control
                            type="email"
                            value={email}
                            disabled
                        />
                        <Form.Control
                            type="password"
                            placeholder="กรอกรหัสผ่าน.."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Form.Control
                            type="text"
                            placeholder="กรอกชื่อ.."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <button variant="secondary" onClick={CloseSetData}>
                        ปิด
                    </button>
                    <button
                        variant="primary"
                        onClick={handleSendData}
                    >
                        ยืนยัน
                    </button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </>
    )
}

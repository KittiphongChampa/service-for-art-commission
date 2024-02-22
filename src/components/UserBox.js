import '../css/profileimg.css'
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../alertdata/alertData";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import React, { useState, useEffect,useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { host } from "../utils/api";


function UserBox(props) {
    const jwt_token = localStorage.getItem("token");
    const [banReason, setBanReason] = useState("");

    //เหตุผลการแบน
    const [selectedItem, setSelectedItem] = useState({});
    const [popup, setpopup] = useState(false);
    const Close = () => {
        setBanReason("");
        setpopup(false);
    };
    
    const deleteUser = async () => {
        setpopup(false);
        const userId = selectedItem;
        const formData = new FormData();
        formData.append("banReason", banReason);
        await axios.patch(`${host}/alluser/delete/${userId}`, formData, {
            headers: {
                Authorization: "Bearer " + jwt_token,
            }
        })
        .then((response) => {
            const data = response.data;
            console.log(data);
            if (data.status === "ok") {
            Swal.fire({ ...alertData.deleteUserSuccess }).then(() => {
                window.location.reload(false);
            });
            } else {
            Swal.fire({ ...alertData.deleteUserFailed }).then(() => {
                window.location.reload(false);
            });
            }
        });
    };

    const handleRedirect = (id) => {
        window.location = (`/profile/${id}`);
    }

    const banBtnRef = useRef(null)
    const handleClick = (item) => {
        setSelectedItem(item);
        setpopup(true);
    };
    
    return (
        <>
        
        <div className="user-item open-profile" onClick={()=>handleRedirect(props.userid)}>
            {/* <Link to={`/profile/${props.userid}`} variant="primary">ดูโปรไฟล์</Link> */}
            <div className="profile-image ">
                <img src={props.src} />
            </div>
            <p className="username">{props.username}</p>
            <p>{props.userid}</p>
            <p>{props.email}</p>
            <button ref={banBtnRef} onClick={(e) => { e.stopPropagation(); handleClick(props.userid) }}>ระงับบัญชีผู้ใช้</button>
        </div>
        <Modal show={popup} onHide={Close}>
            <Modal.Header>
            <Modal.Title>เหตุผลการแบน</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <Form>
                <Form.Control
                as="textarea"
                rows={3}
                placeholder="เหตุผลการแบน..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                />
            </Form>
            </Modal.Body>

            <Modal.Footer>
            <Button variant="secondary" onClick={Close}>
                ปิด
            </Button>
                <Button variant="danger" onClick={deleteUser}>
                    แบนไอดี
                </Button>
            </Modal.Footer>
        </Modal>
      </>
    )
}

function AdminBox(props) {

    function deleteAdmin(id) {

        Swal.fire({
            title: 'ต้องการลบแอดมินหรือไม่',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            showCancelButton: true,
            icon: 'question'
            }).then((result) => {
            if (result.isConfirmed) {
                // Swal.fire('ลบแล้ววว!', '', 'success')
                axios .patch(`${host}/alladmin/delete/${id}`).then((response) => {
                    const data = response.data;
                    if (data.status === "ok") {
                        Swal.fire('ลบแล้ววว!', '', 'success').then(() => {
                            window.location.reload(false);
                        });
                        // Swal.fire({ ...alertData.deladminSuccess }).then(() => {
                        //     window.location.reload(false);
                        // });
                    } else {
                        Swal.fire('ลบไม่ได้!', '', 'error')
                    }
                    
                })
                
            }
        })
    }
    
    return (
        <div className="user-item">
            <div className="profile-image">
                <img src={props.src} />
            </div>
            <p className="username">{props.username}</p>
            <p>{props.userid}</p>
            <p>{props.email}</p>
            <button onClick={()=>deleteAdmin(props.userid)}>ลบบัญชีแอดมิน</button>
        </div>
    )
}


export {UserBox, AdminBox}
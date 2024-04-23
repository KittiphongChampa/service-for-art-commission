import React, { useState, useEffect, useRef, createElement } from "react";
import * as Icon from 'react-feather';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import "../css/indexx.css";
import '../styles/main.css';
import "../css/allbutton.css";
import "../css/profileimg.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from "react-helmet";
// import DefaultInput from "../components/DefaultInput";
import { NavbarUser, NavbarAdmin, NavbarHomepage, NavbarGuest } from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ggIcon from '@mui/icons-material';
import TextareaAutosize from "react-textarea-autosize";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import * as alertData from '../alertdata/alertData';
import { width } from '@mui/system';
import ImgFullscreen from '../components/openFullPic'
import { Modal, Input, Select, Space, Switch, Checkbox } from 'antd';
import { host } from "../utils/api";


export default function ChatAddModal(props) {
    const [page, setPage] = useState("1")
    function handlePage(pagenumber) {
        setPage(pagenumber)
    }



    const [isChecked, setIsChecked] = useState({ tou: false, price: false })

    function handleIsChecked(event) {
        const name = event.target.name
        setIsChecked({ ...isChecked, [name]: event.target.checked });
        console.log(name, event.target.checked)
    }

    function ChangeOrderPage() {
        return (<>
            <p className="h4">เปลี่ยนแปลงประเภทการใช้และราคา</p>
            <div><p>ประเภทการใช้งานปัจจุบัน : Personal use</p>
                <p>ราคาปัจจุบัน : 200 บาท</p>
                <p>ราคาขั้นต่ำ: xxxx</p></div>
            <form action="/action_page.php">
                <div className="form-item">
                    <div>
                        <input type="checkbox" id="tou" name="tou" value="tou" checked={isChecked.tou} onChange={handleIsChecked} />
                        <label className="ms-2" for="tou">เปลี่ยนประเภทการใช้งาน</label>
                        {/* <Checkbox >เปลี่ยนประเภทการใช้งาน</Checkbox> */}

                        {/* <fieldset>
                            <legend>Personalia:</legend>
                        </fieldset> */}
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
                <button className="orderSubmitBtn">ส่งคำขอ</button>
            </form>



        </>
        )
    }







    const [src, setSrc] = useState(null)

    const handleFullImg = (imgsrc) => {
        console.log("คลิกฟังชันโชว์", imgsrc)
        setSrc(imgsrc)

    }



    return (
        <>
            {src != null && <ImgFullscreen src={src} handleFullImg={handleFullImg} />}
            {/* <ImgFullscreen src={src} opened={fullImgOpened} handleFullImg={handleFullImg} /> */}
            {/* <div className="modal cms-detail">
                <div className="form-order-card"> */}
            {/* {page === "1" ? <div className="close-tab" onClick={props.onClick}><button><Icon.X /></button></div> : <div className="goback-tab" onClick={() => handlePage("1")}><button><Icon.ChevronLeft /></button></div>} */}
            <div className="form-order">
                {page === "1" && <FirstPage />}
                {page === "2" && <ProgressPage />}
                {page === "3" && <ChangeOrderPage />}
            </div>
            {/* </div>
            </div> */}

        </>
    )
}

function FirstPage() {
    return (<>
        {/* <p className="h4">แนบไฟล์</p>
        <button className="add-item">
            <div className="icon-div"><Icon.Image /></div>
            <p className="text">แนบไฟล์ภาพ</p>
        </button>
        <p className="h4">เกี่ยวกับออเดอร์</p>
        <button className="add-item" onClick={() => handlePage("2")}>
            <div className="icon-div"><Icon.Upload /></div>
            <p className="text">ส่งความคืบหน้าของงาน</p>
        </button>
        <button className="add-item" onClick={() => handlePage("3")} >
            <div className="icon-div"><Icon.Briefcase /></div>
            <p className="text">เปลี่ยนแปลงประเภทการใช้และราคา<Icon.Info /></p>
        </button> */}
    </>
    )
}

function ProgressPage() {
    const [images, setImages] = useState([]);
    const addToArray = () => {
        const newItem = "../boo.jpg" // Replace this with the new item you want to add to the array
        setImages(prevArray => [...prevArray, newItem]);
    };
    // const images = ["../เหมียวเวห์.jpg", "../แต๋มคลั่ง.jpg", "../boo.jpg", "../แต๋มซิ้ม.jpg", "../mac-kaveh.jpg"]
    // const { register, handleSubmit, setValue, formState: { errors, isSubmitting, isDirty, isValid }, reset } = useForm();
    return (<>
        <p className="h4">ส่งความคืบหน้าของงาน</p>
        {/* <div><p>ประเภทการใช้งานปัจจุบัน : Personal use</p>
                <p>ราคาปัจจุบัน : 200 บาท</p></div> */}
        <div className="tou-radio-btn-group">
            <div><input type="radio" id="Personal" name="type-of-use" value="Personal" />
                <label className="ms-1" for="Personal">ภาพร่าง <span>(หลังจากนี้ชำระเงินครั้งที่ 1)</span></label></div>
            <div><input type="radio" id="License" name="type-of-use" value="License" />
                <label className="ms-1" for="License">ภาพเส้นเปล่า </label></div>
            <div><input type="radio" id="Exclusive" name="type-of-use" value="Exclusive" />
                <label className="ms-1" for="Exclusive">ภาพลงสีพื้น<span>(หลังจากนี้ชำระเงินครั้งที่ 2)</span></label></div>
            <div><input type="radio" id="Exclusive" name="type-of-use" value="Exclusive" />
                <label className="ms-1" for="Exclusive">ภาพไฟนัล</label></div>
        </div>
        {/* <div className="input-group mb-1 mt-5">
                <input
                    type="file" className="form-control" id="inputGroupFile02" />
            </div> */}

        <div className="selected-img">
            <div onClick={addToArray} style={{ border: "2px dashed #9C8FB1", backgroundColor: "#EDEAF2", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <Icon.Plus style={{ color: "#9C8FB1", width: "3rem", height: "3rem" }} />
                <p style={{ color: "#9C8FB1" }}>เพิ่มรูปภาพ</p>
            </div>
            {/* <div>
                    <img src="เหมียวเวห์.jpg" />
                </div> */}


            {/* {images.map((img, index) => (
                <div key={index} onClick={() => handleFullImg(img)}>
                    <button className="close-btn"><Icon.X className="middle-icon" /></button>
                    <img src={img} />
                </div>

            ))} */}


        </div>

        <button className="orderSubmitBtn">อัปเดตความคืบหน้า</button>

    </>
    )
}
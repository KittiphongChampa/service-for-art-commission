import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Icon from 'react-feather';

import "../css/indexx.css";
import "../css/allbutton.css";
import "../css/homepage.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from "react-helmet";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../components/Navbar";
import BgBody from "../components/BgBody";
import { useAuth } from '../context/AuthContext';
import { Modal, Button, Input, Select, Space, Upload, Rate, Flex, Tooltip, InputNumber, Form } from 'antd';

const title = 'หน้าหลัก';
const body = { backgroundColor: "white" }

export default function Welcome() {
    const { userdata, isLoggedIn, type } = useAuth();
    const navigate = useNavigate();


    return (
        <div className="body-con">
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <NavbarHomepage />
            {/* <img className="homeBG" src="seamoon.jpg" /> */}

            <div className="body-nopadding" style={body}>
                <div
                    // className="container-fluid"
                    style={{ height: "100vh" }}
                >
                    {/* <img className="presenter" src="character.png" /> */}
                    <div className="box-container" style={{ backgroundImage: "url('./images/welcome.png')" }}>
                        <Flex className="container-xl" vertical style={{ height:'100%'}} wrap="wrap">

                            <div style={{ flex:1 }}></div>

                            <Flex vertical justify="center" align="center" style={{ flex: '1' }} wrap="wrap">
                                <p className="display-3" style={{ color: 'white',letterSpacing:'2px',fontWeight:'300 !important' }}>Service for Art<br></br>Commissioning</p>
                                <p style={{ color: 'white', letterSpacing: '2px',opacity:'0.8',padding:'1rem 0',textAlign:'center' }}>เว็บไซต์สำหรับจ้างงานศิลปะ(Commission) สถานที่ที่รวบรวมผลงานศิลปะและนักวาด
                                    ที่พร้อมจะทำให้ความคิดสร้างสรรค์ของคุณเป็นจริง</p>
                            </Flex>

                            <Flex align="center" gap='middle' justify="center" style={{ flex: '1' }} wrap="wrap">
                                <p style={{color:'white',fontWeight:'300 !important'}}>สไตล์ : </p>
                                <div className='style-box'>
                                    <div>
                                        <img src='./images/semi.png'></img>
                                    </div>
                                    <p className='h6' >Semi Realistic</p>
                                </div>
                                <div className='style-box'>
                                    <div>
                                        <img src='./images/chibi.jpg'></img>
                                    </div>
                                    <p className='h6'>SD Scale</p>
                                </div>
                                <div className='style-box'>
                                    <div>
                                        <img src='./images/pixel.png'></img>
                                    </div>
                                    <p className='h6'>Pixel Art</p>
                                </div>
                                <div className='style-box'>
                                    {/* <div>
                                        <img src='./images/pixel.png'></img>
                                    </div> */}
                                    <Flex justify="center" style={{width: '100%'}}>
                                        <p className='h6'>อื่นๆอีก 17 สไตล์</p>
                                    </Flex>
                                    
                                </div>
                            </Flex>

                        </Flex>

                    </div>
                    <div className="section-wrapper container-xl" >
                        {/* ช่องคอมมิชชันคือไร */}
                        <div className="cms-section">
                            <div className="icon">
                                <img src="./images/cms-meanning.svg"></img>
                            </div>
                            
                            <h2 className="h1">art commission คืออะไร</h2>
                            <p>art commission คือ การจ้างนักวาดให้สร้างผลงานศิลปะตามคำร้องของผู้จ้าง ไม่ใช่การซื้อผลงานที่นักวาดสร้างขึ้นก่อนแล้ว โดยเรื่องราคาจะขึ้นอยู่กับรายละเอียดของงานและจุดประสงค์การใช้ โดยประเภทของสิทธิ์ต่างๆมีดังนี้</p>
                            <p>Personal use : ใช้ส่วนตัว ไม่สามารถใช้เชิงพาณิชย์ได้,License : สามารถนำไปทำบางอย่างได้ เช่น ใช้ในเชิงพาณิชย์ ทั้งนี้ทั้งนั้นขึ้นอยู่กับข้อตกลงว่าสามารถทำอะไรได้บ้าง,Exclusive right : สามารถนำผลงานไปทำอะไรก็ได้ อาทิ การนำไปดัดแปลง ขายต่อ เป็นต้น ลิขสิทธิ์อยู่ที่ผู้ซื้อ แต่นักวาดยังมีเครดิตในผลงานอยู่</p>
                            <div className='cms-img'>
                                <img src='./images/b-welcompage2.png' alt='รูป art commission คืออะไร' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
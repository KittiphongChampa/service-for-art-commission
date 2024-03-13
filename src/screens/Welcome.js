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

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     navigate("/");
  //   } else {
  //     navigate("/login");
  //   }
  // }, []);

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
          <div className="box-container" style={{ backgroundImage: "url('./images/seamoon.jpg')" }}>
            <div className="container-xl aa">
              <div className="text-col">
                <div className="headding-box">
                  <h1 className="display-3">Service for Art Commissioning</h1>
                </div>
                <p>เว็บไซต์สำหรับจ้างงานศิลปะ สถานที่ที่รวบรวมผลงานศิลปะและนักวาด
                  ที่พร้อมจะทำให้ความคิดสร้างสรรค์ของคุณเป็นจริง</p>
                <Button shape='round' size='large'>
                  ตามหานักวาด
                </Button>
              </div>
              <div className="img-col">
                <img src="./images/b-welcompage2.png"></img>
              </div>

            </div>

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
                <img src='./images/รูปหน้าhome.png' alt='รูป art commission คืออะไร'/>
              </div> 
            </div>

            {/* ช่องระบบ */}
            {/* <div className="sys-section">
              <div className="sys-img">
                <img src="seamoon.jpg" />
              </div>
              <div className="sys-text-wrapper">
                <h2 className='h1'>
                  ระบบของเว็บ
                </h2>
                <Flex className="sys-text" vertical gap='middle'>
                  <Flex gap='small'>
                    <div className="rounded-number">1</div>
                    <p>-hv8;k,ddfsdfsdffsd dfsdfsdffsddfsdfsdff sddfsdfsdffsddfsdf sdffsv</p>
                  </Flex>
                  <Flex gap='small'>
                    <div className="rounded-number">2</div>
                    <p>-hv8;k, ddfsdddfs dfsdffs vddfsdf sdffsd dfsd fsdffsfsdffs</p>
                  </Flex>
                  <Flex gap='small'>
                    <div className="rounded-number">3</div>
                    <p>-hv8;ddfs dfsdffs ddfsdfsdff sk,ddfsdd fsdfsdffs vdf sdffs</p>
                  </Flex>
                </Flex>

                <Button shape='round' size='large'>สมัครเป็นนักวาด</Button>
              </div>
            </div> */}
          </div>

          {/* <footer className="w-100 py-4 flex-shrink-0" style={{ backgroundColor: "#525764" }}>
            <div className="container-xl py-4">
              <div className="row gy-4 gx-5">
                <div className="col-lg-4 col-md-6">
                  <h5 className="h1 text-white">FB.</h5>
                  <p className="small text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p>
                  <p className="small text-muted mb-0">&copy; Copyrights. All rights reserved. <a className="text-primary" href="#">Bootstrapious.com</a></p>
                </div>
                <div className="col-lg-2 col-md-6">
                  <h5 className="text-white mb-3">Quick links</h5>
                  <ul className="list-unstyled text-muted">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Get started</a></li>
                    <li><a href="#">FAQ</a></li>
                  </ul>
                </div>
                <div className="col-lg-2 col-md-6">
                  <h5 className="text-white mb-3">Quick links</h5>
                  <ul className="list-unstyled text-muted">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Get started</a></li>
                    <li><a href="#">FAQ</a></li>
                  </ul>
                </div>
                <div className="col-lg-4 col-md-6">
                  <h5 className="text-white mb-3">Newsletter</h5>
                  <p className="small text-muted">มีการยืมเรฟมาจากบลาๆๆๆ</p>
                  <form action="#">
                    <div className="input-group mb-3">
                      <input className="form-control" type="text" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2" />
                      <button className="btn btn-primary" id="button-addon2" type="button"><i className="fas fa-paper-plane"></i></button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </footer> */}


        </div>

      </div>
    </div>
  );
}

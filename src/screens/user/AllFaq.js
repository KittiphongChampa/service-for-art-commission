import { Modal, Button, Input, Select, Space, Upload, Collapse, Flex, Tooltip, InputNumber, Form } from 'antd';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Icon from 'react-feather';

import "../../css/indexx.css";
import "../../css/allbutton.css";
import "../../css/homepage.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from "react-helmet";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../../components/Navbar";
import BgBody from "../../components/BgBody";
import axios from 'axios';
import { host } from "../../utils/api";


const title = 'หน้าหลัก';
const bgImg = "url('images/seamoon.jpg')"
const body = { backgroundColor: "white" }

export default function AllFaq() {
    const navigate = useNavigate();
    const [allfaq, setAllfaq] = useState([]);
    const [filteredFaq, setFilteredFaq] = useState([]);

    useEffect(() => {
        AllFaq()
    }, []);

    useEffect(() => {
        setFilteredFaq(allfaq);
    }, [allfaq]);


    const AllFaq = async() => {
        await axios.get(`${host}/all/faq`).then((response) => {
            const data = response.data;
            setAllfaq(data.results)
        })
    }
    // const { Search } = Input;
    
    

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filtered = allfaq.filter(
          (item) =>
            item.faq_heading.toLowerCase().includes(query) ||
            item.faq_desc.toLowerCase().includes(query)
        );
        setFilteredFaq(filtered);
    };

    const items = filteredFaq.map((item, index) => (
        {
            key: item.faq_id,
            label: item.faq_heading,
            children: <p>{item.faq_desc}</p>,
        }
    ))

    return (
        <div className="body-con">
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <NavbarUser />
            {/* <img className="homeBG" src="seamoon.jpg" /> */}

            <div className="body-nopadding" style={body}>
                <div style={{
                    height: "50vh", backgroundImage: "url('./images/seamoon.jpg')", backgroundPosition: "top",
                    backgroundSize: "cover"
                }}>
                    <div className="container" style={{paddingTop:"30vh",paddingInline:"15%"}}>
                        <Input type="search" onChange={handleSearch} placeholder="ค้นหาคำถามที่พบบ่อย.." allowClear size="large" />
                    </div>
                </div>
                <div className="container">
                    <h1>คำถามที่พบบ่อย</h1>
                    <Collapse items={items} bordered={false}
                        style={{
                            backgroundColor: "transparent",
                        }} />
                    {/* <h1>คู่มือการใช้งาน</h1> */}
                </div>
            </div>
        </div >
    );
}

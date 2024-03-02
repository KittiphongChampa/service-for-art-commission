import React, { useState, useEffect, useRef, createElement } from "react";
import * as Icon from 'react-feather';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import "../../css/indexx.css";
import '../../styles/main.css';
import "../../css/allbutton.css";
import "../../css/profileimg.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from "react-helmet";
import Dashboard from "./Dashboard";
import { NavbarUser, NavbarAdmin, NavbarHomepage, NavbarGuest } from "../../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ggIcon from '@mui/icons-material';
import Switch from 'react-switch';

// import ChatBoxUi from './Old_ChatBox'
import OrderOverview from '../../components/OrderOverview'
import { Link, useParams, useLocation } from 'react-router-dom';


export default function ArtistManagement() {
    const { menu } = useParams();
    const location = useLocation();

    return (
        <div className="body-con">
            <Helmet>
                <title>artist panel</title>
            </Helmet>
            {/* <ImgFullscreen />
            <div className="modall">aaaaaaaaaaaaaaaaaaaaa</div> */}
            <NavbarUser />
            <div className="chatbox-container">
                <div className="aside-chatbox">
                    <div className="setting-menu">
                        <h1 className="h3" style={{ fontWeight: "200", color: "white", marginBottom: "1rem" }}>
                            artist panel
                        </h1>

                        <Link to={`/artistmanagement/dashboard`}><div><ggIcon.GridView /><p>แดชบอร์ด</p></div></Link>
                        <Link to={`/artistmanagement/orderoverview`} ><div><Icon.List /><p>รายการคอมมิชชัน</p></div></Link>
                        {/* <Link to={`/artistmanagement/chat`} ><div><Icon.MessageCircle /><p>แชท</p></div></Link> */}
                        {/* <Link to={`/artistmanagement/setting`}><div><Icon.Settings /><p>การตั้งค่า</p></div></Link> */}
                    </div>


                </div>
                <div className="aside-main-card" style={{ padding: "1.3rem 3rem" }}>
                    {menu === "dashboard" ? <Dashboard /> : menu === "orderoverview" ? <OrderOverview /> : null}
                </div>
            </div>


        </div>
    );



}
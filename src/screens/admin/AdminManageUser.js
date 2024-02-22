import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
// import "../../css/indexx.css";
// import "../../css/allbutton.css";
// import "../../css/profileimg.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import DefaultInput from "../../components/DefaultInput";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../../components/Navbar";
// import UserBox from "../components/UserBox";
// import inputSetting from "../../function/function";
import ProfileImg from "../../components/ProfileImg";
// import Profile from './Profile';
// import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../../alertdata/alertData";
import { AdminBox, UserBox } from "../../components/UserBox";
import { Typography,Button,Input } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { host } from "../../utils/api";

const title = "จัดการผู้ใช้งาน";
const bgImg = "";
const body = { backgroundColor: "#F1F5F9" };


export default function AdminManageUser() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { admindata, isLoggedIn } = useAuth();

  const [user, setUser] = useState([]);
  const [admin, setAdmin] = useState("");
  const [banReason, setBanReason] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);
  
  useEffect(() => {
    if (token) {
      getData();
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    // update filtered user when user state changes
    setFilteredUser(user);
  }, [user]);

  const getData = async () => {
    await axios
      .get(`${host}/alluser`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          setUser(data.users);
          setAdmin(data.results[0]);
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
    const filtered = user.filter(
      (item) =>
        item.urs_name.toLowerCase().includes(query) ||
        item.urs_email.toLowerCase().includes(query)
    );
    setFilteredUser(filtered);
  };

  return (
    <>
      
      <Helmet>
        <title>{title}</title>
      </Helmet>
   
      <h1 className="">การจัดการผู้ใช้งาน</h1>
      <div className="all-user-head">
        <h2>รายชื่อผู้ใช้ ({user.length})</h2>
        <div>
          <Input type="search" onChange={handleSearch} placeholder=" ค้นหา..." />
        </div>
      </div>
      <div className="user-item-area">



        {filteredUser.map((item, index) => (
          <div key={index}>
            <UserBox
              src={item.urs_profile_img}
              username={item.urs_name}
              userid={item.id}
              email={item.urs_email}
            />
          </div>
        ))}
      </div>
    </>
  );
}

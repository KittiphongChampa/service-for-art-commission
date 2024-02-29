import React, { useState, useEffect, useRef, createElement } from "react";
import "../../css/indexx.css";
// import "../css/recent_index.css";
// import '../styles/index.css';
import "../../styles/main.css";
import "../../css/allbutton.css";
import "../../css/profileimg.css";
import "../../css/chat.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../../components/Navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import * as ggIcon from "@mui/icons-material";

import axios from "axios";
import ChatContainer from "../../components/ChatContainer";
import Contacts from "../../components/Contacts";
import Welcome from "../../components/Welcome";
import { Modal, Button, Input, Empty, Space, Upload, Flex, Radio, Card } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { host } from "../../utils/api";


const title = "แชท";
// const bgImg = { backgroundImage: "url('mainmoon.jpg')", backgroundSize: " cover", backgroundOpacity: "0.5" }
const body = { backgroundImage: "url('images/seamoon.jpg')" };

export default function ChatBox() {
  const navigate = useNavigate();
  const { userdata, isLoggedIn, socket } = useAuth();
  const { Search } = Input;
  const token = localStorage.getItem("token");

  const chat = useRef(null);
  const [chatlist, setChatlist] = useState();
  // const location = useLocation();
  const queryParams = new URLSearchParams(window.location.search);
  const chat_partner_id = queryParams.get("id");
  const chat_order_id = queryParams.get("od_id");


  const [selectedChatType, setSelectedChatType] = useState(chat_order_id == 0 || chat_order_id == null || chat_order_id == undefined ? "private" : "order");

  function menuChat(event, menu) {
    let oldSelected = document.querySelector("button.selected");
    oldSelected.classList.remove("selected");
    event.target.classList.add("selected");
    setSelectedChatType(menu)
  }
  const [isToggled, setIsToggled] = useState(false);
  const handleToggle = () => {
    setIsToggled((prevState) => !prevState);
  };
  /*--------------------------------------------------------------------------------- */
  const [partnerChat, setPartnerChat] = useState([]);
  // console.log("partnerChat : ",partnerChat);

  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined); //คนที่เราเลือกสนทนา
  // console.log("currentChat : ",currentChat);

  const getPartnerChat = async () => {
    await axios
      .get(`${host}/chat/partner/${chat_partner_id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setPartnerChat(response.data[0]);
        // setOrderId(chat_order_id)
      });
  };

  useEffect(() => {
    if (token) {
      getPartnerChat();
    } else {
      navigate("/login");
    }
  }, []);


  useEffect(() => {
    try {
      axios
        .get(`${host}/allchat`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          // console.log(response.data);
          setContacts(response.data); //แสดงผลคนที่เราสามารถแชทด้วยได้ทั้งหมด
        });
    } catch (error) {
      // Handle error
      console.log("catch");
    }
    // }, [contacts])
  }, [])


  const handleChatChange = (chat) => {
    setPartnerChat(null);
    setCurrentChat(chat);
  };


  /*--------------------------------------------------------------------------------- */

  //หลังจากที่กดส่งคำขอจ้างไปแล้วจะขึ้น order id มาและขึ้นเป็นแชทใหม่ 
  //ตอนเรียง contact แยกด้วยการเช็คทั้ง userid และ od_id ถ้า od_id อันเดียวกันให้อยู่ด้วยกัน

  return (
    <div className="body-con">
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <NavbarUser />
      {/* <div style={{ display: "flex", height: "100%" }}> */}
      <div className="chatbox-container">
        {/* -----ดิฟ1 ฝั่งรายชื่อ ------*/}
        <div className="aside-chatbox">
          <div className="headding">
            <h1 >แชท</h1>
          </div>
          <div className="menu-chat-grid">
            <div className="abc">
              <Flex>
                <Search placeholder="ค้นหา..." allowClear size="large" />
                <Button type="text" icon={<FilterOutlined style={{ color: "white" }} />}></Button>
              </Flex>
            </div>
            <div className="menu-chat">
              <button className={selectedChatType == "private" && "selected"} onClick={(event) => menuChat(event, "private")}>
                ส่วนตัว
              </button>
              <button className={selectedChatType == "order" && "selected"} onClick={(event) => menuChat(event, "order")}>
                ออเดอร์
              </button>
            </div>
          </div>
          <div style={{height:"100%",overflow: "auto"}}>
            <div className="chat-list">
              <Contacts
                partnerID={chat_partner_id}
                orderID={chat_order_id}
                contacts={contacts}
                changeChat={handleChatChange}
                Toggled={isToggled}
                selectedChatType={selectedChatType}
              />
            </div>

          </div>

          
        </div>

        {/* -----ดิฟ2  กดแล้วให้เปลี่ยนตรงนี้------*/}
        <div className="chat-room">
          {partnerChat != undefined ? (
            <ChatContainer currentChat={partnerChat} orderId={chat_order_id} chatId={partnerChat.id} />
          ) : currentChat === undefined ? (
            <Flex justify="center" align="center" height="100%"
              style={{ flex: 1 }}>
              <Empty description={
                <span>
                  ไม่มีแชทที่เลือกอยู่ในขณะนี้
                </span>
              } />
            </Flex>
          ) : (
            <ChatContainer currentChat={currentChat} chatId={currentChat.id} />
          )}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

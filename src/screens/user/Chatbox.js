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

const currentDate = new Date();
const date = new Date();
const date_now = date.toLocaleDateString("th-TH", {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: "2-digit",
  minute: "2-digit",
});
const timestamp_chat = date_now.split(" ")[1];

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
  const [contacts_order, setContactsOrder] = useState([]);

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

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    reportWindowSize()
  }, [chat_order_id])

  useEffect(() => {
    reportWindowSize()
  }, [partnerChat])

  function reportWindowSize() {
    // console.log(window.innerHeight, window.innerWidth)
    if (chat_order_id == null && partnerChat == null) {
      //ถ้าเปิดหน้าเลือกแชท
      // linear - gradient(180deg, #1E1C7B 0 %, #6394DE 100 %);
      if (window.innerWidth <= 999) {
        document.querySelector(".aside-chatbox").style.display = 'block';
        document.querySelector(".chat-room").style.display = 'none';
        document.querySelector(".aside-chatbox").classList.add("container");
      } else {
        document.querySelector(".aside-chatbox").style.display = 'block';
        document.querySelector(".chat-room").style.display = 'flex';
        document.querySelector(".aside-chatbox").classList?.remove("container");
      }
    } else {
      //ถ้าเปิดหน้าแชท
      if (window.innerWidth <= 999) {
        document.querySelector(".aside-chatbox").style.display = 'none';
        document.querySelector(".chat-room").style.display = 'flex';
      } else {
        document.querySelector(".aside-chatbox").style.display = 'block';
        document.querySelector(".chat-room").style.display = 'flex';
      }
    }
  }

  window.onresize = reportWindowSize;



  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await axios.get(`${host}/allchat`, {
        // headers: {
        //   Authorization: "Bearer " + token,
        // },
  //     });
  //     const sortedContacts = response.data.sort((a, b) => {
  //       return new Date(b.last_message_timestamp) - new Date(a.last_message_timestamp);
  //     });
  //     setContacts(sortedContacts);
  //     userRef.current = response.data;
  //   };
  
  //   fetchData();
  // }, [userRef.current]);

  // Callback function ที่จะส่งไปยัง child
  const updateMessages = (messages) => {
    console.log(messages);
    setMessages(messages);
  };

  // ทำงานแล้วดึงข้อมูลของผู้ติดต่อและข้อความ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${host}/allchat`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setContacts(response.data.contacts);
        setContactsOrder(response.data.contacts_order);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchData();
  }, [messages]);


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
                contacts_order={contacts_order}
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
            <ChatContainer currentChat={partnerChat} orderId={chat_order_id} chatId={partnerChat.id} updateMessages={updateMessages}/>
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
            <ChatContainer currentChat={currentChat} chatId={currentChat.id} updateMessages={updateMessages}/>
          )}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

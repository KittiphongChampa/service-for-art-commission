import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import io from "socket.io-client";
// import Logo from "../assets/logo.svg";
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { host } from "../utils/api";


export default function Contacts({ contacts, contacts_order, changeChat, Toggled, partnerID, orderID, selectedChatType }) {
  const { userdata } = useAuth();
  // const [usersOnline, setUsersOnline] = useState([]);

  // useEffect(() => {
  //   const usersArray = Array.from(onlineUsers);
  //   setUsersOnline(usersArray);
  // }, [onlineUsers]);
  
  const [currentSelected, setCurrentSelected] = useState();
  console.log(contacts);

  useEffect(() => {
    if (partnerID !== null) {
      orderID == null ? setCurrentSelected(partnerID + 0) : setCurrentSelected(partnerID + orderID)
    }
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
    window.history.pushState({}, '', `/chatbox?id=${contact.id}&od_id=${contact.od_id}`)
  };
  return (
    <>
      
      {userdata.urs_name && userdata.urs_profile_img && (
        <>

          {/* แสดงผลคนที่เราสามารถแชทด้วยได้ */}

          {contacts.map((contact, index) => {
            return (
              <>
                {selectedChatType == "private" || selectedChatType == "all" ?
                  (<>
                    <div
                      key={contact.id + contact.od_id} 
                      className={`chat-item ${String(contact.id) + String(contact.od_id) == currentSelected ? "selected" : ""}`}
                      onClick={() => changeCurrentChat(String(contact.id) + String(contact.od_id), contact)}
                    >
                      <img src={contact.urs_profile_img}></img>
                      <div>
                        {!Toggled && (
                          <>
                            <p className="order h6">{contact.urs_name}</p>
                            <p>

                              {contact.message_text?.split("images")[0] === `${host}/` ? (
                                <p className="message">ได้ส่งรูปภาพ</p>
                              ) : (
                                  <p className="message"
                                    style={{
                                      display: "flex",
                                    }}>
                                    <span className="oneline-textoverflow" style={{ flex: 1}}>{contact.latest_message_text}</span>
                                    <span style={{ width: "fit-content" }}> {new Date(contact.last_message_time).toLocaleString("th-TH", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", })} น.</span>
                                  </p>
                              )}
                            </p>
                            {/* <p className="message">{contact.message_text}</p> */}
                          </>
                        )}

                        {Toggled && (
                          <>
                            <p className="order filterd">xxxx</p>
                            <p className="message filterd">bust-up full color..</p>
                            <p className="time filterd">
                              {" "}
                              <span className="q">คิวที่1</span>
                              <span className="stat">รอชำระเงิน</span>
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="qq">
                      {/* {console.log(contact.id + contact.od_id + "=" + currentSelected)} */}
                      <div className={String(contact.id) + String(contact.od_id) == currentSelected ? "arrow" : ""} />
                    </div>
                  </>)
                  : null
                }
              </>
            );
          })}

          {contacts_order.map((contact_order, index) => {
            return (
              <>
                {selectedChatType == "order" && contact_order.od_id != 0 || selectedChatType == "all" ?
                  (<>
                    <div
                      key={contact_order.id + contact_order.od_id} //เปลี่ยนเป็น ยูเซอร์ไอดี+ออเดอร์ไอดี 
                      className={`chat-item ${String(contact_order.id) + String(contact_order.od_id) == currentSelected ? "selected" : ""}`}
                      onClick={() => changeCurrentChat(String(contact_order.id) + String(contact_order.od_id), contact_order)}
                    >
                      <img src={contact_order.urs_profile_img}></img>
                      <div>
                        {!Toggled && (
                          <>
                            <p className="order h6">{contact_order.urs_name}</p>
                            <p>

                              {contact_order.message_text?.split("images")[0] === `${host}/` ? (
                                <p className="message">ได้ส่งรูปภาพ</p>
                              ) : (
                                  <p className="message"
                                    style={{
                                      display: "flex",
                                    }}>
                                    <span className="oneline-textoverflow" style={{ flex: 1}}>{contact_order.latest_message_text}</span>
                                    <span style={{ width: "fit-content" }}> {new Date(contact_order.last_message_time).toLocaleString("th-TH", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", })} น.</span>
                                  </p>
                              )}
                            </p>
                            {/* <p className="message">{contact_order.message_text}</p> */}
                            <p className="time">
                              {/* <span className="stat">{new Date(contact_order.last_message_time).toLocaleString("th-TH")}</span> */}
                              {contact_order.od_id != 0 && <> <span className="stat">
                                {contact_order?.current_step_name?.includes("แนบสลิป") || contact_order?.current_step_name?.includes("ภาพ") ?
                                  contact_order.artist_id == userdata.id && 'รอ' //ถ้ามีคำว่าสลิปและเราเป็นนักวาด ให้ใส่คำว่ารอ แต่ถ้าไม่มีคำว่าสลิป และเราไม่ใช่นักวาด ให้ใส่คำว่ารอ
                                  : contact_order.artist_id !== userdata.id && 'รอ'}{contact_order?.current_step_name?.includes("ภาพ") && 'อนุมัติ'}{contact_order.current_step_name}</span>
                                {/* <span className="stat">{contact_order.od_id}</span> */}
                                </>
                              }
                            </p>
                          </>
                        )}

                        {Toggled && (
                          <>
                            <p className="order filterd">xxxx</p>
                            <p className="message filterd">bust-up full color..</p>
                            <p className="time filterd">
                              {" "}
                              <span className="q">คิวที่1</span>
                              <span className="stat">รอชำระเงิน</span>
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="qq">
                      {/* {console.log(contact_order.id + contact_order.od_id + "=" + currentSelected)} */}
                      <div className={String(contact_order.id) + String(contact_order.od_id) == currentSelected ? "arrow" : ""} />
                    </div>
                  </>) : null
                }
              </>
            )
          })}
        </>
      )}
    </>
  );
}

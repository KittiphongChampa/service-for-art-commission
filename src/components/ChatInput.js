import React, { useRef, useState, useEffect } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { FileUploader } from "react-drag-drop-files";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import io from "socket.io-client";
import "../css/chat.css";

export default function ChatInput({ handleSendMsg, handleSendImage }) {
  const [msg, setMsg] = useState("");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No selected file");
  const [previewUrl, setPreviewUrl] = useState("");


  // const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // const handleEmojiPickerhideShow = () => {
  //   setShowEmojiPicker(!showEmojiPicker);
  // };
  // const handleEmojiClick = (event, emojiObject) => {
  //   let message = msg;
  //   message += emojiObject.emoji;
  //   setMsg(message);
  // };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    } else {
      // console.log(image);
      handleSendImage(image);
    }
  };

  const [form_image, setForm_image] = useState(false);
  const Close_form_image = () => {
    setPreviewUrl(null);
    setForm_image(false);
  };
  const openModal = () => setForm_image(true);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setImage(file);
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   setSelectedFile(file);
  // };

  return (
    <>
      <Container>
        <div className="button-container">
          {/* <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div> */}

          <div className="emoji">
            {/* <input type="file" onChange={handleFileChange} hidden/>
          {selectedFile && (
            <img src={URL.createObjectURL(selectedFile)} alt="Selected File" />
          )} */}
            <button onClick={openModal}>ไฟล์</button>
          </div>
        </div>

        <form className="input-container" onSubmit={(event) => sendChat(event)}>
          <input
            type="text"
            placeholder="ส่งข้อความ..."
            onChange={(e) => setMsg(e.target.value)}
            value={msg}
          />
          <button type="submit">
            <IoMdSend />
          </button>
        </form>
      </Container>

      <Modal show={form_image} onHide={Close_form_image} size="lg" centered>
        {/* <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            เลือกรูปภาพ
          </Modal.Title>
        </Modal.Header> */}
        <div class="d-flex justify-content-center mt-3">
          <h5>เลือกรูปภาพ</h5>
        </div>
        <Modal.Body class="d-flex justify-content-center">
          <form
            id="sendImage"
            onClick={() => document.querySelector(".input-field").click()}
            className="dragNdrop"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onSubmit={(event) => sendChat(event)}
          >
            <input
              type="file"
              accept="image/png ,image/gif ,image/jpeg"
              className="input-field"
              hidden
              onChange={({ target: { files } }) => {
                files[0] && setFileName(files[0].name);
                if (files) {
                  setImage(files[0]);
                  setPreviewUrl(URL.createObjectURL(files[0]));
                }
              }}
            />
            {previewUrl ? (
              <img src={previewUrl} alt={fileName} className="imagePreview" />
            ) : (
              <h4>Drop images here</h4>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={Close_form_image}>Close</Button>
          <Button variant="primary" type="submit" form="sendImage" onClick={Close_form_image}>Send</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;

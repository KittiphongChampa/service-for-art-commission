import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import axios from "axios";
import { host } from "../utils/api";

export default function Welcome() {
  const token = localStorage.getItem("token");
  const [userName, setUserName] = useState("");
  
//   useEffect(async () => {
//     setUserName(
//       await JSON.parse(
//         localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
//       ).username
//     );
//   }, []);
useEffect(() => {
  getUser();
}, []);
const getUser = async () => {
  // await axios
  //   .get("http://localhost:3333/index", {
  //     headers: {
  //       Authorization: "Bearer " + token,
  //     },
  //   })
  //   .then((response) => {
  //     const data = response.data;
  //     if (data.status === "ok") {
  //         // setUserdata(data.users[0]);
  //         setCurrentUserName(data.users[0].urs_name);
  //         setCurrentUserImage(data.users[0].urs_profile_img);
  //     }
  //   });
  try {
    const response = await axios.get(`${host}/index`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = response.data;
    if (data.status === "ok") {
      setUserName(data.users[0].urs_name);
    }
  } catch (error) {
    // Handle error
  }
};

  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
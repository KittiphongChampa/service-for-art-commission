import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import "../css/indexx.css";
import "../css/allbutton.css";
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import DefaultInput from "../components/DefaultInput";
import ProfileImg from "../components/ProfileImg.js";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../alertdata/alertData";
import * as Icon from 'react-feather';
import * as ggIcon from '@mui/icons-material';
import { host } from "../utils/api.js";
import { Button, Space, Form, Input, Checkbox, Flex, Col, Row } from "antd";
import { NavbarUser, NavbarAdmin, NavbarHomepage, NavbarGuest } from "../components/Navbar";
const title = "สร้างบัญชี";


const toastOptions = {
  position: "bottom-right",
  autoClose: 1000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};



export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");
  const roleName = new URLSearchParams(location.search).get("role");
  const userID = new URLSearchParams(location.search).get("userID");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { }, []);
  const [pdpaAccept, setPdpaAccept] = useState(false);
  const [values, setValues] = useState({
    username: "",
    password: "",
    confirmpassword: "",
    bankAccName: "",
    ppNumber: ""
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setPdpaAccept(checked);
    } else {
      setValues({ ...values, [event.target.name]: event.target.value });
    }
  };

  const [file, setFile] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");


  //มิ้นท์
  const addProfileImg = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const image = e.target.files[0];
      setFile(image);
      setPreviewUrl(URL.createObjectURL(image));
    };
    input.accept = "image/png ,image/gif ,image/jpeg";
    input.click();
  };

  const handleValidation = () => {
    const { password, confirmpassword, username } = values;
    if (password !== confirmpassword) {
      toast.error("password and confirm password should be same", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("username should be greater than 4 characters", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("password should be greater than 8 characters", toastOptions);
      return false;
    } else if (pdpaAccept != true) {
      toast.error(
        "ไม่สามารถสมัครสมาชิกได้เนื่องจากไม่ได้ยอมรับเงื่อนไขการใช้บริการ",
        toastOptions
      );
    }
    return true;
  };

  const [form] = Form.useForm();
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (handleValidation()) {
  //     setIsLoading(true);
  //     const formData = new FormData();
  //     formData.append("userID", userID);
  //     formData.append("email", email);
  //     formData.append("file", file);
  //     formData.append("username", values.username);
  //     formData.append("password", values.password);
  //     formData.append("bankAccName", values.bankAccName);
  //     formData.append("ppNumber", values.ppNumber);
  //     formData.append("pdpaAccept", pdpaAccept);
  //     formData.append("roleName", roleName);
  //     const token = localStorage.getItem("token");
  //     await axios
  //       .post(`${host}/register`, formData, {
  //         headers: {
  //           "Content-type": "multipart/form-data",
  //           Authorization: "Bearer " + token,
  //         },
  //       })
  //       .then((response) => {
  //         const data = response.data;
  //         if (data.status === "ok") {
  //           localStorage.setItem("token", data.token);
  //           localStorage.setItem("type", "user");
  //           // navigate("/");
  //           Swal.fire({ ...alertData.registerSuccess }).then(
  //             // navigate("/")
  //             window.location.href = "/"
  //           );
  //         } else if (data.status === "error") {
  //           toast.error(data.message, toastOptions);
  //         } else {
  //           toast.error("Register Failed", toastOptions);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   }
  // };
  // const [roleName, setRoleName] = useState(null)
  console.log(roleName);

  const [roleConfirm, setRoleConfirm] = useState(false)
  const icon = {
    fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48",
  };

  // function handleRole(role) {
  //   setRoleName(role)
  //   // alert(role)
  // }

  function roleCheck() {
    setRoleConfirm(!roleConfirm)
  }

  const handleSubmit = async (values) => {
    // event.preventDefault();
    console.log(values)
    setIsLoading(true);
    const formData = new FormData();
    formData.append("userID", userID);
    formData.append("email", email);
    formData.append("file", file);
    formData.append("username", values.username);
    formData.append("password", values.password);
    // formData.append("bankAccName", values.bankAccName);
    // formData.append("ppNumber", values.ppNumber);
    // formData.append("pdpaAccept", pdpaAccept);
    formData.append("roleName", roleName);
    const token = localStorage.getItem("token");
    await axios
      .post(`${host}/register`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("type", "user");
          // navigate("/");

          if (roleName == 'artist') {
            alert()
          } else {
            Swal.fire({ ...alertData.registerSuccess });
    setTimeout(() => {
        window.location.href = "/";
    }, 1500);
          }
          

        } else if (data.status === "error") {
          toast.error(data.message, toastOptions);
        } else {
          toast.error("Register Failed", toastOptions);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  function alert() {
    Swal.fire({
      title: 'สมัครสมาชิกสำเร็จ',
      icon: 'success',
      html: `

      <Lottie animationData={Animation} />
      
      
      
      <p>เริ่มต้นการใช้งานเว็บไซต์อย่างสมบูรณ์ด้วยการตั้งค่าบัญชีของคุณเพิ่มเติม เพื่อให้ผู้คนรู้จักคุณมากขึ้นและสามารถเปิดคอมมิชชันได้ทันที
      <ul>
      <li>ตั้งค่าโปรไฟล์</li>
      <li>เพิ่มช่องทางการรับเงิน</li>
      
      </ul>
      
      
      </p>
      
      `,
      allowOutsideClick:false,
      confirmButtonText: "ไปตั้งค่าโปรไฟล์",
      showDenyButton: true,
      denyButtonText: `สำรวจเว็บไซต์ก่อน`,
      //iconColor: '#7E9AFA',
    })
    .then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/setting-profile"
      } else {
        window.location.href = "/"
      }
    })
  }

  return (
    <div className="body-con">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <NavbarGuest />
      {/* <NavbarGuest /> */}

      <div
        className="body-lesspadding"
        style={{
          backgroundImage: "url('images/mainmoon.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container-xl">
            <div className="createaccount-soloCard">
              <div className="card-header-tap">
                <div>
                  <button>
                    <Icon.ArrowLeft
                      className="go-back-icon"
                      onClick={roleCheck}
                    />
                  </button>
                </div>
                <h1 className="text-center">{title} </h1>
                <div></div>
              </div>
              <div className="createaccount-col-text">
                <ProfileImg src={previewUrl} onPress={addProfileImg} />
                <p className="text-center">รูปโปรไฟล์</p>
                <Form
                  onFinish={handleSubmit}
                  name="submitArtist"
                  form={form}
                  layout="vertical"
                  initialValues={
                    { email: email }}>
                  <Form.Item
                    label="อีเมล"
                    name="email"
                    id="email"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกอีเมล",
                      },
                      { type: "email" },
                    ]}

                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    label="ชื่อผู้ใช้"
                    id="username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกชื่อผู้ใช้",
                      },
                      {
                        min: 4,
                        message: "กรุณากรอกชื่อผู้ใช้อย่างน้อย 4 ตัว",
                      },
                      { type: "text" },
                    ]}
                  >
                    <Input />
                  </Form.Item>


                  <Form.Item
                    label="รหัสผ่าน"
                    name="password"
                    id="password"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกรหัสผ่าน",
                      },
                      {
                        min: 8,
                        message: "กรุณากรอกรหัสผ่านอย่างน้อย 8 ตัว",
                      },
                      { type: "password" },
                    ]}
                  >
                    <Input.Password style={{ borderRadius: "1rem", padding: "0.5rem 1rem" }} />
                  </Form.Item>

                  {/* Field */}
                  <Form.Item
                    label="ยืนยันรหัสผ่าน"
                    name="confirmpassword"
                    dependencies={['password']}
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกรหัสผ่าน",
                      },
                      { type: "password" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password style={{ borderRadius: "1rem", padding: "0.5rem 1rem" }} />
                  </Form.Item>
                  {/* {roleName == "artist" && (
                    <>
                      <Form.Item
                        label="ชื่อบัญชีธนาคาร"
                        id="bankAccName"
                        name="bankAccName"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกชื่อบัญชีธนาคาร",
                          },
                          { type: "text" },
                        ]}

                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="เลขพร้อมเพย์"
                        id="ppNumber"
                        name="ppNumber"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกเลขพร้อมเพย์",
                          },
                          { type: "text" },
                        ]}
                      >
                        <Input maxLength={13} />
                      </Form.Item>
                    </>)} */}

                  <Flex>
                    <Checkbox checked={pdpaAccept} onChange={(e) => setPdpaAccept(e.target.checked)}>ยอมรับเงื่อนไขการใช้บริการ</Checkbox>

                  </Flex>
                  <Flex justify="center">
                    <Button htmlType="submit" shape="round" size="large" type="primary" disabled={!pdpaAccept}>ลงทะเบียน</Button>
                  </Flex>
                </Form>
              </div>
            </div>
          
        </div>
      </div>
    </div>
  );
}
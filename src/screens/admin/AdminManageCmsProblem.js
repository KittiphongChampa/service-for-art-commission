import React, { useState, useEffect } from "react";
import {
  NavbarUser,
  NavbarAdmin,
  NavbarHomepage,
  NavbarGuest,
} from "../../components/Navbar";
import * as Icon from "react-feather";
import {
  Select,
  Dropdown,
  Input,
  Radio,
  Badge,
  Tabs,
  Tag,
  Modal,
  Form,
  message,
  Button,
  Flex,
  Image,
  Card,
} from "antd";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { useAuth } from "../../context/AuthContext";
import { host } from "../../utils/api";
import {
  isSameDay,
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
} from "date-fns";

import {
  CloseOutlined,
  LeftOutlined,
  HomeOutlined,
  UserOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import AdminMenuAside from "./AdminMenuAside";
import { Helmet } from "react-helmet";

export default function AdminManageCmsProblem() {
  const type = localStorage.getItem("type");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const cmsID = useParams();
  const { admindata, isLoggedIn, socket } = useAuth();

  // ข้อมูลผู้ใช้ คอมมิชชัน ภาพ ที่เป็นปัญหา



  useEffect(() => {
    if (token && type === "admin") {
      getData();
    } else {
      navigate("/login");
    }
  }, []);

  const [problemPics, setProblemPics] = useState([]);
  const [problemCmsData, setProblemCmsData] = useState([]);
  const [array_imgSimilar, setImgSimilar] = useState([]);

  const getData = async () => {
    await axios
      .get(`${host}/commission/problem/${cmsID.id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          setProblemPics(data.similar_object);
          setProblemCmsData(data.similar_data[0]);
          setImgSimilar(data.array_imgSimilar)
   
        } else {
          console.log("error");
        }
      });
  };

  const [form] = Form.useForm();

  const [deleteModal, setDeleteModal] = useState(false);

  function openDelModal() {
    setDeleteModal(!deleteModal);
  }

  function keep(cmsID) {
    Swal.fire({
      title: `อนุมัติคอมมิชชันนี้หรือไม่`,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      icon: "question",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // เกี่ยวกับการแจ้งเตือน
        const keepSimilar = {
          sender_id: 0,
          sender_name: admindata.admin_name,
          sender_img: admindata.admin_profile,
          receiver_id: problemCmsData.id,
          work_id: problemCmsData.cms_id,
          msg: `คอมมิชชันของคุณใช้งานได้แล้ว เนื่องจากแอดมินตรวจสอบแล้วพบว่าไม่มีความคล้าย`,
        };
        socket.emit("ManageCmsSimilar", keepSimilar);
        axios.post(`${host}/admin/keep/work/noti`, keepSimilar);

        await axios
          .patch(
            `${host}/commission/problem/approve/${cmsID}?array_imgSimilar=${array_imgSimilar}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )
          .then((response) => {
            const data = response.data;
            if (data.status === "ok") {
              Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                showConfirmButton: false,
  timer: 1500,
              }).then(() => {
                window.location.href = `/admin/adminmanage/allcms`;
              });
            } else {
              console.log("error");
              Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด กรุณาลองใหม่",
              });
            }
          });
      }
    });
  }

  function delCommission(values) {
    const commissionId = cmsID.id;
    const postData = {
      reason: values["reason"],
    };
    // console.log(postData);
    Swal.fire({
      title: `ต้องการลบหรือไม่`,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      icon: "question",
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        // เกี่ยวกับการแจ้งเตือน
        const DeleteSimilar = {
          sender_id: 0,
          sender_name: admindata.admin_name,
          sender_img: admindata.admin_profile,
          receiver_id: problemCmsData.id,
          work_id: problemCmsData.cms_id,
          msg: `คอมมิชชกันของคุณถูกลบโดยแอดมิน เนื่องจากแอดมินตรวจสอบแล้วพบว่ามีความคล้าย`,
        };
        socket.emit("ManageCmsSimilar", DeleteSimilar);
        axios.post(`${host}/admin/delete/work/noti`, DeleteSimilar);

        await axios
          .patch(
            `${host}/commission/problem/notapprove/${commissionId}`,
            postData,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )
          .then((response) => {
            const data = response.data;
            if (data.status === "ok") {
              Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                showConfirmButton: false,
  timer: 1500,
              }).then(() => {
                window.location.href = `/admin/adminmanage/allcms`;
              });
            } else {
              console.log("error");
              Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด กรุณาลองใหม่",
              });
            }
          });
      }
    });
  }

  const title = "รายงานภาพเหมือน";

  function formatDate(date) {
    if (date) {
      let thisDate = new Date(date);
      let timeFormat = new Date(date);

      if (!Number.isNaN(thisDate.getTime())) {
        if (isToday(thisDate)) {
          timeFormat = format(thisDate, "วันนี้");
        } else if (isYesterday(thisDate)) {
          timeFormat = format(thisDate, "เมื่อวานนี้");
        } else if (isThisYear(thisDate)) {
          timeFormat = format(thisDate, "วันที่ dd/MM");
        } else {
          timeFormat = format(thisDate, "วันที่ dd/MM/yyyy");
        }
      }
      return timeFormat;
    } else {
      return date;
    }
  }

  const menus = [
    {
      key: "wait",
      label: "ภาพที่1",
      children: "",
    },
    {
      key: "ฟ",
      label: "ภาพที่2",
      children: "",
    },
  ];

  const [selectedKey, setSelectedKey] = useState(0);

  const handleTabChange = (key) => {
    setSelectedKey(key); //
    console.log(key);
  };

  return (
    <>

      <div className="body-con">
        <Modal
          title="ระบุเหตุผลการลบ"
          open={deleteModal}
          onCancel={openDelModal}
          footer=""
        >
          <Form
            form={form}
            name="delReport"
            onFinish={delCommission}
            layout="vertical"
          >
            <Flex gap="middle" vertical>
              <Form.Item
                name="reason"
                label="ใส่เหตุผลการลบ"
                rules={[
                  { required: true, message: "กรุณากรอกฟิลด์นี้" },
                  { type: "string", max: 100 },
                ]}
              >
                <Input />
              </Form.Item>
              <Flex gap="small" justify="flex-end">
                <Button shape="round" size="large" htmlType="submit" danger>
                  ลบคอมมิชชันนี้
                </Button>
                {/* <Button shape="round" size="large" onClick={openDelModal}>ยกเลิก</Button> */}
              </Flex>
            </Flex>
          </Form>
        </Modal>

        <Helmet>
          <title>{title}</title>
        </Helmet>
        <NavbarAdmin />
        <div className="chatbox-container">
          <div className="aside-panel">
            <AdminMenuAside onActive="allcms" />
          </div>
          <div className="aside-main-card" style={{ padding: "1.3rem 2rem" }}>
            <h1 className="h3">
              {" "}
              <Button
                className="icon-btn"
                size="large"
                type="text"
                icon={<LeftOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = "/admin/adminmanage/allcms";
                }}
              ></Button>
              รูปภาพที่รอตรวจสอบความเหมือน
            </h1>

            <Tabs defaultActiveKey="0" onChange={handleTabChange}>
              {/* Use problemPics?.map() to map each item to a <Tabs.TabPane> */}
              {problemPics?.map((item, index) => (
                <Tabs.TabPane key={index} tab={"รูป id: " + item.ex_img_id}>
                  <Flex style={{ gap: "0.5rem", marginBottom: "1rem" }} className='similar-headding1'>
                    <p className="h4" style={{ flex: "1" }}>
                      รูปภาพที่เป็นปัญหา
                    </p>
                    <p className="h4" style={{ flex: "1" }}>
                      รูปภาพที่เหมือน
                    </p>
                  </Flex>
                  <div className="sim-container">
                    <p className="h4 similar-headding2">
                      รูปภาพที่เป็นปัญหา
                    </p>
                    <Card className="problem-pic-container">
                      <div className="cms-artist-box">
                        <Link to={`/profile/${problemCmsData.id}`}>
                          <div id="cms-artist-profile">
                            <img src={problemCmsData?.urs_profile_img} alt="" />
                            <div>
                              <p>
                                {problemCmsData?.urs_name}{" "}
                                <Badge
                                  count={"cms id :" + problemCmsData.cms_id}
                                  showZero
                                  color="#faad14"
                                />
                              </p>
                            </div>
                          </div>
                        </Link>
                        <p id="cms-price">
                          โพสต์เมื่อ {formatDate(problemCmsData.created_at)}
                        </p>
                      </div>
                      <div className="pic">
                        <Image
                          src={problemPics[selectedKey]?.ex_img_path}
                        ></Image>
                      </div>

                      {/* {imgSimilar.map((item, index) => (
                  <div className="pic" key={index}>
                    <Image src={item.ex_img_path}></Image>
                  </div>
                ))} */}

                      <Flex
                        justify="center"
                        gap="small"
                        className="mt-3"
                        style={{ flex: "0 1 auto", minHeight: 0 }}
                      >
                        <Button
                          shape="round"
                          size="large"
                          onClick={() => keep(cmsID.id)}
                        >
                          อนุมัติคอมมิชชัน
                        </Button>
                        <Button
                          shape="round"
                          size="large"
                          danger
                          onClick={openDelModal}
                        >
                          ไม่อนุมัติคอมมิชชัน
                        </Button>
                      </Flex>
                    </Card>
                    <div className="sim-pic-container">
                      <p className="h4 similar-headding2">
                        รูปภาพที่เหมือน
                      </p>
                      {problemPics[selectedKey]?.image_similar.map((item,index)=>{
                        return <Card className="pic-box" key={index}>
                        <div className="cms-artist-box">
                          <Link to={`/profile/${item.id}`}>
                            <div id="cms-artist-profile">
                              <img
                                src={item.urs_profile_img}
                                alt=""
                              />
                              <div>
                                <p>
                                  {item.urs_name}{" "}
                                  <Badge
                                    count={"cms id :" + item.cms_id}
                                    showZero
                                    color="#faad14"
                                  />
                                </p>
                              </div>
                            </div>
                          </Link>
                          <p id="cms-price">
                            โพสต์เมื่อ {formatDate(item.created_at)}
                          </p>
                        </div>
                        <div className="pic-wrapper">
                          <Image src={item.ex_img_path}></Image>
                        </div>
                        <Flex justify="center">
                          <p>คล้าย {item.percentage}%</p>
                        </Flex>
                      </Card>
                      })}
                    </div>
                  </div>
                </Tabs.TabPane>
              ))}
            </Tabs>
            {/* <ComparePic/> */}
          </div>
        </div>
      </div>
    </>
  );
}

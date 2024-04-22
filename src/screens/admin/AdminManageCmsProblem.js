import React, { useState, useEffect } from "react";
import { NavbarUser, NavbarAdmin, NavbarHomepage, NavbarGuest } from "../../components/Navbar";
import * as Icon from 'react-feather';
import { Select,Dropdown, Input, Radio, Space, Tag, Modal, Form, message, Button, Flex } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { useAuth } from '../../context/AuthContext';
import { host } from "../../utils/api";



export default function AdminManageCmsProblem() {
    const type = localStorage.getItem("type");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const cmsID = useParams();
    const { admindata, isLoggedIn } = useAuth();
    // const [cmsData, setCmsdata] = useState([]);
    // const [problemImage, setProblemImage] = useState([]);
    // console.log(problemImage);

    // ข้อมูลผู้ใช้ คอมมิชชัน ภาพ ที่เป็นปัญหา
    const [userSimilar, setUserProblem] = useState([]);
    const [cmsSimilar, setCmsProblem] = useState([]);
    const [imgSimilar, setImgSimilar] = useState([]);
    let array_imgSimilar = [];
    imgSimilar.map((data) => (array_imgSimilar.push(data.ex_img_id)))
    // console.log(userSimilar);
    // console.log(cmsSimilar);
    // console.log(imgSimilar);

    // ข้อมูลผู้ใช้ คอมมิชชัน ภาพ ที่เป็นต้นแบบ
    const [prototype, setPrototype] = useState([]);
    
    // const [usersPrototype, setUserPrototype] = useState([]);
    // const [cmsPrototype, setCmsPrototype] = useState([]);
    // const [imgPrototype, setImgPrototype] = useState([]);
    // console.log(usersPrototype);
    // console.log(cmsPrototype);
    // console.log(imgPrototype);

    useEffect(() => {
        if (token && type==="admin") {
          getData();
        } else {
          navigate("/login");
        }
    }, []);

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
            setUserProblem(data.data1.res_User_similar);
            setCmsProblem(data.data1.res_Cms_similar);
            setImgSimilar(data.data1.updatedResults1);
            // setUserPrototype(data.data2.res_User_prototype);
            // setCmsPrototype(data.data2.res_Cms_prototype);
            // setImgPrototype(data.data2.updatedResults2);
            setPrototype(data.data2)

          } else {
              console.log("error");
          }
        })
    }

    const [form] = Form.useForm();

    const [deleteModal,setDeleteModal] = useState(false)

    function openDelModal() {
      setDeleteModal(!deleteModal)
    }

    function keep(cmsID) {
      Swal.fire({
        title: `เก็บไว้หรือไม่`,
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        icon: "question"
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios
          .patch(`${host}/commission/problem/approve/${cmsID}?array_imgSimilar=${array_imgSimilar}`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            const data = response.data;
            if (data.status === "ok") {
              Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                confirmButtonText: 'ตกลง',
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
          })
        }
      })
    }

    function delCommission(values) {
      const commissionId = cmsID.id;
      const postData = {
        reason: values['reason'],
      };
      console.log(postData);
      Swal.fire({
        title: `ต้องการลบหรือไม่`,
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        icon: "question"
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios
          .patch(`${host}/commission/problem/notapprove/${commissionId}`, postData, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            const data = response.data;
            if (data.status === "ok") {
              Swal.fire({
                icon: "success",
                title: "บันทึกสำเร็จ",
                confirmButtonText: 'ตกลง',
              }).then(() => {
                // const deleteWork = {
                //   sender_id: 0,
                //   sender_name: admindata.admin_name,
                //   sender_img: admindata.admin_profile,
                //   receiver_id: artistDetail.artistId,
                //   msg: `งานของคุณถูกลบโดยแอดมิน เนื่องจากถูกรายงานว่าเป็น ${reportDetail.sendrp_header}`
                // };
                // socket.emit('workhasdeletedByadmin', deleteWork);
                window.location.href = `/admin/adminmanage/allcms`;
              });
            } else {
              console.log("error");
              Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด กรุณาลองใหม่",
              });
            }
          })
        } 
      })
    }


  return (
    <>
      <div>
        <h3>ภาพที่เป็นปัญหา</h3>

        <h5>ข้อมูลผู้ใช้: {userSimilar.urs_name}</h5>
        <img src={userSimilar.urs_profile_img} style={{width: "30px"}} />
        <p>user_id: {userSimilar.usr_id}</p>

        <h5>ชื่อคอมมิชชัน: {cmsSimilar.cms_name}</h5>
        <p>cms_id: {cmsSimilar.cms_id}</p>
        <p>รายละเอียด: {cmsSimilar.cms_desc}</p>
        <p>เวลา: {cmsSimilar.created_at}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {imgSimilar.map((item, index) => (
            <div key={index} style={{ margin: '5px' }}>
              <img
                src={item.ex_img_path}
                style={{
                  width: '300px',
                  border: item.status === 'similar' ? '2px solid red' : 'none',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {prototype.map((item, index) => (
          <div key={index} style={{ margin: '5px' }}>
              <h3>อาจคล้ายกับ</h3>
              <h5>ข้อมูลผู้ใช้: {item.users_data.urs_name}</h5>
              <img src={item.users_data.urs_profile_img} style={{width: "30px"}} />
              <p>user_id: {item.users_data.usr_id}</p>
              <h5>ชื่อคอมมิชชัน: {item.cms_data.cms_name}</h5>
              <p>cms_id: {item.cms_data.cms_id}</p>
              <p>รายละเอียด: {item.cms_data.cms_desc}</p>
              <p>เวลา: {item.cms_data.created_at}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <img
                  src={item.img_data.ex_img_path}
                  style={{
                    width: '300px',
                    border: item.img_data.status === 'prototype' ? '2px solid red' : 'none',
                  }}
                />
              </div>
          </div>
        ))}
      </div>

      {/* <button onClick={() => approve(cmsID.id)}>อนุมัติ</button>
      <button onClick={() => not_approve(cmsID.id)}>ไม่อนุมัติ</button> */}

      <Flex justify="center" gap="small">
        <Button size="large" shape="round" onClick={() => keep(cmsID.id)}>
          เก็บคอมมิชชันไว้
        </Button>
        <Button size="large" shape="round" danger onClick={openDelModal}>
          ลบคอมมิชชัน
        </Button>
      </Flex>

      <Modal title="ระบุเหตุผลการลบ" open={deleteModal} onCancel={openDelModal} footer="">
        <Form
          form={form}
          name="delReport"
          onFinish={delCommission}
        >
          <Flex gap='middle' vertical>
            <Form.Item
              name="reason"
              label="ใส่เหตุผลการลบ"
              rules={[{ required: true, message: "กรุณากรอกฟิลด์นี้" }, { type: 'string', max: 100 }]}
            >
              <Input />
            </Form.Item>
            <Flex gap='small' justify="flex-end">
              <Button shape="round" size="large" htmlType="submit" danger>ยืนยัน</Button>
              <Button shape="round" size="large" onClick={openDelModal}>ยกเลิก</Button>
            </Flex>
        
            </Flex>
          </Form>
      </Modal>
    </>
  )
}
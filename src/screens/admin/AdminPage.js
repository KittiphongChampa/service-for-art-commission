import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import {
  NavbarUser,
  NavbarAdmin,
  NavbarHomepage,
} from "../../components/Navbar";
import PieChart from "../../components/DashboardAdmin/PieChart";
import LineChart from "../../components/DashboardAdmin/LineChart";
import { styled } from "styled-components";
import { width } from "@mui/system";
import AdminMenuAside from "./AdminMenuAside";
import { useAuth } from '../../context/AuthContext';
import { host } from "../../utils/api";
import { Flex } from 'antd';

export default function AdminPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const type = localStorage.getItem("type");
  const { admindata, isLoggedIn } = useAuth();
  // console.log(admindata.admin_type);

  const [admins, setAdmins] = useState([]); //ข้อมูลของแอดมินทั้งหมด
  const [user, setUser] = useState([]); //ข้อมูลของผู้ใช้งานทั้งหมด
  const [cmsData, setCmsdata] = useState([]); //ข้อมูลของ cms ที่รอตรวจสอบทั้งหมด
  const [reportAll, setReportAll] = useState([]); //ข้อมูลของ report ทั้งหมด
  const [artistRank, setArtistRank] = useState([]); //ข้อมูลลำดับของนักวาด

  useEffect(() => {
    if (token && type == "admin") {
      getAllAdminData();
      getAllUsersData();
      getAllCmsProblem();
      getReport();
      getArtistRank();
    } else {
      navigate("/login");
    }
  }, []);


  const getAllAdminData = async () => {
    await axios
      .get(`${host}/alladmin`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const data = response.data;
        setAdmins(data.admins);
      });
  };

  const getAllUsersData = async () => {
    await axios
      .get(`${host}/alluser`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const data = response.data;
        setUser(data.users);
      });
  };

  const getAllCmsProblem = async () => {
    await axios
      .get(`${host}/allcommission`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        const data = response.data;
        setCmsdata(data.data);
      })
  };

  const getReport = async () => {
    await axios
      .get(`${host}/allreport`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          setReportAll(data.results);
        }
      });
  };

  const getArtistRank = async () => {
    await axios .get(`${host}/get/artist/ranking`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      if (response.status == 200) {
        setArtistRank(response.data.results)
      } else {
        console.log("เกิดข้อผิดพลาดในการหา artist rank");
      }
    })
  };



  return (
    <>
      <div className="body-con">
        <NavbarAdmin />

        <div className="chatbox-container">
          <div className="aside-panel">
            <AdminMenuAside onActive={null} />
          </div>
          <div className="aside-main-card" style={{ padding: "1.3rem 3rem" }}>
            {/* <h3>Welcome,{admindata.admin_name}</h3> */}
            <h1 className="h3">แดชบอร์ด</h1>
            <Flex gap="small" wrap="wrap">
              <Link to="/admin/adminmanage/allcms">
                <div className="dashboard-item">
                  <p className="h4">{cmsData.length}</p>
                  <p>ภาพที่รอตรวจความคล้าย</p>
                </div>
              </Link>
              <Link to="/admin/adminmanage/report">
                <div className="dashboard-item">
                  <p className="h4">{reportAll.length}</p>
                  <p>รีพอร์ต</p>
                </div>
              </Link>
              <Link to="/admin/adminmanage/alluser">
                <div className="dashboard-item">
                  <p className="h4">{user.length}</p>
                  <p>ผู้ใช้งาน</p>
                </div>
              </Link>
              <Link to="/admin/adminmanage/alladmin">
                <div className="dashboard-item">
                  <p className="h4">{admins.length}</p>
                  <p>แอดมิน</p>
                </div>
              </Link>
            </Flex>

            <div style={{ display: "flex", marginTop: "15px" }}>
              <div
                style={{
                  borderRadius: "20px",
                  border: "3px",
                  backgroundColor: "white",
                  // width: "650px",
                  flex: 5,
                  padding: "20px",
                }}
              >
                <h2 className="h6">อัตราส่วนสมัครสมาชิกของผู้ว่าจ้างและนักวาด</h2>
                <LineChart />
              </div>
              <div
                style={{
                  borderRadius: "20px",
                  border: "3px",
                  backgroundColor: "white",
                  // width: "500px",
                  flex: 1,
                  marginLeft: "15px",
                  padding: "20px",
                }}
              >
                <h2 className="h6">อัตราส่วนระหว่างผู้ว่าจ้างและนักวาด</h2>
                <PieChart />
              </div>
            </div>

            <div>
              <h6>อันดับนักวาด</h6>
              <div style={{ display: "flex", marginTop: "15px" }}>
                <table className="table is-striped is-fullwidth">
                  <thead>
                    <tr>
                      <th>ลำดับ</th>
                      <th>ชื่อนักวาด</th>
                      <th>จำนวนรีวิว</th>
                      <th>คะแนนรีวิว</th>
                      <th>จำนวนออเดอร์</th>
                      <th>เงินที่ได้ทั้งหมด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artistRank.length == 0 ? (<tr>
                        <td>ยังไม่มีข้อมูล</td>
                      </tr>
                      )
                      :
                      (artistRank.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>
                            <img src={item.urs_profile_img} style={{ width: 20, borderRadius: 50 }} /> {item.urs_name}
                          </td>
                          <td>{item.review_count}</td>
                          <td>{item.urs_all_review}</td>
                          <td>{item.order_count}</td>
                          <td>{item.profit}</td>
                        </tr>
                      )))
                    }
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

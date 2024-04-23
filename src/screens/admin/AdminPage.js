import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as Icon from 'react-feather';
import axios from "axios";
import Button from "@mui/material/Button";
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import * as ggIcon from '@mui/icons-material';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
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
import { Flex, Menu } from 'antd';

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
    await axios.get(`${host}/get/artist/ranking`, {
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

  const items = [
    {
      label: <Link to={`/admin`} >
        <ggIcon.GridView /> ภาพรวมระบบ
      </Link>,
      key: '',
      icon: '',
    },
    {
      label: <Link to={`/admin/adminmanage/report`} >
        <Icon.Flag /> การรายงาน
      </Link>,
      key: 'report',
      icon: '',
    },
    {
      label: <Link to={`/admin/adminmanage/alladmin`} >
        <AdminPanelSettingsOutlinedIcon /> จัดการแอดมิน
      </Link>,
      key: 'alladmin',
      icon: '',
    },
    {
      label: <Link to={`/admin/adminmanage/alluser`} >
        <Icon.User /> จัดการผู้ใช้งาน
      </Link>,
      key: 'alluser',
      icon: '',
    },
    {
      label: <Link to={`/admin/adminmanage/allcms`} >
        <Icon.Image /> การตรวจสอบรูปภาพ
      </Link>,
      key: 'allcms',
      icon: '',
    },
    {
      label: <Link to={`/admin/adminmanage/allfaq`} >
        <Icon.HelpCircle /> คำถามที่พบบ่อย
      </Link>,
      key: 'allfaq',
      icon: '',
    },
  ];

  const [current, setCurrent] = useState('');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const [activePage, setActivePage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(9);
  const itemsPerPage = 10;

  const [windowSize, setWindowSize] = useState(window.innerWidth <= 767 ? 'small' : 'big')

  window.onresize = reportWindowSize;
  function reportWindowSize() {
    // console.log(window.innerHeight, window.innerWidth)
    if (window.innerWidth <= 767) {
      setWindowSize('small')
    } else {
      setWindowSize('big')

    }
    console.log(windowSize)
  }


  const tabledData = (data) => {
    if (windowSize != 'small') {
      return data?.map((item, index) => (
        <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex}>
          <td>{index + 1}</td>
          <td>
            <img src={item.urs_profile_img} style={{ width: 20, borderRadius: 50 }} /> {item.urs_name}
          </td>
          <td>{item.review_count}</td>
          <td>{item.urs_all_review}</td>
          <td>{item.order_count}</td>
          <td>{item.profit}</td>
        </tr>
      ));
    } else {
      return data?.map((item, index) => (
        <>
          <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex}>
            <td>
              <Flex justify="space-between">
                <p>ลำดับ</p>
                <p>{index + 1}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row">
            <td>
              <Flex justify="space-between">
                <p>ชื่อนักวาด</p>
                <img src={item.urs_profile_img} style={{ width: 20, borderRadius: 50 }} /> {item.urs_name}
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row">
            <td>
              <Flex justify="space-between">
                <p>จำนวนรีวิว</p>
                <p>{item.review_count}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row last">
            <td>
              <Flex justify="space-between">
                <p>คะแนนรีวิว</p>
                <p>{item.urs_all_review}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row last">
            <td>
              <Flex justify="space-between">
                <p>จำนวนออเดอร์</p>
                <p>{item.order_count}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row last">
            <td>
              <Flex justify="space-between">
                <p>เงินที่ได้ทั้งหมด</p>
                <p>{item.profit}</p>
              </Flex>
            </td>
          </tr>
        </>
      ));
    }
  };

  return (
    <>
      <div className="body-con">
        <NavbarAdmin />
        <Menu className='top-menu' onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        <div className="chatbox-container">
          <div className="aside-panel">
            <AdminMenuAside onActive={null} />
          </div>
          <div className="aside-main-card" style={{ padding: "1.3rem 3rem" }}>
            {/* <h3>Welcome,{admindata.admin_name}</h3> */}
            <h1 className="h3 color-font">แดชบอร์ด</h1>
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

            <div className='mt-4'>
              <h2 className="h4 color-font">อัตราส่วนสมัครสมาชิกของผู้ว่าจ้างและนักวาด</h2>
              <LineChart />
            </div>

            <div className='mt-4'>
              <h2 className="h4 color-font">อัตราส่วนระหว่างผู้ว่าจ้างและนักวาด</h2>
              <PieChart />
            </div>

            <div className='mt-4'>
              <h2 className='h4 color-font'>อันดับนักวาด</h2>
              <div style={{ display: "flex", marginTop: "15px" }}>
                {/* <table className="table is-striped is-fullwidth">
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
                      <td colspan={6}>ยังไม่มีข้อมูล</td>
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
                </table> */}

                <table className="overview-order-table">
                  {windowSize != 'small' &&
                    <tr>
                      <th>ลำดับ</th>
                      <th>ชื่อนักวาด</th>
                      <th>จำนวนรีวิว</th>
                      <th>คะแนนรีวิว</th>
                      <th>จำนวนออเดอร์</th>
                      <th>เงินที่ได้ทั้งหมด</th>
                    </tr>}

                  {artistRank?.length != 0 ? (
                    tabledData(artistRank)
                  ) : (
                    <tr style={{ textAlign: 'center' }}>
                      <td colSpan={6}>ยังไม่มีข้อมูล</td>
                    </tr>
                  )}
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../../components/Navbar";
import { Helmet } from "react-helmet";
import { Typography, Button, Input, Flex, Image, Card } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { host } from "../../utils/api";
import {
  CloseOutlined,
  LeftOutlined,
  HomeOutlined,
  UserOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const title = 'จัดการคอมมิชชัน';

export default function AdminManageCms() {
  const navigate = useNavigate();
  const jwt_token = localStorage.getItem("token");
  const type = localStorage.getItem("type");
  const { admindata, isLoggedIn } = useAuth();

  const [cmsData, setCmsdata] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);

  useEffect(() => {
    if (jwt_token && type === "admin") {
      getData();
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    // update filtered user when user state changes
    setFilteredUser(cmsData);
  }, [cmsData]);

  const getData = async () => {
    await axios
      .get(`${host}/allcommission`, {
        headers: {
          Authorization: "Bearer " + jwt_token,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          setCmsdata(data.data);
        } else if (data.status === "no_access") {
          alert(data.message);
          navigate("/");
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      })
  }

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filtered = cmsData.filter(
      (item) =>
        item.urs_name.toLowerCase().includes(query) ||
        item.cms_name.toLowerCase().includes(query)
    );
    setFilteredUser(filtered);
  };
  const queryParams = new URLSearchParams(window.location.search);
  const cms_id = queryParams.get('cms_id');

  // useEffect(() => {

  // }, [cms_id])



  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {!cms_id ?
        <>
          <h1 className="h3">รูปภาพที่รอตรวจสอบความเหมือน</h1>
          <div className="all-user-head">
            <h2 className="h3">จำนวนทั้งหมด ({cmsData.length})</h2>
            <div>
              <Input type="search" onChange={handleSearch} placeholder=" ค้นหา..." />
            </div>
          </div>
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>cmsID</th>
                <th>Commission Name</th>
                <th>userID</th>
                <th>userName</th>
                <th>DateTime</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUser.map((item, index) => (
                <tr key={index}>
                  <td>{item.cms_id}</td>
                  <td>{item.cms_name}</td>
                  <td>{item.usr_id}</td>
                  <td>{item.urs_name}</td>
                  <td>{item.formattedCreatedAt}</td>
                  <td><Link to={`/admin/adminmanage/cms-problem/${item.cms_id}`}>จัดการ</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button>จัดการ</Button>
        </>
        :
        <ShowSimilarCmsDetail />}
    </>
  )
}


function ShowSimilarCmsDetail(props) {
  return (
    <>
      <h1 className="h3"> <Button
        className="icon-btn"
        size="large"
        type="text"
        icon={<LeftOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = "/admin/adminmanage/report";
        }}
      ></Button>รูปภาพที่รอตรวจสอบความเหมือน</h1>
      <Flex style={{ gap: "0.5rem" ,marginBottom:'1rem'}}>
        <p className="h4" style={{ flex: '1' }}>รูปภาพที่เป็นปัญหา</p>
        <p className="h4" style={{ flex: '1' }}>รูปภาพที่เหมือน</p>
      </Flex>
      {/* <ComparePic/> */}
      <div className="sim-container">
        <Card className="problem-pic-container">
          <div className="cms-artist-box" style={{ flex: '0 1 auto', minHeight: 0 }}>
            <Link to={`/profile/`}>
              <div className="cms-artist-profile">
                <img src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain" alt="" />
                <div>
                  <p>ชื่อคมช</p>
                </div>
              </div>
            </Link>
            <p id="cms-price">โพสต์เมื่อ</p>
          </div>
          <div className="pic">
            {/* ss */}
            <Image src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain"></Image>
          </div>
          
          <Flex justify="center" gap='small' className="mt-3" style={{ flex: '0 1 auto', minHeight: 0 }}>
            <Button shape="round" size="large">อนุมัติ</Button>
            <Button shape="round" size="large" danger>ไม่อนุมัติ</Button>
          </Flex>
        </Card>


        <div className="sim-pic-container">
          <Card className="pic-box">
            <p className="pic-detail">
              <div className="cms-artist-box">
                <Link to={`/profile/`}>
                  <div className="cms-artist-profile">
                    <img src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain" alt="" />
                    <div>
                      <p>ชื่อคมช</p>
                    </div>
                  </div>
                </Link>
                <p id="cms-price">คล้าย...%</p>
              </div>
            </p>
            <div className="pic-wrapper">
              <Image src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain"></Image>
            </div>

          </Card>
          <Card className="pic-box">
            <p className="pic-detail">
              <div className="cms-artist-box">
                <Link to={`/profile/`}>
                  <div className="cms-artist-profile">
                    <img src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain" alt="" />
                    <div>
                      <p>ชื่อคมช</p>
                    </div>
                  </div>
                </Link>
                <p id="cms-price">คล้าย...%</p>
              </div>
            </p>
            <div className="pic-wrapper">
              <Image src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain"></Image>
            </div>

          </Card>
          <Card className="pic-box">
            <p className="pic-detail">
              <div className="cms-artist-box">
                <Link to={`/profile/`}>
                  <div className="cms-artist-profile">
                    <img src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain" alt="" />
                    <div>
                      <p>ชื่อคมช</p>
                    </div>
                  </div>
                </Link>
                <p id="cms-price">คล้าย...%</p>
              </div>
            </p>
            <div className="pic-wrapper">
              <Image src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain"></Image>
            </div>

          </Card>
          <Card className="pic-box">
            <p className="pic-detail">
              <div className="cms-artist-box">
                <Link to={`/profile/`}>
                  <div className="cms-artist-profile">
                    <img src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain" alt="" />
                    <div>
                      <p>ชื่อคมช</p>
                    </div>
                  </div>
                </Link>
                <p id="cms-price">คล้าย...%</p>
              </div>
            </p>
            <div className="pic-wrapper">
              <Image src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain"></Image>
            </div>

          </Card>
          <div className="pic-box">
            <p className="pic-detail">
              <div className="cms-artist-box">
                <Link to={`/profile/`}>
                  <div className="cms-artist-profile">
                    <img src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain" alt="" />
                    <div>
                      <p>ชื่อคมช</p>
                    </div>
                  </div>
                </Link>
                <p id="cms-price">คล้าย...%</p>
              </div>
            </p>
            <div className="pic-wrapper">
              <Image src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain"></Image>
            </div>

          </div>
          <div className="pic-box">
            <p className="pic-detail">
              <div className="cms-artist-box">
                <Link to={`/profile/`}>
                  <div className="cms-artist-profile">
                    <img src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain" alt="" />
                    <div>
                      <p>ชื่อคมช</p>
                    </div>
                  </div>
                </Link>
                <p id="cms-price">คล้าย...%</p>
              </div>
            </p>
            <div className="pic-wrapper">
              <Image src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain"></Image>
            </div>

          </div>
          <div className="pic-box">
            <p className="pic-detail">
              <div className="cms-artist-box">
                <Link to={`/profile/`}>
                  <div className="cms-artist-profile">
                    <img src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain" alt="" />
                    <div>
                      <p>ชื่อคมช</p>
                    </div>
                  </div>
                </Link>
                <p id="cms-price">คล้าย...%</p>
              </div>
            </p>
            <div className="pic-wrapper">
              <Image src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain"></Image>
            </div>

          </div>
          


        </div>

      </div>
    </>)
}


function ComparePic(props) {

  return (
    <>
      <Flex>
        <div>
          <div>
            <Image src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain"></Image>
          </div>
          <div>
            รายละเอียดนี้ๆๆเป็นของใคร
          </div>
        </div>
        <div>
          <div>
            <Image src="https://th.bing.com/th/id/OIP.i7X3_FiXyGKriqbI2azCBgHaHQ?rs=1&pid=ImgDetMain"></Image>
          </div>
          <div>
            รายละเอียด
          </div>
        </div>


      </Flex>
    </>)
}
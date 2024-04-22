import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../../css/indexx.css";
import "../../css/allbutton.css";
import "../../css/profileimg.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import ProfileImg from "../../components/ProfileImg";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../../components/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CmsItem from "../../components/CmsItem";
// import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
// import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../../alertdata/alertData";
import { useAuth } from '../../context/AuthContext';
import { Modal, Button, Input, Rate, Tabs } from 'antd';
import { host } from "../../utils/api";
import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear, addDays, isAfter, isBefore } from 'date-fns';

const title = "ViewProfile";
const bgImg = "";
const body = { backgroundColor: "white" };

const toastOptions = {
  position: "bottom-right",
  autoClose: 1000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};




export default function ViewProfile() {
  const jwt_token = localStorage.getItem("token");
  const type = localStorage.getItem("type");
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const { id } = useParams();
  const [userdata, setUserdata] = useState([]); //จะเป็นข้อมูลของคนอื่น
  const [follow, setFollow] = useState([]);
  const [myFollower, setFollowIds] = useState([]);
  const [myFollowerData, setMyFollowerData] = useState([]);

  const [showCoverModal, setShowCoverModal] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(null);
  // const [loading, setLoading] = useState(false);

  const [myCommission, setMyCms] = useState([]);
  const [profileMenuSelected, setprofileMenuSelected] = useState("cms");

  useEffect(() => {
    getUserProfile();
    getUserCms();
  }, [])

  // useEffect(() => {
  //   // setLoading(true);
  //   getUserProfile();
  // }, [myFollower]);

  const getUserProfile = async () => {
    await axios
      .get(`${host}/profile/${id}`, {
        headers: {
          Authorization: "Bearer " + jwt_token,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          setUserdata(data.users[0]);
          setFollow(data.message);
          setFollowIds(data.followerIds);
        } else if (data.status === "error") {
          toast.error(data.message, toastOptions);
        } else {
          toast.error("ไม่พบผู้ใช้งาน", toastOptions);
        }
      })
  };

  const getUserCms = async () => {
    await axios
      .get(`${host}/userCommission/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt_token,
        },
      })
      .then((response) => {
        const myCms = response.data;
        setMyCms(myCms.commissions);
      });
  };

  function menuProfile(event, menu) {
    let oldSelected = document.querySelector(".sub-menu.selected");
    oldSelected.classList.remove("selected");
    event.target.classList.add("selected");
    setprofileMenuSelected(menu);
  }

  const eventfollow = async () => {
    try {
      await axios
        .post(
          `${host}/follow`,
          { id },
          {
            headers: {
              Authorization: "Bearer " + jwt_token,
            },
          }
        )
        .then((response) => {
          const data = response.data;
          if (data.status === "ok") {
            window.location.reload(false);
          } else {
            toast.error("เกิดข้อผิดพลาด", toastOptions);
          }
        });
    } catch (error) {
      // จัดการข้อผิดพลาดที่เกิดขึ้น
    }
  };

  const eventUnfollow = async () => {
    try {
      await axios
        .delete(`${host}/unfollow/${id}`, {
          headers: {
            Authorization: "Bearer " + jwt_token,
          },
        })
        .then((response) => {
          const data = response.data;
          if (data.status === "ok") {
            window.location.reload(false);
          } else {
            toast.error("เกิดข้อผิดพลาด", toastOptions);
          }
        });
    } catch (error) {
      // จัดการข้อผิดพลาดที่เกิดขึ้น
    }
  };


  const openFollower = () => {
    const formData = new FormData();
    formData.append("myFollower", myFollower);
    axios
      .post(`${host}/openFollower`, formData, {
        headers: {
          Authorization: "Bearer " + jwt_token,
        },
      })
      .then((response) => {
        const data = response.data;
        setMyFollowerData(data.results);
      });
  };

  //admin
  const [banReason, setBanReason] = useState("");

  const [popup, setpopup] = useState(false);
  const Close = () => {
    setBanReason("");
    setpopup(false);
  };
  const deleteUser = async () => {
    setpopup(false);
    const userId = userdata.id;
    const formData = new FormData();
    formData.append("banReason", banReason);
    await axios
      .patch(`${host}/alluser/delete/${userId}`, formData, {
        headers: {
          Authorization: "Bearer " + jwt_token,
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data.status === "ok") {
          Swal.fire({ ...alertData.deleteUserSuccess }).then(() => {
            window.location = "/admin/alluser";
          });
        } else {
          Swal.fire({ ...alertData.deleteUserFailed }).then(() => {
            window.location.reload(false);
          });
        }
      });
  };

  const menus = [
    {
      key: '1',
      label: "คอมมิชชัน",
      children: <AllCms myCommission={myCommission} userID={userdata.id} />,
    },
    {
      key: '2',
      label: "งานวาด",
      children: <AllArtworks />,
    },
    {
      key: '3',
      label: "รีวิว",
      children: <AllReviews />,
    }
  ];

  let currentDate;

  if (!Number.isNaN(new Date(userdata.created_at).getTime())) {
    currentDate = format(new Date(userdata.created_at), 'dd/MM/yyyy');
  }



  return (
    <>
      <div className="body-con">
        <Helmet>
          <title>{title}</title>
        </Helmet>

        {isLoggedIn ? (
          type === 'admin' ? <NavbarAdmin /> : <NavbarUser />
        ) : (
          <NavbarHomepage />
        )}

        <div class="body-nopadding" style={body}>
          <div className="cover-grid">
            <div
              className="cover"
            // onClick={openModal}
            >
              <div
                className="cover-color"
                style={{ backgroundColor: userdata.urs_cover_color }}
              ></div>
            </div>
            <div className="container-xl profile-page">
              <div className="user-profile-area">
                <div className="user-col-profile">
                  <ProfileImg
                    src={userdata.urs_profile_img}
                    type="only-show"
                  // onPress={() => openModal("profile")}
                  />
                  {/* <ProfileImg src="b3.png" type="show" onPress={() => openModal("profile")} /> */}
                  <p className="username-profile fs-5">{userdata.urs_name}</p>
                  {/* <p className="follower-profile">follower</p> */}
                  {type == "admin" ? (
                    <>
                      <div className="group-btn-area">
                        <Button shape="round" danger onClick={() => setpopup(true)}>ระงับบัญชีผู้ใช้</Button>
                      </div>
                      <Modal show={popup} onHide={Close}>
                        <Modal.Header>
                          <Modal.Title>เหตุผลการแบน</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                          <Form>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="เหตุผลการแบน..."
                              value={banReason}
                              onChange={(e) => setBanReason(e.target.value)}
                            />
                          </Form>
                        </Modal.Body>

                        <Modal.Footer>
                          <Button variant="secondary" onClick={Close}>
                            ปิด
                          </Button>
                          <Button variant="danger" onClick={deleteUser}>
                            แบนไอดี
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </>
                    
                  ) : (
                      
                      <div className="group-btn-area">
                        {follow === "no_follow" ? (
                          <Button shape="round" onClick={eventfollow}>
                            ติดตาม
                          </Button>
                        ) : (
                          <Button shape="round" onClick={eventUnfollow}>
                            เลิกติดตาม
                          </Button>
                        )}

                        <a href={`/chatbox?id=${userdata.id}&od_id=0`}>
                          {/* <Link to={{ pathname: "/chatbox", state: { data: id } }}> */}
                          <Button shape="round" >
                            แชท
                          </Button>
                          {/* </Link> */}
                        </a>
                      </div>
                    
                  )}
                  <p className="bio-profile">{userdata.urs_bio}</p>
                </div>
                <div className="user-col-about">
                  {/* <div className="user-about-menu">
                  <button className="sub-menu selected">overview</button>
                  <button className="sub-menu">about me</button>
                </div> */}
                  <div className="user-about-content">
                    <div className="user-about-review mb-4">
                      <div className="user-about-review mb-4"><p className="fs-3">{userdata.urs_all_review ? userdata.urs_all_review : 0}<Rate disabled defaultValue={1} className="one-star profile" /></p> <p>จาก {userdata.rw_number ? userdata.rw_number : 0} รีวิว</p></div>
                    </div>
                    <div className="user-about-text">
                      <div>
                        <p>
                          ผู้ติดตาม {myFollower.length}{" "}คน
                        </p>
                        <div>
                          {myFollowerData.map((data) => (
                            <a
                              key={data.id}
                              href={`/profile/${data.id}`}
                              style={{ display: "flex" }}
                            >
                              <img
                                src={data.urs_profile_img}
                                style={{ width: "30px" }}
                              />
                              <p>{data.urs_name}</p>
                            </a>
                          ))}
                        </div>
                        <p>งานสำเร็จแล้ว {userdata.success} งาน</p>
                        <p>เป็นสมาชิกเมื่อ {currentDate}</p>
                      </div>
                      <div>
                        <p>คอมมิชชัน เปิด</p>
                        <p>คิวว่าง 1 คิว</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="user-profile-contentCard">
                <div>
                  <Tabs defaultActiveKey="1" items={menus} />
                </div>
                {/* <button
                className="sub-menu selected"
                onClick={(event) => menuProfile(event, "cms")}
              >
                คอมมิชชัน
              </button>
              <button
                className="sub-menu"
                onClick={(event) => menuProfile(event, "gallery")}
              >
                งานวาด
              </button>
              <button
                className="sub-menu"
                onClick={(event) => menuProfile(event, "review")}
              >
                รีวิว
              </button>
              {profileMenuSelected === "cms" ? (
                <AllCms myCommission={myCommission} userID={userdata.id} />
              ) : null}
              {profileMenuSelected === "gallery" ? <AllArtworks /> : null}
              {profileMenuSelected === "review" ? <AllReviews /> : null} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AllCms(props) {
  const type = localStorage.getItem("type");
  const { myCommission, userID } = props;
  const handleRedirect = (cms_id) => {
    window.location = (`/cmsdetail/${cms_id}`);
  }
  return (
    <>
      <p className="h3 mt-3 mb-2">คอมมิชชัน</p>
      <div class="content-items">
        {type != "admin" ? (
          <>
            {myCommission.map((mycms) => (
              <div key={mycms.cms_id}>
                <Link to={`/cmsdetail/${mycms.cms_id}`}>
                  <CmsItem
                    src={mycms.ex_img_path}
                    headding={mycms.cms_name}
                    price={mycms.pkg_min_price}
                    desc={mycms.cms_desc}
                  />
                </Link>
              </div>
            ))}
          </>
        ) : (
          <>
            {myCommission.map((mycms) => (
              <div key={mycms.cms_id} style={{ display: "flex" }}>
                <Link onClick={() => handleRedirect(mycms.cms_id)}>
                  <CmsItem
                    src={mycms.ex_img_path}
                    headding={mycms.cms_name}
                    price={mycms.pkg_min_price}
                    desc={mycms.cms_desc}
                  />
                </Link>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

function AllArtworks(props) {
  return (
    <>
      <p className="h3 mt-3 mb-2">งานวาด</p>
      <div className="profile-gallery-container">
        <div className="profile-gallery" >
          <img src="b3.png" />

        </div>
        <div className="profile-gallery" >
          <img src="b3.png" />

        </div>

      </div>

      {/* <p className="h3 mt-3 mb-2">งานวาด</p>
      <div className="profile-gallery-container">
        {myGallery.map((data) => (
          <Link to={`/artworkdetail/` + data.artw_id}>
            <div className="profile-gallery" key={data.artw_id}>
              <img key={data.artw_id} src={data.ex_img_path} />
            </div>
          </Link>
        ))}
      </div> */}
    </>
  );
}

function AllReviews(props) {
  return (
    <>
      <p className="h3 mt-3 mb-2">รีวิว</p>
    </>
  );
}
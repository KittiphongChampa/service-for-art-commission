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
import ArtistBox from '../../components/ArtistBox'
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../../alertdata/alertData";
import { useAuth } from '../../context/AuthContext';
import { Modal, Button, Input, Rate, Tabs, Flex } from 'antd';
import * as ggIcon from "@mui/icons-material";
import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear, addDays, isAfter, isBefore } from 'date-fns';
import { host } from "../../utils/api";

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
  const { userdata, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const { id } = useParams();
  const [userInfo, setUserInfo] = useState([]); //จะเป็นข้อมูลของคนอื่น

  const [follow, setFollow] = useState([]); //status การกดติดตาม
  const [myFollowerData, setMyFollowerData] = useState([]);
  const [IFollowerData, setIFollowerData] = useState([]);

  const [showCoverModal, setShowCoverModal] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(null);

  const [myCommission, setMyCms] = useState([]);
  const [myGallery, setMyGallery] = useState([]);
  const [all_review, setAllReview]  = useState([]);


  const [profileMenuSelected, setprofileMenuSelected] = useState("cms");

  useEffect(() => {
    getUserCms();
    getUserGallerry();
    getAllReview();
    if (jwt_token) {
      getUserProfile();
    } else {
      getUserProfile_notlogin();
    }
  }, [])

  const getUserProfile_notlogin = async () => {
    await axios
      .get(`${host}/profile_notlogin/${id}`)
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          setUserInfo(data.users[0]);
          setFollow(data.message);
          axios.get(`${host}/openFollowing?iFollowing=${data.IFollowingsIds}`).then((response) => {
            const data = response.data;
            setIFollowerData(data.ifollowing)
          })
          axios.get(`${host}/openFollower?myFollower=${data.MyFollowerIds}`).then((response) => {
            const data = response.data;
            setMyFollowerData(data.myfollower)
          })
        } else if (data.status === "error") {
          toast.error(data.message, toastOptions);
        } else {
          toast.error("ไม่พบผู้ใช้งาน", toastOptions);
        }
      })
  }

  const getUserProfile = async () => {
    await axios
      .get(`${host}/profile/${id}?myId=${userdata.id}`, {
        headers: {
          Authorization: "Bearer " + jwt_token,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          setUserInfo(data.users[0]);
          setFollow(data.message);
          axios.get(`${host}/openFollowing?iFollowing=${data.IFollowingsIds}`).then((response) => {
            const data = response.data;
            setIFollowerData(data.ifollowing)
          })
          axios.get(`${host}/openFollower?myFollower=${data.MyFollowerIds}`).then((response) => {
            const data = response.data;
            setMyFollowerData(data.myfollower)
          })
        } else if (data.status === "error") {
          toast.error(data.message, toastOptions);
        } else {
          toast.error("ไม่พบผู้ใช้งาน", toastOptions);
        }
      })
  };

  const getUserCms = async () => {
    await axios
      .get(`${host}/userCommission/${id}`)
      .then((response) => {
        const myCms = response.data;
        setMyCms(myCms.commissions);
      });
  };

  const getUserGallerry = async () => {
    await axios.get(`${host}/userGallery/${id}`).then((response) => {
        const data = response.data;
        setMyGallery(data.myGallery);
    })
  }

  const getAllReview = async () => {
    await axios.get(`${host}/userReview/all/${id}`).then((response) => {
        setAllReview(response.data);
    })
  }

  function menuProfile(event, menu) {
    let oldSelected = document.querySelector(".sub-menu.selected");
    oldSelected.classList.remove("selected");
    event.target.classList.add("selected");
    setprofileMenuSelected(menu);
  }

  const eventfollow = async () => {
    if (isLoggedIn) {
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
    } else {
      openModal();
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

  //admin
  const [banReason, setBanReason] = useState("");

  const [popup, setpopup] = useState(false);
  const Close = () => {
    setBanReason("");
    setpopup(false);
  };
  const deleteUser = async () => {
    setpopup(false);
    const userId = userInfo.id;
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

  const menusArtist = [
    {
      key: '1',
      label: "คอมมิชชัน",
      children: <AllCms myCommission={myCommission} userID={userInfo.id} />,
    },
    {
      key: '2',
      label: "งานวาด",
      children: <AllArtworks myGallery={myGallery}/>,
    },
    {
      key: '3',
      label: "รีวิว",
      children: <AllReviews all_review={all_review}/>,
    },
    {
        key: '4',
        label: "ผู้ติดตาม",
        children: <Followers myFollowerData={myFollowerData} />,
    },
    {
        key: '5',
        label: "กำลังติดตาม",
        children: <Followings IFollowerData={IFollowerData} />,
    }
  ];

  const menus = [
    {
        key: "5",
        label: "กำลังติดตาม",
        children: <Followings IFollowerData={IFollowerData} />,
    },
    // {
    //   key: "1",
    //   label: "ผู้ติดตาม",
    //   children: <Followers myFollowerData={myFollowerData} />,
    // },
  ];

  const [isModalOpened, setIsModalOpened] = useState(false);

  function openModal() {
    setIsModalOpened(true);
  }

  function closeModal() {
    setIsModalOpened(false);
  }
  let currentDate;

  if (!Number.isNaN(new Date(userInfo.created_at).getTime())) {
    currentDate = format(new Date(userInfo.created_at), 'dd/MM/yyyy');
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
            >
              <div
                className="cover-color"
                style={{ backgroundColor: userInfo.urs_cover_color }}
              ></div>
            </div>
          <div className="container-xl profile-page">
            <div className="user-profile-area">
              <div className="user-col-profile">

                <ProfileImg
                  src={userInfo.urs_profile_img}
                  type="only-show"
                // onPress={() => openModal("profile")}
                />

                {/* <ProfileImg src="b3.png" type="show" onPress={() => openModal("profile")} /> */}
                <p className="username-profile fs-5">{userInfo.urs_name}</p>
                {/* <p className="follower-profile">follower</p> */}
               
                {type != "admin" ? (
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

                    {isLoggedIn ? (
                      <a href={`/chatbox?id=${userInfo.id}&od_id=0`}>
                        <Button shape="round">
                          แชท
                        </Button>
                      </a>
                    ) : (
                      <Button shape="round" onClick={openModal}>
                        แชท
                      </Button>
                    )}

                  </div>
                ) : (
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
                )}
                <p className="bio-profile">{userInfo.urs_bio}</p>
              </div>
              <div className="user-col-about">
     
                <div className="user-about-content">
                  <div className="user-about-review mb-4"><p className="fs-3">{userInfo.urs_all_review ? userInfo.urs_all_review : 0}<Rate disabled defaultValue={1} className="one-star profile" /></p> <p>จาก {userInfo.rw_number ? userInfo.rw_number : 0} รีวิว</p></div>
                  <div className="user-about-text">
                    {userInfo.urs_type == 1 ? 
                      <>
                        <Flex gap="small" vertical>
                          <p>ผู้ติดตาม {myFollowerData.length} คน</p>
                          <p>กำลังติดตาม {IFollowerData.length} คน </p>
                          <p>งานสำเร็จแล้ว {userInfo.success} งาน</p>
                          <p>เป็นสมาชิกเมื่อ {currentDate}</p>
                        </Flex>
                        <Flex gap="small" vertical>
                          <p>คอมมิชชันทั้งหมด</p>
                          <p>คิวว่าง 5 คิว</p>
                        </Flex>
                      </>
                      :
                      <Flex gap="small" vertical>
                        <p>ผู้ติดตาม {myFollowerData.length} คน</p>
                        <p>กำลังติดตาม {IFollowerData.length} คน </p>
                        <p>เป็นสมาชิกเมื่อ {currentDate}</p>
                      </Flex>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="user-profile-contentCard">
              <div>
                {userInfo.urs_type == 1 ? (
                  <>
                    <Tabs defaultActiveKey="1" items={menusArtist} />
                  </>
                ) : (
                  <>
                    <Tabs defaultActiveKey="1" items={menus} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Modal
        title="คุณยังไม่ได้เข้าสู่ระบบ"
        open={isModalOpened}
        onCancel={closeModal}
        footer=""
        width={1000}
      >
        <p>กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        <Flex justify="flex-end">
          <Link to="/login"><Button shape="round" size="large">ตกลง</Button></Link>
        </Flex>
      </Modal>
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
            {myCommission.length != 0 ? (myCommission.map((mycms) => (
              <div key={mycms.cms_id}>
                <Link to={`/cmsdetail/${mycms.cms_id}`}>
                  <CmsItem
                    src={mycms.ex_img_path}
                    headding={mycms.cms_name}
                    price={mycms.pkg_min_price}
                    desc={mycms.cms_desc}
                    total_reviews={mycms.total_reviews} 
                    cms_all_review={mycms.cms_all_review} 
                    status={mycms.cms_status}
                  />
                </Link>
              </div>
            ))): (<p>ยังไม่มีข้อมูล</p>)}
          </>
        ) : (
          <>
            {myCommission.length != 0 ? (myCommission.map((mycms) => (
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
            ))) : (<p>ยังไม่มีข้อมูล</p>)}
          </>
        )}
      </div>
    </>
  );
}

function AllArtworks(props) {
  const { myGallery } = props
  return (
    <>
      <p className="h3 mt-3 mb-2">งานวาด</p>
      <div className="profile-gallery-container">
        {myGallery.length != 0 ? (myGallery.map((data) => (
            <Link to={`/artworkdetail/` + data.artw_id}>
                <div className="profile-gallery" key={data.artw_id}>
                    <img key={data.artw_id} src={data.ex_img_path} />
                </div>
            </Link>
        ))) : (<p>ยังไม่มีข้อมูล</p>)}
      </div>
    </>
  );
}

function AllReviews(props) {
  const { all_review } = props
  return (
    <>
      <p className="h3 mt-3 mb-2">รีวิว</p>
      {all_review.length != 0 ? (all_review.map(review => (
        <div className="review-box">
        <div className="reviewer-box">
          <div>
            <img src={review.urs_profile_img} />
          </div>
          <div>
            <p>{review.urs_name}</p>
            <p>{new Date(review.created_at).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</p>
          </div>
        </div>
        {/* <p style={{ fontWeight: "500" }}>แพ็กเกจ : {review.pkg_name}</p> */}
        <p>
          {[...Array(review.rw_score)].map((_, index) => (
            <ggIcon.Star key={index} className="fill-icon" />
          ))}
        </p>
        <p>{review.rw_comment}</p>
      </div>
      ))) : (<p>ไม่มีข้อมูล</p>)}
    </>
  );
}

function Followers(props) {
  const { myFollowerData } = props

  return <>
      <p className="h3 mt-3 mb-2">ผู้ติดตาม</p>
      <div className="artistbox-items">
          {myFollowerData.length != 0 ? myFollowerData.map(data => (
              <a key={data.id} href={`/profile/${data.id}`}>
                  
                      <ArtistBox img={data.urs_profile_img} name={data.urs_name} all_review={data.urs_all_review} total_reviews={data.total_reviews}/>
                  
              </a>
          )) : (<p>ยังไม่มีข้อมูล</p>)}
      </div>
  </>
}

function Followings(props) {
  const { IFollowerData } = props;
  // console.log(IFollowerData);

  return <>
      <p className="h3 mt-3 mb-2">กำลังติดตาม</p>
      <div className="artistbox-items">
          {IFollowerData.length != 0 ? IFollowerData.map(data => (
              <a key={data.id} href={`/profile/${data.id}`}>
                  <ArtistBox img={data.urs_profile_img} name={data.urs_name} all_review={data.urs_all_review} total_reviews={data.total_reviews}/>
              </a>
          )) : <p>ยังไม่มีข้อมูล</p>}
      </div>
  </>
}
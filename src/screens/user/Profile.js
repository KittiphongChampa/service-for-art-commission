import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as alertData from "../../alertdata/alertData";
import "../../css/indexx.css";
import "../../css/allbutton.css";
import "../../css/profileimg.css";
import "../../styles/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import ProfileImg from "../../components/ProfileImg";
import {
  NavbarUser,
  NavbarAdmin,
  NavbarHomepage,
} from "../../components/Navbar";
import ArtistBox from "../../components/ArtistBox";
import CmsItem from "../../components/CmsItem";
import { Modal, Button, Rate, Select, Tabs, Flex } from "antd";
import * as ggIcon from "@mui/icons-material";
import ChangeProfileImgModal from "../../modal/ChangeProfileImgModal";
import { ChangeCoverModal, openInputColor } from "../../modal/ChangeCoverModal";
// import Button from "react-bootstrap/Button";
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  addDays,
  isAfter,
  parseISO,
} from "date-fns";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { host } from "../../utils/api";

const title = "Profile";
const bgImg = "";
const body = { backgroundColor: "white" };

export default function Profile() {
  const navigate = useNavigate();
  const { isLoggedIn, socket } = useAuth();
  const token = localStorage.getItem("token");
  const [userdata, setUserdata] = useState([]);

  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [myFollowerData, setMyFollowerData] = useState([]);
  const [IFollowerData, setIFollowerData] = useState([]);

  const [myCommission, setMyCms] = useState([]);
  const [myGallery, setMyGallery] = useState([]);
  const [all_review, setAllReview] = useState([]);

  // console.log('myFollower : ',myFollower, 'iFollowing : ', iFollowing);

  useEffect(() => {
    if (token) {
      getUser();
      getMyCms();
      getMyGallery();
      getAllReview();
    } else {
      navigate("/login");
    }
  }, []);
  // }, [myFollower,iFollowing]); //realtime follow

  // useEffect(() => {},[])
  // const [myFollower, setMyFollower] = useState([])
  // console.log(myFollower);

  const getUser = async () => {
    await axios
      .get(`${host}/profile`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          setUserdata(data.users[0]);
          axios
            .get(`${host}/openFollowing?iFollowing=${data.IFollowingsIds}`)
            .then((response) => {
              const data = response.data;
              setIFollowerData(data.ifollowing);
            });
          axios
            .get(`${host}/openFollower?myFollower=${data.MyFollowerIds}`)
            .then((response) => {
              const data = response.data;
              setMyFollowerData(data.myfollower);
            });
        }
        // else if (data.status === "no_access") {
        //     alert(data.message);
        //     navigate('/admin');
        // }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data === "Token has expired"
        ) {
          alert("Token has expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Error:", error);
        }
      });
  };

  const getMyCms = async () => {
    await axios
      .get(`${host}/myCommission`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const myCms = response.data;
        setMyCms(myCms.commissions);
      });
  };

  const getMyGallery = async () => {
    await axios
      .get(`${host}/myGallery`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const data = response.data;
        setMyGallery(data.myGallery);
      });
  };

  const getAllReview = async () => {
    await axios
      .get(`${host}/review/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setAllReview(response.data);
      });
  };

  function menuProfile(event, menu) {
    let oldSelected = document.querySelector(".sub-menu.selected");
    oldSelected.classList.remove("selected");
    event.target.classList.add("selected");
    setprofileMenuSelected(menu);
  }

  const openModal = (modal) => {
    if (modal === "profile") {
      const ProfileModal = (
        <ChangeProfileImgModal
          profile={userdata.urs_profile_img}
          setShowProfileModal={setShowProfileModal}
        />
      );
      setShowProfileModal(ProfileModal);
    } else {
      const CoverModal = (
        <ChangeCoverModal
          profile={userdata.urs_profile_img}
          setShowCoverModal={setShowCoverModal}
        />
      );
      setShowCoverModal(CoverModal);
      // openInputColor()
    }
  };

  const [profileMenuSelected, setprofileMenuSelected] = useState("cms");

  const menusArtist = [
    {
      key: "1",
      label: "คอมมิชชัน",
      children: <AllCms myCommission={myCommission} userID={userdata.id} />,
    },
    {
      key: "2",
      label: "งานวาด",
      children: <AllArtworks myGallery={myGallery} />,
    },
    {
      key: "3",
      label: "รีวิว",
      children: <AllReviews all_review={all_review} />,
    },
    {
      key: "4",
      label: "ผู้ติดตาม",
      children: <Followers myFollowerData={myFollowerData} />,
    },
    {
      key: "5",
      label: "กำลังติดตาม",
      children: <Followings IFollowerData={IFollowerData} />,
    },
  ];

  const menus = [
    {
      key: "1",
      label: "กำลังติดตาม",
      children: <Followings IFollowerData={IFollowerData} />,
    },
  ];

  function changeMenu() { }

  function openCoverModal() {
    setShowCoverModal(!showCoverModal);
  }
  function openProfileModal() {
    setShowProfileModal(!showProfileModal);
  }

  const submitChangeCoverForm = (event, data) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("cover_color", selectedColor);
    // Swal.fire({ ...alertData.changeProfileImgConfirm }).then((result) => {

    // if (result.isConfirmed) {
    axios
      .patch(`${host}/cover_color/update`, formData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        if (response.data.status === "ok") {
          Swal.fire({ ...alertData.changeCoverColorIsConfirmed }).then(() => {
            window.location.reload(false);
          });
        } else {
          Swal.fire({ ...alertData.changeCoverIsError });
        }
      });
    // }
    // })
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
  } = useForm();

  const [file, setFile] = useState("");
  const [previewUrl, setPreviewUrl] = useState(userdata.urs_profile_img);

  const handleFileChange = (event) => {
    const image = event.target.files[0];
    setFile(image);
    setPreviewUrl(URL.createObjectURL(image));
  };

  const profileupdate_img = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    await axios
      .put(`${host}/profile_img/update`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          Swal.fire({ ...alertData.changeProfileImgIsConfirmed }).then(() => {
            window.location.reload(false);
          });
          //   alert("Update Success");
          //   window.location = "/userprofile";
        } else {
          //   toast.error(data.message, toastOptions);
          Swal.fire({ ...alertData.IsError }).then(() => {
            window.location.reload(false);
          });
        }
      });
  };

  const [selectedColor, setSelectedColor] = useState(userdata.urs_cover_color);

  let currentDate;

  if (!Number.isNaN(new Date(userdata.created_at).getTime())) {
    currentDate = format(new Date(userdata.created_at), "dd/MM/yyyy");
  }

  return (
    <div className="body-con">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {/* {showCoverModal}
            {showProfileModal} */}
      {/* <Navbar /> */}
      <NavbarUser />
      <div className="body-nopadding" style={body}>
        <div className="cover-grid">
          <div className="cover" onClick={openCoverModal}>
            <div
              className="cover-color"
              style={{ backgroundColor: userdata.urs_cover_color }}
            ></div>
            <div className="cover-hover">
              <p className="fs-5">เปลี่ยนสีปก</p>
            </div>
          </div>
          <div className="container-xl profile-page">
            <div className="user-profile-area">
              <div className="user-col-profile">
                <ProfileImg
                  src={userdata.urs_profile_img}
                  type="show"
                  onPress={openProfileModal}
                />
                {/* <ProfileImg src="b3.png" type="show" onPress={() => openModal("profile")} /> */}
                <p className="username-profile fs-5">{userdata.urs_name}</p>
                {/* <p className="follower-profile">follower</p> */}
                <div className="group-btn-area">
                  {/* <button className="message-btn"><Icon.MessageCircle /></button>
                                        <button className="follow-btn">ติดตาม</button> */}
                  <a href="/setting-profile">
                    <Button shape="round">แก้ไขโปรไฟล์</Button>
                  </a>
                </div>
                <p className="bio-profile">{userdata.urs_bio}</p>
              </div>
              <div className="user-col-about">
                <div className="user-about-content">
                  <div className="user-about-review mb-4">
                    <p className="fs-3">
                      {userdata.urs_all_review ? userdata.urs_all_review : 0}
                      <Rate
                        disabled
                        defaultValue={1}
                        className="one-star profile"
                      />
                    </p>{" "}
                    <p>
                      จาก {userdata.rw_number ? userdata.rw_number : 0} รีวิว
                    </p>
                  </div>
                  <div className="user-about-text">
                    {userdata.urs_type == 1 ? (
                      <>
                        <Flex gap="small" vertical>
                          <p>ผู้ติดตาม {myFollowerData.length} คน</p>
                          <p>กำลังติดตาม {IFollowerData.length} คน </p>
                          <p>งานสำเร็จแล้ว {userdata.success} งาน</p>
                          <p>เป็นสมาชิกเมื่อ {currentDate}</p>
                        </Flex>
                        <Flex gap="small" vertical>
                          <p>คอมมิชชันทั้งหมด</p>
                          <p>คิวว่าง 5 คิว</p>
                        </Flex>
                      </>
                    ) : (
                      <Flex gap="small" vertical>
                        {/* <p>ผู้ติดตาม {myFollowerData.length} คน</p> */}
                        <p>กำลังติดตาม {IFollowerData.length} คน </p>
                        <p>เป็นสมาชิกเมื่อ {currentDate}</p>
                      </Flex>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="user-profile-contentCard">
              {/* <button className="sub-menu selected" onClick={(event) => menuProfile(event, 'all')}>ทั้งหมด</button> */}
              <div>
                {userdata.urs_type == 1 ? (
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
      <Modal
        title="เปลี่ยนสีปก"
        open={showCoverModal}
        onCancel={openCoverModal}
        footer=""
      >
        {/* <div className="form-area"> */}
        <form onSubmit={submitChangeCoverForm}>
          {/* <h2 style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>เปลี่ยนสีปก</h2> */}
          <div className="setting-img-box">
            <div className="setting-cover">
              <input
                onChange={(e) => {
                  setSelectedColor(e.target.value);
                }}
                defaultValue={userdata.urs_cover_color}
                type="color"
                id="color-input"
                style={{ cursor: "pointer" }}
              />
            </div>
            <ProfileImg src={userdata.urs_profile_img} type="only-show" />
          </div>
          <Flex justify="center" gap="small">
            <Button type="primary" shape="round" size="large" htmlType="submit">
              บันทึก
            </Button>
            <Button shape="round" size="large" onClick={openCoverModal}>
              ยกเลิก
            </Button>
          </Flex>
        </form>

        {/* </div> */}
      </Modal>

      <Modal
        title="เปลี่ยนภาพโปรไฟล์"
        open={showProfileModal}
        onCancel={openProfileModal}
        footer=""
      >
        <form onSubmit={profileupdate_img}>
          {/* <h2 style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>เปลี่ยนภาพโปรไฟล์</h2> */}
          <ProfileImg
            type="only-show"
            src={previewUrl}
            basedProfile={userdata.urs_profile_img}
          />
          {/* <ProfileImg src={previewUrl} onPress={addProfileImg}/> */}
          <div className="input-group mb-1 mt-5">
            <input
              {...register("profileImg", { required: true })}
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              type="file"
              className="form-control"
              id="inputGroupFile02"
            />
            {/* <label className="input-group-text" for="inputGroupFile02">Upload</label> */}
          </div>
          <div className="text-align-right">
            {errors.profileImg && errors.profileImg.type === "required" && (
              <p className="validate-input"> กรุณาเลือกไฟล์ภาพ</p>
            )}
            {errors.profileImg && errors.profileImg.type === "accept" && (
              <p className="validate-input">อัปโหลดได้แค่ไฟล์ภาพเท่านั้น</p>
            )}
          </div>
          <Flex justify='flex-end' style={{marginBottom:'1rem',color:'gray',fontSize:'14px'}}>
            *อัปโหลดไฟล์ภาพได้ไม่เกิน 5 MB
          </Flex>
          <Flex gap="small" justify="center">
            <Button type="primary" shape="round" size="large" htmlType="submit">
              บันทึก
            </Button>
            <Button shape="round" size="large" onClick={openProfileModal}>
              ยกเลิก
            </Button>
          </Flex>
        </form>
      </Modal>
    </div>
  );
}

function Followers(props) {
  const { myFollowerData } = props;

  return (
    <>
      <p className="h3 mt-3 mb-2">ผู้ติดตาม</p>
      <div className="artistbox-items">
        {myFollowerData.length != 0 ? (
          myFollowerData.map((data) => (
            <a key={data.id} href={`/profile/${data.id}`}>
              <ArtistBox
                img={data.urs_profile_img}
                name={data.urs_name}
                all_review={data.urs_all_review}
                total_reviews={data.total_reviews}
              />
            </a>
          ))
        ) : (
          <p>ยังไม่มีข้อมูล</p>
        )}
      </div>
    </>
  );
}

function Followings(props) {
  const { IFollowerData } = props;
  // console.log(IFollowerData);

  return (
    <>
      <p className="h3 mt-3 mb-2">กำลังติดตาม</p>
      <div className="artistbox-items">
        {IFollowerData.length != 0 ? (
          IFollowerData.map((data) => (
            <a key={data.id} href={`/profile/${data.id}`}>
              <ArtistBox
                img={data.urs_profile_img}
                name={data.urs_name}
                all_review={data.urs_all_review}
                total_reviews={data.total_reviews}
              />
            </a>
          ))
        ) : (
          <p>ยังไม่มีข้อมูล</p>
        )}
      </div>
    </>
  );
}

function AllCms(props) {
  const { myCommission, userID } = props;
  return (
    <>
      <p className="h3 mt-3 mb-2">คอมมิชชัน</p>
      <div className="content-items">
        {myCommission.length != 0 ? (
          myCommission.map((mycms) => (
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
          ))
        ) : (
          <p>ยังไม่มีข้อมูล</p>
        )}
      </div>
    </>
  );
}

function AllArtworks(props) {
  const { myGallery } = props;
  return (
    <>
      <p className="h3 mt-3 mb-2">งานวาด</p>
      <div className="profile-gallery-container">
        {myGallery.length != 0 ? (
          myGallery.map((data) => (
            <Link to={`/artworkdetail/` + data.artw_id}>
              <div className="profile-gallery" key={data.artw_id}>
                <img key={data.artw_id} src={data.ex_img_path} />
              </div>
            </Link>
          ))
        ) : (
          <p>ยังไม่มีข้อมูล</p>
        )}
      </div>
    </>
  );
}

function AllReviews(props) {
  const { all_review } = props;
  return (
    <>
      <p className="h3 mt-3 mb-2">รีวิว</p>
      {all_review.length != 0 ? (
        all_review.map((review) => (
          <div className="review-box">
            <div className="reviewer-box">
              <div>
                <img src={review.urs_profile_img} />
              </div>
              <div>
                <p>{review.urs_name}</p>
                <p>
                  {new Date(review.created_at).toLocaleString("th-TH", {
                    timeZone: "Asia/Bangkok",
                  })}
                </p>
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
        ))
      ) : (
        <p>ยังไม่มีข้อมูล</p>
      )}
    </>
  );
}
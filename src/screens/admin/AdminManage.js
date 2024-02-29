import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";

// import "../css/indexx.css";
// import "../css/allbutton.css";
// import "../css/profileimg.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
// import UserBox from "../components/UserBox";
// import inputSetting from "../function/function";
// import ProfileImg from "../components/ProfileImg";
// import Profile from './Profile';
import {
  NavbarUser,
  NavbarAdmin,
  NavbarHomepage,
} from "../../components/Navbar";
import { useParams } from "react-router-dom";

// import UserList from "../components/UserList";
import Report from "./Report";
import AdminMenuAside from "./AdminMenuAside";
import AdminManageAdmin from "./AdminManageAdmin";
import AdminManageUser from "./AdminManageUser";
import AdminManageFAQ from "./AdminManageFAQ";
import AdminManageCms from "./AdminManageCms";

const title = "จัดการแอดมิน";
const bgImg = "";
const body = { backgroundColor: "#F1F5F9" };

export default function AdminManagement() {
  const { menu } = useParams();
  // alert(menu)
  // const [subMenuSelected, setSubMenuSelected] = useState()

  // const [mainMenu, setMainMenu] = useState(submenu)

  // function handleMenu(menu) {
  //     setMainMenu(menu)
  // }


  return (
    <div className="body-con">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <NavbarAdmin />
      <div className="chatbox-container">
        <div className="aside-chatbox">
          <AdminMenuAside onActive={menu} />
        </div>
        <div className="aside-main-card" style={{ padding: "1.3rem 3rem" }}>
          {menu == "alladmin" ? ( 
            <AdminManageAdmin />
          ) : menu == "report" ? ( 
            <Report />
          ) : menu == "alluser" ? (
            <AdminManageUser />
          ) : menu == "allfaq" ? (
            <AdminManageFAQ />
          ) : menu == "allcms" ? (
            <AdminManageCms />
          ) : null}
        </div>
      </div>
      {/* <div class="body-lesspadding" style={body}>
                <div className="container">

                    <div class="white-page container">

                        <h1 className="text-align-center">การจัดการแอดมิน</h1>
                        <div style={{ border: "1px solid gray", borderRadius: "200px", padding: "0.5rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                            <button className="sub-menu " >ทั้งหมด</button>
                            <button className="sub-menu" >การรายงาน</button>
                            <button className="sub-menu">โพสต์ที่ถูกสั่งลบ</button>
                            <button className="sub-menu selected">รายชื่อผู้ใช้</button>
                        </div>
                        
                        <div className="all-user-head">
                            <h2>รายชื่อผู้ใช้</h2>
                            <div>
                                <button><Icon.Plus/> เพิ่มแอดมิน</button>
                                <input type="text" style={{borderRadius:"200px",border:"1px solid gray"}} placeholder=" ค้นหา..."></input>
                            </div>
                        </div>
                        <div className="user-item-area">
                            <UserBox src="b3.png" username="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" userid="aaaa" />
                            <UserBox src="b3.png" username="aa" userid="aaaa" />
                            <UserBox src="b3.png" username="aa" userid="aaaa" />
                            <UserBox src="b3.png" username="aa" userid="aaaa" />
                            <UserBox src="b3.png" username="aa" userid="aaaa" />
                            <UserBox src="b3.png" username="aa" userid="aaaa" />


                        </div>
                    </div>
                </div>
            </div> */}
    </div>
  );
}

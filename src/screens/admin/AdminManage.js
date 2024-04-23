import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";
import * as ggIcon from '@mui/icons-material';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import { Menu, Input } from "antd";
import {
  NavbarUser,
  NavbarAdmin,
  NavbarHomepage,
} from "../../components/Navbar";
import { useParams, Link } from "react-router-dom";

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

  const [current, setCurrent] = useState(menu);
  const onClick = (e) => {
    setCurrent(e.key);
  };


  return (
    <div className="body-con">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <NavbarAdmin />
      <Menu className='top-menu' onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      <div className="chatbox-container">
        <div className="aside-panel">
          <AdminMenuAside onActive={menu} />
        </div>
        <div className="aside-main-card" style={{ padding: "1.3rem 2rem" }}>
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
    </div>
  );
}

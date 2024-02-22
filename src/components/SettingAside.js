import * as Icon from "react-feather";
import "../css/navbar.css";
import "../css/allinput.css";
import "../css/indexx.css";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";

import * as ggIcon from "@mui/icons-material";

const SettingAside = (props) => {
  // <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  let profileActive = null;
  let coinActive = null;

  switch (props.onActive) {
    case "profile":
      profileActive = "active";
      console.log("profile active");
      break;
    case "coin":
      coinActive = "active";
      break;
    default:
      break;
  }

  return (
    <div class="setting-menu">
      {/* <h2>การตั้งค่า</h2> */}
      <h1 style={{ fontWeight: "200", color: "white", marginBottom: "1rem" }}>
        การตั้งค่าและความเป็นส่วนตัว
      </h1>
      <Link style={{ textDecoration: "none" }} to="/setting-profile">
        <div className={profileActive}>
          <Icon.User />
          <p>โปรไฟล์</p>
        </div>
      </Link>
      <Link style={{ textDecoration: "none" }} to="">
        <div className={coinActive}>
          <ggIcon.History />
          <p>ประวัติการจ้าง</p>
        </div>
      </Link>
      <Link style={{ textDecoration: "none" }} to="">
        <div className={coinActive}>
          <Icon.Bell />
          <p>การแจ้งเตือน</p>
        </div>
      </Link>
      {/* <Link style={{ textDecoration: 'none' }} to="/setting-coin" ><div><Icon.Trash2 /><p>ลบบัญชีผู้ใช้งาน</p></div></Link> */}
    </div>
  );
};

export default SettingAside;

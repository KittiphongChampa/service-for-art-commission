import * as Icon from 'react-feather';
import "../../css/navbar.css";
import "../../css/allinput.css";
import "../../css/indexx.css";
import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import * as ggIcon from '@mui/icons-material';


const AdminMenuAside = (props) => {
    function activeCheck(menu) {
        const result = props.onActive === menu ? 'active' : null
        
        return result
    }

    return (
        <div className="setting-menu">
            <h1 className="h3" style={{ fontWeight: "200", color: "white", marginBottom: "1rem" }}>admin panel</h1>
            <Link to="/admin"><div className={props.onActive==null? 'active' : ''}><ggIcon.GridView /><p>ภาพรวมระบบ</p></div></Link>
            <Link to="/admin/adminmanage/report"><div className={activeCheck('report')}><Icon.Flag /><p>การรายงาน</p></div></Link >
            <Link to="/admin/adminmanage/alladmin" ><div className={activeCheck('alladmin')}><AdminPanelSettingsOutlinedIcon /><p>จัดการแอดมิน</p></div></Link >
            <Link to="/admin/adminmanage/alluser" ><div className={activeCheck('alluser')}><Icon.User /><p>จัดการผู้ใช้งาน</p></div></Link >
            <Link to="/admin/adminmanage/allcms" ><div className={activeCheck('allcms')}><Icon.Image /><p>การตรวจสอบรูปภาพ</p></div></Link >
            <Link to="/admin/adminmanage/allfaq" ><div className={activeCheck('allfaq')} ><Icon.HelpCircle /><p>คำถามที่พบบ่อย</p></div></Link >
            
        </div>
    )
}

export default AdminMenuAside;
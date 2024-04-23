import axios from "axios";
import * as Icon from 'react-feather';
import "../css/navbar.css";
import "../css/allinput.css";
import { useState, useEffect, useRef } from 'react';
import * as ggIcon from '@mui/icons-material';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { Button, Drawer, Radio, Flex, Avatar, Badge, Modal } from 'antd';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

import { host } from '../utils/api'

const NavbarUser = (props) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef();
    const { userdata, socket, logout } = useAuth();

    useEffect(() => {
        let handler = (event) => {
            if (!dropdownRef.current.contains(event.target)) {
                setOpen(false)
                // console.log(dropdownRef.current);
            }
        }
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, [])

    const notiRef = useRef();
    useEffect(() => {
        let handler = (event) => {
            if (!notiRef.current.contains(event.target)) {
                setOpenNoti(false)
            }
        }
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, [])

    // ส่วนของการแสดงผล noti
    const [notifications, setNotifications] = useState([]);

    const [openNoti, setOpenNoti] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (socket) {
            socket.on('getNotification', (data) => {
                setNotifications((prev) => {
                    // เพิ่มการแจ้งเตือนที่มาใหม่ไปที่ตำแหน่งแรกของอาร์เรย์
                    prev.unshift(data.data);
                    return [...prev];
                });
            });
        }
        axios.get(`${host}/noti/getmsg`, {
            headers: { Authorization: "Bearer " + token }
        }).then((response) => {
            const data = response.data;
            setNotifications(data.dataNoti);
        });
    }, [socket]);

    // ทำงานหลังจากกดอ่านแจ้งเตือน
    const handleNotificationClick = async (keyData, action) => {
        await axios.put(`${host}/noti/readed/?order_keyData=${keyData}&action=${action}`)
        hasnotread = notifications.some((noti) => noti.noti_read === 0);
    };

    //การแจ้งเตือนของ users
    const displayNotification = (data) => {
        // console.log(data);
        let action;
        let read;
        let linked;
        let keyData;
        let system = "แจ้งเตือนระบบ";
        if (data.msg === 'รับคำขอจ้าง') {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === 'ยกเลิกคำขอจ้าง') {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === 'ได้ส่งภาพร่าง') {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === "ได้ส่งภาพไฟนัล") {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === 'แจ้งเตือนการชำระเงินครั้งที่ 1') {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`
        } else if (data.msg === 'แจ้งเตือนการชำระเงินครั้งที่ 2') {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === 'ส่งความคืบหน้างาน') {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === 'ส่งคำขอจ้าง') {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === 'อนุมัติภาพร่างแล้ว โปรดตั้งราคางาน') {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === 'อนุมัติภาพความคืบหน้าแล้ว') {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === 'ได้ชำระเงินครั้งที่ 1 แล้ว') {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === 'ได้ชำระเงินครั้งที่ 2 แล้ว') {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === "ให้คะแนนและความคิดเห็น") {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === "แจ้งแก้ไขภาพร่าง") {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === "แจ้งแก้ไขใบเสร็จ") {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg === "แจ้งแก้ไขภาพ") {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg == "แจ้งแก้ไขภาพไฟนัล") {
            action = data.msg
            keyData = data.order_id
            linked = `/chatbox?id=${data.sender_id}&od_id=${data.order_id}`

        } else if (data.msg.includes("ถูกลบโดยแอดมิน")) {
            action = data.msg
            if (data.msg.includes("งานวาด")) {
                keyData = data.work_id
                linked = `/artworkdetail/${data.work_id}`

            } else if (data.msg.includes("คอมมิชชัน")) {
                keyData = data.work_id
                linked = `/cmsdetail/${data.work_id}`

            } else if (data.msg.includes("ออเดอร์")) {
                keyData = data.work_id
                linked = `/cmsdetail/${data.work_id}`

            }
        }

        if (data.noti_read === 1) {
            read = "อ่านแล้ว"
        } else {
            read = "่ยังไม่อ่าน"
        }

        return (
            // นี่คือส่วนของกล่องการแจ้งเตือน
            // <div key={keyData}>

            //     <a href={linked} onClick={() => handleNotificationClick(keyData, action)}>
            //         <span>
            //             <img src={data.sender_img} style={{ width: 30 }} />
            //             {data.sender_name} {action} <span style={{color:'gray'}}>{data.created_at}</span> {read}
            //         </span>
            //     </a>

            // </div>


            <div className='noti-wrapper' key={keyData} style={{ backgroundColor: read === 'อ่านแล้ว' ? 'white' : '#ebf1ff' }}>
                <a href={linked} onClick={() => handleNotificationClick(keyData, action)}>
                    <div className="pic">
                        <img src={data.sender_img} />
                    </div>
                    <div className="data">
                        {data.sender_name} {action} <span style={{color:'gray'}}>{data.created_at}</span>
                    </div>
                </a>
            </div>
        );

        // return (
        //     // นี่คือส่วนของกล่องการแจ้งเตือน
        //     <div key={keyData}>
        //         {action.includes('ถูกลบโดยแอดมิน') ? 
        //             (
        //                 <a href={linked}>
        //                     <span>
        //                         {system} {action} {data.created_at}
        //                     </span>
        //                 </a>
        //             )
        //         : 
        //             (
        //                 <a href={linked} onClick={() => handleNotificationClick(keyData, action)}>
        //                     <span>
        //                         <img src={data.sender_img} style={{ width: 30 }} />
        //                         {data.sender_name} {action} {data.created_at} {read}
        //                     </span>
        //                 </a>
        //             )
        //         }
        //     </div>
        // );

        // return (
        //     <div key={keyData}>
        //         <a href={linked} onClick={() => handleNotificationClick(keyData, action)}>
        //             <span>
        //                 {action.includes('ถูกลบโดยแอดมิน') ? (
        //                     <>
        //                         {system} {action} {data.created_at}
        //                     </>
        //                 ) : (
        //                     <>
        //                         <img src={data.sender_img} style={{ width: 30 }} alt={data.sender_name} /> {data.sender_name} {action} {data.created_at} {read}
        //                     </>
        //                 )} 
        //             </span>
        //         </a>
        //     </div>
        // );
    };

    const handleRead = () => {
        // setNotifications([]);
        setOpenNoti(false);
    };

    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        logout();
        navigate("/");
    };

    const [openDrawer, setOpenDrawer] = useState(false);
    const showDrawer = () => {
        setOpenDrawer(true);
    };
    const onClose = () => {
        setOpenDrawer(false);
    };

    let hasnotread = notifications.some((noti) => noti.noti_read === 0);
    const [notiModal, setNotiModal] = useState(false);

    function handleNotiModal() {
        setNotiModal(!notiModal);
    }

    return (
        <div className="nav-box" >
            <nav className="nav-container">
                <div className="inline-nav">
                    <a href="#" className="ham-menu" onClick={showDrawer}><Icon.Menu className='nav-icon' /></a>
                    <a href="/"><Icon.Home className='nav-icon' /></a>
                    <a href="/search"><Icon.Search className='nav-icon' /></a>

                </div>
                <div className="inline-nav">
                    <div ref={notiRef} style={{ position: "relative" }}>
                        <button onClick={() => setOpenNoti(!openNoti)} className="noti-btn">
                            {/* <Badge dot={notifications.length > 0 ? true : false}> */}
                            <Badge dot={hasnotread ? true : false}>
                                <Icon.Bell className='nav-icon' />
                            </Badge>
                            {/* --โนติแบบมีเลข ห้ามลบบบ */}
                            {/* {notifications.length > 0 &&
                                <div className="ba">
                                    {notifications.length <= 99 ?
                                        <>
                                            {notifications.length}
                                        </>

                                        :
                                        <>
                                            99+
                                        </>}
                                </div>} */}


                            {/* <div className="counter">{notifications.length > 0 ? notifications.length : 0}</div> */}
                            {/* {notifications.length > 0 ? (
                                <div className="counter">{notifications.length}</div>
                            ) : (
                                <div className="counter">0</div>
                            )} */}

                        </button>
                        <div className={`noti-area ${openNoti ? 'open' : 'close'}`} >
                            <div className="notifications">
                                {notifications.map((n) => displayNotification(n))}
                            </div>
                        </div>
                    </div>


                    <a href="/chatbox"><Icon.MessageCircle className='nav-icon' /><i data-feather="message-circle" className="nav-icon"></i></a>
                    {userdata.urs_type === 1 ? (
                        <>
                            <a href="/manage-commission"><Icon.PlusSquare className='nav-icon' /></a>
                        </>
                    ) : (
                        <></>
                    )}

                    <div className="dropdown-nav" ref={dropdownRef}>
                        <button onClick={() => { setOpen(!open) }}
                        // style={{ backgroundImage: "url(mainmoon.jpg)" }}
                        >
                            <img src={userdata.urs_profile_img} style={{ width: "45px", height: "45px", borderRadius: "45px" }} />
                        </button>
                        <div className={`dropdown-area ${open ? 'open' : 'close'}`} >
                            <a href="/profile" className="in-dropdown"><Icon.User className='nav-icon mx-2' />โปรไฟล์ของฉัน</a>
                            <a href="/setting-profile" className="in-dropdown"><Icon.Settings className='nav-icon mx-2' />ตั้งค่าโปรไฟล์</a>
                            <a href="/myreq" className="in-dropdown"><DescriptionOutlinedIcon className='nav-icon mx-2' />รายการจ้าง</a>
                            {/* <a href="/chatbox" className="in-dropdown"><Icon.MessageCircle className='nav-icon mx-2' />แชท</a> */}
                            {userdata.urs_type === 1 && (
                                <>
                                    <a href="/artistmanagement/dashboard" className="in-dropdown"><PaletteOutlinedIcon className='nav-icon mx-2' />artist panel</a>
                                </>
                            )}
                            <a href="/allfaq" className="in-dropdown"><Icon.HelpCircle className='nav-icon mx-2' />คำถามที่พบบ่อย</a>
                            <a href="#" onClick={handleLogout} className="in-dropdown"><Icon.LogOut className='nav-icon mx-2' />ออกจากระบบ</a>
                        </div>
                    </div>

                </div>
                <Drawer
                    title=""
                    placement="left"
                    closable={true}
                    onClose={onClose}
                    open={openDrawer}
                // className="ham-nav"
                >
                    <div className="ham-nav">
                        <a href="/profile">
                            <Flex gap="small" align="center">
                                <img src={userdata.urs_profile_img} style={{ width: "45px", height: "45px", borderRadius: "45px" }} />
                                <p>โปรไฟล์ของฉัน</p>
                            </Flex>
                        </a>
                        <a href="/"><Icon.Home className='nav-icon mx-2' />หน้าหลัก</a>
                        <a href="/search"><Icon.Search className='nav-icon mx-2' />สำรวจ</a>
                        <a href="#" onClick={handleNotiModal}><Icon.Bell className='nav-icon mx-2' />การแจ้งเตือน</a>
                        <a href="/chatbox"><Icon.MessageCircle className='nav-icon mx-2' />แชท</a>
                        <a href="/setting-profile"><Icon.Settings className='nav-icon mx-2' />ตั้งค่าโปรไฟล์</a>
                        <a href="/myreq"><DescriptionOutlinedIcon className='nav-icon mx-2' />รายการจ้างของฉัน</a>
                        {userdata.urs_type === 1 &&
                            <>
                                <a href="/manage-commission"><Icon.PlusSquare className='nav-icon mx-2' />เพิ่มคอมมิชชันและงานวาด</a>
                                <a href="/artistmanagement/dashboard"><PaletteOutlinedIcon className='nav-icon mx-2' />artist panel</a>
                            </>}
                        <a href="/allfaq"><Icon.HelpCircle className='nav-icon mx-2' />คำถามที่พบบ่อย</a>
                        <a href="#"><Icon.LogOut className='nav-icon mx-2' />ออกจากระบบ</a>
                    </div>
                </Drawer>
                <Modal open={notiModal} onCancel={handleNotiModal} footer='' className="notiModal">
                    <div className="notifications">
                        {notifications.map((n) => displayNotification(n))}

                    </div>
                </Modal>
            </nav>
        </div>
    )
}

const NavbarHomepage = (props) => {
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    return (
        <div className="nav-box" style={{ position: "fixed", backgroundColor: "transparent", border: "none" }}>
            <nav className="nav-container" >
                {/* <button className="ham-menu">เปิด</button> */}
                <div className="inline-nav inhomepage" >
                    <a href="#" className="ham-menu" onClick={showDrawer}><Icon.Menu className='nav-icon' /></a>
                    <a href="/search"><Icon.Search className='nav-icon' /></a>
                    <a href="/"><Icon.Home className='nav-icon' /></a>
                </div>
                <div className="inline-nav inhomepage">
                    <a href="/login">เข้าสู่ระบบ</a>
                    <a href="/selectrole">สมัครสมาชิก</a>
                </div>
            </nav>

            <Drawer
                title=""
                placement="left"
                closable={true}
                onClose={onClose}
                open={open}
            // className="ham-nav"
            >
                <div className="ham-nav">
                    <a href="/login"><Icon.LogIn className='nav-icon mx-2' />เข้าสู่ระบบ</a>
                    <a href="/selectrole"><Icon.LogIn className='nav-icon mx-2' />สมัครสมาชิก</a>
                    <a href="/"><Icon.Home className='nav-icon mx-2' />หน้าหลัก</a>
                    <a href="/search"><Icon.Search className='nav-icon mx-2' />สำรวจ</a>
                </div>
            </Drawer>
        </div>
    )
}

const NavbarGuest = (props) => {
    return (
        <div className="nav-box" >
            <nav className="nav-container" >
                <div className="inline-nav" >
                    <a href="/"><Icon.Home className='nav-icon' /></a>
                    <a href="/search"><Icon.Search className='nav-icon' /></a>
                </div>
                <div className="inline-nav">
                    {/* <a href="/"><Icon.Bell className='nav-icon' /><i data-feather="bell" className="nav-icon"></i></a> */}
                    {/* <a href="/login_M"><Icon.MessageCircle className='nav-icon' /><i data-feather="message-circle" className="nav-icon"></i></a> */}
                    {/* <a href="/userprofile"><Icon.PlusSquare className='nav-icon' /></a> */}
                    {/* <div className="show-coin">
                        <p>300 C</p>
                    </div> */}
                    <a href="/login">เข้าสู่ระบบ</a>
                    <a href="/selectrole">สมัครสมาชิก</a>
                    {/* <div className="dropdown-nav" ref={dropdownRef}>
                        <button onClick={() => { setOpen(!open) }} style={{ backgroundImage: "url(mainmoon.jpg)" }}>
                        </button>
                        <ul className={`dropdown-area ${open ? 'open' : 'close'}`} >
                            <li>ddd</li>
                            <li>ddd</li>
                            <li>ddd</li>
                            <li>ddd</li>
                            <li>ddd</li>
                            <li>ddd</li>
                        </ul>
                    </div> */}

                </div>
            </nav>
        </div>
    )
}

const NavbarAdmin = (props) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef();
    const { admindata, socket, logout } = useAuth();

    useEffect(() => {
        let handler = (event) => {
            if (!dropdownRef.current.contains(event.target)) {
                setOpen(false)
                // console.log(dropdownRef.current);
            }
        }
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, [])

    const notiRef = useRef();
    useEffect(() => {
        let handler = (event) => {
            if (!notiRef.current.contains(event.target)) {
                setOpenNoti(false)
            }
        }
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, [])

    // ส่วนของการแสดงผล noti
    const [notifications, setNotifications] = useState([]);
    const [openNoti, setOpenNoti] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (socket) {
            socket.on('getNotificationAdmin', (data) => {
                setNotifications((prev) => {
                    // เพิ่มการแจ้งเตือนที่มาใหม่ไปที่ตำแหน่งแรกของอาร์เรย์
                    prev.unshift(data.data);
                    return [...prev];
                });
            });
        }
        // การทำงานที่ดึงการแจ้งเตือนของแอดมินออกมา
        axios.get(`${host}/admin/noti/getmsg`, {
            headers: { Authorization: "Bearer " + token }
        }).then((response) => {
            const data = response.data;
            setNotifications(data.dataNoti);
        });

    }, [socket]);

    // ทำงานหลังจากกดอ่านแจ้งเตือน
    const handleNotificationClick = async (keyData, action) => {
        await axios.put(`${host}/noti/readed/?report_keyData=${keyData}&action=${action}`)
        hasnotread = notifications.some((noti) => noti.noti_read === 0);
    };
    let hasnotread = notifications.some((noti) => noti.noti_read === 0);

    const displayNotification = (data) => {
        let action;
        let read;
        let linked;
        let keyData;

        // การแจ้งเตือนของแอดมิน
        if (data.msg === 'ได้รายงานคอมมิชชัน') {
            action = data.msg;
            keyData = data.reportId;
            linked = `/admin/adminmanage/report/${data.reportId}`

        } else if (data.msg === 'ได้รายงานผลงานภาพ') {
            action = data.msg;
            keyData = data.reportId;
            linked = `/admin/adminmanage/report/${data.reportId}`

        } else if (data.msg === 'ได้รายงานออเดอร์') {
            action = data.msg;
            keyData = data.reportId;
            linked = `/admin/adminmanage/report/${data.reportId}`
        }

        if (data.noti_read === 1) {
            read = "อ่านแล้ว"
        } else {
            read = "่ยังไม่อ่าน"
        }
        return (
            // <div key={keyData}>
            //     {/* < href={linked} onClick={() => handleNotificationClick(keyData, action)}> */}
            //     <a href={linked} onClick={() => handleNotificationClick(keyData, action)}>
            //         <span><img src={data.sender_img} style={{width:30}}/>{data.sender_name} {action} {data.created_at} {read}</span>
            //     </a>
            // </div>

            <div className='noti-wrapper' key={keyData} style={{ backgroundColor: read === 'อ่านแล้ว' ? 'white' : '#ebf1ff' }}>
                <a href={linked} onClick={() => handleNotificationClick(keyData, action)}>
                    <div className="pic">
                        <img src={data.sender_img} />
                    </div>
                    <div className="data">
                        {data.sender_name} {action} <span style={{color:'gray',fontSize:'14px !important'}}> {data.created_at}</span>
                    </div>
                </a>
            </div>
        );

    };

    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        logout();
        navigate("/");
    };

    const [openDrawer, setOpenDrawer] = useState(false);
    const showDrawer = () => {
        setOpenDrawer(true);
    };
    const onClose = () => {
        setOpenDrawer(false);
    };
    const [notiModal, setNotiModal] = useState(false);

    function handleNotiModal() {
        setNotiModal(!notiModal);
    }




    return (
        <div className="nav-box" >
            <nav className="nav-container">
                <div className="inline-nav">
                    <a href="#" className="ham-menu" onClick={showDrawer}><Icon.Menu className='nav-icon' /></a>
                    <a href="/admin"><Icon.Home className='nav-icon' /></a>
                    <a href="/"><Icon.Search className='nav-icon' /></a>
                </div>
                <div className="inline-nav">

                    {/* <div className="dropdown-nav" ref={dropdownRef}>
                        <button onClick={() => setOpenNoti(!openNoti)} className="noti-btn">
                            <Icon.Bell className='nav-icon' />
                            <div className="counter">{notifications.length > 0 ? notifications.length : 0}</div>

                        </button>
                    </div>
                    <div className={`dropdown-area ${openNoti ? 'open' : 'close'}`} >
                        <div className="notifications">
                            {notifications.map((n) => displayNotification(n))}
                        </div>
                    </div> */}

                    <div ref={notiRef} style={{ position: "relative" }}>
                        <button onClick={() => setOpenNoti(!openNoti)} className="noti-btn">

                            {/* <Badge dot={hasnotread ? true : false}> */}
                            <Badge dot={hasnotread ? true : false}>
                                <Icon.Bell className='nav-icon' />
                            </Badge>
                        </button>
                        <div className={`noti-area ${openNoti ? 'open' : 'close'}`} >
                            <div className="notifications">
                                {/* {notifications.map(data => (
                                    <div key={data.reportId}>
                                        <span><img src={data.sender_img} style={{width:30}}/>{data.sender_name} {data.msg} </span>
                                    </div>
                                ))} */}
                                {notifications.map((n) => displayNotification(n))}
                                {/* <button className="nButton" onClick={handleRead}>
                                    Mark as read
                                </button> */}
                            </div>
                        </div>
                    </div>

                    {admindata.admin_type === 0 ? (
                        <>
                            <a href="/admin/adminmanage/alladmin"><AdminPanelSettingsOutlinedIcon className='nav-icon' /></a>
                        </>
                    ) : (
                        <></>
                    )}

                    <div className="dropdown-nav" ref={dropdownRef}>
                        <button onClick={() => { setOpen(!open) }}>
                            <img src={admindata.admin_profile} style={{ width: "45px", height: "45px", borderRadius: "50px" }} />
                        </button>
                        <div className={`dropdown-area ${open ? 'open' : 'close'}`} >
                            <a href="/admin/setting-profile" className="in-dropdown"><Icon.User className='nav-icon mx-2' />ตั้งค่าโปรไฟล์</a>
                            {admindata.admin_type === 0 &&
                                <a href="/admin/adminmanage/alladmin" className="in-dropdown"><AdminPanelSettingsOutlinedIcon className='nav-icon mx-2' />จัดการแอดมิน</a>}
                            <a href="/admin/adminmanage/alluser" className="in-dropdown"><ggIcon.Group className='nav-icon mx-2' />จัดการผู้ใช้งาน</a>
                            <a href="/admin/adminmanage/allcms" className="in-dropdown"><ggIcon.ImageSearch className='nav-icon mx-2' />ตรวจสอบรายงานรูปภาพ</a>
                            <a href="/admin/adminmanage/allfaq" className="in-dropdown"><Icon.HelpCircle className='nav-icon mx-2' />จัดการคำถามที่พบบ่อย</a>
                            <a href="#" onClick={handleLogout} className="in-dropdown"><Icon.LogOut className='nav-icon mx-2' />ออกจากระบบ</a>
                        </div>
                    </div>

                </div>
                <Drawer
                    title=""
                    placement="left"
                    closable={true}
                    onClose={onClose}
                    open={openDrawer}
                // className="ham-nav"
                >
                    <div className="ham-nav">
                        <a href="/profile">
                            <Flex gap="small" align="center">
                                <img src={admindata.admin_profile} style={{ width: "45px", height: "45px", borderRadius: "45px" }} />
                                <p>โปรไฟล์ของฉัน</p>
                            </Flex>
                        </a>
                        <a href="/"><Icon.Home className='nav-icon mx-2' />หน้าหลัก</a>
                        <a href="/admin/adminmanage/alluser" className="in-dropdown"><ggIcon.Group className='nav-icon mx-2' />จัดการผู้ใช้งาน</a>
                        {admindata.admin_type === 0 &&
                            <a href="/admin/adminmanage/alladmin" className="in-dropdown"><AdminPanelSettingsOutlinedIcon className='nav-icon mx-2' />จัดการแอดมิน</a>}
                        <a href="#" onClick={handleNotiModal}><Icon.Bell className='nav-icon mx-2' />การแจ้งเตือน</a>
                        <a href="/admin/adminmanage/allcms" className="in-dropdown"><ggIcon.ImageSearch className='nav-icon mx-2' />ตรวจสอบรายงานรูปภาพ</a>
                        <a href="/admin/adminmanage/allfaq" className="in-dropdown"><Icon.HelpCircle className='nav-icon mx-2' />จัดการคำถามที่พบบ่อย</a>
                        <a href="#" onClick={handleLogout} className="in-dropdown"><Icon.LogOut className='nav-icon mx-2' />ออกจากระบบ</a>
                    </div>
                </Drawer>
                <Modal open={notiModal} onCancel={handleNotiModal} footer='' className="notiModal">
                    <div className="notifications">
                        {notifications.map((n) => displayNotification(n))}
                    </div>
                </Modal>
            </nav>
        </div>
    )
}

export { NavbarUser, NavbarAdmin, NavbarHomepage, NavbarGuest };
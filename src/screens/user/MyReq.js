import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import "../../css/indexx.css";
import "../../css/allinput.css";
import "../../css/allbutton.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import SettingAside from "../../components/SettingAside";
import ProfileImg from "../../components/ProfileImg";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../../components/Navbar";
import "sweetalert2/src/sweetalert2.scss";
import * as Icon from 'react-feather';
import "../../css/indexx.css";
import '../../css/main.css';
import "../../css/allbutton.css";
import "../../css/profileimg.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ggIcon from '@mui/icons-material';
// import ChatOrderDetail from '../components/ChatOrderDetail'
import Scrollbars from 'react-scrollbars-custom';
import { Pagination, Toggle, SelectPicker, TagPicker, InputNumber } from 'rsuite';
import { Link } from 'react-router-dom';
import { DateRangePicker } from 'rsuite';
import { Cascader, Input, Select, Flex, Tabs } from 'antd';


// import Button from "react-bootstrap/Button";
import { Button } from 'antd';
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import * as alertData from "../../alertdata/alertData";
import { host } from "../../utils/api";

const title = "ตั้งค่าโปรไฟล์";
const toastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

export default function MyReq() {

    const menus = [
        {
            key: '1',
            label: "ทั้งหมด",
            // children: <Foryou statusUserLogin={statusUserLogin} cmsLatests={cmsLatests} cmsArtists={cmsArtists} IFollowerData={IFollowerData} gallerylatest={gallerylatest} galleryIfollow={galleryIfollow} />,
        },
        {
            key: '2',
            label: "รอการตอบรับ",
            // children: <Commissions IFollowingIDs={IFollowingIDs} />,
        },
        {
            key: '3',
            label: "ยอมรับแล้ว",
            // children: <Gallery IFollowingIDs={IFollowingIDs} />,
        },
        {
            key: '4',
            label: "เสร็จสิ้น",
            // children: <Artists IFollowingIDs={IFollowingIDs} />,
        },
        {
            key: '5',
            label: "ยกเลิกแล้ว",
            // children: <Artists IFollowingIDs={IFollowingIDs} />,
        },

    ];
    let layout = ['total', '-', 'pager', 'skip']

    return (
        <div className="body-con">
            <Helmet>
                <title>{title}</title>
            </Helmet>

            {/* <Navbar /> */}
            <NavbarUser />

            {/* <div className="setting-container"> */}
            <div className="body-lesspadding" style={{ backgroundColor: "rgb(241, 241, 249)" }}>
                <div className="container">
                    <div className="content-card">
                        <h1>รายการจ้างของฉัน</h1>
                        <div>
                            <Tabs defaultActiveKey="1" items={menus} />
                        </div>
                        <Flex justify="space-between" align="center">
                            <div className="filter" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                เรียงตาม :
                                <Select
                                    // value={{ value: sortBy, label: sortBy }}
                                    style={{ width: 120 }}
                                    // onChange={handleSortByChange}
                                    options={[
                                        { value: 'ล่าสุด', label: 'ล่าสุด' },
                                        { value: 'เก่าสุด', label: 'เก่าสุด' },
                                        { value: 'ราคา ↑', label: 'ราคา ↑' },
                                        { value: 'ราคา ↓', label: 'ราคา ↓' },
                                        // { value: 'คะแนนรีวิว ↑', label: 'คะแนนรีวิว ↑' },
                                        // { value: 'คะแนนรีวิว ↓', label: 'คะแนนรีวิว ↓' },
                                    ]}
                                />
                            </div>
                            <div>
                                <Input type="search" placeholder=" ค้นหา..." />
                            </div>

                        </Flex>


                        {/* <div className="submenu-filter" style={{ display:"flex",justifyContent: "flex-end",alignItems: "center"}}>
                            เรียงตาม : 
                            <Select
                                // value={{ value: sortBy, label: sortBy }}
                                style={{ width: 120 }}
                                // onChange={handleSortByChange}
                                options={[
                                    { value: 'ล่าสุด', label: 'ล่าสุด' },
                                    { value: 'เก่าสุด', label: 'เก่าสุด' },
                                    { value: 'ราคา ↑', label: 'ราคา ↑' },
                                    { value: 'ราคา ↓', label: 'ราคา ↓' },
                                    // { value: 'คะแนนรีวิว ↑', label: 'คะแนนรีวิว ↑' },
                                    // { value: 'คะแนนรีวิว ↓', label: 'คะแนนรีวิว ↓' },
                                ]}
                            />
                        </div> */}
                        {/* <table className="table is-striped is-fullwidth">
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
                                <tr >
                                    <td>ฟฟฟ</td>
                                    <td>ฟฟฟฟ</td>
                                    <td>ฟฟฟ</td>
                                    <td>ฟฟ</td>
                                    <td>ฟฟฟ</td>
                                    <td><Link to={`/admin/adminmanage/cms-problem/`}>จัดการ</Link></td>
                                </tr>
                            </tbody>
                        </table> */}
                        <table className="overview-order-table">
                            <tr className="table-head">
                                <th>ไอดีออเดอร์</th>
                                <th>คอมมิชชัน:แพ็คเกจ</th>
                                <th>ราคาคมช.</th>
                                <th>นักวาด</th>
                                <th>ความคืบหน้า</th>
                            </tr>

                            <tr className="order-data-row">
                                <td>ddd</td>
                                <td>ddd</td>
                                <td>ddd</td>
                                <td>ddd</td>
                                <td>ddd</td>
                            </tr>
                            {/* <tr className="tr-detail">
                                <td colspan="12">
                                    <div>
                                        <p>วันที่ส่งคำขอจ้างส่งคำขอจ้าง : <span>xxxxxx</span></p>
                                        <p>ระยะเวลา : <span>xxxxxx</span></p>
                                        <p>เวลาที่เหลือ : <span>xxxxxx</span></p>
                                        <p>แก้ไข(ครั้ง) : <span>xxxxxxxxx</span></p>
                                        <p>ราคาแก้ไข : <span>xxxxxxxxx</span></p>
                                        <p>รวมราคา : <span>xxxxxxxxx</span></p>

                                    </div>
                                </td>
                            </tr> */}




                        </table>
                        <Pagination
                            
                            layout={layout}
                            size='md'
                            prev={true}
                            next={true}
                            first={true}
                            last={true}
                            ellipsis={true}
                            boundaryLinks={true}
                            // total={dataa.length}
                            // limit={itemsPerPage}
                            maxButtons={5}
                            // activePage={activePage}
                            // onChangePage={setActivePage}
                        />



                    </div>


                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../../css/indexx.css";
import "../../css/allinput.css";
import "../../css/allbutton.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import { NavbarUser, NavbarAdmin, NavbarHomepage } from "../../components/Navbar";
import "sweetalert2/src/sweetalert2.scss";
import * as Icon from 'react-feather';
import "../../css/indexx.css";
import '../../styles/main.css';
import "../../css/allbutton.css";
import "../../css/profileimg.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ggIcon from '@mui/icons-material';
import { Cascader, Input, Select, Flex, Tabs, Pagination } from 'antd';
import { useAuth } from '../../context/AuthContext';

// import Button from "react-bootstrap/Button";
import { Button } from 'antd';
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import * as alertData from "../../alertdata/alertData";
import { host } from "../../utils/api";
import _ from 'lodash';

const title = "ตั้งค่าโปรไฟล์";
const toastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

export default function MyReq() {
    const token = localStorage.getItem("token");


    const { userdata, socket } = useAuth();
    const menus = [
        {
            key: 'all',
            label: "ทั้งหมด",
            // children: <Foryou statusUserLogin={statusUserLogin} cmsLatests={cmsLatests} cmsArtists={cmsArtists} IFollowerData={IFollowerData} gallerylatest={gallerylatest} galleryIfollow={galleryIfollow} />,
        },
        {
            key: 'wait',
            label: "รอการตอบรับ",
            // children: <Commissions IFollowingIDs={IFollowingIDs} />,
        },
        {
            key: 'accepted',
            label: "ยอมรับแล้ว",
            // children: <Gallery IFollowingIDs={IFollowingIDs} />,
        },
        {
            key: '4',
            label: "เสร็จสิ้น",
            // children: <Artists IFollowingIDs={IFollowingIDs} />,
        },
        {
            key: 'cancel',
            label: "ยกเลิกแล้ว",
            // children: <Artists IFollowingIDs={IFollowingIDs} />,
        },

    ];

    const [activePage, setActivePage] = useState(1);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(9);
    const itemsPerPage = 10;

    useEffect(() => {
        if (filteredData) {
            //หน้าเพจ - 1 = index 0 * จำนวนแสดงต่อหน้า 0-9 10-19 20-29
            const newStartIndex = (activePage - 1) * itemsPerPage;
            //เอาจำนวนที่เริ่ม + จำนวนที่แสดง (0+10 = 10) จะเป็น index 0-10 
            
            const newEndIndex = newStartIndex + (itemsPerPage-1);
            //index เริ่มและ index สุดท้าย
            setFilteredData(filteredData.slice(newStartIndex, newEndIndex))
            setStartIndex(newStartIndex);
            setEndIndex(newEndIndex);
            // setFilterCmsReq(allData);
            console.log(activePage, newStartIndex, newEndIndex)
        }
    }, [activePage]);

    const [allData, setAllData] = useState()
    const [filteredData, setFilteredData] = useState()
    const [sortby, setsortby] = useState('เก่าสุด')

    useEffect(() => {
        const getData = async () => {
            const allDataData = await axios.get(
                `${host}/getreq`,
                {
                    headers: {Authorization: "Bearer " + token},
                }
            )
            // console.log(allDataData.data)
            setAllData(allDataData.data)
            setFilteredData(allDataData.data)
        }
        getData()
    }, [])



    function changeMenu(key) {
        // key == "all" && const aa = allData.filter(menu => menu.step_name == "")
        var req;
        if (key == 'all') {
            req = allData
        } else if (key == 'wait') {
            req = allData.filter(menu => menu?.step_name == "รับคำขอจ้าง")
        } else if (key == 'accepted') {
            req = allData.filter(menu => !menu.step_name?.includes('คำขอจ้าง') || !menu.step_name?.includes('แอดมินอนุมัติ'))
        } else if (key == 'cencel') {
            req = allData.filter(menu => menu?.od_cancel_by !== null)
        }
        setFilteredData(req)

        if (searchValue) {
            search2(req)
        }
    }

    useEffect(() => {
        sortAllData(filteredData)
    }, [sortby])

    //เรียงข้อมูล
    function sortAllData(allData) {
        var sortData;
        if (allData) {
            if (sortby == "ล่าสุด") {
                sortData = _.orderBy(allData, ['ordered_at'], ['desc']);
            } else if (sortby == "เก่าสุด") {
                sortData = _.orderBy(allData, ['ordered_at'], ['asc']);
            } else if (sortby == "ราคา ↑") {
                sortData = _.orderBy(allData, ['od_price'], ['asc']);
            } else if (sortby == "ราคา ↓") {
                sortData = _.orderBy(allData, ['od_price'], ['desc']);
            }
            setFilteredData(sortData)
        }

    }

    const [searchQuery, setSearchQuery] = useState()
    const [searchValue, setSearchValue] = useState()

    //ค้นหา
    const handleSearch = (event) => {
            const query = event.target.value.toLowerCase();
            setSearchValue(query)
            const filtered = filteredData.filter(
                (item) =>
                    String(item.od_id).toLowerCase().includes(query) ||
                    String(item.cms_name).toLowerCase().includes(query) ||
                    String(item.artist_name).toLowerCase().includes(query)
            );
            setSearchQuery(filtered);
    };

    function search2(req) {
        const filtered = req.filter(
            (item) =>
                String(item.od_id).toLowerCase().includes(searchValue) ||
                String(item.cms_name).toLowerCase().includes(searchValue) ||
                String(item.artist_name).toLowerCase().includes(searchValue)
        );
        setSearchQuery(filtered);

    }



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
                        <h1 className="h3">รายการจ้างของฉัน</h1>
                        <div>
                            <Tabs defaultActiveKey="1" items={menus} onChange={changeMenu} />
                        </div>
                        <Flex justify="space-between" align="center" wrap="wrap">
                            <div className="filter" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                เรียงตาม :
                                <Select
                                    // value={{ value: sortBy, label: sortBy }}
                                    style={{ width: 120 }}
                                    // onChange={handleSortByChange}
                                    value={sortby}
                                    onChange={setsortby}
                                    options={[
                                        { value: 'เก่าสุด', label: 'เก่าสุด' },
                                        { value: 'ล่าสุด', label: 'ล่าสุด' },
                                        { value: 'ราคา ↑', label: 'ราคา ↑' },
                                        { value: 'ราคา ↓', label: 'ราคา ↓' },
                                        // { value: 'คะแนนรีวิว ↑', label: 'คะแนนรีวิว ↑' },
                                        // { value: 'คะแนนรีวิว ↓', label: 'คะแนนรีวิว ↓' },
                                    ]}
                                />
                            </div>
                            <div>
                                <Input type="search" placeholder=" ค้นหา..." value={searchValue} onChange={handleSearch} />
                            </div>

                        </Flex>

                        <table className="overview-order-table">
                            <tr className="table-head">
                                <th>ไอดีออเดอร์</th>
                                <th>คอมมิชชัน:แพ็คเกจ</th>
                                <th>ราคาคมช.</th>
                                <th>นักวาด</th>
                                <th>ความคืบหน้า</th>
                            </tr>



                            {searchQuery ?
                                <>
                                    {searchQuery.map((req,index) => {
                                        //ถ้าช่องค้นหาไม่ว่างให้แสดงอีกตัวแทน
                                        return (
                                            <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex}>
                                                <td>{req.od_id}</td>
                                                <td>{req.cms_name} : {req.pkg_name}</td>
                                                <td>{req.od_price}</td>
                                                <td>{req.artist_name}</td>
                                                <td>{req.step_name}</td>
                                            </tr>
                                        )
                                    })
                                    }
                                </>
                                :
                                <>
                                    {filteredData && filteredData.map((req,index) => {
                                        //ถ้าช่องค้นหาไม่ว่างให้แสดงอีกตัวแทน
                                        return (
                                            <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex}>
                                                <td>{req.od_id}</td>
                                                <td>{req.cms_name} : {req.pkg_name}</td>
                                                <td>{req.od_price}</td>
                                                <td>{req.artist_name}</td>
                                                <td>{req.step_name}</td>
                                            </tr>
                                        )
                                    })
                                    }
                                </>
                            }
                        </table>

                        <Pagination
                            total={filteredData == undefined ? 0 : filteredData.length}
                            showQuickJumper
                            showTotal={(total) => `จำนวน ${total} รายการ`}
                            defaultPageSize={10}
                            current={activePage}
                            responsive
                            onChange={setActivePage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

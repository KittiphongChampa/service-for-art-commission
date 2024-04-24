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
import { Cascader, Input, Badge, Select, Flex, Tabs, Pagination } from 'antd';
import { useAuth } from '../../context/AuthContext';

// import Button from "react-bootstrap/Button";
import { Button } from 'antd';
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import * as alertData from "../../alertdata/alertData";
import { host } from "../../utils/api";
import _ from 'lodash';

const title = "รายการจ้างของฉัน";
export default function MyReq() {
    const token = localStorage.getItem("token");


    const [countAll, setCountAll] = useState()
    const [countWait, setCountWait] = useState()
    const [countAccepted, setCountAccepted] = useState()
    const [countCancel, setCountCancel] = useState()
    const [countFinish, setCountFinish] = useState()


    const { userdata, socket } = useAuth();
    const menus = [
        {
            key: 'all',
            label:
                <>
                    <span>ทั้งหมด </span>
                    <Badge count={countAll} showZero color="#faad14" />
                </>,
            // children: <Foryou statusUserLogin={statusUserLogin} cmsLatests={cmsLatests} cmsArtists={cmsArtists} IFollowerData={IFollowerData} gallerylatest={gallerylatest} galleryIfollow={galleryIfollow} />,
        },
        {
            key: 'wait',
            label:

                <>
                    <span>รอการตอบรับ </span>
                    <Badge count={countWait} showZero color="#faad14" />
                </>
            ,
            // children: <Commissions IFollowingIDs={IFollowingIDs} />,
        },
        {
            key: 'accepted',
            label:
                <>
                    <span>ยอมรับแล้ว </span>
                    <Badge count={countAccepted} showZero color="#faad14" />
                </>,
            // children: <Gallery IFollowingIDs={IFollowingIDs} />,
        },
        {
            key: 'finish',
            label:
                <>
                    <span>เสร็จสิ้น </span>
                    <Badge count={countFinish} showZero color="#faad14" />
                </>
            // children: <Artists IFollowingIDs={IFollowingIDs} />,
        },
        {
            key: 'cancel',
            label:
                <>
                    <span>ยกเลิกแล้ว </span>
                    <Badge count={countCancel} showZero color="#faad14" />
                </>,
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

            const newEndIndex = newStartIndex + (itemsPerPage);
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
            const allData = await axios.get(
                `${host}/getreq`,
                {
                    headers: { Authorization: "Bearer " + token },
                }
            )
            // console.log(allData.data)
            console.log()
            setAllData(allData.data)
            setFilteredData(allData.data)
            console.log(allData.data)

            const array0 = allData.data
            setCountAll(array0.length)
            const array1 = allData.data.filter(data => data?.step_name?.includes('รับคำขอจ้าง') && data?.od_cancel_by == null)
            setCountWait(array1.length)
            const array3 = allData.data.filter(data => data?.od_cancel_by != null)
            setCountCancel(array3.length)
            const array4 = allData.data.filter(data => data?.finished_at != null)
            setCountFinish(array4.length)
            const array5 = allData.data.filter(data => data?.finished_at != null && data?.od_cancel_by != null)
            setCountAccepted(array5.length)

            // console.log(array3.length)
        }
        getData()



    }, [])


    // const countAll = useRef()
    // const countWait = useRef()
    // const countCancel = useRef()
    // const countFinish = useRef()
    function changeMenu(key) {
        // key == "all" && const aa = allData.filter(menu => menu.step_name == "")
        let req;
        if (key == 'all') {
            req = allData
        } else if (key == 'wait') {
            req = allData.filter(menu => menu?.step_name?.includes('รับคำขอจ้าง') && menu?.od_cancel_by == null)
        } else if (key == 'cancel') {
            req = allData.filter(menu => menu?.od_cancel_by != null)
        } else if (key == 'finish') {
            req = allData.filter(menu => menu?.finished_at != null)
        }
        else {
            // กรณีแอกเซ็ป
            req = allData.filter(menu => menu?.finished_at != null && menu?.od_cancel_by != null && menu?.step_name.includes('รับคำขอจ้าง'))
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

    const [windowSize, setWindowSize] = useState(window.innerWidth <= 767 ? 'small' : 'big')

    window.onresize = reportWindowSize;
    function reportWindowSize() {
        // console.log(window.innerHeight, window.innerWidth)
        if (window.innerWidth <= 767) {
            setWindowSize('small')
        } else {
            setWindowSize('big')

        }
        console.log(windowSize)
    }


    const tableData = (data) => {
        if (windowSize != 'small') {
            return data?.map((req, index) => (
                <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex}>
                    <td>{req.od_id}</td>
                    <td>{req.cms_name} : {req.pkg_name}</td>
                    <td>{req.od_price}</td>
                    <td>{req.artist_name}</td>
                    <td>
                        {req.od_cancel_by == null && req.finished_at == null && <Badge className='badge-status' count={'รอ' + req.step_name} showZero color="#7E9AFA" />}
                        {req.finished_at != null && <Badge className='badge-status' count='เสร็จสิ้นแล้ว' showZero color={req.od_cancel_by != null ? "#faad14" : "#52c41a"} />}
                        {req.od_cancel_by != null && <Badge className='badge-status' count='ยกเลิกแล้ว' showZero color="gray" />}
                    </td>
                </tr>
            ));
        } else {
            return data?.map((req, index) => (
                <>
                    <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex}>
                        <td>
                            <Flex justify="space-between">
                                <p>ไอดีออเดอร์</p>
                                <p>{req.od_id}</p>
                            </Flex>
                        </td>
                    </tr>
                    <tr className="order-data-row">
                        <td>
                            <Flex justify="space-between">
                                <p>คอมมิชชัน : แพ็กเกจ</p>
                                <p>{req.cms_name} : {req.pkg_name}</p>
                            </Flex>
                        </td>
                    </tr>
                    <tr className="order-data-row">
                        <td>
                            <Flex justify="space-between">
                                <p>ราคา</p>
                                <p>{req.od_price}</p>
                            </Flex>
                        </td>
                    </tr>
                    <tr className="order-data-row">
                        <td>
                            <Flex justify="space-between">
                                <p>ชื่อนักวาด</p>
                                <p>{req.artist_name}</p>
                            </Flex>
                        </td>
                    </tr>
                    <tr className="order-data-row last">
                        <td>
                            <Flex justify="space-between">
                                <p>ความคืบหน้า</p>
                                <p>{req.od_cancel_by == null && req.finished_at == null && <Badge className='badge-status' count={'รอ' + req.step_name} showZero color="#7E9AFA" />}
                                    {req.finished_at != null && <Badge className='badge-status' count='เสร็จสิ้นแล้ว' showZero color={req.od_cancel_by != null ? "#faad14" : "#52c41a"} />}
                                    {req.od_cancel_by != null && <Badge className='badge-status' count='ยกเลิกแล้ว' showZero color="gray" />}</p>
                            </Flex>
                        </td>
                    </tr>
                </>
            ));
        }
    };

    return (
        <div className="body-con">
            <Helmet>
                <title>{title}</title>
            </Helmet>

            {/* <Navbar /> */}
            <NavbarUser />

            {/* <div className="setting-container"> */}
            <div className="body-lesspadding" >
                <div className="container-xl">
                    <div className="content-card">
                        <h1 className="h3">รายการจ้างของฉัน</h1>
                        <div>
                            <Tabs defaultActiveKey="1" items={menus} onChange={changeMenu} />
                        </div>
                        <Flex justify="space-between" align="center" wrap="wrap">
                            <div className="filter" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>

                                <Flex align="center">
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
                                </Flex>
                            </div>
                            <div>
                                <Input type="search" placeholder=" ค้นหา..." value={searchValue} onChange={handleSearch} />
                            </div>

                        </Flex>

                        <table className="overview-order-table">
                            {windowSize != 'small' &&
                                <tr className="table-head">
                                    <th>ไอดีออเดอร์</th>
                                    <th>คอมมิชชัน:แพ็กเกจ</th>
                                    <th>ราคาคมช.</th>
                                    <th>นักวาด</th>
                                    <th>ความคืบหน้า</th>
                                </tr>}




                            {searchQuery && searchValue != '' ? (
                                tableData(searchQuery)
                            ) : (
                                tableData(filteredData)
                            )}
                        </table>

                        <Pagination hideOnSinglePage
                            total={filteredData == undefined ? 0 : filteredData.length}
                            showQuickJumper
                            showTotal={(total) => `จำนวน ${total} รายการ`}
                            defaultPageSize={itemsPerPage}
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
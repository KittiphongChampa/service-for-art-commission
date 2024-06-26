

import React, { useState, useEffect, useRef, createElement } from "react";
import * as Icon from 'react-feather';
import "../css/indexx.css";
import '../styles/main.css';
import "../css/allbutton.css";
import "../css/profileimg.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from "react-helmet";
import DefaultInput from "../components/DefaultInput";
import { NavbarUser, NavbarAdmin, NavbarHomepage, NavbarGuest } from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ggIcon from '@mui/icons-material';
// import ChatOrderDetail from '../components/ChatOrderDetail'
import Scrollbars from 'react-scrollbars-custom';
// import { Pagination } from 'rsuite';
import { Link } from 'react-router-dom';
// import { DateRangePicker } from 'rsuite';
import { Pagination, Input, Select, Space, Tabs, Flex, DatePicker, Collapse, Badge } from 'antd';
import axios from "axios";
import { host } from "../utils/api";
import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear, addDays, isAfter, isBefore } from 'date-fns';
// import { sortBy, orderBy } from 'lodash';
import _ from 'lodash';




export default function OrderOverview() {
    const token = localStorage.getItem("token");
    // const sortdate = ['สัปดาห์นี้', 'เดือนนี้', 'ปีนี้', 'ทุกปี', 'กำหนดเอง'].map(
    //     item => ({ label: item, value: item })
    // );

    // const sortby = ['วันที่ส่งคำขอจ้าง ↑', 'วันที่ส่งคำขอจ้าง ↓', 'ราคาคอมมิชชัน ↑', 'ราคาคอมมิชชัน ↓', 'ราคารวม ↑', 'ราคารวม ↓', 'ราคาแก้ไข ↑', 'ราคาแก้ไข ↓'].map(
    //     item => ({ label: item, value: item })
    // );

    const [sortby, setsortby] = useState('คิว')
    const [sortdateValue, setSortdateValue] = useState('ทุกปี')
    const [allData, setAllData] = useState()
    const [filterCmsReq, setFilterCmsReq] = useState()

    let layout = ['total', '-', 'pager', 'skip']

    //     { q: 1, od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "02:01:12 น.", price: "500", edit: "4/3", edit_price: "+100", amount_price: "600", customer: "Boobi", progress: "ภาพ final" },
    //     { q: 2, od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "-", edit: "0/3", edit_price: "-", amount_price: "-", customer: "babi", progress: "รับรีเควสแล้ว" },
    //     { q: 3, od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "-", edit: "0/3", edit_price: "-", amount_price: "-", customer: "ณัฐนันท์", progress: "รับรีเควสแล้ว" },
    //     { q: 4, od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "-", edit: "0/3", edit_price: "-", amount_price: "-", customer: "Boobi", progress: "รับรีเควสแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Natthapat", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Nanta", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Natpimon M", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "4/3", edit_price: "+100", amount_price: "600", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "0/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "4/3", edit_price: "+100", amount_price: "600", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "0/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "0/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "0/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Natthapat", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Nanta", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Natpimon M", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "4/3", edit_price: "+100", amount_price: "600", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "0/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "4/3", edit_price: "+100", amount_price: "600", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "0/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "0/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "0/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" }, { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Natthapat", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Nanta", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Natpimon M", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "1/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "4/3", edit_price: "+100", amount_price: "600", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "0/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "4/3", edit_price: "+100", amount_price: "600", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "0/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "0/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    //     { q: "-", od_id: "OD123420011", cms: "XXXXXXX", during_time: 2, left_time: "-", price: "500", edit: "0/3", edit_price: "-", amount_price: "500", customer: "Boobi", progress: "เสร็จแล้ว" },
    // ];
    const itemsPerPage = 10;

    const [activePage, setActivePage] = useState(1);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(9);
    const [dateSelected, setDateSelected] = useState("ทั้งหมด")

    const [countAll, setCountAll] = useState(0)
    const [countWait, setCountWait] = useState(0)
    const [countAccepted, setCountAccepted] = useState(0)
    const [countCancel, setCountCancel] = useState(0)
    const [countFinish, setCountFinish] = useState(0)
    // const [dataToShow, setDataToShow] = useState(filterCmsReq.slice(startIndex, endIndex))

    useEffect(() => {
        const getData = async () => {
            const allreqData = await axios.get(
                `${host}/getcmsreq`,
                {
                    headers: { Authorization: "Bearer " + token }
                }
            )
            // console.log(allreqData)
            setAllData(allreqData.data)
            setFilterCmsReq(allreqData.data)

            const array0 = allreqData.data
            setCountAll(array0.length)
            const array1 = allreqData.data.filter(data => data?.step_name?.includes('รับคำขอจ้าง') && data?.od_cancel_by == null)
            setCountWait(array1.length)
            const array3 = allreqData.data.filter(data => data?.od_cancel_by != null)
            setCountCancel(array3.length)
            const array4 = allreqData.data.filter(data => data?.finished_at != null)
            setCountFinish(array4.length)
            const array5 = allreqData.data.filter(data => data?.finished_at != null && data?.od_cancel_by != null)
            setCountAccepted(array5.length)
        }

        getData()
    }, [])

    useEffect(() => {
        if (filterCmsReq) {
            const newStartIndex = (activePage - 1) * itemsPerPage;
            const newEndIndex = newStartIndex + itemsPerPage;
            setFilterCmsReq(filterCmsReq.slice(newStartIndex, newEndIndex))

            setStartIndex(newStartIndex);
            setEndIndex(newEndIndex);
            // setFilterCmsReq(allData);
            console.log(activePage, newStartIndex, newEndIndex)
        }
    }, [activePage]);

    //กรองวันที่
    useEffect(() => {
        var dateDuration;
        if (allData) {
            if (dateSelected == "ทั้งหมด") {
                dateDuration = allData
            } else if (dateSelected == "วันนี้") {
                dateDuration = allData.filter(d => isToday(new Date(d.ordered_at)))
            } else if (dateSelected == "สัปดาห์นี้") {
                dateDuration = allData.filter(d => isThisWeek(new Date(d.ordered_at)))
            } else if (dateSelected == "เดือนนี้") {
                dateDuration = allData.filter(d => isThisMonth(new Date(d.ordered_at)))
            } else if (dateSelected == "ปีนี้") {
                dateDuration = allData.filter(d => isThisYear(new Date(d.ordered_at)))
            }
            // setFilterCmsReq(dateDuration)
            sortAllData(dateDuration)
        }
    }, [dateSelected])

    useEffect(() => {
        sortAllData(filterCmsReq)
    }, [sortby])

    //เรียงข้อมูล
    function sortAllData(AllRequest) {
        var sortData;
        if (filterCmsReq) {
            if (sortby == "คิว") {
                //เรียงค่า null ก่อน ให้มันไปอยู่หลังสุด แล้วค่อยเรียงอื่นๆตามมา
                sortData = _.orderBy(AllRequest, [(obj) => obj.od_q_number === null, 'od_q_number', 'ordered_at'], ['asc', 'asc', 'asc']);
            } else if (sortby == "ล่าสุด") {
                sortData = _.orderBy(AllRequest, ['ordered_at'], ['desc']);
            } else if (sortby == "เก่าสุด") {
                sortData = _.orderBy(AllRequest, ['ordered_at'], ['asc']);
            } else if (sortby == "ราคา ↑") {
                sortData = _.orderBy(AllRequest, ['od_price'], ['asc']);
            } else if (sortby == "ราคา ↓") {
                sortData = _.orderBy(AllRequest, ['od_price'], ['desc']);
            }
            setFilterCmsReq(sortData)
        }

    }

    function filterRangeDate(date, dateString) {
        const qq = allData.filter(item => isAfter(new Date(item.ordered_at), new Date(dateString[0])) && isBefore(new Date(item.ordered_at), new Date(dateString[1])))
        //dateString = อาเรย์วันที่
        sortAllData(qq)
        console.log(dateString[0], dateString[1]);
    }

    const [showDetail, setShowDetail] = useState('')

    function openDetail(key) {
        showDetail === key ? setShowDetail('') : setShowDetail(key)
    }

    document.querySelectorAll('.watermarked').forEach(function (el) {
        el.dataset.watermark = (el.dataset.watermark + ' ').repeat(300);
    });


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

    const { RangePicker } = DatePicker;

    function changeMenu(key) {
        // key == "all" && const aa = allReq.filter(menu => menu.step_name == "")
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
            req = allData.filter(menu => menu?.finished_at != null && menu?.od_cancel_by != null && menu?.step_name?.includes('รับคำขอจ้าง'))
        }
        setFilterCmsReq(req)
        if (searchValue) {
            search2(req)
        }
    }

    const [searchQuery, setSearchQuery] = useState()
    const [searchValue, setSearchValue] = useState()

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchValue(query)
        const filtered = filterCmsReq?.filter(
            (item) =>
                String(item.od_id).toLowerCase().includes(query) ||
                String(item.cms_name).toLowerCase().includes(query) ||
                String(item.customer_name).toLowerCase().includes(query)
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


    function formatDate(date) {
        let currentDate = new Date(date)
        if (!Number.isNaN(currentDate.getTime())) {
            currentDate = format(currentDate, 'dd/MM/yyyy HH:mm น.');
            if (isToday(currentDate)) {
                currentDate = format(currentDate, 'วันนี้ HH:mm น.');
            } else if (isYesterday(currentDate)) {
                currentDate = format(currentDate, 'เมื่อวานนี้ HH:mm น.');
            }
        }
        return currentDate;
    }

    const tableData = (data) => {

        if (windowSize != 'small') {

            return data?.map((req, index) => (
                <>
                    <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex} onClick={() => openDetail(index + 1 + startIndex)}>
                        <td>{req.od_q_number ? req.od_q_number : '-'}</td>
                        <td>{req.od_id}</td>
                        <td>{req.cms_name} : {req.pkg_name}</td>
                        <td>{req.od_price}</td>
                        <td>{req.customer_name}</td>
                        <td>
                            {req.od_cancel_by == null && req.finished_at == null && <Badge className='badge-status' count={'รอ' + (req.step_name.includes('ภาพ') ? 'อนุมัติ' + req.step_name : req.step_name)} showZero color="#7E9AFA" />}
                            {req.finished_at != null && <Badge className='badge-status' count='เสร็จสิ้นแล้ว' showZero color={req.od_cancel_by != null ? "#faad14" : "#52c41a"} />}
                            {req.od_cancel_by != null && <Badge className='badge-status' count='ยกเลิกแล้ว' showZero color="gray" />}
                        </td>
                    </tr>
                    {showDetail === index + 1 + startIndex && <tr className="tr-detail">
                        <td colSpan="12">
                            <Flex>
                                <p>ส่งคำขอจ้างเมื่อ : <span>{formatDate(req.ordered_at)}</span></p>
                                <p>ระยะเวลา : <span>{req.pkg_duration} วัน</span></p>
                                <p>กำหนดส่ง : <span>{formatDate(req.od_deadline)}</span></p>
                                <p>แก้ไข(ครั้ง) : <span>{req.od_number_of_edit}</span></p>
                                <p>เสร็จสิ้นเมื่อ : <span>{req.finished_at ? req.finished_at : '-'}</span></p>
                            </Flex>
                        </td>
                    </tr>}
                </>
            ));
        } else {
            return data?.map((req, index) => (
                <>

                    <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex}>
                        <td>
                            <Flex justify="space-between">
                                <p>คิว</p>
                                <p>{req.od_q_number ? req.od_q_number : '-'}</p>
                            </Flex>
                        </td>
                    </tr>
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
                                <p>ผู้จ้าง</p>
                                <p>{req.customer_name}</p>
                            </Flex>
                        </td>
                    </tr>
                    <tr className="order-data-row">
                        <td>
                            <Flex justify="space-between">
                                <p>ความคืบหน้า</p>
                                <p>{req.od_cancel_by == null && req.finished_at == null && <Badge className='badge-status' count={'รอ' + req.step_name} showZero color="#7E9AFA" />}
                                    {req.finished_at != null && <Badge className='badge-status' count='เสร็จสิ้นแล้ว' showZero color={req.od_cancel_by != null ? "#faad14" : "#52c41a"} />}
                                    {req.od_cancel_by != null && <Badge className='badge-status' count='ยกเลิกแล้ว' showZero color="gray" />}</p>
                            </Flex>
                        </td>
                    </tr>

                    <tr className="order-data-row last">
                        <Collapse ghost className="" items={
                            [{
                                key: '1',
                                label: 'ดูเพิ่มเติม',
                                children: <div>
                                    <p>ส่งคำขอจ้างเมื่อ : <span>{formatDate(req.ordered_at)}</span></p>
                                    <p>ระยะเวลา : <span>{req.pkg_duration} วัน</span></p>
                                    <p>กำหนดส่ง : <span>{formatDate(req.od_deadline)}</span></p>
                                    <p>แก้ไข(ครั้ง) : <span>{req.od_number_of_edit}</span></p>
                                    <p>เสร็จสิ้นเมื่อ : <span>{req.finished_at ? req.finished_at : '-'}</span></p>
                                </div>,
                            },]
                        } />
                    </tr>
                </>
            ));
        }
    };

    return (
        <>

            <Helmet>
                {/* <title>{title}</title> */}
            </Helmet>
            {/* <div className="artist-mn-container"> */}
            {/* <Segmented
                size="large"
                options={[
                    {
                        label: 'ภาพรวมระบบ',
                        value: 'List',
                        icon: <ggIcon.GridView />,
                    },
                    {
                        label: 'การรายงาน',
                        value: 'Kanban',
                        icon: <Icon.Flag />,
                    },
                    {
                        label: 'จัดการแอดมิน',
                        value: 'List',
                        icon: '',
                    },
                    {
                        label: 'จัดการผู้ใช้งาน',
                        value: 'Kanban',
                        icon: <Icon.User />,
                    },
                    {
                        label: 'การตรวจสอบรูปภาพ',
                        value: 'List',
                        icon: <Icon.Image />,
                    },
                    {
                        label: 'คำถามที่พบบ่อย',
                        value: 'Kanban',
                        icon: <Icon.HelpCircle />,
                    },
                ]}
                onChange={(value) => {
                    console.log(value); // string
                }}
            /> */}
            <div className="headding">
                <h1 className="h3">รายการคอมมิชชัน</h1>
            </div>
            {/* <div className="artist-mn-card"> */}
            <Tabs defaultActiveKey="1" items={menus} onChange={changeMenu} />
            <Flex justify="space-between" align="center" wrap="wrap">
                <div className="filter" style={{ display: "flex", alignItems: "center", flexWrap: 'wrap' }}>
                    <Flex align="center">
                        <p style={{ whiteSpace: 'nowrap' }}>เรียงตาม : </p>
                        <Select
                            // value={{ value: sortby, label: sortby }}
                            style={{ width: 120 }}
                            // onChange={handlesortbyChange}
                            value={sortby}
                            onChange={setsortby}
                            options={[
                                { value: 'คิว', label: 'คิว' },
                                { value: 'ล่าสุด', label: 'ล่าสุด' },
                                { value: 'เก่าสุด', label: 'เก่าสุด' },
                                { value: 'ราคา ↑', label: 'ราคา ↑' },
                                { value: 'ราคา ↓', label: 'ราคา ↓' },
                            ]}
                        />
                    </Flex>

                    <Flex align="center">
                        <p style={{ whiteSpace: 'nowrap' }}>ระยะเวลา : </p>

                        <Select
                            value={dateSelected}
                            style={{ width: 120 }}
                            onChange={setDateSelected}
                            options={[
                                { value: 'ทั้งหมด', label: 'ทั้งหมด' },
                                { value: 'วันนี้', label: 'วันนี้' },
                                { value: 'สัปดาห์นี้', label: 'สัปดาห์นี้' },
                                { value: 'เดือนนี้', label: 'เดือนนี้' },
                                { value: 'ปีนี้', label: 'ปีนี้' },
                                { value: 'กำหนดเอง', label: 'กำหนดเอง' },

                            ]}
                        />
                    </Flex>
                    {dateSelected == 'กำหนดเอง' &&
                        <RangePicker onChange={filterRangeDate} />}

                </div>
                <div>
                    <Input type="search" placeholder=" ค้นหา..." value={searchValue} onChange={handleSearch} />
                </div>

            </Flex>

            <table className="overview-order-table">
                {windowSize != 'small' && <tr className="table-head">
                    <th className="number">คิว</th>
                    <th>ไอดีออเดอร์</th>
                    <th>คอมมิชชัน:แพ็กเกจ</th>
                    <th>ราคา</th>
                    <th>ผู้จ้าง</th>
                    <th>ความคืบหน้า</th>
                </tr>}

                {searchQuery && searchValue !== '' ? (
                    tableData(searchQuery)
                ) : (
                    tableData(filterCmsReq)
                )}

                {/* {searchQuery && searchValue != '' ?
                    // <ShowData filteredArray={searchQuery} />
                    <>
                        {searchQuery.map((req, index) => {
                            let currentDate = new Date(req.ordered_at)
                            let deadline = new Date(req.od_deadline)

                            if (!Number.isNaN(currentDate.getTime())) {
                                currentDate = format(currentDate, 'dd/MM HH:mm น.');
                                if (isToday(currentDate)) {
                                    currentDate = format(currentDate, 'วันนี้ HH:mm น.');
                                } else if (isYesterday(currentDate)) {
                                    currentDate = format(currentDate, 'เมื่อวานนี้ HH:mm น.');
                                }
                            }

                            if (!Number.isNaN(deadline.getTime())) {
                                deadline = format(deadline, 'dd/MM HH:mm น.');
                                if (isToday(deadline)) {
                                    deadline = format(deadline, 'วันนี้ HH:mm น.');
                                } else if (isYesterday(deadline)) {
                                    deadline = format(deadline, 'เมื่อวานนี้ HH:mm น.');
                                }
                            }

                            return (
                                <>
                                    <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex} onClick={() => openDetail(index + 1 + startIndex)}>
                                        <td>{req.od_q_number}</td>
                                        <td>{req.od_id}</td>
                                        <td>{req.cms_name} : {req.pkg_name}</td>
                                        <td>{req.od_price}</td>
                                        <td>{req.customer_name}</td>
                                        <td>{req.od_cancel_by == null && req.finished_at == null && <Badge className='badge-status' count={'รอ' + req.step_name} showZero color="#7E9AFA" />}
                                            {req.finished_at != null && <Badge className='badge-status' count='เสร็จสิ้นแล้ว' showZero color="#52c41a" />}
                                            {req.od_cancel_by != null && <Badge className='badge-status' count='ยกเลิกแล้ว' showZero color="gray" />}</td>
                                    </tr>
                                    {showDetail === index + 1 + startIndex && <tr className="tr-detail">
                                        <td colSpan="12">
                                            <div>
                                                <p>ส่งคำขอจ้างเมื่อ : <span>{currentDate}</span></p>
                                                <p>ระยะเวลา : <span>{req.pkg_duration} วัน</span></p>
                                                <p>กำหนดส่ง : <span>{deadline}</span></p>
                                                <p>แก้ไข(ครั้ง) : <span>{req.od_number_of_edit}</span></p>
                                                <p>เสร็จสิ้นเมื่อ : <span>{req.finished_at}</span></p>
                                            </div>
                                        </td>
                                    </tr>}
                                </>
                            );
                        })}
                    </>
                    :
                    // <ShowData filteredArray={filterCmsReq} />

                    <>
                        {filterCmsReq && filterCmsReq.map((req, index) => {
                            let currentDate = new Date(req.ordered_at)
                            let deadline = new Date(req.od_deadline)

                            if (!Number.isNaN(currentDate.getTime())) {
                                currentDate = format(currentDate, 'dd/MM HH:mm น.');
                                if (isToday(currentDate)) {
                                    currentDate = format(currentDate, 'วันนี้ HH:mm น.');
                                } else if (isYesterday(currentDate)) {
                                    currentDate = format(currentDate, 'เมื่อวานนี้ HH:mm น.');
                                }
                            }

                            if (!Number.isNaN(deadline.getTime())) {
                                deadline = format(deadline, 'dd/MM HH:mm น.');
                                if (isToday(deadline)) {
                                    deadline = format(deadline, 'วันนี้ HH:mm น.');
                                } else if (isYesterday(deadline)) {
                                    deadline = format(deadline, 'เมื่อวานนี้ HH:mm น.');
                                }
                            }

                            return (
                                <>
                                    <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex} onClick={() => openDetail(index + 1 + startIndex)}>
                                        <td>{req.od_q_number}</td>
                                        <td>{req.od_id}</td>
                                        <td>{req.cms_name} : {req.pkg_name}</td>
                                        <td>{req.od_price}</td>
                                        <td>{req.customer_name}</td>
                                        <td>{req.od_cancel_by == null && req.finished_at == null && <Badge className='badge-status' count={'รอ' + req.step_name} showZero color="#7E9AFA" />}
                                            {req.finished_at != null && <Badge className='badge-status' count='เสร็จสิ้นแล้ว' showZero color="#52c41a" />}
                                            {req.od_cancel_by != null && <Badge className='badge-status' count='ยกเลิกแล้ว' showZero color="gray" />}</td>
                                    </tr>
                                    {showDetail === index + 1 + startIndex && <tr className="tr-detail">
                                        <td colSpan="12">
                                            <div>
                                                <p>ส่งคำขอจ้างเมื่อ : <span>{currentDate}</span></p>
                                                <p>ระยะเวลา : <span>{req.pkg_duration} วัน</span></p>
                                                <p>กำหนดส่ง : <span>{deadline}</span></p>
                                                <p>แก้ไข(ครั้ง) : <span>{req.od_number_of_edit}</span></p>
                                                <p>เสร็จสิ้นเมื่อ : <span>{req.finished_at}</span></p>
                                            </div>
                                        </td>
                                    </tr>}
                                </>
                            );
                        })}
                    </>
                } */}
            </table>

            {/* {searchQuery ?
                    <Table
                        showSizeChanger={false}
                        columns={[
                            {
                                title: 'คิว',
                                dataIndex: 'q',
                                key: 'q',
                            },
                            {
                                title: 'ไอดีออเดอร์',
                                dataIndex: 'od_id',
                                key: 'od_id',
                            },
                            {
                                title: 'คอมมิชชัน:แพ็กเกจ',
                                dataIndex: 'cms_name',
                                key: 'cma_name',
                            },
                            {
                                title: 'ราคา',
                                dataIndex: 'od_price',
                                key: 'od_price',
                            },
                            {
                                title: 'ผู้จ้าง',
                                dataIndex: 'customer_name',
                                key: 'customer_name',
                            },
                            {
                                title: 'ความคืบหน้า',
                                dataIndex: 'step_name',
                                key: 'step_name',
                            },
                        ]}
                        dataSource={searchQuery?.map((req, index) => {
                            var currentDate = req.ordered_at;
                            var deadline;

                            if (!Number.isNaN(new Date(req.ordered_at).getTime())) {
                                currentDate = format(new Date(req.ordered_at), 'dd/MM HH:mm น.');
                                if (isToday(new Date(req.ordered_at))) {
                                    currentDate = format(new Date(req.ordered_at), 'วันนี้ HH:mm น.');
                                } else if (isYesterday(new Date(req.ordered_at))) {
                                    currentDate = format(new Date(req.ordered_at), 'เมื่อวานนี้ HH:mm น.');
                                }
                                //ต้องเป็นวันที่รับคำขอจ้าง
                            }

                            return (
                                {
                                    key: req.od_id,
                                    q: req.od_q_number,
                                    od_id: req.od_id,
                                    cms_name: req.cms_name + ":" + req.pkg_name,
                                    od_price: req.od_price,
                                    customer_name: req.customer_name,
                                    step_name: req.step_name == undefined ? "-" : req.step_name,
                                }
                            )
                        })}
                    />

                    :

                    <Table
                        showSizeChanger={false}
                        columns={[
                            {
                                title: 'คิว',
                                dataIndex: 'q',
                                key: 'q',
                            },
                            {
                                title: 'ไอดีออเดอร์',
                                dataIndex: 'od_id',
                                key: 'od_id',
                            },
                            {
                                title: 'คอมมิชชัน:แพ็กเกจ',
                                dataIndex: 'cms_name',
                                key: 'cma_name',
                            },
                            {
                                title: 'ราคา',
                                dataIndex: 'od_price',
                                key: 'od_price',
                            },
                            {
                                title: 'ผู้จ้าง',
                                dataIndex: 'customer_name',
                                key: 'customer_name',
                            },
                            {
                                title: 'ความคืบหน้า',
                                dataIndex: 'step_name',
                                key: 'step_name',
                            },
                        ]}
                        dataSource={filterCmsReq?.map((req, index) => {
                            var currentDate = req.ordered_at;
                            var deadline;

                            if (!Number.isNaN(new Date(req.ordered_at).getTime())) {
                                currentDate = format(new Date(req.ordered_at), 'dd/MM HH:mm น.');
                                let raw_deadline = addDays(new Date(req.ordered_at), req.pkg_duration)
                                deadline = format(raw_deadline, 'dd/MM HH:mm น.');
                                if (isToday(new Date(req.ordered_at))) {
                                    currentDate = format(new Date(req.ordered_at), 'วันนี้ HH:mm น.');
                                    let raw_deadline = addDays(new Date(req.ordered_at), req.pkg_duration)
                                    deadline = format(raw_deadline, 'วันนี้ HH:mm น.');
                                } else if (isYesterday(new Date(req.ordered_at))) {
                                    currentDate = format(new Date(req.ordered_at), 'เมื่อวานนี้ HH:mm น.');
                                    let raw_deadline = addDays(new Date(req.ordered_at), req.pkg_duration)
                                    deadline = format(raw_deadline, 'เมื่อวานนี้ HH:mm น.');
                                }
                                //ต้องเป็นวันที่รับคำขอจ้าง
                            }

                            return (
                                {
                                    key: req.od_id,
                                    q: req.od_q_number,
                                    od_id: req.od_id,
                                    cms_name: req.cms_name + ":" + req.pkg_name,
                                    od_price: req.od_price,
                                    customer_name: req.customer_name,
                                    step_name: req.step_name == undefined ? "-" : req.step_name,
                                }
                            )
                        })}
                    />


                } */}

            {/* <Pagination hideOnSinglePage
                layout={layout}
                size='md'
                prev={true}
                next={true}
                first={true}
                last={true}
                ellipsis={true}
                boundaryLinks={true}
                total={filterCmsReq == undefined ? 0 : filterCmsReq.length}
                limit={itemsPerPage}
                maxButtons={5}
                activePage={activePage}
                onChangePage={setActivePage}
            /> */}

            <Pagination hideOnSinglePage
                className="mt-4"
                total={filterCmsReq == undefined ? 0 : filterCmsReq.length}
                showQuickJumper
                showTotal={(total) => `จำนวน ${total} รายการ`}
                defaultPageSize={10}
                current={activePage}
                responsive
                onChange={setActivePage}
            />
            {/* </div> */}

            {/* </div> */}
        </>

    )
}


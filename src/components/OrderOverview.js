

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
import { Pagination, Input, Select, Space, Tabs, Flex, DatePicker } from 'antd';
import axios from "axios";
import { host } from "../utils/api";
import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear, addDays, isAfter, isBefore } from 'date-fns';
// import { sortBy, orderBy } from 'lodash';
import _ from 'lodash';




export default function OrderOverview() {
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


    // const dataa = [
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
    // const [dataToShow, setDataToShow] = useState(filterCmsReq.slice(startIndex, endIndex))

    useEffect(() => {
        const getData = async () => {
            const allreqData = await axios.post(
                `${host}/getcmsreq`,
                {
                    urs_id: 33
                }
            )
            console.log(allreqData)
            setAllData(allreqData.data)
            setFilterCmsReq(allreqData.data)
        }
        getData()
    }, [])

    useEffect(() => {
        if (filterCmsReq) {
            const newStartIndex = (activePage - 1) * itemsPerPage;
            const newEndIndex = newStartIndex + itemsPerPage-1;
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
                dateDuration = allData.filter(d => isToday(d.ordered_at))
            } else if (dateSelected == "สัปดาห์นี้") {
                dateDuration = allData.filter(d => isThisWeek(d.ordered_at))
            } else if (dateSelected == "เดือนนี้") {
                dateDuration = allData.filter(d => isThisMonth(d.ordered_at))
            } else if (dateSelected == "6เดือนนี้") {
            } else if (dateSelected == "ปีนี้") {
                dateDuration = allData.filter(d => isThisYear(d.ordered_at))
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
        const qq = allData.filter(item => isAfter(item.ordered_at, dateString[0]) && isBefore(item.ordered_at, dateString[1]))
        //dateString = อาเรย์วันที่
        sortAllData(qq)
        // console.log(qq);
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

    const { RangePicker } = DatePicker;

    function changeMenu(key) {
        // key == "all" && const aa = allReq.filter(menu => menu.step_name == "")
        var req;
        if (key == 'all') {
            req = allData
        } else if (key == 'wait') {
            req = allData.filter(menu => menu.step_name == "รับคำขอจ้าง")
        } else if (key == 'accepted') {
            req = allData.filter(menu => !menu.step_name?.includes('คำขอจ้าง') || !menu.step_name?.includes('แอดมินอนุมัติ'))
        } else if (key == 'cencel') {
            req = allData.filter(menu => menu.od_cancel_by !== null)
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
        const filtered = filterCmsReq.filter(
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

    return (
        <>

            <Helmet>
                {/* <title>{title}</title> */}
            </Helmet>
            {/* <div className="artist-mn-container"> */}
            <div className="headding">
                <h1 className="h3">รายการคอมมิชชัน</h1>
            </div>
            {/* <div className="artist-mn-card"> */}
            <Tabs defaultActiveKey="1" items={menus} onChange={changeMenu} />
            <Flex justify="space-between" align="center" wrap="wrap">
                <div className="filter" style={{ display: "flex", alignItems: "center" }}>
                    เรียงตาม :
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

                    ระยะเวลา :
                    <Select
                        value={dateSelected}
                        style={{ width: 120 }}
                        onChange={setDateSelected}
                        options={[
                            { value: 'ทั้งหมด', label: 'ทั้งหมด' },
                            { value: 'วันนี้', label: 'วันนี้' },
                            { value: 'สัปดาห์นี้', label: 'สัปดาห์นี้' },
                            { value: 'เดือนนี้', label: 'เดือนนี้' },
                            { value: '6 เดือน', label: '6 เดือน' },
                            { value: 'ปีนี้', label: 'ปีนี้' },
                            { value: 'กำหนดเอง', label: 'กำหนดเอง' },

                        ]}
                    />
                    {dateSelected == 'กำหนดเอง' &&
                        <RangePicker onChange={filterRangeDate} />}

                </div>
                <div>
                    <Input type="search" placeholder=" ค้นหา..." value={searchValue} onChange={handleSearch} />
                </div>

            </Flex>
            <Scrollbars>



                <table className="overview-order-table">
                    <tr className="table-head">
                        <th className="number">คิว</th>
                        {/* <th className="q">คิวที่</th> */}
                        <th>ไอดีออเดอร์</th>
                        <th>คอมมิชชัน:แพ็คเกจ</th>
                        {/* <th>ระยะเวลา(วัน)</th> */}
                        {/* <th>เวลาที่เหลือ<Icon.Info /></th> */}
                        <th>ราคาคมช.</th>
                        {/* <th>แก้ไข(ครั้ง)</th> */}
                        {/* <th>ราคาแก้ไข(บาท)</th> */}
                        {/* <th>รวม(บาท)</th> */}
                        <th>ผู้จ้าง</th>
                        <th>ความคืบหน้า</th>
                    </tr>

                    {/* {filterCmsReq && filterCmsReq.map((req, index) => {
                        var currentDate;
                        var deadline;

                        if (!Number.isNaN(new Date(req.ordered_at).getTime())) {
                            currentDate = format(req.ordered_at, 'dd/MM HH:mm น.');
                            let raw_deadline = addDays(req.ordered_at, 10)
                            deadline = format(raw_deadline, 'dd/MM HH:mm น.');
                            if (isToday(req.ordered_at)) {
                                currentDate = format(req.ordered_at, 'วันนี้ HH:mm น.');
                                let raw_deadline = addDays(req.ordered_at, 10)
                                deadline = format(raw_deadline, 'วันนี้ HH:mm น.');

                            } else if (isYesterday(req.ordered_at)) {
                                currentDate = format(req.ordered_at, 'เมื่อวานนี้ HH:mm น.');
                                let raw_deadline = addDays(req.ordered_at, 10)
                                deadline = format(raw_deadline, 'เมื่อวานนี้ HH:mm น.');
                            }
                            //ต้องเป็นวันที่รับคำขอจ้าง
                        }

                        return (
                            <>
                                <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex} onClick={() => openDetail(index + 1 + startIndex)}>
                                    <td>{req.od_q_number}</td>
                                    <td>{req.od_id}</td>
                                    <td>{req.cms_name} : {req.pkg_name}</td>
                                    <td>{req.od_price}</td>
                                    <td>{req.customer_name}</td>
                                    <td>{req.step_name == undefined ? "-" : req.step_name}</td>
                                </tr>
                                {showDetail === index + 1 + startIndex && <tr className="tr-detail">
                                    <td colSpan="12">
                                        <div>
                                            <p>วันที่ส่งคำขอจ้างส่งคำขอจ้าง : <span>{currentDate}</span></p>
                                            <p>ระยะเวลา : <span>{req.pkg_duration} วัน</span></p>
                                            <p>กำหนดส่ง : <span>{deadline}</span></p>
                                            <p>แก้ไข(ครั้ง) : <span>{req.od_number_of_edit}</span></p>
                                            <p>ราคาแก้ไข : <span>{req.od_edit_amount_price}</span></p>
                                            <p>รวมราคา : <span>{req.od_edit_amount_price + req.od_price}</span></p>
                                        </div>
                                    </td>
                                </tr>}
                            </>
                        );
                    })} */}

                    
                    {searchQuery ?
                        // <ShowData filteredArray={searchQuery} />
                        <>
                            {searchQuery.map((req, index) => {
                        var currentDate;
                        var deadline;

                        if (!Number.isNaN(new Date(req.ordered_at).getTime())) {
                            currentDate = format(req.ordered_at, 'dd/MM HH:mm น.');
                            let raw_deadline = addDays(req.ordered_at, 10)
                            deadline = format(raw_deadline, 'dd/MM HH:mm น.');
                            if (isToday(req.ordered_at)) {
                                currentDate = format(req.ordered_at, 'วันนี้ HH:mm น.');
                                let raw_deadline = addDays(req.ordered_at, 10)
                                deadline = format(raw_deadline, 'วันนี้ HH:mm น.');

                            } else if (isYesterday(req.ordered_at)) {
                                currentDate = format(req.ordered_at, 'เมื่อวานนี้ HH:mm น.');
                                let raw_deadline = addDays(req.ordered_at, 10)
                                deadline = format(raw_deadline, 'เมื่อวานนี้ HH:mm น.');
                            }
                            //ต้องเป็นวันที่รับคำขอจ้าง
                        }

                        return (
                            <>
                                <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex} onClick={() => openDetail(index + 1 + startIndex)}>
                                    <td>{req.od_q_number}</td>
                                    <td>{req.od_id}</td>
                                    <td>{req.cms_name} : {req.pkg_name}</td>
                                    <td>{req.od_price}</td>
                                    <td>{req.customer_name}</td>
                                    <td>{req.step_name == undefined ? "-" : req.step_name}</td>
                                </tr>
                                {showDetail === index + 1 + startIndex && <tr className="tr-detail">
                                    <td colSpan="12">
                                        <div>
                                            <p>วันที่ส่งคำขอจ้างส่งคำขอจ้าง : <span>{currentDate}</span></p>
                                            <p>ระยะเวลา : <span>{req.pkg_duration} วัน</span></p>
                                            <p>กำหนดส่ง : <span>{deadline}</span></p>
                                            <p>แก้ไข(ครั้ง) : <span>{req.od_number_of_edit}</span></p>
                                            <p>ราคาแก้ไข : <span>{req.od_edit_amount_price}</span></p>
                                            <p>รวมราคา : <span>{req.od_edit_amount_price + req.od_price}</span></p>
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
                                var currentDate;
                                var deadline;

                                if (!Number.isNaN(new Date(req.ordered_at).getTime())) {
                                    currentDate = format(req.ordered_at, 'dd/MM HH:mm น.');
                                    let raw_deadline = addDays(req.ordered_at, 10)
                                    deadline = format(raw_deadline, 'dd/MM HH:mm น.');
                                    if (isToday(req.ordered_at)) {
                                        currentDate = format(req.ordered_at, 'วันนี้ HH:mm น.');
                                        let raw_deadline = addDays(req.ordered_at, 10)
                                        deadline = format(raw_deadline, 'วันนี้ HH:mm น.');

                                    } else if (isYesterday(req.ordered_at)) {
                                        currentDate = format(req.ordered_at, 'เมื่อวานนี้ HH:mm น.');
                                        let raw_deadline = addDays(req.ordered_at, 10)
                                        deadline = format(raw_deadline, 'เมื่อวานนี้ HH:mm น.');
                                    }
                                    //ต้องเป็นวันที่รับคำขอจ้าง
                                }

                                return (
                                    <>
                                        <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex} onClick={() => openDetail(index + 1 + startIndex)}>
                                            <td>{req.od_q_number}</td>
                                            <td>{req.od_id}</td>
                                            <td>{req.cms_name} : {req.pkg_name}</td>
                                            <td>{req.od_price}</td>
                                            <td>{req.customer_name}</td>
                                            <td>{req.step_name == undefined ? "-" : req.step_name}</td>
                                        </tr>
                                        {showDetail === index + 1 + startIndex && <tr className="tr-detail">
                                            <td colSpan="12">
                                                <div>
                                                    <p>วันที่ส่งคำขอจ้างส่งคำขอจ้าง : <span>{currentDate}</span></p>
                                                    <p>ระยะเวลา : <span>{req.pkg_duration} วัน</span></p>
                                                    <p>กำหนดส่ง : <span>{deadline}</span></p>
                                                    <p>แก้ไข(ครั้ง) : <span>{req.od_number_of_edit}</span></p>
                                                    <p>ราคาแก้ไข : <span>{req.od_edit_amount_price}</span></p>
                                                    <p>รวมราคา : <span>{req.od_edit_amount_price + req.od_price}</span></p>
                                                </div>
                                            </td>
                                        </tr>}
                                    </>
                                );
                            })}
                        </>
                    }



                </table>




            </Scrollbars>
            {/* <Pagination
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

            <Pagination
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



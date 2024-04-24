import * as Icon from "react-feather";
// import UserBox from "../components/UserBox";
// import ReportItem from "../components/ReportItem";
import _ from "lodash";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Input,
  Select,
  Space,
  Upload,
  Empty,
  Flex,
  Tabs,
  Card,
  Form,
  Badge,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import ReportItem from "../../components/ReportItem";
import ImgSlide from "../../components/ImgSlide";
import {
  CloseOutlined,
  LeftOutlined,
  HomeOutlined,
  UserOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as alertData from "../../alertdata/alertData";
import axios from "axios";
import * as ggIcon from "@mui/icons-material";
import { Helmet } from "react-helmet";
import { useAuth } from "../../context/AuthContext";
import { host } from "../../utils/api";
import {
  isSameDay,
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
} from "date-fns";

const title = "รายงาน";

export default function Report(props) {
  // const history = useHistory();
  const navigate = useNavigate();
  const type = localStorage.getItem("type");
  const jwt_token = localStorage.getItem("token");
  const { admindata, isLoggedIn, socket } = useAuth();

  const { reportid } = useParams();

  const [reportOrder, setReportOrder] = useState(false);

  const [reportAll, setReportAll] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);

  const [reportDetail, setReportDetail] = useState([]);
  const [relatedTo, setRelatedTo] = useState([]);

  const [artistDetail, setArtistDetail] = useState([]);
  const [workDetail, setWorkDetail] = useState([]);

  const [imgDetail, setImgDetail] = useState([]);
  const [work_type, setType] = useState("");

  const time = workDetail.created_at;
  const date = new Date(time);
  const thaiDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543
    }`;

  useEffect(() => {
    if (jwt_token && type === "admin") {
      getReport();
      if (reportid != undefined) {
        getReportDetail();
      }
    } else {
      navigate("/login");
    }
  }, [reportid]);

  // useEffect(() => {
  //   setFilteredUser(reportAll);
  // }, [reportAll])

  const [countAll, setCountAll] = useState(0);
  const [countKept, setCountKept] = useState(0);
  const [countDeleted, setCountDeleted] = useState(0);

  const getReport = async () => {
    await axios
      .get(`${host}/allreport`, {
        headers: {
          Authorization: "Bearer " + jwt_token,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          const array0 = data.results.filter(data => data?.status == null || data?.status == undefined)
          setFilteredUser(array0)

          setCountAll(array0.length == 0 ? '0' : array0.length) //เช็คสเตตัสที่ว่างเปล่า
          const array1 = data.results.filter(data => data?.status?.includes('ap'))
          setCountKept(array1.length == 0 ? '0' : array1.length) //เช็คสเตตัสที่กดเก็บ
          const array3 = data.results.filter(data => data?.status?.includes('de'))
          setCountDeleted(array3.length == 0 ? '0' : array3.length) //เช็คสเตตัสที่ลบแล้ว
          setReportAll(data.results);

        }
      });
  };

  const getReportDetail = () => {
    axios.get(`${host}/report/detail/${reportid}`).then((response) => {
      const data = response.data;
      if (data.type == "ออเดอร์") {
        setReportOrder(true);
      } else {
        setReportOrder(false);
        setRelatedTo(data.relatedTo);
      }
      setReportDetail(data.reportDetail[0]);
      setArtistDetail(data.data.artist);
      setWorkDetail(data.data.work);
      setImgDetail(data.data.images);
      setType(data.type);
    });
  };

  const [deleteModal, setDeleteModal] = useState(false);

  function openDelModal() {
    setDeleteModal(!deleteModal);
  }

  function keep() {
    Swal.fire({
      title: `เก็บไว้หรือไม่`,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      icon: "question",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .post(`${host}/report/approve/${reportid}`)
          .then((response) => {
            const data = response.data;
            if (data.status === "ok") {
              Swal.fire({
                icon: "success",
                title: "เก็บแล้ว",
                timer: 1500,
                showConfirmButton: false,
              }).then(() => {
                window.location.href = "/admin/adminmanage/report";
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด กรุณาลองใหม่",
                timer: 1500,
                showConfirmButton: false,
              }).then(() => {
                window.location.reload(false);
              });
            }
          });
      }
    });
  }

  const [form] = Form.useForm();

  function deleteReport(values) {
    const postData = {
      reason: values["reason"],
    };
    Swal.fire({
      title: `ต้องการลบหรือไม่`,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      icon: "question",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .post(`${host}/report/delete/${reportid}`, postData, {
            headers: { Authorization: "Bearer " + jwt_token },
          })
          .then((response) => {
            const data = response.data;
            if (data.status === "ok") {
              let message = ``;
              if (work_type == "ออเดอร์") {
                message = `คอมมิชชันของคุณถูกลบโดยแอดมิน เนื่องจากถูกราย ${work_type} ว่าเป็น ${reportDetail.sendrp_header}`;
              } else {
                message = `${work_type} ของคุณถูกลบโดยแอดมิน เนื่องจากถูกรายงานว่าเป็น ${reportDetail.sendrp_header}`;
              }

              // การแจ้งเตือนเจ้าของ cms หรือ artwork หริอ order
              const deleteWork = {
                sender_id: 0,
                sender_name: admindata.admin_name,
                sender_img: admindata.admin_profile,
                receiver_id: artistDetail.artistId,
                work_id: workDetail.id,
                msg: message,
              };

              socket.emit("workhasdeletedByadmin", deleteWork);

              // บันทึก notification
              axios.post(`${host}/admin/delete/work/noti`, deleteWork);

              Swal.fire({
                icon: "success",
                title: "ลบแล้ว",
                timer: 1500,
                showConfirmButton: false,
              }).then(() => {
                window.location.href = "/admin/adminmanage/report";
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด กรุณาลองใหม่",
                timer: 1500,
                showConfirmButton: false,
              }).then(() => {
                window.location.reload(false);
              });
            }
          });
      }
    });
  }

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchValue(query);
    const filtered = filteredUser.filter(
      (item) =>
        item.reporter_name.toLowerCase().includes(query) ||
        item.reported_name.toLowerCase().includes(query) ||
        item.sendrp_header.toLowerCase().includes(query) ||
        item.text.toLowerCase().includes(query)
    );
    setSearchQuery(filtered);
    // setFilteredUser(filtered);
  };

  const menus = [
    {
      key: "wait",
      label: (
        <>
          <span>รอดำเนินการ </span>
          <Badge count={countAll} showZero color="#faad14" />
        </>
      ),
      children: "",
    },
    {
      key: "kept",
      label: (
        <>
          <span>เก็บไว้แล้ว </span>
          <Badge count={countKept} showZero color="#faad14" />
        </>
      ),
      children: "",
    },
    {
      key: "deleted",
      label: (
        <>
          <span>ลบแล้ว </span>
          <Badge count={countDeleted} showZero color="#faad14" />
        </>
      ),
      children: "",
    },
  ];

  //--------------------------
  const [sortby, setsortby] = useState("ล่าสุด");

  const [activePage, setActivePage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(9);
  const itemsPerPage = 10;
  const [typeValues, setTypeValues] = useState([
    "Artwork",
    "Commission",
    "Order",
  ]);

  useEffect(() => {
    if (filteredUser) {
      //หน้าเพจ - 1 = index 0 * จำนวนแสดงต่อหน้า 0-9 10-19 20-29
      const newStartIndex = (activePage - 1) * itemsPerPage;
      //เอาจำนวนที่เริ่ม + จำนวนที่แสดง (0+10 = 10) จะเป็น index 0-10

      const newEndIndex = newStartIndex + itemsPerPage;
      //index เริ่มและ index สุดท้าย
      setFilteredUser(filteredUser.slice(newStartIndex, newEndIndex));
      setStartIndex(newStartIndex);
      setEndIndex(newEndIndex);
      // setFilterCmsReq(allData);
      // console.log(activePage, newStartIndex, newEndIndex)
    }
  }, [activePage]);

  const nowKey = useRef("wait");

  function changeMenu(key) {
    // setNowKey(key)
    nowKey.current = key;
    let rep;
    if (key == "wait") {
      rep = reportAll.filter(
        (data) => data?.status == null || data?.status == undefined
      );
    } else if (key == "kept") {
      rep = reportAll.filter((data) => data?.status?.includes("ap"));
    } else if (key == "deleted") {
      rep = reportAll.filter((data) => data?.status?.includes("de"));
    }
    setFilteredUser(rep);
    filterType(rep); //กรองตามประเภท

    if (searchValue) {
      search2(filteredUser);
    }
  }

  useEffect(() => {
    sortAllData();
  }, [sortby]);

  useEffect(() => {
    filterType(reportAll);
    // filterMenu(nowKey)
  }, [typeValues]);

  function sortAllData() {
    let sortData;
    if (filteredUser) {
      if (sortby == "ล่าสุด") {
        sortData = _.orderBy(filteredUser, ["created_at"], ["desc"]);
      } else if (sortby == "เก่าสุด") {
        sortData = _.orderBy(filteredUser, ["created_at"], ["asc"]);
      }
      setFilteredUser(sortData);
      // setReportAll(sortData)
    }
    if (reportAll) {
      if (sortby == "ล่าสุด") {
        sortData = _.orderBy(reportAll, ["created_at"], ["desc"]);
      } else if (sortby == "เก่าสุด") {
        sortData = _.orderBy(reportAll, ["created_at"], ["asc"]);
      }
      setReportAll(sortData);
      // setReportAll(sortData)
    }
    if (searchQuery) {
      if (sortby == "ล่าสุด") {
        sortData = _.orderBy(searchQuery, ["created_at"], ["desc"]);
      } else if (sortby == "เก่าสุด") {
        sortData = _.orderBy(searchQuery, ["created_at"], ["asc"]);
      }
      setSearchQuery(sortData);
    }
  }

  function changeType(value) {
    setTypeValues(value);
  }

  function filterType(arr) {
    const filteredData = arr.filter((data) => typeValues.includes(data.text));

    let rep;
    if (nowKey.current == "wait") {
      rep = filteredData.filter(
        (data) => data?.status == null || data?.status == undefined
      );
    } else if (nowKey.current == "kept") {
      rep = filteredData.filter((data) => data?.status?.includes("ap"));
    } else if (nowKey.current == "deleted") {
      rep = filteredData.filter((data) => data?.status?.includes("de"));
    }

    setFilteredUser(rep);
    // console.log(filteredData)
    // console.log(nowKey.current)
  }

  const [searchQuery, setSearchQuery] = useState();
  const [searchValue, setSearchValue] = useState();

  // const handleSearch = (event) => {
  //   const query = event.target.value.toLowerCase();
  //   setSearchValue(query)
  //   const filtered = filteredUser.filter(
  //     (item) =>
  //       item.reporter_name.toLowerCase().includes(query) ||
  //       item.reported_name.toLowerCase().includes(query) ||
  //       item.sendrp_header.toLowerCase().includes(query) ||
  //       item.sendrp_detail.toLowerCase().includes(query) ||
  //       item.text.toLowerCase().includes(query)
  //   );
  //   setSearchQuery(filtered);
  //   // setFilteredUser(filtered);
  // };

  function search2(rep) {
    const filtered = rep.filter(
      (item) =>
        item.reporter_name.toLowerCase().includes(searchValue) ||
        item.reported_name.toLowerCase().includes(searchValue) ||
        item.sendrp_header.toLowerCase().includes(searchValue) ||
        item.text.toLowerCase().includes(searchValue)
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
          <td>{index + 1}</td>
          <td>{req.reporter_name} : {req.pkg_name}</td>
          <td>{req.reported_name}</td>
          <td>{req.sendrp_header}</td>
          <td><Badge
            count={data.text}
            color={
              data?.text?.includes("work")
                ? "#faad14"
                : data?.text?.includes("mission")
                  ? "#52c41a"
                  : "#FF8716"
            }
          /></td>
          <td>{formatDate(data.created_at)}</td>
          <td>
            <Button shape="round">
              <Link
                to={`/admin/adminmanage/report/${data.sendrp_id}`}
              >
                จัดการ
              </Link>
            </Button>
          </td>

        </tr>
      ));
    } else {
      return data?.map((req, index) => (
        <>
          <tr className="order-data-row" key={index + 1 + startIndex} id={index + 1 + startIndex}>
            <td>
              <Flex justify="space-between">
                <p>ลำดับ</p>
                <p>{index + 1}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row">
            <td>
              <Flex justify="space-between">
                <p>ผู้รายงาน</p>
                <p>{req.reporter_name}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row">
            <td>
              <Flex justify="space-between">
                <p>ผู้ถูกรายงาน</p>
                <p>{req.reported_name}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row">
            <td>
              <Flex justify="space-between">
                <p>หัวข้อ</p>
                <p>{req.sendrp_header}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row">
            <td>
              <Flex justify="space-between">
                <p>ประเภท</p>
                <Badge
                  count={req.artist_name}
                  color={
                    data.text.includes("work")
                      ? "#faad14"
                      : data.text.includes("mission")
                        ? "#52c41a"
                        : "#FF8716"
                  }
                />
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row">
            <td>
              <Flex justify="space-between">
                <p>เวลา</p>
                <p>{formatDate(data.created_at)}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row last">
            <td>
              <Flex justify="space-between">
                <p>Action</p>
                <Button shape="round">
                  <Link
                    to={`/admin/adminmanage/report/${data.sendrp_id}`}
                  >
                    จัดการ
                  </Link>
                </Button>
              </Flex>
            </td>
          </tr>
        </>
      ));
    }
  };


  function formatDate(currentDate) {
    let formatDate = new Date(currentDate);
    if (!Number.isNaN(formatDate.getTime())) {
      formatDate = format(formatDate, "dd/MM/yyyy HH:mm น.");
      if (isToday(formatDate)) {
        formatDate = format(formatDate, "วันนี้ HH:mm น.");
      } else if (isYesterday(formatDate)) {
        formatDate = format(formatDate, "เมื่อวานนี้ HH:mm น.");
      }
    }
    return formatDate;
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {!reportid ? (
        <>
          <h1 className="h3">การรายงาน</h1>
          <Tabs defaultActiveKey="1" items={menus} onChange={changeMenu} />

          <div className="all-user-head">
            {/* <h2 className="h4">จำนวนทั้งหมด ({reportAll.length})</h2> */}
            <div className="submenu-filter">

              <Flex align="center">
                เรียงตาม :
                <Select
                  // value={{ value: sortBy, label: sortBy }}
                  style={{ width: 120 }}
                  // onChange={handleSortByChange}
                  value={sortby}
                  onChange={setsortby}
                  options={[
                    { value: 'ล่าสุด', label: 'ล่าสุด' },
                    { value: 'เก่าสุด', label: 'เก่าสุด' },
                  ]}
                />
              </Flex>
              <Flex align="center">
                ประเภท : <Select
                  mode="multiple"
                  style={{ minWidth: '10rem', maxWidth: 'fit-content' }}
                  placeholder="Please select"
                  value={typeValues}
                  id="topicSelector"
                  onChange={changeType}
                  // maxTagCount='responsive'
                  options={[
                    // { value: 'ทั้งหมด', label: 'ทั้งหมด' },
                    { value: 'Artwork', label: 'งานวาด' },
                    { value: 'Commission', label: 'คอมมิชชัน' },
                    { value: 'Order', label: 'ออเดอร์' },
                  ]}
                  allowClear
                >
                  {/* {children} */}
                </Select>
              </Flex>


            </div>
            <div className="search">
              <Input
                type="search"
                onChange={handleSearch}
                placeholder=" ค้นหา..."
              />
            </div>
          </div>

          {/* <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ผู้รายงาน</th>
                <th>ผู้ถูกรายงาน</th>
                <th>หัวข้อ</th>
                <th>ประเภท</th>
                <th>เวลา</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchQuery && searchValue != "" ? (
                <>
                  {searchQuery.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.reporter_name}</td>
                      <td>{data.reported_name}</td>
                      <td>{data.sendrp_header}</td>
                      <td>
                        <Badge
                          count={data.text}
                          color={
                            data.text.includes("work")
                              ? "#faad14"
                              : data.text.includes("mission")
                                ? "#52c41a"
                                : "#FF8716"
                          }
                        />
                      </td>
                      <td>{formatDate(data.created_at)}</td>
                      <td>
                        <Button shape="round">
                          <Link
                            to={`/admin/adminmanage/report/${data.sendrp_id}`}
                          >
                            จัดการ
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {filteredUser.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.reporter_name}</td>
                      <td>{data.reported_name}</td>
                      <td>{data.sendrp_header}</td>
                      <td>
                        <Badge
                          count={data.text}
                          color={
                            data.text.includes("work")
                              ? "#faad14"
                              : data.text.includes("mission")
                                ? "#52c41a"
                                : "#FF8716"
                          }
                        />
                      </td>
                      <td>{formatDate(data.created_at)}</td>
                      <td>
                        <Button shape="round">
                          <Link
                            to={`/admin/adminmanage/report/${data.sendrp_id}`}
                          >
                            จัดการ
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table> */}

          <table className="overview-order-table">
            {windowSize != 'small' &&
              <tr className="table-head">
                <th>ลำดับ</th>
                <th>ผู้รายงาน</th>
                <th>ผู้ถูกรายงาน</th>
                <th>หัวข้อ</th>
                <th>ประเภท</th>
                <th>เวลา</th>
                <th>Action</th>
              </tr>}

            {searchQuery && searchValue != '' ? (
              tableData(searchQuery)
            ) : (
                tableData(filteredUser)
            )}
          </table>

        </>
      ) : (
        <>
          <h1 className="h3">
            <Button
              className="icon-btn"
              size="large"
              type="text"
              icon={<LeftOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigate('/admin/adminmanage/report')
              }}
            ></Button>
            รายละเอียดการรายงาน
          </h1>
          {/* <h5>ชื่อ {workDetail.name}</h5> */}
          <Card className="mb-3 mt-3">
            <div className="cms-artist-box">
              <Link to={`/profile/${artistDetail.artistId}`}>
                <div id="cms-artist-profile">
                  <img src={artistDetail.artistProfile} alt="" />
                  <div>
                    <p>{artistDetail.artistName}</p>
                  </div>
                </div>
              </Link>
              <p id="cms-price">โพสต์เมื่อ {thaiDate}</p>
            </div>
            <ImgSlide imgDetail={imgDetail} />



            <Flex justify="center" gap="small" className="mt-3">
              {!reportDetail.status ?
                <>
                  <Button size="large" shape="round" onClick={keep}>
                    เก็บไว้ {reportDetail.status}
                  </Button>
                  <Button size="large" shape="round" danger onClick={openDelModal}>
                    ลบ
                  </Button>

                </>
                :
                <>
                  <p>{reportDetail.status == 'deleted' ? 'ลบ' : 'เก็บไว้'}แล้ว</p>
                </>

              }
              {/* <Button size="large" shape="round" onClick={keep}>
                เก็บไว้
              </Button>
              <Button size="large" shape="round" danger onClick={openDelModal}>
                ลบ
              </Button> */}
            </Flex>
          </Card>
          <div>
            <Card>
              <div className="report-content">
                <Flex gap="1rem" vertical wrap="wrap">
                  <Link to={`/profile/${reportDetail.id}`}>
                    <div id="cms-artist-profile">
                      <img src={reportDetail.urs_profile_img} alt="" />
                      <p>แจ้งโดย {reportDetail.urs_name}</p>
                    </div>
                  </Link>
                  <div>
                    <p className="h6">
                      หัวข้อที่มีการละเมิด: {reportDetail.sendrp_header}
                    </p>
                  </div>
                  <div>
                    <p className="h6">รายละเอียดที่มีการแจ้ง</p>
                    <p>{reportDetail.sendrp_detail}</p>
                  </div>
                  {reportDetail.sendrp_link != null && (
                    <div>
                      <p className="h6">ลิ้งค์ผลงานที่มีการลงมาก่อน</p>
                      <p>{reportDetail.sendrp_link}</p>
                    </div>
                  )}

                  <div>
                    <p className="h6">อีเมลติดต่อกลับ</p>
                    <p>{reportDetail.urs_email}</p>
                  </div>
                </Flex>
              </div>
            </Card>

            {reportOrder != true ? (<>
              <h5 className="h4 mt-4 mb-4">รายงานที่เกี่ยวข้อง</h5>
              {relatedTo.length != 0 ?


                <div className="report-grid">

                  {relatedTo.map((data) => (
                    <Card key={data.id}>
                      <div className="report-content">
                        <Flex gap="1rem" vertical wrap="wrap">
                          <Link to={`/profile/${data.id}`}>
                            <div id="cms-artist-profile">
                              <img src={data.urs_profile_img} alt="" />
                              <p>แจ้งโดย {data.urs_name}</p>
                            </div>
                          </Link>
                          <div>
                            <p className="h6">หัวข้อที่มีการละเมิด: {data.sendrp_header}</p>
                          </div>
                          <div>
                            <p className="h6">รายละเอียดที่มีการแจ้ง</p>
                            <p>{data.sendrp_detail}</p>
                          </div>
                          {data.sendrp_link != null && (
                            <div>
                              <p className="h6">ลิ้งค์ผลงานที่มีการลงมาก่อน</p>
                              <p>{data.sendrp_link}</p>
                            </div>
                          )}
                          <div>
                            <p className="h6">อีเมลติดต่อกลับ</p>
                            <p>{data.urs_email}</p>
                          </div>

                          {data.status !== null ? (
                            <div>
                              <p className="h6">สถานะ : {data.status === "approve" ? "อนุมัติแล้ว" : (data.status === "deleted" ? "ไม่อนุมัติ" : "ยังไม่ได้ตรวจสอบ")}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="h6">สถานะ : ยังไม่ได้ตรวจสอบ</p>
                            </div>
                          )}

                        </Flex>
                      </div>
                    </Card>
                  ))}



                </div>

                :

                <Flex justify="center" align="center" style={{ width: "100%", height: "fit-content", padding: '5rem 1rem' }}>
                  <Empty description={
                    <span>
                      ไม่มีรายงานที่เกี่ยวข้อง
                    </span>
                  } />
                </Flex>
              }
            </>
            )
              : (<></>)}
          </div>

          <Modal
            title="ระบุเหตุผลการลบ"
            open={deleteModal}
            onCancel={openDelModal}
            footer=""
          >
            <Form form={form} name="delReport" onFinish={deleteReport}>
              <Flex gap="middle" vertical>
                <Form.Item
                  name="reason"
                  label="ใส่เหตุผลการลบ"
                  rules={[
                    { required: true, message: "กรุณากรอกฟิลด์นี้" },
                    { type: "string", max: 100 },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Flex gap="small" justify="flex-end">
                  <Button shape="round" size="large" htmlType="submit" danger>
                    ยืนยัน
                  </Button>
                  <Button shape="round" size="large" onClick={openDelModal}>
                    ยกเลิก
                  </Button>
                </Flex>
              </Flex>
            </Form>
          </Modal>
        </>
      )}
      {/* ในกรณีที่มีการลบโพสต์แล้วรายงานที่เกี่ยวข้องจะขึ้นว่าถูกลบแล้วทั้งหมด */}
    </>
  );
}
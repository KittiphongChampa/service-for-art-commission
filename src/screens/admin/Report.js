import * as Icon from "react-feather";
// import UserBox from "../components/UserBox";
// import ReportItem from "../components/ReportItem";
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
  Card,Form
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

const title = "รายงาน";

export default function Report(props) {
  const navigate = useNavigate();
  const type = localStorage.getItem("type");
  const jwt_token = localStorage.getItem("token");
  const { admindata, isLoggedIn, socket } = useAuth();

  const { reportid } = useParams();

  const [reportAll, setReportAll] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);


  const [reportDetail, setReportDetail] = useState([]);
  const [relatedTo, setRelatedTo] = useState([]);

  const [artistDetail, setArtistDetail] = useState([]);
  const [workDetail, setWorkDetail] = useState([]);
  const [imgDetail, setImgDetail] = useState([]);

  const time = workDetail.created_at;
  const date = new Date(time);
  const thaiDate = `${date.getDate()}/${date.getMonth() + 1}/${
    date.getFullYear() + 543
  }`;

  // console.log(reportDetail);

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

  useEffect(() => {
    setFilteredUser(reportAll);
  }, [reportAll])

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
          setReportAll(data.results);
        }
      });
  };

  const getReportDetail = () => {
    axios.get(`${host}/report/detail/${reportid}`).then((response) => {
      const data = response.data;
      // console.log(data);
      setRelatedTo(data.relatedTo)
      setReportDetail(data.reportDetail[0]);
      setArtistDetail(data.data.artist);
      setWorkDetail(data.data.work);
      setImgDetail(data.data.images);
    });
  };

  const [deleteModal,setDeleteModal] = useState(false)
  
  function openDelModal() {
    setDeleteModal(!deleteModal)
  }

  function keep() {
    Swal.fire({
      title: `เก็บไว้หรือไม่`,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      icon: "question"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.post(`${host}/report/approve/${reportid}`).then((response) => {
          const data = response.data;
          if (data.status === "ok") {
            Swal.fire({
              icon: "success",
              title: "เก็บแล้ว",
              confirmButtonText: 'ตกลง',
            }).then(() => {
              window.location.href = "/admin/adminmanage/report"
            });

          } else {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด กรุณาลองใหม่",
              confirmButtonText: 'ตกลง',
            }).then(() => {
              window.location.reload(false)
            });
          }
        })
        
      }
    })
  }
  
  const [form] = Form.useForm();

  function deleteReport(values) {
    const postData = {
      reason: values['reason'],
    };
    Swal.fire({
      title: `ต้องการลบหรือไม่`,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      icon: "question"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.post(`${host}/report/delete/${reportid}`, postData, {
          headers: {Authorization: "Bearer " + jwt_token}
        }).then((response) => {
          const data = response.data;
          if (data.status === "ok") {
            // การแจ้งเตือนเจ้าของ cms หรือ artwork
            // const deleteWork = {
            //   sender_id: 0,
            //   sender_name: admindata.admin_name,
            //   sender_img: admindata.admin_profile,
            //   receiver_id: artistDetail.artistId,
            //   msg: `งานของคุณถูกลบโดยแอดมิน เนื่องจากถูกรายงานว่าเป็น ${reportDetail.sendrp_header}`
            // };
            // socket.emit('workhasdeletedByadmin', deleteWork);

            // บันทึก notification
            // await axios.post(`${host}/admin/noti/add`, {
            //   reporter: userdata.id,
            //   reported: 0,
            //   reportId: response.data.reportId,
            //   msg: "งานของคุณถูกลบโดยแอดมิน เนื่องจากถูกรายงานว่า"
            // }).then((response) => {
            //   if (response.status === 200) {
            //     Swal.fire({
            //       title: "รายงานสำเร็จ",
            //       icon: "success"
            //     }).then(() => {
            //       window.location.reload(false);
            //     });
            //   } else {
            //     console.log("เกิดข้อผิดพลาดในการบันทึกข้อมูลการแจ้งเตือนของแอดมิน");
            //   }
            // });

            Swal.fire({
              icon: "success",
              title: "ลบแล้ว",
              confirmButtonText: 'ตกลง',
            }).then(() => {
              window.location.href = "/admin/adminmanage/report"
            });

          } else {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด กรุณาลองใหม่",
              confirmButtonText: 'ตกลง',
            }).then(() => {
              window.location.reload(false)
            });
          }
        })
      }
    })
  }

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filtered = reportAll.filter(
      (item) =>
        item.reporter_name.toLowerCase().includes(query) ||
        item.reported_name.toLowerCase().includes(query) ||
        item.sendrp_header.toLowerCase().includes(query) ||
        item.sendrp_detail.toLowerCase().includes(query) ||
        item.text.toLowerCase().includes(query)
    );
    setFilteredUser(filtered);
  };

  const menus = [
    {
      key: 1,
      label:'กำลังดำเนินการ',
      children: ''
    },
    {
      key: 2,
      label: 'เก็บไว้แล้ว',
      children: ''
    },
    {
      key: 3,
      label: 'ลบแล้ว',
      children: ''
    },
  ]

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {!reportid ? (
        <>
          <h1 className="h3">การรายงาน</h1>
          {/* <div className="all-user-head"></div> */}
          <Tabs defaultActiveKey='1' items={menus} />
          {/* <div className="sub-menu-group mt-4">
            <Link to="#" className="sub-menu selected">
              กำลังดำเนินการ
            </Link>
            <Link to="#" className="sub-menu">
              อนุมัติแล้ว
            </Link>
            <Link to="#" className="sub-menu">
              ลบแล้ว
            </Link>
          </div> */}
          {/* <div className="report-item-area"> */}
            {/* <Link to="/admin/adminmanage/report/11"><ReportItem /></Link> */}

            {/* ต้อง map */}
            {/* {reportAll.map((data) => (
              <div key={data.sendrp_id}>
                <Link to={`/admin/adminmanage/report/${data.sendrp_id}`}>
                  <ReportItem
                    type={data.text}
                    sendrp_header={data.sendrp_header}
                    ex_img_path={data.ex_img_path}
                    usr_reporter_id={data.usr_reporter_id}
                    urs_name={data.urs_name}
                    created_at={data.created_at}
                  />
                </Link>
              </div>
            ))} */}
          {/* </div> */}

          <div className="all-user-head">
            <h2 className="h4">จำนวนทั้งหมด ({reportAll.length})</h2>
            <div>
              <Input type="search" onChange={handleSearch} placeholder=" ค้นหา..." />
            </div>
          </div>

          <table className="table is-striped is-fullwidth">
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
              {filteredUser.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data.reporter_name}</td>
                  <td>{data.reported_name}</td>
                  <td>{data.sendrp_header}</td>
                  <td>{data.text}</td>
                  <td>{data.created_at}</td>
                  <td><Link to={`/admin/adminmanage/report/${data.sendrp_id}`}>จัดการ</Link></td>
                </tr>
              ))}
            </tbody>
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
                window.location.href = "/admin/adminmanage/report";
              }}
            ></Button>
            รายงาน {reportid}
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
              <Button size="large" shape="round" onClick={keep}>
                เก็บไว้
              </Button>
              <Button size="large" shape="round" danger onClick={openDelModal}>
                ลบ
              </Button>
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
                    <p>{reportDetail.sendrp_email}</p>
                  </div>
                </Flex>
              </div>
            </Card>
            <h5 className="h4 mt-4 mb-4">รายงานที่เกี่ยวข้อง</h5>
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
                              <p>{data.sendrp_email}</p>
                          </div>

                          {data.status !== null ? (
                            <div>
                                <p className="h6">สถานะ : {data.status === "approve" ? "อนุมัติแล้ว" : (data.status === "delete" ? "ไม่อนุมัติ" : "ยังไม่ได้ตรวจสอบ")}</p>
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
              <Empty description={
                <span>
                  ไม่มีรายงานที่เกี่ยวข้อง
                </span>
              } />
          </div>

          <Modal title="ระบุเหตุผลการลบ" open={deleteModal} onCancel={openDelModal} footer="">
            <Form
              form={form}
              name="delReport"
              onFinish={deleteReport}
            >
              <Flex gap='middle' vertical>
                <Form.Item
                  name="reason"
                  label="ใส่เหตุผลการลบ"
                  rules={[{ required: true, message: "กรุณากรอกฟิลด์นี้" }, { type: 'string', max: 100 }]}
                >
                  <Input />
                </Form.Item>
                <Flex gap='small' justify="flex-end">
                  <Button shape="round" size="large" htmlType="submit" danger>ยืนยัน</Button>
                  <Button shape="round" size="large" onClick={openDelModal}>ยกเลิก</Button>
                </Flex>
            
                </Flex>
              </Form>
            

          </Modal>

          {/* <p className="h6">รายงานที่เกี่ยวข้องกับคอมมิชชันนี้</p>
                    <div className="report-grid">
                        <Card>
                            <div className="report-content">
                                <Flex gap="1rem" vertical wrap="wrap">
                                    <Link to={`/profile/`}>
                                        <div id="cms-artist-profile">
                                            <img src="/AB1.png" alt="" />
                                            <p>แจ้งโดย xxxxx</p>
                                        </div>
                                    </Link>
                                    <div>
                                        <p className="h6">หัวข้อที่มีการละเมิด: sy;-hvpjvp</p>
                                    </div>
                                    <div>
                                        <p className="h6">รายละเอียดที่มีการแจ้ง</p>
                                        <p>เบลๆๆๆๆๆๆลๆๆๆๆๆๆลๆๆๆๆๆๆลๆๆๆๆๆๆลๆๆๆๆๆๆลๆๆๆๆๆๆลๆๆลๆๆๆๆๆๆลๆๆๆๆๆๆลๆๆๆๆๆๆๆๆๆๆลๆๆๆๆๆๆๆ</p>
                                    </div>
                                    <div>
                                        <p className="h6">ลิ้งค์ผลงานที่มีการลงมาก่อน</p>
                                        <p>บลาๆๆ</p>
                                    </div>
                                    <div>
                                        <p className="h6">อีเมลติดต่อกลับ</p>
                                        <p>email.ccccc</p>
                                    </div>
                                    <div>
                                        <p className="h6">คอมมิชชันหรืองานวาดที่ถูกรายงาน</p>
                                        <p>xxxxxxx</p>
                                    </div>
                                </Flex>

                            </div>
                        </Card>
                        <Card>
                            <div className="report-content">
                                <Flex gap="1rem" vertical wrap="wrap" flex={1}>
                                    <Link to={`/profile/`}>
                                        <div id="cms-artist-profile">
                                            <img src="/AB1.png" alt="" />
                                            <p>แจ้งโดย xxxxx</p>
                                        </div>
                                    </Link>
                                    <div>
                                        <p className="h6">หัวข้อที่มีการละเมิด: sy;-hvpjvp</p>
                                    </div>
                                    <div>
                                        <p className="h6">รายละเอียดที่มีการแจ้ง</p>
                                        <p>เบลๆๆๆๆๆๆๆๆๆๆลๆๆๆๆๆๆๆ</p>
                                    </div>
                                    <div>
                                        <p className="h6">ลิ้งค์ผลงานที่มีการลงมาก่อน</p>
                                        <p>บลาๆๆ</p>
                                    </div>
                                    <div>
                                        <p className="h6">อีเมลติดต่อกลับ</p>
                                        <p>email.ccccc</p>
                                    </div>
                                    <div>
                                        <p className="h6">คอมมิชชันหรืองานวาดที่ถูกรายงาน</p>
                                        <p>xxxxxxx</p>
                                    </div>
                                </Flex>

                            </div>
                        </Card>
                        <Card>
                            <div className="report-content">
                                <Flex gap="1rem" vertical wrap="wrap">
                                    <Link to={`/profile/`}>
                                        <div id="cms-artist-profile">
                                            <img src="/AB1.png" alt="" />
                                            <p>แจ้งโดย xxxxx</p>
                                        </div>
                                    </Link>
                                    <div>
                                        <p className="h6">หัวข้อที่มีการละเมิด: sy;-hvpjvp</p>
                                    </div>
                                    <div>
                                        <p className="h6">รายละเอียดที่มีการแจ้ง</p>
                                        <p>เบลๆๆๆๆๆๆลๆๆๆๆๆๆลๆๆๆๆๆๆลๆๆๆๆๆๆลๆๆๆๆๆๆลๆๆๆๆๆๆลๆๆลๆๆๆๆๆๆลๆๆๆๆๆๆลๆๆๆๆๆๆๆๆๆๆลๆๆๆๆๆๆๆ</p>
                                    </div>
                                    <div>
                                        <p className="h6">ลิ้งค์ผลงานที่มีการลงมาก่อน</p>
                                        <p>บลาๆๆ</p>
                                    </div>
                                    <div>
                                        <p className="h6">อีเมลติดต่อกลับ</p>
                                        <p>email.ccccc</p>
                                    </div>
                                    <div>
                                        <p className="h6">คอมมิชชันหรืองานวาดที่ถูกรายงาน</p>
                                        <p>xxxxxxx</p>
                                    </div>
                                </Flex>
                            </div>
                        </Card>
                    </div> */}
        </>
      )}
      {/* ในกรณีที่มีการลบโพสต์แล้วรายงานที่เกี่ยวข้องจะขึ้นว่าถูกลบแล้วทั้งหมด */}
    </>
  );
}


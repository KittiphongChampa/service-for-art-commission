import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import * as Icon from "react-feather";
import { useForm } from "react-hook-form";
// import "../css/indeAttImgInput.css";
// import "../css/recent_index.css";
// import '../styles/index.css';
import "../../styles/main.css";
import "../../css/allbutton.css";
import "../../css/profileimg.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-quill/dist/quill.snow.css';
import { Helmet } from "react-helmet";
import {
  NavbarUser,
  NavbarAdmin,
  NavbarHomepage,
  NavbarGuest,
} from "../../components/Navbar";
import ImgSlide from "../../components/ImgSlide";
import "bootstrap/dist/css/bootstrap.min.css";
import * as ggIcon from "@mui/icons-material";
import Scrollbars from "react-scrollbars-custom";
import TextareaAutosize from "react-textarea-autosize";
import { v4 as uuidv4 } from "uuid";
// import { Alert, Space } from 'antd';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { Radio, Dropdown, Breadcrumb, Flex, Modal, Progress, notification, Button, Upload, Checkbox, Form, Input, Space, Card, Tooltip, Alert, Select, message, InputNumber, Tabs } from "antd";
import { CloseOutlined, MoreOutlined, HomeOutlined, UserOutlined, MinusCircleOutlined } from '@ant-design/icons';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../../context/AuthContext';

import { host } from "../../utils/api";
import { width } from '@mui/system';

const title = 'รายละเอียด cms';
const body = { backgroundColor: "white" }

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });



export default function CmsDetail() {
  const token = localStorage.getItem("token");
  const type = localStorage.getItem("type");
  const navigate = useNavigate();
  const cmsID = useParams();
  const [artistDetail, setArtistDetail] = useState([]);
  const [cmsDetail, setCmsDetail] = useState([]);
  const [imgDetail, setImgDetail] = useState([]);
  const [pkgDetail, setPkgDetail] = useState([]);
  const [touDetail, setTouDetail] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const [queueTotal, setQueueTotal] = useState([]); //ข้อมูลของคิวที่ถูกจองและคิวทั้งหมด
  const [queueData, setQueueData] = useState([]); //ข้อมูล

  const { userdata, isLoggedIn, socket } = useAuth();



  const time = cmsDetail.created_at;
  const date = new Date(time);
  const thaiDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;

  useEffect(() => {
    getDetailCommission();
    topic();
    getQueueData()
  }, []);

  const getQueueData = async () => {
    await axios.get(`${host}/get/queue/${cmsID}`).then((response) => {
      const data = response.data;
      setQueueTotal(data.QueueInfo[0])
      setQueueData(data.QueueData)
    })
  }

  const topic = () => {
    axios.get(`${host}/getTopic`).then((response) => {
      const data = response.data;
      setTopics(data.topics)
    });
  }



  const getDetailCommission = async () => {
    await axios
      .get(`${host}/detailCommission/${cmsID.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        setArtistDetail(data.artist);
        setCmsDetail(data.commission);
        setImgDetail(data.images);
        setPkgDetail(data.packages);
        setTouDetail(data.typeofuse);

        const aaa = data.typeofuse.map(tou => tou.tou_id.toString())
        setSelectedValues(aaa)
        if (userdata.id == artistDetail.artistId) {
          setIsOwner(true)
          console.log(userdata.id == artistDetail.artistId)
          console.log(userdata.id)
          console.log(artistDetail.artistId)
        }
      });
  };

  // สร้างฟังก์ชันเพื่อหาค่า pkg_min_price ที่น้อยที่สุด //หยุน
  function findMinPrice() {
    if (pkgDetail.length === 0) {
      return null; // หาก pkgDetail ว่างเปล่า จะไม่มีค่าที่น้อยที่สุด
    }
    // ใช้ map เพื่อดึงค่า pkg_min_price ออกมาและเก็บไว้ในอาร์เรย์
    const minPrices = pkgDetail.map((pkg) => pkg.pkg_min_price);
    // ใช้ Math.min เพื่อหาค่าที่น้อยที่สุดจากอาร์เรย์ minPrices
    const minPrice = Math.min(...minPrices);
    return minPrice;
  }
  const minPrice = findMinPrice();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const adminParam = queryParams.get("admin");


  const [touValue, setTouValue] = useState(1);
  const onChangeTou = (e) => {
    console.log("radio checked", e.target.value);
    setTouValue(e.target.value);
  };

  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  //-------------

  const [isModalOpened, setIsModalOpened] = useState(false);

  function openModal() {
    setIsModalOpened(true);
  }

  function closeModal() {
    setIsModalOpened(false);
  }

  const { TextArea } = Input;

  const [pkgID, setPkgID] = useState();
  const [pkgName, setPkgName] = useState();
  // const [Deadline, setDeadline] = useState();

  const [attImgComponents, setAttImgComponents] = useState([]);
  function addNewAttImg(props) {
    setAttImgComponents([...attImgComponents, { text: "", pic: "" }]);
    // console.log(attImgComponents);
  }

  function removeAttImg(componentKey) {
    const update = attImgComponents.filter((_, i) => i !== componentKey);
    setAttImgComponents(update);
  }

  const handleChangeText = (index, newText) => {
    const updatedComponents = attImgComponents.map((component, i) => {
      if (index === i) {
        return { ...component, text: newText };
      }
      return component;
    });
    setAttImgComponents(updatedComponents);
  };

  function manageStatusCms() {
    axios
      .patch(`${host}/changestatus/${cmsID.id}`, {
        cmsStatus: cmsDetail.cms_status
      }).then((response) => {
        console.log()
        console.log(response.data)
        if (response.data.status == 'ok') {
          var newStatus = 'เปิด';
          if (cmsDetail.cms_status == 'open') {
            newStatus = 'ปิด'
          }
          Swal.fire({
            icon: "success",
            title: `${newStatus}คอมมิชชันแล้ว`,
            confirmButtonText: 'ตกลง',
          })

        }

      })

  }

  // เช็คว่าเป็น post ของตัวเองหรือไม่
  let items = [];
  if (userdata.id === artistDetail.artistId) {
    items = [
      {
        label: <div onClick={() => setOpenEditForm(true)}>แก้ไข</div>,
        key: '1',
      },
      {
        label: <div onClick={delCms}>ลบ</div>,
        key: '2',
      },
      {
        label: <div onClick={manageStatusCms}>
          {cmsDetail.cms_status == 'open' ? 'ปิดคอมมิชชัน' : 'เปิดคอมมิชชัน'}
        </div>,
        key: '3',
      }
    ];
  } else {
    items = [
      {
        label: <div onClick={handleReportModal}>รายงาน</div>,
        key: '0',
      },
    ];
  }

  const SendRequest = (values) => {
    const jwt_token = localStorage.getItem("token");
    const selectedRadio = document.querySelector(
      'input[name="type-of-use"]:checked'
    );
    const selectedValue = selectedRadio ? selectedRadio.value : "";
    const formData = new FormData();
    formData.append("cmsID", cmsID.id);
    // formData.append("userID", userdata.id);
    formData.append("artistId", artistDetail.artistId);
    formData.append("pkgId", pkgID);
    // formData.append("Deadline", Deadline);
    formData.append("selectedValue", touValue);
    formData.append("od_use_for", values.purpose);
    formData.append("od_detail", values.detail);
    // fileList.forEach((file) => {
    //     formData.append("image_file", file.originFileObj);
    // });

    axios
      .post(`${host}/order/add`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + jwt_token,
        },
      })
      .then((response) => {
        const data = response.data;
        let od_id = data.orderId;
        if (data.status === "ok") {
          const formData = new FormData();
          // formData.append("from", userdata.id,);
          formData.append("to", artistDetail.artistId);
          formData.append("od_id", od_id);
          // ส่งค่าเพื่อเป็น chat ให้นักวาด
          axios.post(`${host}/messages/addmsg-order`, formData, {
            headers: {
              "Content-type": "multipart/form-data",
              Authorization: "Bearer " + jwt_token,
            },
          })
            .then((response) => {
              const data = response.data;
              if (data.status === 'ok') {

                // การจ้างงาน
                const addOrder = {
                  sender_id: userdata.id,
                  sender_name: userdata.urs_name,
                  sender_img: userdata.urs_profile_img,
                  order_id: od_id,
                  receiver_id: artistDetail.artistId,
                  msg: "ส่งคำขอจ้าง"
                };
                socket.emit('addOrder', addOrder);
                axios.post(`${host}/noti/order/add`, addOrder).then((response) => {
                  if (response.status === 200) {
                    Swal.fire({
                      icon: "success",
                      title: "ส่งคำขอจ้างสำเร็จ",
                      confirmButtonText: 'ตกลง',
                    }).then(() => {
                      window.location.href = `/chatbox?id=${artistDetail.artistId}&od_id=${od_id}`;
                    });
                  }
                })
              } else {
                Swal.fire({
                  icon: "error",
                  title: "เกิดข้อผิดพลาด กรุณาลองใหม่",
                });
              }
            })
        } else if (data.status === "order_full") {
          Swal.fire({
            icon: "error",
            title: "คอมมิชชันรับออเดอร์เต็มแล้ว",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด กรุณาลองใหม่",
          });
        }
      });
  };

  function handlePkgId(id) {
    setPkgID(id);
  }
  function handlePkgName(Pkgname) {
    setPkgName(Pkgname);
  }

  // function handleDeadline(deadline) {
  //   setDeadline(deadline);
  // }

  const [openEditForm, setOpenEditForm] = useState(false)


  const [reportModalIsOpened, setReportModalIsOpened] = useState(false)
  function handleReportModal() {
    setReportModalIsOpened(preveState => !preveState)
    setIsNext(false)
    setValue(null)


    // alert(isOpened)
  }

  const [value, setValue] = useState();
  const [isNext, setIsNext] = useState(false);

  function handleNext() {
    setIsNext(preveState => !preveState)
  }

  function delCms() {
    Swal.fire({
      title: "ลบคอมมิชชันนี้หรือไม่",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Swal.fire("ลบคอมมิชชันนี้แล้ว", "", "success");
        axios.patch(`${host}/commission/delete/${cmsID.id}`).then((response) => {
          const data = response.data;
          if (data.status === 'ok') {
            Swal.fire("ลบคอมมิชชันนี้แล้ว", "", "success").then(() => {
              window.location.href = "/";
            });
          } else {
            Swal.fire("เกิดข้อผิดพลาดกรุณาลองใหม่", "", "error").then(() => {
              window.location.reload(false);
            });
          }
        })
      }
    });
  }

  const onFinish = async (values, selectRadio) => {
    try {
      const postData = {
        rpheader: selectRadio,
        rpdetail: values['rp-detail'],
        rplink: values['rp-link'],
        rpemail: values['rp-email'],
      };
      const response = await axios.post(`${host}/report/commission/${cmsID.id}`, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.status === 200) {

        // เพิ่มการส่งข้อมูลไปยัง socket server
        const reportData = {
          sender_id: userdata.id,
          sender_name: userdata.urs_name,
          sender_img: userdata.urs_profile_img,
          cms_Id: cmsID.id,
          reportId: response.data.reportId,
          msg: "ได้รายงานคอมมิชชัน"
        };
        socket.emit('reportCommission', reportData);

        // บันทึก notification
        await axios.post(`${host}/admin/noti/add`, {
          reporter: userdata.id,
          reported: 0,
          reportId: response.data.reportId,
          msg: "ได้รายงานคอมมิชชัน"
        }).then((response) => {
          if (response.status === 200) {
            Swal.fire({
              title: "รายงานสำเร็จ",
              icon: "success"
            }).then(() => {
              window.location.reload(false);
            });
          } else {
            console.log("เกิดข้อผิดพลาดในการบันทึกข้อมูลการแจ้งเตือนของแอดมิน");
          }
        });
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่",
          icon: "error"
        }).then(() => {
          window.location.reload(false);
        });
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาด', error);
    }
  };

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  const [editorValue, setEditorValue] = useState('')

  const all_option = [
    ...topics.map((data) => ({
      value: data.tp_id,
      label: data.tp_name,
    })),
  ]

  const [topicValues, setTopicValues] = useState([])

  function handleTopic(value) {
    setTopicValues(value)
  }

  const [api, contextHolder] = notification.useNotification();

  const onUpdate = (values) => {
    const formData = new FormData();
    formData.append("commission_name", values.cmsName);
    formData.append("typeofuse", selectedValues.join(","));
    formData.append("commission_description", values.cmsDesc);
    formData.append("commission_q", values.cmsQ);
    formData.append("good", values.cmsGood);
    formData.append("bad", values.cmsBad);
    formData.append("no_talking", values.cmsNo);

    for (const pkg of values.pkgs) {
      formData.append("package_id", pkg.pkg_id);
      formData.append("package_name", pkg.pkgName);
      formData.append("package_detail", pkg.pkgDesc);
      formData.append("duration", pkg.pkgDuration);
      formData.append("price", pkg.pkgPrice);
      formData.append("edits", pkg.pkgEdit);
    }

    axios.patch(`${host}/commission/update/${cmsID.id}?deletedPkgIds=${deletedPkgIds}`, formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "multipart/form-data",
      },
    }).then((response) => {
      const data = response.data;
      if (data.status === "ok") {
        Swal.fire({
          title: "บันทึกสำเร็จ",
          icon: "success"
        }).then(() => {
          window.location.reload(false);
        });
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่",
          icon: "error"
        }).then(() => {
          window.location.reload(false);
        });
      }
    })
    // values.pkgs.map((item) => {
    //   // console.log(item);
    //   // ลูบออบเจ็คในแพ็กเกจเอาค่าออกมา
    //   for (const value of Object.values(item)) {
    //     console.log(value);

    //   }
    //   for (const value of Object.values(item.step)) {
    //     console.log(value); //array ของ stat จะไม่ปริ้นเพราะเป็น array
    //   }
    // });

    // const btn = (
    //   <Space>
    //     {/* <Button type="link" size="small" onClick={() => api.destroy()}>
    //                 Destroy All
    //             </Button> */}
    //     <Button type="link" danger size="small">
    //       ยกเลิกการอัปโหลด
    //     </Button>
    //   </Space>
    // );

    // api.info({
    //   message: 'กำลังตรวจสอบรูปภาพ',
    //   description:
    //     'กำลังตรวจสอบรูปภาพรอก่อนพี่ชายย ยังอัปคอมมิชชันไม่ได้เด้อ', btn,
    //   duration: 0,
    //   placement: 'bottomRight',
    //   // icon: <LoadingOutlined style={{ color: '#108ee9' }} />
    //   icon: <Progress type="circle" percent={50} size={20} />

    // });
  }
  const [form] = Form.useForm();

  //เลือก tou
  const [selectedValues, setSelectedValues] = useState([]);

  const initialValues = {
    cmsName: cmsDetail.cms_name,
    cmsTou: selectedValues,
    cmsDesc: cmsDetail.cms_desc,
    cmsQ: cmsDetail.cms_amount_q,
    cmsGood: cmsDetail.cms_good_at,
    cmsBad: cmsDetail.cms_bad_at,
    cmsNo: cmsDetail.cms_no_talking,
    pkgs: pkgDetail.map(pkg => ({
      pkg_id: pkg.pkg_id,
      pkgName: pkg.pkg_name,
      pkgDesc: pkg.pkg_desc,
      pkgDuration: pkg.pkg_duration,
      pkgEdit: pkg.pkg_edits,
      pkgPrice: pkg.pkg_min_price
    }))
  };


  const [deletedPkgIds, setDeletedPkgIds] = useState([]);
  const handleDelete = (pkg_id) => {
    setDeletedPkgIds(prevDeletedPkgIds => [...prevDeletedPkgIds, pkg_id]);

  };
  // console.log(deletedPkgIds);
  const menus = [
    {
      key: '1',
      label: "แพ็กเกจ",
      children: <Package
        pkgDetail={pkgDetail}
        onClick={openModal}
        setPkgName={handlePkgName}
        setPkgID={handlePkgId}
        isOwner={isOwner}
        id={userdata.id}
        artistId={artistDetail.artistId}
      />,
    },
    {
      key: '2',
      label: "รีวิว",
      children: <Review />,
    },
    {
      key: '3',
      label: "คิว",
      children: <Queue cmsID={cmsID.id} cms_amount_q={cmsDetail.cms_amount_q}  queueTotal={queueTotal} queueData={queueData}/>,
    },
  ];

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }], [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['clean'],
    ],
  };

  // Define what happens when the custom option is clicked
  const formats = [
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'align', 'indent'
  ];

  return (
    <div className="body-con">
      {/* {formModalOpened ? <FormModal pkgId={packageId}/> : null} */}
      <Modal
        // title={`ส่งคำขอจ้าง 'แพ็กเกจ : ${pkgName}'`}
        title={isLoggedIn ? `ส่งคำขอจ้างแพ็กเกจ : ${pkgName}` : "คุณยังไม่ได้เข้าสู่ระบบ"}
        open={isModalOpened}
        onCancel={closeModal}
        footer=""
        width={1000}
      >
        {!isLoggedIn ?
          <>
            <p>กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
            <Flex justify="flex-end">
              <Link to="/login"><Button shape="round" size="large">ตกลง</Button></Link>
            </Flex>
          </>
          :
          <Form layout="vertical" onFinish={SendRequest}>
            <Form.Item label="ประเภทการใช้งาน">
              <Radio.Group onChange={onChangeTou} value={touValue}>
                {touDetail.map((item) => (
                  <Radio key={item.tou_id} value={item.tou_name}>
                    {item.tou_name}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="จุดประสงค์การใช้ภาพ"
              name="purpose"
              rules={[{ required: true, message: "กรุณาใส่จุดประสงค์การใช้งาน" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="รายละเอียด"
              name="detail"
              rules={[{ required: true, message: "กรุณาใส่รายละเอียด" }]}
            >
              <TextArea
                placeholder="อธิบายรายละเอียดที่ต้องการ เช่น ผู้หญิงใส่เสื้อสีดาวผมยาวยืนอยู่ข้างกำแพงสีฟ้าเอียงมุมกล้องเล็กน้อย"
                // showCount
                // maxLength={200}
                autoSize={{
                  minRows: 3,
                  maxRows: 5,
                }}
              />
            </Form.Item>
            <Flex justify="center">
              <Button htmlType="submit" type="primary" shape="round" size="large">
                ส่งคำขอจ้าง
              </Button>

            </Flex>
            
            {/* </Flex> */}
          </Form>

        }

      </Modal >

      <Helmet>
        <title>{title}</title>
      </Helmet>
      {
        isLoggedIn ? (
          type === 'admin' ? <NavbarAdmin /> : <NavbarUser />
        ) : (
          <NavbarGuest />
        )
      }

      <div className="background-blur" style={body}></div>

      <div class="body-lesspadding">
        <div className="container-xl">
          <div className="content-card">
            {

              !openEditForm ?
                <>
                  {/* กรณีไม่กดแก้ไข */}
                  <div className="cms-overview">
                    <h1 className="h3 me-3">{cmsDetail.cms_name}<span class="cms-status-detail">{cmsDetail.cms_status == "open" ? 'เปิด' : 'ปิด'}</span></h1>
                    {isLoggedIn &&
                      <Flex gap="small" justify="flex-end" flex={1}>
                        <Dropdown
                          menu={{
                            items,
                          }}
                          trigger={['click']}
                        >
                          <Button className="icon-btn" type="text" icon={<MoreOutlined />} onClick={(e) => e.preventDefault()}>
                          </Button>
                        </Dropdown>
                      </Flex>
                    }


                  </div>
                  <div className="cms-artist-box">
                    <Link to={`/profile/${artistDetail.artistId}`}>
                      <div id="cms-artist-profile">
                        <img src={artistDetail.artistProfile} alt="" />

                        <div>
                          <p>{artistDetail.artistName}</p>
                          <p>{artistDetail.all_review}<ggIcon.Star className='fill-icon' /><span className="q">({artistDetail.total_reviews}) | ว่าง {cmsDetail.cms_amount_q - (queueTotal?.used_slots || 0)} คิว</span></p>
                        </div>

                      </div>
                    </Link>
                    <p id="cms-price">โพสต์เมื่อ {thaiDate}</p>
                    {/* <p id="cms-price" className="h4">
                  เริ่มต้น {minPrice} บาท
                </p> */}
                  </div>
                  {/* <p style={{ textAlign: "right", fontSize: "0.7rem" }}>
                {thaiDate}
              </p> */}
                  <ImgSlide imgDetail={imgDetail} />

                  {/* <p className="text-align-center mt-3 mb-3">
                    {cmsDetail.cms_desc}
                  </p> */}
                  <div
                    dangerouslySetInnerHTML={{ __html: cmsDetail.cms_desc }}
                    className="view ql-editor displaydesc mt-4 mb-4"
                  />
                  <div className="skill">
                    <div className="good-at">
                      <ul>
                        <p>ถนัด</p>
                        <p style={{ fontWeight: "300" }}>{cmsDetail.cms_good_at}</p>
                        {/* {goodAtItems.map((item, index) => (
                      <li key={index}>
                        <span>{item}</span>
                      </li>
                    ))} */}
                      </ul>
                    </div>
                    <div className="bad-at">
                      <ul>
                        <p>ไม่ถนัด</p>
                        <p style={{ fontWeight: "300" }}>{cmsDetail.cms_bad_at}</p>
                        {/* {badAtItems.map((item, index) => (
                      <li key={index}>
                        <span>{item}</span>
                      </li>
                    ))} */}
                      </ul>
                    </div>

                    <div className="not-accept">
                      <ul>
                        <p>ไม่รับ</p>
                        <p style={{ fontWeight: "300" }}>
                          {cmsDetail.cms_no_talking}
                        </p>
                        {/* {no_talkingAtItems.map((item, index) => (
                      <li key={index}>
                        <span>{item}</span>
                      </li>
                    ))} */}
                      </ul>
                    </div>
                  </div>
                  {/* <div className="group-submenu">
                    <button
                      className="sub-menu selected"
                      onClick={
                        !activeMenu.package
                          ? (event) => handleMenu(event, "package")
                          : null
                      }
                    >
                      แพ็กเกจ
                    </button>

                    <button
                      className="sub-menu"
                      onClick={
                        !activeMenu.review
                          ? (event) => handleMenu(event, "review")
                          : null
                      }
                    >
                      รีวิว
                    </button>
                    <button
                      className="sub-menu"
                      onClick={
                        !activeMenu.queue
                          ? (event) => handleMenu(event, "queue")
                          : null
                      }
                    >
                      คิว
                    </button>
                  </div> */}
                  <div className="mt-3 mb-3">
                    <Tabs defaultActiveKey="1" items={menus} />
                  </div>

                  {/* <Queue /> */}

                  {/* {activeMenu.package && (
                    <Package
                      pkgDetail={pkgDetail}
                      setPkgID={handlePkgId}
                      setPkgName={handlePkgName}
                      // setDeadline={handleDeadline}
                      onClick={openModal}
                    />
                  )}
                  {activeMenu.review && <Review />}
                  {activeMenu.queue && <Queue cmsID={cmsID.id} />} */}
                </>
                :
                <>
                  {/* กรณีกดแก้ไข */}
                  <ImgSlide imgDetail={imgDetail} />
                  <Form
                    form={form}
                    layout="vertical"
                    name="login"
                    onFinish={onUpdate}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={initialValues}
                  >
                    <Form.Item
                      label="ชื่อคอมมิชชัน"
                      name="cmsName"
                      id="cmsName"
                      rules={[
                        {
                          required: true,
                          message: "กรุณาใส่ชื่อคอมมิชชัน",
                        },
                        { type: "text" },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item name="cmsTou" label={<>
                      ประเภทการใช้งานที่รับ
                      <Tooltip title="1.Personal use : ใช้ส่วนตัว ไม่สามารถใช้เชิงพาณิชย์ได้ 2.License : สามารถนำไปทำบางอย่างได้ เช่น ใช้ในเชิงพาณิชย์ ทั้งนี้ทั้งนั้นขึ้นอยู่กับข้อตกลงว่าสามารถทำอะไรได้บ้าง 3.Exclusive right : สามารถนำผลงานไปทำอะไรก็ได้ ลิขสิทธิ์อยู่ที่ผู้ซื้อ แต่นักวาดยังมีเครดิตในผลงานอยู่" color="#2db7f5">
                        <Icon.Info />
                      </Tooltip>
                    </>}
                      rules={[
                        {
                          required: true,
                          message: "กรุณาเลือกประเภทงานที่รับ",
                        }
                      ]}

                    >

                      <Checkbox.Group
                        value={selectedValues}
                        onChange={(values) => setSelectedValues(values)}
                      >

                        <Checkbox value="1" style={{ lineHeight: '32px' }}>
                          Personal use (ใช้ส่วนตัว)

                        </Checkbox>
                        <Checkbox value="2" style={{ lineHeight: '32px' }}>
                          License (มีสิทธ์บางส่วน)
                        </Checkbox>
                        <Checkbox value="3" style={{ lineHeight: '32px' }}>
                          Exclusive right (ซื้อขาด)
                        </Checkbox>
                      </Checkbox.Group>

                    </Form.Item>

                    <Form.Item
                      label="รายละเอียดคอมมิชชัน"
                      name="cmsDesc"
                      id="cmsDesc"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกรายละเอียดคอมมิชชัน",
                        },
                        { type: "text" },
                      ]}
                    >
                      <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        value={editorValue}
                        onChange={setEditorValue}
                        placeholder="เขียนรายละเอียดคอมมิชชัน.."
                      />

                    </Form.Item>

                    <Space
                      style={{
                        display: 'flex',
                        flexDirection: "row",
                        flexWrap: "wrap"
                        // backgroundColor: 'pink'
                      }}>

                      <Form.Item
                        label="จำนวนคิว"
                        name={'cmsQ'}
                        rules={[
                          {
                            required: true,
                            message: "กรุณาใส่จำนวนคิว",
                          },
                          { type: "number" }
                        ]}
                      >

                        <InputNumber suffix="คิว" className="inputnumber-css" />
                      </Form.Item>

                    </Space>

                    <Form.Item label="งานที่ถนัด" name='cmsGood'
                      rules={[
                        {
                          required: true,
                          // whitespace: true,
                          message: "กรุณาใส่งานที่ถนัด",
                        },
                      ]}>
                      <TextArea
                        placeholder="เช่น ผู้หญิง ผู้ชาย เฟอร์นิเจอร์บางชิ้น"
                        //showCount maxLength={200}
                        autoSize={{
                          minRows: 3,
                          maxRows: 5,
                        }} />
                    </Form.Item>

                    <Form.Item label="งานที่ไม่ถนัด" name='cmsBad'
                      rules={[
                        {
                          required: true,
                          // whitespace: true,
                          message: "กรุณาใส่งานที่ไม่ถนัด",
                        },
                      ]}>
                      <TextArea
                        placeholder="เช่น ผู้หญิง ผู้ชาย เฟอร์นิเจอร์บางชิ้น"
                        //showCount maxLength={200}
                        autoSize={{
                          minRows: 3,
                          maxRows: 5,
                        }} />
                    </Form.Item>

                    <Form.Item label="งานที่ไม่รับ" name='cmsNo'
                      rules={[
                        {
                          required: true,
                          // whitespace: true,
                          message: "กรุณาใส่งานที่ไม่รับ'",
                        },
                      ]}>
                      <TextArea
                        placeholder="เช่น ผู้หญิง ผู้ชาย เฟอร์นิเจอร์บางชิ้น"
                        //showCount maxLength={200}
                        autoSize={{
                          minRows: 3,
                          maxRows: 5,
                        }} />
                    </Form.Item>

                    {/* <Button onClick={() => console.log(editorValue)}>เทส</Button> */}

                    <Form.Item
                      name="pkgs"
                      label="แพ็กเกจ"
                    >
                      <Form.List name="pkgs">
                        {(fields, { add, remove }, { errors }) => (
                          <>
                            {fields.map((field, index) => (
                              <Card
                                size="small"
                                title={`แพ็กเกจ ${index + 1}`}
                                key={field.key}
                                extra={
                                  fields.length > 1 && (
                                    <Button
                                      type="danger"
                                      onClick={() => {
                                        const pkg_id = pkgDetail[index].pkg_id;
                                        handleDelete(pkg_id);
                                        remove(field.name);
                                      }}
                                    >
                                      <CloseOutlined />
                                    </Button>
                                  )
                                }
                              >
                                <Form.Item
                                  label="ไอดีแพ็กเกจ"
                                  name={[field.name, 'pkg_id']}
                                >
                                  <Input disabled />
                                </Form.Item>

                                <Form.Item
                                  label="ชื่อแพ็กเกจ"
                                  name={[field.name, 'pkgName']}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: "กรุณาใส่ชื่อแพ็กเกจ",
                                    },
                                  ]}
                                >
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  label="คำอธิบาย"
                                  name={[field.name, 'pkgDesc']}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: "กรุณาใส่คำอธิบาย",
                                    },
                                  ]}
                                >
                                  <Input.TextArea //showCount maxLength={200} 
                                    autoSize={{ minRows: 3, maxRows: 5 }} />
                                </Form.Item>
                                <Space>
                                  <Form.Item
                                    label="จำนวนวัน"
                                    name={[field.name, 'pkgDuration']}
                                    rules={[
                                      {
                                        required: true,
                                        message: "กรุณาใส่จำนวนวัน",
                                      },
                                      { type: "number" }
                                    ]}
                                  >
                                    <InputNumber suffix="วัน" className="inputnumber-css" />
                                  </Form.Item>
                                  <Form.Item
                                    label="จำนวนแก้ไข"
                                    name={[field.name, 'pkgEdit']}
                                    rules={[
                                      {
                                        required: true,
                                        message: "กรุณาใส่จำนวนแก้ไข",
                                      },
                                      { type: "number" }
                                    ]}
                                  >
                                    <InputNumber suffix="ครั้ง" className="inputnumber-css" />
                                  </Form.Item>
                                  <Form.Item
                                    label="ราคาเริ่มต้น"
                                    name={[field.name, 'pkgPrice']}
                                    rules={[
                                      {
                                        required: true,
                                        message: "กรุณาใส่ราคาเริ่มต้น",
                                      },
                                      { type: "number" }
                                    ]}
                                  >
                                    <InputNumber suffix="บาท" className="inputnumber-css" />
                                  </Form.Item>
                                </Space>
                              </Card>
                            ))}
                          </>
                        )}
                      </Form.List>
                    </Form.Item>

                    <Form.Item
                      label="หัวข้อ"
                      name="cmsTopic"

                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "กรุณาเลือกหัวข้อ",
                    //   }
                    // ]}
                    >
                      <Select
                        mode="multiple"
                        disabled={true}
                        placeholder="เลือกหัวข้อ"
                        value={topicValues}
                        // value={["1", "2"]}
                        id="topicSelector"
                        onChange={handleTopic}
                        options={all_option}
                        allowClear
                      // maxTagCount={3}
                      >
                      </Select>
                    </Form.Item>
                    <Flex justify="flex-end" gap="small">
                      <Button size="large" type="primary" shape="round" htmlType="submit">บันทึก</Button>
                      <Button size="large" shape="round" onClick={() => setOpenEditForm(false)}>ยกเลิก</Button>
                    </Flex>
                  </Form>
                </>
            }
          </div>
        </div>
      </div>
      <Modal width={1000} title="รายงาน" open={reportModalIsOpened} onCancel={handleReportModal} footer="">
        <Space gap="small" direction="vertical" style={{ width: "100%" }}>

          {!isNext && <>

            <Radio.Group onChange={onChange} value={value} >
              <Space direction="vertical">
                <div><Radio value="สแปม"><p className="report-headding">สแปม</p></Radio>
                  <p className="report-desc ms-4">ทำให้เข้าใจผิด แนบลิงก์ที่เป็นอันตรายหรือเป็นโพสต์ซ้ำ</p>
                </div>
                <div><Radio value="ละเมิดทรัพย์สินทางปัญญา"><p className="report-headding">ละเมิดทรัพย์สินทางปัญญา</p></Radio>
                  <p className="report-desc ms-4">มีการละเมิดลิขสิทธิ์หรือเครื่องหมายการค้า</p>
                </div>
                <div><Radio value="การกระทำที่ไม่เหมาะสมและการคุกคาม"><p className="report-headding">การกระทำที่ไม่เหมาะสมและการคุกคาม</p></Radio>
                  <p className="report-desc ms-4">มีเนื้อหาหรือภาพที่ไม่เหมาะสม การใช้ถ้อยคำหยาบคาย มีเนื้อหาทางเพศที่โจ่งแจ้งซึ่งเกี่ยวข้องกับผู้ใหญ่หรือภาพเปลือย การใช้ในทางที่ผิดโดยเจตนาเกี่ยวกับผู้เยาว์</p>
                </div>
                <div><Radio value="กิจกรรมที่แสดงความเกลียดชัง"><p className="report-headding">
                  กิจกรรมที่แสดงความเกลียดชัง</p></Radio>
                  <p className="report-desc ms-4">อคติ การเหมารวม ลัทธิคนผิวขาว การยุยงให้เกิดความรุนแรง</p>
                </div>

                {/* <div>
                  <Radio value={4}>
                    <p className="report-headding">อื่นๆ
                      {value === 4 ? <Input style={{ width: 200, marginLeft: 10 }} /> : null}</p>
                  </Radio>
                </div> */}


              </Space>
            </Radio.Group>
            <Flex gap="small" justify="flex-end">
              {/* <Button shape="round" size="large" onClick={handleReportModal}>ยกเลิก</Button> */}
              <Button shape="round" size="large" type="primary" onClick={handleNext} disabled={value == null}>ถัดไป</Button>
            </Flex>

          </>}
          <Form
            form={form}
            layout="vertical"
            // onFinish={onFinish}
            onFinish={(selectRadio) => onFinish(selectRadio, value)} // ส่งค่าของ value ที่เลือกจาก radio ไปด้วย
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="ant-form"
          >
            {value == "ละเมิดทรัพย์สินทางปัญญา" && isNext &&
              <>
                <p>รายงาน : การละเมิดทรัพย์สินทางปัญญา</p>
                <Form.Item
                  name="rp-detail"
                  label="รายละเอียดการแจ้งรายงาน"
                  rules={[{ required: true, message: "กรุณากรอกฟิลด์นี้" }, { type: 'string', max: 100 }]}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  name="rp-link"
                  label="ลิ้งค์ที่ลงผลงาน"
                  rules={[{ required: true, message: "กรุณากรอกฟิลด์นี้" }, { type: 'url', max: 100 }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="rp-email"
                  label="อีเมลติดต่อกลับ"
                  rules={[{ required: true, message: "กรุณากรอกฟิลด์นี้" }, { type: 'email', max: 100 }]}
                >
                  <Input />
                </Form.Item>

                <Flex gap="small" justify="flex-end">
                  <Button shape="round" size="large" onClick={handleNext}>ย้อนกลับ</Button>
                  <Button shape="round" size="large" type="primary" onClick={handleNext} >รายงาน</Button>
                </Flex>
              </>
            }

            {value !== "ละเมิดทรัพย์สินทางปัญญา" && isNext &&
              <>
                <p>รายงาน : {value}</p>
                <Form.Item
                  name="rp-detail"
                  label="รายละเอียดการแจ้งรายงาน"
                  rules={[{ required: true, message: "กรุณากรอกฟิลด์นี้" }, { type: 'string', max: 100 }]}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  name="rp-email"
                  label="อีเมลติดต่อกลับ"
                  rules={[{ required: true, message: "กรุณากรอกฟิลด์นี้" }, { type: 'email', max: 100 }]}
                >
                  <Input />
                </Form.Item>

                <Flex gap="small" justify="flex-end">
                  <Button shape="round" size="large" onClick={handleNext}>ย้อนกลับ</Button>
                  <Button shape="round" size="large" type="primary" htmlType="submit">รายงาน</Button>
                </Flex>
              </>
            }
          </Form>
        </Space>
      </Modal>
    </div >
  );
}

function Package(props) {
  const { pkgDetail } = props;

  const handlePackageClick = (pkgId, pkgName, pkg_duration) => {
    console.log(pkgName);
    console.log(`Clicked on package with id: ${pkgId}`);
    props.setPkgID(pkgId);
    props.setPkgName(pkgName);
    // props.setDeadline(pkg_duration);
    props.onClick(); //เปิดโมดอล
  };

  return (
    <>
      <h2 className="h3">เลือกแพ็กเกจ</h2>
      <p className="text-align-right">
        ราคาสำหรับ personal use หากใช้ในเชิงอื่นอาจกำหนดราคาขึ้นมากกว่านี้
      </p>
      {Array.isArray(pkgDetail) ? (
        pkgDetail.map((pkg) => (
          <div
            className={`select-package-item ${props.id === props.artistId && "owner"}`}
            onClick={props.id === props.artistId ? undefined : () => handlePackageClick(pkg.pkg_id, pkg.pkg_name, pkg.pkg_duration)}
            key={pkg.pkg_id}
          >
            <div>
              <h3>{pkg.pkg_name}</h3>
              <p>{pkg.pkg_min_price}+ THB</p>
              <p>{pkgDetail.pkg_desc}</p>
            </div>
            <div>
              <p>ระยะเวลาทำงาน {pkg.pkg_duration} วัน</p>
              <p>ประเภทงานที่อนุญาต ทุกประเภท</p>
              <p>จำนวนครั้งแก้ไขงาน {pkg.pkg_edits} ครั้ง</p>
            </div>
          </div>
        ))
      ) : (
        <div
          className="select-package-item"
          onClick={() => handlePackageClick(pkgDetail.pkg_id, pkgDetail.pkg_name, pkgDetail.pkg_duration)}
        >
          <div>
            <h3>{pkgDetail.pkg_name}</h3>
            <p>{pkgDetail.pkg_min_price}+ THB</p>
            <p>{pkgDetail.pkg_desc}</p>
          </div>
          <div>
            <p>ระยะเวลาทำงาน {pkgDetail.pkg_duration} วัน</p>
            <p>ประเภทงานที่อนุญาต ทุกประเภท</p>
            <p>จำนวนครั้งแก้ไขงาน {pkgDetail.pkg_edits} ครั้ง</p>
          </div>
        </div>
      )}
    </>
  );
}

function Review() {
  return (
    <>
      <h2 className="h3">รีวิว (4.0 จาก 3 รีวิว)</h2>
      <div className="review-box">
        <div className="reviewer-box">
          <div>
            <img src="https://i.kym-cdn.com/entries/icons/original/000/043/403/cover3.jpg" />
          </div>
          <div>
            <p>K.Kav</p>
            <p>เมื่อวานนี้ 10:10 น.</p>
          </div>
        </div>
        <p style={{ fontWeight: "500" }}>แพ็กเกจ : Half Body</p>
        <p>
          <ggIcon.Star className="fill-icon" />
          <ggIcon.Star className="fill-icon" />
          <ggIcon.Star className="fill-icon" />
          <ggIcon.Star className="fill-icon" />
        </p>
        <p>เขียนรีวิว</p>
        {/* <div className="img-box"><img src="kaveh.png" /></div> */}
      </div>
      <div className="review-box">
        <div className="reviewer-box">
          <div>
            <img src="https://i.cbc.ca/1.5359228.1577206958!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_940/smudge-the-viral-cat.jpg" />
          </div>
          <div>
            <p>Arora</p>
            <p>20/08/2566 19:56 น.</p>
          </div>
        </div>
        <p style={{ fontWeight: "500" }}>แพ็กเกจ : Half Body</p>
        <p>
          <ggIcon.Star className="fill-icon" />
          <ggIcon.Star className="fill-icon" />
          <ggIcon.Star className="fill-icon" />
          <ggIcon.Star className="fill-icon" />
        </p>
        <p>เขียนรีวิว</p>
        {/* <div className="img-box" ><img src="kaveh.png" /></div> */}
      </div>
      <div className="review-box">
        <div className="reviewer-box">
          <div>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREmaQdvWJzdLZ2M0QpDmDxHXY5K_5Uz2ZSNg&usqp=CAU" />
          </div>
          <div>
            <p>Sarah Baba</p>
            <p>17/08/2566 19:56 น.</p>
          </div>
        </div>
        <p style={{ fontWeight: "500" }}>แพ็กเกจ : Half Body</p>
        <p>
          <ggIcon.Star className="fill-icon" />
          <ggIcon.Star className="fill-icon" />
          <ggIcon.Star className="fill-icon" />
          <ggIcon.Star className="fill-icon" />
        </p>
        <p>เขียนรีวิว</p>
        {/* <div className="img-box"><img src="kaveh.png" /></div> */}
      </div>
    </>
  );
}

function Queue(props) {
  const cmsID = props.cmsID;
  const cms_amount_q = props.cms_amount_q;
  const queueTotal = props.queueTotal;
  const queueData = props.queueData;

  return (
    <>
      <h2>คิว ({queueTotal?.used_slots || 0}/{cms_amount_q})</h2>
      {/* <Alert message="ในตารางคิวนี้รวมคิวของคอมมิชชันอื่นของคุณBoobi ด้วย" closable type="info" showIcon className="mt-3 mb-5 " /> */}
      <table className="queue-table">
        <tr>
          <th className="q">คิว</th>
          <th>คอมมิชชัน:แพคเกจ</th>
          <th>ชื่อผู้จ้าง</th>
          <th>วันที่จ้าง</th>
          <th>ความคืบหน้า</th>
        </tr>
        {queueData.length == 0 ? (<div>
          <h4>ยังไม่มีออเดอร์</h4>
        </div>)
          :
          (queueData.map((data, index) => (
            <tr key={data.od_id}>
              <td>{index + 1}</td>
              <td>{data.cms_name} : {data.pkg_name}</td>
              <td>{data.urs_name}</td>
              <td>{data.ordered_at}</td>
              <td>{data.step_name}</td>
            </tr>
          )))}
      </table>
    </>
  );
}

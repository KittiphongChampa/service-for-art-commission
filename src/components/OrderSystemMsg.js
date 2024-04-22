import { Modal, Button, Input, Select, Space, Image, Upload, Rate, Flex, Tooltip, InputNumber, Form } from 'antd';
import { useState, useRef } from 'react';
import {
    InfoCircleOutlined, LoadingOutlined, PlusOutlined, UploadOutlined, DeleteOutlined, ZoomInOutlined,
    ZoomOutOutlined,
} from '@ant-design/icons';
import * as Icon from 'react-feather';
import ImgFullscreen from './openFullPic'
import QRCode from "qrcode.react";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import axios from "axios";
import { host } from "../utils/api";
import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear, addDays, isAfter, isBefore } from 'date-fns';


const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        alert('You can only upload JPG/PNG file!');
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //     alert('Image must smaller than 2MB!');
    // }
    return isJpgOrPng;
};

export default function OrderSystemMsg({ curStepId, sendReview, cancelRequest, orderDetail, phoneNumber, amount, accName, qrCode, handleBrief, message, acceptRequest, approveProgress, setPrice, submitSlip, approveSlip, rejectSlip, editProgress, delProgress, myId, scrollRef }) {
    // console.log(orderDetail);
    // const flexSysDialog = { width: "50%", alignSelf: "center", margin: "1rem 0", borderRadius: "1rem", padding: "1rem", boxShadow: "rgb(133 126 139 / 0%) 0px 2px 6px 0px, rgb(188 187 193 / 10%) 0px 1px 11px 0px, rgb(195 196 207 / 5%) 0px 7px 28px 8px", backgroundColor: " white" }
    // const flexSysDialogWip = { width: "80%", alignSelf: "center", margin: "1rem 0", borderRadius: "1rem", padding: "1rem", boxShadow: "rgb(133 126 139 / 0%) 0px 2px 6px 0px, rgb(188 187 193 / 10%) 0px 1px 11px 0px, rgb(195 196 207 / 5%) 0px 7px 28px 8px", backgroundColor: " white" }

    const [IsModalOpen, setIsModalOpen] = useState(false)
    const stepIdRef = useRef()



    function ModalToggle(stepId) {
        //ถ้ามันปิดอยู่
        if (!IsModalOpen) {
            stepIdRef.current = stepId
        } else {
            stepIdRef.current = null
        }
        setIsModalOpen(!IsModalOpen)
        setImageUrl(null)
        // alert(stepIdRef.current)
    }

    const [IsReviewModalOpen, setIsReviewModalOpen] = useState(false)
    function ReviewModalHandle() {
        setIsReviewModalOpen(!IsReviewModalOpen)
        // alert(stepIdRef.current)
    }

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const handleChange = (info) => {

        getBase64(info.file.originFileObj, (url) => {
            setLoading(false);
            setImageUrl(url);
        });
        return false;
    };
    const uploadButton = (
        <div>
            {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    const priceRef = useRef()
    async function uploadSlip(stepId) {
        const res = await submitSlip(stepId, ModalToggle)
        // res == true && ModalToggle()
        console.log("res=", res)
    }
    const [reviewValue, setReviewValue] = useState(5);
    const [commentValue, setCommentValue] = useState();
    const ref = useRef()

    const scrollToWip = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const [fullImgOpened, setFullImgOpened] = useState(false)
    const [src, setSrc] = useState("")

    const handleFullImg = (imgsrc) => {
        console.log("คลิกฟังชันโชว์", imgsrc)
        setFullImgOpened(prevState => !prevState)
        setSrc(imgsrc)
    }



    const submitReview = async(values) => {
        // Swal.fire({
        //     title: values.comment + reviewValue,
        //     showCancelButton: true,
        //     confirmButtonText: "ตกลง",
        //     cancelButtonText: "ยกเลิก",
        // }).then(async (result) => {
        // if (result.isConfirmed) {
        await axios.post(
            `${host}/sendreview`,
            {
                od_id: orderDetail.od_id,
                rw_comment: values.comment,
                rw_score: reviewValue,
                cms_id: orderDetail.cms_id,
                artist_id: orderDetail.artist_id,
                all: orderDetail
            }
        );
        sendReview()
        //     }
        // });
    };

    function formatTime(rawTime) {
        let currentDate;

        if (!Number.isNaN(new Date(rawTime).getTime())) {
            // currentDate = format(new Date(rawTime), 'dd/MM HH:mm น.');
            if (isToday(new Date(rawTime))) {
                currentDate = format(new Date(rawTime), 'HH:mm น.');
            } else if (isYesterday(new Date(rawTime))) {
                currentDate = format(new Date(rawTime), 'เมื่อวานนี้ HH:mm น.');
            } else if (isThisYear(new Date(rawTime))) {
                currentDate = format(new Date(rawTime), 'dd/MM HH:mm น.');
            } else {
                currentDate = format(new Date(rawTime), 'dd/MM/yyyy HH:mm น.');
            }
        }
        return currentDate
    }


    return (
        <>
            <ImgFullscreen src={src} opened={fullImgOpened} handleFullImg={handleFullImg} acceptRequest={acceptRequest} />

            {message.step_id == 0 && message.status == "e" &&
                <Flex wrap='wrap' gap="small" justify="center" align="center" vertical className="sys-dialog">
                    <p>{new Date(message.created_at).toLocaleString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} น.</p>
                    {message.message}
                    {/* {orderDetail.artist_id == myId ? <p>ยอมรับคำขอแล้ว รอส่งภาพร่างให้ลูกค้า</p> : <p>นักวาดได้เปลี่ยนแปลงรายละเอียดออเดอร์แล้ว จากราคา XXX เป็น xxx และ XXX เป็น xxxx</p>} */}
                </Flex>}


            {
                message.step_name == "ส่งคำขอจ้าง" &&
                <>
                    <Flex wrap='wrap' key={message.index} gap="small" justify="center" align="center" vertical className="sys-dialog">
                        <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })} น.</p>
                        {orderDetail.artist_id == myId ? <p>ลูกค้าส่งคำขอจ้างถึงคุณ</p> : <p>คุณส่งคำขอจ้างแล้ว</p>}
                        <Button size='large' type='link' onClick={handleBrief}>ดูบรีฟ</Button>

                        {orderDetail.artist_id == myId ?
                            message.checked == 0 ?
                                <Flex wrap='wrap' gap="small" justify="center">
                                    <Button size="large" shape="round" onClick={() => acceptRequest(message.step_id, message.step_name)} > ยอมรับคำขอจ้าง</Button>
                                    <Button size="large" danger shape="round" onClick={() => cancelRequest(message.step_id, message.step_name)} > ยกเลิกคำขอจ้าง</Button>
                                </Flex>
                                : null
                            : null
                        }
                    </Flex>
                </>
            }


            {message.step_name.includes('รับคำขอจ้าง') && message.status !== "c" &&
                <Flex wrap='wrap' gap="small" justify="center" align="center" vertical className="sys-dialog">
                    <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} น.</p>
                    {orderDetail.artist_id == myId ? <p>ยอมรับคำขอแล้ว รอส่งภาพร่างให้ลูกค้า</p> : <p>นักวาดยอมรับคำขอจ้างแล้ว</p>}
                </Flex>}

            {/*! -----but ปฏิเสธ-------*/}
            {message.step_name.includes('รับคำขอจ้าง') && message.status == "c" &&
                <Flex wrap='wrap' gap="small" justify="center" align="center" vertical className="sys-dialog">
                    <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} น.</p>
                    {orderDetail.artist_id == myId ? <p>ยกเลิกคำขอจ้างแล้ว</p> : <p>นักวาดยกเลิกคำขอจ้างแล้ว</p>}
                </Flex>}

            {message.step_name == "ระบุราคา" && message.status == null && message.status == undefined && orderDetail.artist_id == myId &&
                <Flex wrap='wrap' gap="small" justify="center" align="center" vertical className="sys-dialog">
                    <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} น.</p>
                    {/* {message.msgId} */}
                    <p className="h4"> ระบุราคาคอมมิชชัน</p>
                    <p>ราคาขั้นต่ำ {orderDetail.pkg_min_price} บาท</p>
                    {message.checked == 0 ?
                        <>
                            <InputNumber suffix="บาท" className="inputnumber-css" ref={priceRef} />
                            <Button size="large" type="primary" shape="round" onClick={() => setPrice(message.step_id, message.step_name, priceRef.current.value)} > แจ้งราคา</Button>
                        </>
                        : <p>กำหนดราคาแล้ว</p>}


                </Flex>
            }

            {message.step_name == "ระบุราคา" && message.status !== null && message.status !== undefined &&
                <Flex wrap='wrap' gap="small" justify="center" align="center" vertical className="sys-dialog">
                    <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} น.</p>
                    <p>{orderDetail.artist_id == myId ? 'คุณ' : 'นักวาด'}{message.message}</p>
                </Flex>}

            {message?.step_name?.includes('แนบสลิป') && message.status == null && message.status == undefined &&
                <Flex wrap='wrap' className="system-message qrcode sys-dialog" gap="small" justify="center" align="center" vertical>
                    <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} น.</p>
                    {/* {message.msgId} */}
                    <p className="h4">{!message?.step_name?.includes('2') ? 'ชำระเงินครึ่งแรก' : "ชำระเงินครึ่งหลัง"}
                        {!message?.step_name?.includes('2') &&
                            <Tooltip title="จ่ายเงินล่วงหน้า 50% ก่อนเริ่มงาน" color="#2db7f5">
                                <Icon.Info />
                            </Tooltip>}

                    </p>
                    <div>
                        {/* <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" /> */}
                        <QRCode value={qrCode} />
                    </div>
                    <div>
                        <p>ชื่อบัญชี : {accName}</p>
                        <p>จำนวนเงิน {amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท</p>
                    </div>
                    {orderDetail.artist_id == myId ?
                        message.checked == 0 ?
                            <p>รอลูกค้าจ่ายเงิน</p>
                            : null
                        :
                        message.checked == 0 ?
                            <Button icon={<UploadOutlined />} size="large" shape="round" onClick={() => ModalToggle(message.step_id)} > อัปโหลดใบเสร็จชำระเงิน</Button>
                            : <p>แนบใบเสร็จชำระเงินแล้ว</p>
                    }
                </Flex>
            }

            {/*ส่งสลิปลแว้ รอเช็คสลิป */}
            {message?.step_name?.includes('ตรวจสอบใบเสร็จ') && message.status == null && message.status == undefined &&
                <Flex wrap='wrap' className="system-message qrcode sys-dialog" gap="small" justify="center" align="center" vertical>
                    <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} น.</p>
                    {/* {message.msgId} */}
                    {orderDetail.artist_id == myId &&
                        <p className="h4">
                            {!message?.step_name?.includes('2') ? 'ตรวจสอบใบเสร็จชำระเงินครึ่งแรก' : "ตรวจสอบใบเสร็จชำระเงินครึ่งหลัง"}
                        </p>
                    }
                    <div onClick={() => handleFullImg("https://s359.kapook.com/pagebuilder/ba154685-db18-4ac7-b318-a4a2b15b9d4c.jpg")}>
                        <img src="https://s359.kapook.com/pagebuilder/ba154685-db18-4ac7-b318-a4a2b15b9d4c.jpg" />
                    </div>
                    {orderDetail.artist_id == myId &&
                        <Flex wrap='wrap' gap='small' justify='center'>
                            {message.checked == 0 ? <>
                                <Button size="large" shape="round" onClick={() => approveSlip(message.step_id, message.step_name)} >ยอมรับสลิป</Button>
                                <Button size="large" shape="round" onClick={() => rejectSlip(message.step_id, message.step_name)} danger >ไม่ยอมรับสลิป</Button>
                                {/* <Button size="large" type="primary" shape="round" >ลบภาพร่าง</Button> */}
                            </>
                                : <p>ตรวจสอบใบเสร็จชำระเงินแล้ว</p>
                            }
                        </Flex>
                    }

                </Flex>
            }

            {/*  = สลิปผ่าน */}
            {message?.step_name?.includes('ตรวจสอบใบเสร็จ') && message.status == 'a' &&
                <Flex wrap='wrap' className="system-message qrcode sys-dialog" gap="small" justify="center" align="center" vertical >
                    <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} น.</p>
                    <p>{message.message}</p>
                </Flex>
            }

            {/*  = สลิปไม่ผ่าน */}

            {message?.step_name?.includes('ตรวจสอบใบเสร็จ') && message.status == 'c' &&
                <Flex wrap='wrap' className="system-message qrcode sys-dialog" gap="small" justify="center" align="center" vertical >
                    <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} น.</p>
                    <p>ใบเสร็จชำระเงินไม่ถูกต้อง กรุณาอัปโหลดใบเสร็จการชำระเงินใหม่</p>
                </Flex>
            }

            {message?.step_name?.includes("ภาพ") && message.status == null && message.status == undefined &&
                <Flex wrap='wrap' className="system-message progress sys-dialog-wip" gap="small" justify="center" align="center" vertical>
                    {/* {message.msgId} */}
                    <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} น.</p>
                    <p className="h4">{message.step_name}</p>
                    <div className="progress-img-container" >
                        {Array.isArray(message.img) && message.img.map((img) => {
                            return <div><Image src={img}
                                preview={{
                                    toolbarRender: (
                                        _,
                                        {
                                            transform: { scale },
                                            actions: { onZoomOut, onZoomIn },
                                        },
                                    ) => (
                                        <Space size={12} className="toolbar-wrapper">
                                            <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                            <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                                        </Space>
                                    ),
                                }} /></div>
                        })}
                        {!Array.isArray(message.img) && <div><Image src={message.img}
                            preview={{
                                toolbarRender: (
                                    _,
                                    {
                                        transform: { scale },
                                        actions: { onZoomOut, onZoomIn },
                                    },
                                ) => (
                                    <Space size={12} className="toolbar-wrapper">
                                        <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                        <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                                    </Space>
                                ),
                            }} /></div>
                        }
                    </div>
                    <Flex wrap='wrap' gap="small" justify="center">
                        {
                            orderDetail.artist_id !== myId ?
                                message.checked == 0 ? <>
                                    <Button size="large" shape="round" onClick={() => editProgress(message.step_id, message.step_name)} >แก้ไขภาพ {orderDetail.od_number_of_edit}/{orderDetail.pkg_edits}</Button>
                                    <Button size="large" shape="round" onClick={() => approveProgress(message.step_id, message.step_name)} >อนุมัติภาพ</Button>

                                </>
                                    : <p>ดำเนินการแล้ว</p>
                                : message.checked == 0 ? <>
                                    <Flex wrap='wrap' justify='flex-start' gap="middle" vertical style={{ width: "100%" }}>
                                        <p><InfoCircleOutlined /> รอลูกค้าตรวจสอบว่าต้องการอนุมัติหรือแก้ไขภาพ ({orderDetail.od_number_of_edit}/{orderDetail.pkg_edits})</p>
                                        <Flex wrap='wrap' justify='center'>
                                            <Button size="large" shape="round" onClick={() => delProgress(message.step_id, message.step_name, message.msgId)} style={{ width: "fit-content" }} danger icon={<DeleteOutlined />}></Button>
                                        </Flex>
                                    </Flex>

                                </>
                                    : <p>ดำเนินการแล้ว</p>
                        }

                    </Flex>
                </Flex>}

            {message?.step_name?.includes("ภาพ") && message.status !== null && message.status !== undefined &&
                <Flex wrap='wrap' gap="small" justify="center" align="center" vertical className="sys-dialog">
                    <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })} น.</p>
                    <p>{message.message}</p>
                </Flex>
            }

            {message?.step_name == "รีวิว" &&
                <>
                    <Flex wrap='wrap' key={message.index} gap="small" justify="center" align="center" vertical className="sys-dialog">
                        <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })} น.</p>
                        {orderDetail.artist_id == myId ? <p>รีวิว</p> : <p>รีวิว</p>}
                        <p><u>ลิ้งโหลดงาน</u></p>

                        {orderDetail.artist_id !== myId ?
                            message.checked !== 0 ?
                                <>
                                    <Button size="large" type="primary" shape="round" onClick={ReviewModalHandle} >รีวิว</Button>
                                </>
                                : <p>รีวิวแล้ว</p>
                            : null
                        }
                    </Flex>
                </>
            }

            {message?.step_name.includes("แอดมิน") && message?.status == null &&
                <>
                    <Flex wrap='wrap' key={message.index} gap="small" justify="center" align="center" vertical className="sys-dialog">
                        <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })} น.</p>
                        รอระบบตรวจสอบความเหมือนของรูปภาพไฟนัล
                    </Flex>
                </>
            }

            {message?.step_name.includes("แอดมิน") && message?.status != null &&
                <>
                    <Flex wrap='wrap' key={message.index} gap="small" justify="center" align="center" vertical className="sys-dialog">
                        {/* {orderDetail.artist_id == myId ? <p>รีวิว</p> : <p>รีวิว</p>} */}
                        <p className='time-sent'>{new Date(message.created_at).toLocaleString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })} น.</p>
                        <Icon.CheckCircle style={{ color: "#b7eb8f", width: "50px", height: "50px" }} />
                        <p>ไม่มีรูปภาพที่เหมือนในระบบ</p>
                        {/* <Button size="large" type="primary" shape="round" onClick={ReviewModalHandle} >รีวิว</Button> */}
                        {orderDetail.artist_id !== myId ?
                            message.checked == 0 ?
                                <>
                                    <Button size="large" type="link" shape="round">
                                        <Flex align='center' gap='small'>
                                            ดาวน์โหลดรูปภาพไฟนัล<Icon.Download />

                                        </Flex>

                                    </Button>
                                    <Button size="large" type="primary" shape="round" onClick={ReviewModalHandle} >รีวิว</Button>
                                </>
                                : null
                            : null
                        }
                    </Flex>
                </>
            }



            <Modal title="แนบใบเสร็จชำระเงิน" open={IsModalOpen} footer="" onCancel={ModalToggle} style={{ maxWidth: "1000px" }}>
                <Flex wrap='wrap' gap="small" justify="center" align="center" vertical className="big-uploader">

                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="avatar"
                                style={{
                                    width: '100%',
                                    objectFit: "cover"
                                }}
                            />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                    {/* <Button icon={<UploadOutlined />} >อัปโหลดสลิป</Button> */}
                    <Button icon={<UploadOutlined />} disabled={imageUrl === null} onClick={() => uploadSlip(stepIdRef.current)}>อัปโหลดสลิป</Button>
                </Flex>
            </Modal>

            <Modal title="รีวิวคอมมิชชัน" open={IsReviewModalOpen} footer="" onCancel={ReviewModalHandle} style={{ maxWidth: "1000px" }}>
                {/* <Flex wrap='wrap' gap="small" justify="center" align="center" vertical className="big-uploader"> */}
                <Form
                    layout="vertical"
                    onFinish={submitReview}>
                    <Flex wrap='wrap' justify='center'>
                        <Rate onChange={setReviewValue} value={reviewValue} allowClear={false} />
                    </Flex>
                    <Form.Item name='comment' label="ความคิดเห็น" style={{ textAlign: "center" }}>
                        <Input.TextArea placeholder="เขียนความคิดเห็น..."
                            showCount maxLength={200}
                            autoSize={{
                                minRows: 2,
                                maxRows: 6,
                            }} />
                    </Form.Item>
                    <Form.Item >
                        <Flex wrap='wrap' gap="small" justify='flex-end'>
                            {/* <Button htmlType="submit" size="large" shape="round">ยกเลิก</Button> */}
                            <Button size="large" type="primary" shape="round" htmlType='submit'>ส่งรีวิว</Button>
                        </Flex>
                    </Form.Item>
                </Form>
                {/* </Flex> */}
            </Modal>
        </>
    )
}
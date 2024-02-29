import { Modal, Button, Input, Select, Space, Upload, Rate, Flex, Tooltip, InputNumber, Form } from 'antd';
import { useState, useRef } from 'react';
import { InfoCircleOutlined, LoadingOutlined, PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import * as Icon from 'react-feather';
import ImgFullscreen from './openFullPic'
import QRCode from "qrcode.react";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import axios from "axios";
import { host } from "../utils/api";

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

export default function OrderSystemMsg({  curStepId, sendReview, cancelRequest, orderDetail, phoneNumber, amount, accName, qrCode, handleBrief, message, acceptRequest, approveProgress, setPrice, submitSlip, approveSlip, rejectSlip, editProgress, delProgress, myId, scrollRef }) {
    // console.log(orderDetail);
    const flexSysDialog = { width: "50%", alignSelf: "center", margin: "1rem 0", borderRadius: "1rem", padding: "1rem", boxShadow: "rgb(133 126 139 / 0%) 0px 2px 6px 0px, rgb(188 187 193 / 10%) 0px 1px 11px 0px, rgb(195 196 207 / 5%) 0px 7px 28px 8px", backgroundColor: " white" }
    const flexSysDialogWip = { width: "80%", alignSelf: "center", margin: "1rem 0", borderRadius: "1rem", padding: "1rem", boxShadow: "rgb(133 126 139 / 0%) 0px 2px 6px 0px, rgb(188 187 193 / 10%) 0px 1px 11px 0px, rgb(195 196 207 / 5%) 0px 7px 28px 8px", backgroundColor: " white" }

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
        const res = await submitSlip(stepId)
        res == true && ModalToggle()
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

    

    const submitReview = (values) => {
        Swal.fire({
            title: values.comment + reviewValue,
            showCancelButton: true,
            confirmButtonText: "ตกลง",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
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
            }
        });
    };


    return (
        <>
            <ImgFullscreen src={src} opened={fullImgOpened} handleFullImg={handleFullImg} acceptRequest={acceptRequest} />

            {message.step_id == 0 && message.status == "e" &&
                <Flex gap="small" justify="center" align="center" vertical style={flexSysDialog}>
                    {message.message}
                    {/* {orderDetail.artist_id == myId ? <p>ยอมรับคำขอแล้ว รอส่งภาพร่างให้ลูกค้า</p> : <p>นักวาดได้เปลี่ยนแปลงรายละเอียดออเดอร์แล้ว จากราคา XXX เป็น xxx และ XXX เป็น xxxx</p>} */}
                </Flex>}
            

            {
                message.step_name == "ส่งคำขอจ้าง" &&
                <>
                    <Flex key={message.index} gap="small" justify="center" align="center" vertical style={flexSysDialog}>
                        {orderDetail.artist_id == myId ? <p>ลูกค้าส่งคำขอจ้างถึงคุณ</p> : <p>คุณส่งคำขอจ้างแล้ว</p>}
                        <Button size='large' type='link' onClick={handleBrief}>ดูบรีฟ</Button>

                        {orderDetail.artist_id == myId ?
                            message.checked == 0 ?
                                <Flex gap="small">
                                    <Button size="large" shape="round" onClick={() => acceptRequest(message.step_id, message.step_name)} > ยอมรับคำขอจ้าง</Button>
                                    <Button size="large" danger shape="round" onClick={() => cancelRequest(message.step_id, message.step_name)} > ยกเลิกคำขอจ้าง</Button>
                                </Flex>
                                : null
                            : null
                        }
                    </Flex>
                </>
            }


            {message.step_name == "รับคำขอจ้าง" && message.status !== "c" &&
                <Flex gap="small" justify="center" align="center" vertical style={flexSysDialog}>
                    {orderDetail.artist_id == myId ? <p>ยอมรับคำขอแล้ว รอส่งภาพร่างให้ลูกค้า</p> : <p>นักวาดยอมรับคำขอจ้างแล้ว</p>}
                </Flex>}

            {/*! -----but ปฏิเสธ-------*/}
            {message.step_name == "รับคำขอจ้าง" && message.status == "c" &&
                <Flex gap="small" justify="center" align="center" vertical style={flexSysDialog}>
                    {orderDetail.artist_id == myId ? <p>ยกเลิกคำขอจ้างแล้ว</p> : <p>นักวาดยกเลิกคำขอจ้างแล้ว</p>}
                </Flex>}

            {message.step_name == "ระบุราคา" && message.status == null && message.status == undefined && orderDetail.artist_id == myId &&
                <Flex gap="small" justify="center" align="center" vertical style={flexSysDialog}>
                    <p className="h4"> ระบุราคาคอมมิชชัน</p>
                    {message.checked == 0 ?
                        <>
                            <InputNumber suffix="บาท" className="inputnumber-css" ref={priceRef} />
                            <Button size="large" type="primary" shape="round" onClick={() => setPrice(message.step_id, message.step_name, priceRef.current.value)} > แจ้งราคา</Button>
                        </>
                        : <p>กำหนดราคาแล้ว</p>}


                </Flex>
            }

            {message.step_name == "ระบุราคา" && message.status !== null && message.status !== undefined &&
                <Flex gap="small" justify="center" align="center" vertical style={flexSysDialog}>
                    <p>{orderDetail.artist_id == myId ? 'คุณ' : 'นักวาด'}{message.message}</p>
                </Flex>}

            {message?.step_name?.includes('แนบสลิป') && message.status == null && message.status == undefined &&
                <Flex className="system-message qrcode" gap="small" justify="center" align="center" vertical style={flexSysDialog}>
                    <p className="h4">{!message?.step_name?.includes('2') ? 'ชำระเงินครึ่งแรก' : "ชำระเงินครึ่งหลัง"}
                        <Tooltip title="มีการจ่ายเงินสองรอบ จ่ายครั้งแรกหลังนักวาดส่งภาพร่าง จ่ายเงินครั้งที่สองหลังจากที่งานดำเนินไปได้ 50% แล้ว" color="#2db7f5">
                            <Icon.Info />
                        </Tooltip>
                    </p>
                    <div>
                        {/* <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" /> */}
                        <QRCode value={qrCode} />
                    </div>
                    <div>
                        <p>ชื่อบัญชี : {accName}</p>
                        <p>จำนวนเงิน {amount} บาท</p>
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
            {message?.step_name?.includes('ตรวจสอบใบเสร็จ') && message.status == null && message.status == undefined && orderDetail.artist_id == myId &&
                <Flex className="system-message qrcode" gap="small" justify="center" align="center" vertical style={flexSysDialog}>
                    <p className="h4">{!message?.step_name?.includes('2') ? 'ตรวจสอบใบเสร็จชำระเงินครึ่งแรก' : "ตรวจสอบใบเสร็จชำระเงินครึ่งหลัง"}</p>
                    <div onClick={() => handleFullImg("https://s359.kapook.com/pagebuilder/ba154685-db18-4ac7-b318-a4a2b15b9d4c.jpg")}>
                        <img src="https://s359.kapook.com/pagebuilder/ba154685-db18-4ac7-b318-a4a2b15b9d4c.jpg" />
                    </div>
                    <Flex gap='small' justify='center'>
                        {message.checked == 0 ? <>
                            <Button size="large" shape="round" onClick={() => approveSlip(message.step_id, message.step_name)} >ยอมรับสลิป</Button>
                            <Button size="large" shape="round" onClick={() => rejectSlip(message.step_id, message.step_name)} danger >ไม่ยอมรับสลิป</Button>
                            {/* <Button size="large" type="primary" shape="round" >ลบภาพร่าง</Button> */}
                        </>
                            : <p>ตรวจสอบใบเสร็จชำระเงินแล้ว</p>
                        }
                    </Flex>
                </Flex>
            }

            {/*  = สลิปผ่าน */}
            {message?.step_name?.includes('ตรวจสอบใบเสร็จ') && message.status !== null && message.status !== undefined &&
                <Flex className="system-message qrcode" gap="small" justify="center" align="center" vertical style={flexSysDialog}>
                    <p>{message.message}</p>
                </Flex>
            }

            {message?.step_name?.includes("ภาพ") && message.status == null && message.status == undefined &&
                <Flex className="system-message progress" gap="small" justify="center" align="center" vertical style={flexSysDialogWip}>
                    <p className="h4">{message.step_name}</p>
                    <div className="progress-img-container">
                        {Array.isArray(message.img) && message.img.map((img) => {
                            return <div onClick={() => handleFullImg(img)}><img src={img} /></div>
                        })}
                        {!Array.isArray(message.img) && <div onClick={() => handleFullImg(message.img)}><img src={message.img} /></div>
                        }
                    </div>
                    <Flex gap="small">
                        {
                            orderDetail.artist_id !== myId ?
                                message.checked == 0 ? <>
                                    <Button size="large" shape="round" onClick={() => editProgress(message.step_id, message.step_name)} >แก้ไขภาพ {orderDetail.od_number_of_edit}/{orderDetail.pkg_edits}</Button>
                                    <Button size="large" shape="round" onClick={() => approveProgress(message.step_id, message.step_name)} >อนุมัติภาพ</Button>
                                    <Button size="large" shape="round" onClick={() => delProgress(message.step_id, message.step_name, message.msgId)} danger icon={<DeleteOutlined />}></Button>
                                </>
                                    : <p>ดำเนินการแล้ว</p>
                                : message.checked == 0 ? <>
                                    <Flex justify='flex-start' style={{ width: "100%" }}>
                                        <p><InfoCircleOutlined /> รอลูกค้าตรวจสอบว่าต้องการอนุมัติหรือแก้ไขภาพ ({orderDetail.od_number_of_edit}/{orderDetail.pkg_edits})</p>
                                    </Flex>
                                </>
                                    : <p>ดำเนินการแล้ว</p>
                        }

                    </Flex>
                </Flex>}

            {message?.step_name?.includes("ภาพ") && message.status !== null && message.status !== undefined &&
                <Flex gap="small" justify="center" align="center" vertical style={flexSysDialog}>
                    <p>{message.message}</p>
                </Flex>
            }

            {message?.step_name == "รีวิว" &&
                <>
                    <Flex key={message.index} gap="small" justify="center" align="center" vertical style={flexSysDialog}>
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

            {message?.step_name == "แอดมินอนุมัติผลงาน" &&
                <>
                    <Flex key={message.index} gap="small" justify="center" align="center" vertical style={flexSysDialog}>
                        {orderDetail.artist_id == myId ? <p>รีวิว</p> : <p>รีวิว</p>}
                        <p><u>อันนี้แอดมินต้องเป็นคนอนุมัติแต่ให้userมากดเองก่อนยังไม่มีหน้า</u></p>
                        <Button size="large" type="primary" shape="round" onClick={ReviewModalHandle} >รีวิว</Button>
                        {orderDetail.artist_id !== myId ?
                            message.checked !== 0 ?
                                <>
                                    <Button size="large" type="primary" shape="round" onClick={ReviewModalHandle} >รีวิว</Button>
                                </>
                                : <p>อนุมัติแล้ว</p>
                            : null
                        }
                    </Flex>
                </>
            }

            <Modal title="แนบใบเสร็จชำระเงิน" open={IsModalOpen} footer="" onCancel={ModalToggle} style={{ maxWidth: "1000px" }}>
                <Flex gap="small" justify="center" align="center" vertical className="big-uploader">
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

            <Modal title="รีวิว" open={IsReviewModalOpen} footer="" onCancel={ReviewModalHandle} style={{ maxWidth: "1000px" }}>
                {/* <Flex gap="small" justify="center" align="center" vertical className="big-uploader"> */}
                <Form
                    layout="vertical"
                    onFinish={submitReview}>
                    <Flex justify='center'>
                        <Rate  onChange={setReviewValue} value={reviewValue} allowClear={false} />
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
                        <Flex gap="small" justify='flex-end'>
                            <Button htmlType="submit" size="large" shape="round">ยกเลิก</Button>
                            <Button size="large" type="primary" shape="round" htmlType='submit'>ส่งรีวิว</Button>
                        </Flex>
                    </Form.Item>
                </Form>
                {/* </Flex> */}
            </Modal>
        </>
    )
}
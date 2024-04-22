import { NavbarUser, NavbarAdmin, NavbarGuest } from "../../components/Navbar";
import { Button, Space, Form, Input, Checkbox, Flex, Col, Steps } from "antd";
import ProfileImg from "../../components/ProfileImg";
import { useEffect, useState } from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";


export default function SetArtistProfile() {
    const { TextArea } = Input;
    const { step } = useParams();
    // const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);

    useEffect(() => {

        if (step == 'setpayment') {
            setCurrent(1)
        } else {
            setCurrent(0)
        }

    }, [step])

    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: 'ตั้งค่าข้อมูลส่วนตัว',
            // description,
        },
        {
            title: 'เพิ่มช่องทางการชำระเงิน',
            // description,
            // subTitle: 'Left 00:00:08',
        }
    ];
    return (
        <div className='body-con'>
            <NavbarGuest />

            <div className="body-lesspadding">
                <div className="container-xl">
                    <div className='content-body'>
                        <Flex style={{width:"50%"}}>
                        <Steps
                            current={current}
                            items={steps}
                            />
                        </Flex>
                        <Form
                            layout="vertical">

                            {current == 0 &&
                                <>
                                    <Flex style={{ marginTop: "2rem", marginBottom: "2rem"}} vertical>
                                        <h1 className="h3">ตั้งค่าข้อมูลส่วนตัว</h1>
                                        <p>บอกเราเล็กน้อยเกี่ยวกับตัวคุณเอง ข้อมูลนี้จะปรากฏบนโปรไฟล์สาธารณะของคุณ เพื่อให้ผู้ซื้อที่เป็นไปได้สามารถรู้จักคุณได้ดียิ่งขึ้น</p>
                                    </Flex>




                                    <Form.Item
                                        label="รูปภาพโปรไฟล์และปก">
                                        <div className="setting-img-box">
                                            <div
                                                className="setting-cover"
                                            // onClick={openCoverModal}
                                            // style={{ backgroundColor: cover }}
                                            >
                                                <div className="cover-hover">
                                                    <p className="fs-5">เปลี่ยนสีปก</p>
                                                </div>
                                            </div>
                                            <ProfileImg
                                            // src={userdata.urs_profile_img}
                                            // onPress={openProfileModal}
                                            />
                                            <div className="submit-color-btn-area">
                                                <Button shape="round" size="large" type="primary" className="submit-color-btn" htmlType="submit" >
                                                    บันทึกข้อมูล
                                                </Button>
                                            </div>
                                        </div>
                                    </Form.Item>

                                    <Form.Item
                                        label="คำอธิบายตัวเอง">
                                        <TextArea placeholder="แนะนำตนเอง แบ่งปันประสบการณ์ทำงาน และเงื่อนไขการทำงานของคุณ" />
                                    </Form.Item>

                                    <Link to='/setartistprofile/setpayment'>
                                        <Button>ถัดไป</Button>
                                    </Link>

                                </>
                            }

                            {current == 1 &&
                                <>
                                    <Flex style={{ marginTop: "1.5rem", marginBottom: "1rem" }} vertical>
                                        <h1 className="h3">เพิ่มช่องทางการชำระเงิน</h1>
                                        <p>กรอกชื่อบัญชีและเลขพร้อมพ์เพย์ของคุณเพื่อเป็นช่องทางการรับเงินจากลูกค้าโดยตรง</p>
                                    </Flex>




                                    <Form.Item label='ชื่อบัญชีพร้อมเพย์'>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="เลขพร้อมเพย์">
                                        <Input />
                                    </Form.Item>

                                <Flex justify="space-between">
                                    <Button type="text">ข้ามขั้นตอนนี้</Button>

                                    <Space>
                                        <Link to='/setartistprofile/setpersonalinfo'>
                                            <Button>ย้อนกลับ</Button>
                                        </Link>
                                        <Link to='/setartistprofile/setpayment'>
                                            <Button>ถัดไป</Button>
                                        </Link>
                                    </Space>


                                </Flex>
                                    

                                </>
                            }





                        </Form>

                        {/* {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
                                Next
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary">
                                Done
                            </Button>
                        )}
                        {current > 0 && (
                            <Button
                                style={{
                                    margin: '0 8px',
                                }}
                                onClick={() => prev()}
                            >
                                Previous
                            </Button>
                        )} */}




                    </div>
                </div>

            </div>

        </div>
    )
}
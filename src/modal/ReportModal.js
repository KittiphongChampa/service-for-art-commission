
import { NavbarUser, NavbarAdmin, NavbarHomepage, NavbarGuest } from "../components/Navbar";
import * as Icon from 'react-feather';
import { useState } from "react";
import { Input, Radio, Space, Button, Form,  message} from 'antd';

export default function ReportModal(props) {

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const [value, setValue] = useState();
    const [isNext, setIsNext] = useState(false);

    function handleNext() {
        setIsNext(preveState => !preveState)
    }

    const [form] = Form.useForm();

    const onFinish = () => {
        message.success('Submit success!');
    };

    const onFinishFailed = () => {
        message.error('Submit failed!');
    };

    const onFill = () => {
        form.setFieldsValue({
            url: 'https://taobao.com/',
        });
    };

    return (
        <>
            <div className="modal-area" id="modalArea2">
                <div className="container">
                    <div className="form-modal">
                        <div className="close-tab" onClick={props.handleModal}><Icon.X /></div>
                        <div className="form-area">
                            <h2 style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>รายงาน</h2>
                            {/* <form > */}
                            
                            {!isNext && <>
                                
                                <Radio.Group onChange={onChange} value={value} >
                                    <Space direction="vertical">
                                        <div><Radio value="spam"><p className="report-headding">สแปม</p></Radio>
                                            <p className="report-desc ms-4">ทำให้เข้าใจผิดหรือเป็นโพสท์ซ้ำ</p>
                                        </div>
                                        <div><Radio value="ละเมิด"><p className="report-headding">ละเมิดทรัพย์สินทางปัญญา</p></Radio>
                                            <p className="report-desc ms-4">มีการละเมิดลิขสิทธิ์หรือเครื่องหมายการค้า</p>
                                        </div>
                                        <div><Radio value="ss"><p className="report-headding">ภาพลามกอนาจารหรือเนื้อหาเกี่ยวกับเรื่องเพศ</p></Radio>
                                            <p className="report-desc ms-4">เนื้อหาทางเพศที่โจ่งแจ้งซึ่งเกี่ยวข้องกับผู้ใหญ่หรือภาพเปลือย ไม่ใช่ภาพเปลือย หรือการใช้ในทางที่ผิดโดยเจตนาเกี่ยวกับผู้เยาว์</p>
                                        </div>
                                        <div><Radio value="s"><p className="report-headding">
                                            กิจกรรมที่แสดงความเกลียดชัง</p></Radio>
                                            <p className="report-desc ms-4">อคติ การเหมารวม ลัทธิคนผิวขาว การใช้คำพูดส่อเสียด</p>
                                        </div>

                                        <div>
                                            <Radio value={4}>

                                                <p className="report-headding">อื่นๆ 
                                                    {value === 4 ? <Input style={{ width: 200, marginLeft: 10 }} /> : null}</p>
                                            </Radio>
                                        </div>
                                
                                        
                                    </Space>
                                </Radio.Group>
                                <div className="text-align-center">
                                    <button className={`lightblue-btn `} onClick={handleNext} disabled={value==null}>ถัดไป</button>
                                    <button className="cancle-btn" type="button" onClick={props.handleModal}>ยกเลิก</button>
                                </div>
                            
                            </>
                    
                            }
                            {value == "ละเมิด" && isNext &&
                                <>
                                <p>รายงาน : การละเมิดทรัพย์สินทางปัญญา</p>

                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                    className="ant-form"
                                >
                                    <Form.Item
                                        name="rp-detail"
                                        label="รายละเอียดการแจ้งรายงาน"
                                        rules={[{ required: true,message:"กรุณากรอกฟิลด์นี้" },  { type: 'string', max: 100 }]}
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
                                    <Form.Item>
                                        <Space>
                                            {/* <Button type="primary" htmlType="submit">
                                                Submit
                                            </Button> */}
                                            {/* <Button htmlType="button" onClick={onFill}>
                                                Fill
                                            </Button> */}
                                        </Space>
                                    </Form.Item>
                                </Form>



                                <div className="text-align-center">
                                    <button className={`lightblue-btn `} onClick={handleNext} disabled>รายงาน</button>
                                    <button className="cancle-btn" type="button" onClick={props.handleModal}>ย้อนกลับ</button>
                                </div>
                                
                                </>}
                            
                            {value !== "ละเมิด" && isNext &&
                                <>
                                    <p>รายงาน : xxxxxx</p>

                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={onFinish}
                                        onFinishFailed={onFinishFailed}
                                        autoComplete="off"
                                        className="ant-form"
                                    >
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
                                        <Form.Item>
                                            <Space>
                                                {/* <Button type="primary" htmlType="submit">
                                                Submit
                                            </Button> */}
                                                {/* <Button htmlType="button" onClick={onFill}>
                                                Fill
                                            </Button> */}
                                            </Space>
                                        </Form.Item>
                                    </Form>



                                    <div className="text-align-center">
                                    <button className={`lightblue-btn `} onClick={handleNext} disabled>รายงาน</button>
                                        <button className="cancle-btn" type="button" onClick={props.handleModal}>ย้อนกลับ</button>
                                    </div>

                                </>}
                            {/* </form> */}
                        </div>
                    </div>
                </div>
            </div></>
    )
}
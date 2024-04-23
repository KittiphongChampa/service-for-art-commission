import "../css/indexx.css";
import * as Icon from 'react-feather';
import { Rate } from 'antd';
import { host } from "../utils/api";



export default function ReportItem(props) {

    return (
        <div className="report-card">
            <div className="cms-card-grid">
                <div className="cms-card-img"
                    style={{ backgroundImage: `url("${props.ex_img_path}")` }}
                ></div>
                <div className="report-card-text-box">
                    <div>
                        <p>ผลงาน {props.type}</p>
                        <p className="headding">{props.sendrp_header}</p>
                    </div>
                    <div>
                        <p>แจ้งโดย {props.usr_reporter_id} {props.urs_name}</p>
                        <p>เมื่อ {props.created_at}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


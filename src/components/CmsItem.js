import "../css/indexx.css";
import * as Icon from "react-feather";
import { Rate } from "antd";

export default function CmsItem(props) {
    console.log(props);
  return (
    <div class="cms-card">
      {/* <Icon.Check className="cms-status" style={{ backgroundColor: `#b7eb8f`,color:'green !important' }}/> */}
      {/* <i data-feather="check" class="nav-icon cms-status"></i> */}
      <div class="cms-card-grid">
        <div
          class="cms-card-img col"
          style={{ backgroundImage: `url("${props.src}")` }}
        >
          <div className="status-wrapper" >
            <p className={props.status}> {props.status == "open" ? "เปิด" : "ปิด"} </p>
            {/* ถ้าปิดเป็น classname close */}
          </div>
        </div>
        <div class="cms-card-text-box">
          <div>
            <p class="cms-card-headding text-center">{props.headding}</p>
            <p class="cms-card-price">{props.price}+ THB</p>
          </div>
          <div>
            <Rate disabled defaultValue={2} className="one-star" />
            {props.cms_all_review} ({props.total_reviews} รีวิว)
          </div>
        </div>
      </div>
    </div>
  );
}

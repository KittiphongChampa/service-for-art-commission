import { log } from "util";
import "../css/profileimg.css";

export default function ProfileImg(props) {
    console.log(props);
    let imgbrowse = "imgbrowse"
    let display = "flex" 
    if (props.type === "only-show") {
        imgbrowse = null
        display = "none" 
        
    }



    return (
        <>
            <div className={`profile-img ${imgbrowse}`} onClick={props.onPress}>
                <div className="edit-img-hover" style={{ display: `${display}` }}><p>เปลี่ยนโปรไฟล์</p></div>
                <img src={props.src == null || props.src == undefined ? props.basedProfile : props.src } alt="" />
            </div>
        </>
    )
}
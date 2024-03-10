import { Rate } from 'antd';

export default function ArtistBox(props) {
    const {img, name} = props;

    return (
        <>
            <div className="artist-box">
                <div className="img-wrapper"><img src={img} /></div>
                <div>
                    <p>{name}</p>
                    <Rate disabled defaultValue={2} className="one-star" />{props.rw_star} ({props.rw_number} รีวิว)
                </div>
            </div>
        </>
    )

}
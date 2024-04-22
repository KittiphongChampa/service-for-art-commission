import { Rate } from 'antd';

export default function ArtistBox(props) {
    const {img, name, all_review, total_reviews} = props;
    console.log(all_review);

    return (
        <>
            <div className="artist-box">
                <div className="img-wrapper"><img src={img} /></div>
                <div>
                    <p>{name}</p>
                    <Rate disabled defaultValue={2} className="one-star" />{ all_review == null ? 0 : all_review } ({total_reviews} รีวิว)
                </div>
            </div>
        </>
    )

}
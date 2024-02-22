import "../css/indexx.css";

export default function BgBody(props) {
    const body = { backgroundImage: props.bgImg, backgroundPosition: 'center', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }
    return (
        <>
            <div style={body}/>
        </>
    )
}

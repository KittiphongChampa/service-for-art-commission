
import React, { useState, useEffect, useRef, createElement } from "react";
import * as Icon from 'react-feather';

// import { Watermark } from 'antd';

export default function ImgFullscreen(props) {
    const [modalSrc, setModalSrc] = useState('');

    // console.log("จากพร็อพ",modalSrc)

    // useEffect(() => {

    //     const originalImage = new Image();
    //     originalImage.src = props.src;
    //     const watermarkImage = new Image();
    //     watermarkImage.src = '../watermark.png';
    //     watermarkImage.onload = function () {
    //         const canvas = document.createElement('canvas');
    //         canvas.width = originalImage.width; //500
    //         canvas.height = originalImage.height; //300

    //         // ถ้าภาพออริจินัลสูงมากกว่ากว้าง ให้ขยายความกว้างแล้วความสูงเป็นออโต้
    //         //ถ้าภาพออริจินัลกว้างมากกว่าสูง ให้ขยายความสูงแล้วความกว้างเป็นออโต้
    //         //ถ้าเป็นภาพสี่เหลี่ยมจตุรัสให้สูงและกว้างเท่ากันไปเลย

    //         const ctx = canvas.getContext('2d');
    //         ctx.drawImage(originalImage, 0, 0);
    //         var watermarkWidth = null
    //         var watermarkHeight = null
    //         if (originalImage.width <= originalImage.height) {
    //             watermarkHeight = canvas.height
    //             watermarkWidth = (canvas.height - watermarkImage.height) + watermarkImage.width
    //             // alert("if")

    //         } else if (originalImage.height <= originalImage.width) {
    //             watermarkHeight = (canvas.width - watermarkImage.width) + watermarkImage.height
    //             watermarkWidth = canvas.width
    //             // alert("else if")

    //         } else {
    //             watermarkWidth = canvas.width
    //             watermarkHeight = canvas.height
    //             // alert("else")
    //         }

    //         const watermarkX = (canvas.width - watermarkWidth) / 2;
    //         const watermarkY = (canvas.height - watermarkHeight) / 2;

    //         ctx.drawImage(watermarkImage, watermarkX, watermarkY, watermarkWidth, watermarkHeight);

    //         const mergedImage = new Image();
    //         mergedImage.src = canvas.toDataURL('image/png');
    //         setModalSrc(mergedImage.src);
    //         // alert(mergedImage.src)
    //         // alert(modalSrc)
    //         // imageContainer.appendChild(mergedImage);}

    //     }
    // }, [props.src]);



    const [zoomIn, setZoomIn] = useState(true);


    if (!props.opened) return null;

    function handleZoom() {
        const imgComponent = document.getElementById('img')
        const modalComponent = document.getElementsByClassName('modall')

        if (zoomIn) {
            imgComponent.style.height = 'auto';
            imgComponent.style.width = '100%'
            modalComponent[0].style.justifyContent = 'unset'
            modalComponent[0].style.alignItems = 'unset'
        } else {
            imgComponent.style.height = '100%';
            imgComponent.style.width = 'auto'
            modalComponent[0].style.justifyContent = 'center'
            modalComponent[0].style.alignItems = 'center'
        }
        setZoomIn(prevState => !prevState)
    }
    return (
        <>
            <div className="modall" >
                <button className="close-img" onClick={props.handleFullImg}><Icon.X /></button>
                {/* <img className={zoomIn ? 'zoom-in' : 'zoom-out'} id="img" src={modalSrc} onClick={handleZoom} /> */}
                <img className={zoomIn ? 'zoom-in' : 'zoom-out'} id="img" src={props.src} onClick={handleZoom} />
            </div >
        </>)

}
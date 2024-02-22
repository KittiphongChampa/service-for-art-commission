
// import Watermark from '@uiw/react-watermark';
import watermark from 'watermarkjs'; // นำเข้า watermarkjs
import { useEffect, useState } from 'react';


export default function WatermarkedImg(props) {

    const [mergedImgSrc, setMergedImgSrc] = useState('');
    const [allImgLoaded, setAllImgLoaded] = useState(false);

    useEffect(() => {
        const originalImage = new Image();
        originalImage.src = props.src;
        const watermarkImage = new Image();
        watermarkImage.src = 'watermark.png';

        // เมื่อรูปภาพลายน้ำโหลดเสร็จ

        var originalImageL = false
        var watermarkImageL = false

        originalImage.onload = function () {
            originalImageL = true
            console.log('ภาพ' + props.src)
            console.log(originalImageL)
            checkBothImagesLoaded();

        }

        watermarkImage.onload = function () {
            watermarkImageL = true
            console.log('ภาพลายน้ำโหลดเสร็จแล้ว')
            console.log(watermarkImageL)
            checkBothImagesLoaded();
        }

        const checkBothImagesLoaded = () => {
            if (originalImageL && watermarkImageL) {
                setAllImgLoaded(true)
                const canvas = document.createElement('canvas');
                canvas.width = originalImage.width; //500
                canvas.height = originalImage.height; //300

                // ถ้าภาพออริจินัลสูงมากกว่ากว้าง ให้ขยายความกว้างแล้วความสูงเป็นออโต้
                //ถ้าภาพออริจินัลกว้างมากกว่าสูง ให้ขยายความสูงแล้วความกว้างเป็นออโต้
                //ถ้าเป็นภาพสี่เหลี่ยมจตุรัสให้สูงและกว้างเท่ากันไปเลย

                const ctx = canvas.getContext('2d');
                ctx.drawImage(originalImage, 0, 0);
                var watermarkWidth = null
                var watermarkHeight = null
                if (originalImage.width <= originalImage.height) {
                    watermarkHeight = canvas.height
                    watermarkWidth = (canvas.height - watermarkImage.height) + watermarkImage.width

                } else if (originalImage.height <= originalImage.width) {
                    watermarkHeight = (canvas.width - watermarkImage.width) + watermarkImage.height
                    watermarkWidth = canvas.width
                } else {
                    watermarkWidth = canvas.width
                    watermarkHeight = canvas.height
                }

                const watermarkX = (canvas.width - watermarkWidth) / 2;
                const watermarkY = (canvas.height - watermarkHeight) / 2;

                ctx.drawImage(watermarkImage, watermarkX, watermarkY, watermarkWidth, watermarkHeight);

                const mergedImage = new Image();
                mergedImage.src = canvas.toDataURL('image/png'); // เปลี่ยนเป็นรูปแบบที่คุณต้องการ
                // imageContainer.appendChild(mergedImage);
                setMergedImgSrc(mergedImage.src);

                // alert("else if")
            }
        };

    }, []);


    return (<>

        {allImgLoaded ? <img alt={props.src} src={mergedImgSrc} /> : <img alt={props.src} src={props.src} style={{ filter: "blur(4px)", pointerEvents: "none" }}/>}

        {/* <Watermark content={props.content} className='watermark-overlay'>
            <img src={props.src} className="watermarked-img s" id="s" />
        </Watermark> */}

    </>
    )
}
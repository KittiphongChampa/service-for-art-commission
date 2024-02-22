import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import {WatermarkedImg}
import { Watermark } from 'antd';

// import './styles.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import WatermarkedImg from './WatermarkedImg';
import { width } from '@mui/system';



function ImgSlide({imgDetail}) {

    return (
        <>
            {/* <Watermark content="Ant Design">
                <div></div>
            </Watermark>
            <img src="ares.png"></img> */}
            {/* <div><WatermarkedImg src="monlan.png" content="ลายนั้ม" /></div> */}
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 5500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="cms-example-swiper"
                >
                {Array.isArray(imgDetail) ? (
                    imgDetail.map((image) => (
                        <SwiperSlide key={image.ex_img_id}>
                        <img src={image.ex_img_path} alt={image.ex_img_name} />
                        </SwiperSlide>
                    ))
                    ) : (
                        <SwiperSlide key={imgDetail.ex_img_id}>
                        <img src={imgDetail.ex_img_path} alt={imgDetail.ex_img_name} />
                        </SwiperSlide>
                    )
                }
                
            </Swiper>
        </>
    );
}

export default ImgSlide;
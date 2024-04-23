import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import * as Icon from 'react-feather';
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import "../css/indexx.css";
import "../css/allbutton.css";
import "../css/profileimg.css";
import "../styles/main.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { Helmet } from "react-helmet";
// import DefaultInput from "../components/DefaultInput";
import { NavbarUser, NavbarAdmin, NavbarGuest } from "../components/Navbar";
import CmsItem from "../components/CmsItem";
import { Pagination, Input, Select, Empty, Tabs, Flex } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Scrollbar, Navigation } from 'swiper/modules';
import ArtistBox from '../components/ArtistBox'
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { host } from "../utils/api";

const title = 'หน้าแรก';
const bgImg = "";
const body = { backgroundImage: "url('images/seamoon.jpg')" }



export default function Index() {
  const { userdata, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const type = localStorage.getItem("type");

  useEffect(() => {
    if (token && type === "user") {
      getAritisIFollow();
      // getGalleryArtistIfollow();
      getArtistCommission();
    }
    getLatestCommission();
    getGalleryLatest();
    getTopTenArtist();
  }, []);

  const [topTenArtist, setTopTenArtist] = useState([]); //ท็อป 10 นักวาดประจำสัปดาห์

  const [cmsLatests, setCmsLatest] = useState([]); //คอมมิชชันล่าสุด
  const [cmsArtists, setCmsArtist] = useState([]); //คอมมิชชันของนักวาดที่ติดตาม

  const [gallerylatest, setGallerylatest] = useState([]); //งานวาดล่าสุด
  // const [galleryIfollow, setGalleryIFollow] = useState([]); //งานวาดของนักวาดที่ติดตาม

  const [IFollowerData, setIFollowerData] = useState([]);
  const [IFollowingIDs, setIFollowingIDs] = useState([]);

  const getLatestCommission = async () => {
    await axios.get(`${host}/latestCommission`).then((response) => {
      const Cmslatest = response.data;
      setCmsLatest(Cmslatest.commissions)
    })
  }
  const getArtistCommission = async () => {
    await axios.get(`${host}/artistCommission`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      if (response.data.status === 'ok') {
        const Cmsfollowing = response.data;
        setCmsArtist(Cmsfollowing.commissions);
      }
    })
  }
  const getGalleryLatest = async () => {
    await axios.get(`${host}/gallerry/latest`).then((response) => {
      const Gallerylatest = response.data;
      setGallerylatest(Gallerylatest.results)
    })
  }
  // const getGalleryArtistIfollow = async () => {
  //   await axios.get(`${host}/gallerry/Ifollow`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + token,
  //     },
  //   }).then((response) => {
  //     const data = response.data;
  //     if (data.status === 'ok') {
  //       setGalleryIFollow(data.results)
  //     }
  //   })
  // }

  //หาคนที่เรากำลังติดตามและติดตามเรา
  const getAritisIFollow = async () => {
    await axios
      .get(`${host}/profile`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          setIFollowingIDs(data.IFollowingsIds);
          const formData = new FormData();
          formData.append("iFollowing", data.IFollowingsIds);
          axios.post(`${host}/ArtistIndex`, formData, {
            headers: {
              Authorization: "Bearer " + token,
            }
          }).then((response) => {
            const data = response.data;
            setIFollowerData(data.results)
          })
        } else {
          // console.log("error");
        }
      })
  }

  const getTopTenArtist = async () => {
    await axios .get(`${host}/artist/top`).then((response) => {
      if (response.status == 200){
        setTopTenArtist(response.data.results)
      } else {
        setTopTenArtist('')
      }
    })
  }

  const { Search } = Input;
  const { submenu } = useParams();


  // useEffect(() => {
  //   // console.log(submenu)
  //   const oldSelected = document?.getElementsByClassName("selected")
  //   oldSelected[0]?.classList.remove("selected")
  //   if (submenu == null) {
  //     const menuSelected = document?.getElementById("explore")
  //     menuSelected?.classList.add("selected")
  //   } else {
  //     if (document.getElementById(submenu)) {
  //       document.getElementById(submenu).classList.add("selected")
  //     } else {
  //       if (submenu !== 'search') {
  //         window.location.href = `${host}/`;
  //       }
  //     }
  //   }
  // }, [submenu])

  useEffect(() => {
    setActivateKey(submenu)
  }, [submenu])


  const [activateKey, setActivateKey] = useState('explore')


  const menus = [
    {
      key: 'explore',
      label: <Link to="/" id="explore" >สำรวจ</Link>,
      children: <Explore type={type} isLoggedIn={isLoggedIn} cmsLatests={cmsLatests} cmsArtists={cmsArtists} IFollowerData={IFollowerData} gallerylatest={gallerylatest} topTenArtist={topTenArtist}/>,
    },
    {
      key: 'commissions',
      label: <Link to="/commissions" id="commissions">คอมมิชชัน</Link>,
      children: <Commissions IFollowingIDs={IFollowingIDs} />,
    },
    {
      key: 'gallery',
      label: <Link to="/gallery" id="gallery">งานวาด</Link>,
      children: <Gallery IFollowingIDs={IFollowingIDs} />,
    },
    {
      key: 'artists',
      label: <Link to="/artists" id="artists" >นักวาด</Link>,
      children: <Artists IFollowingIDs={IFollowingIDs} />,
    },
  ];

  // เกี่ยวกับ search
  const [search, setSearch] = useState('');
  const [user_SearchResult, setUserSearchResults] = useState([]);
  const [cms_SearchResult, setCmsSearchResults] = useState([]);
  const [art_SearchResult, setArtSearchResults] = useState([]);

  const handleSearch = async () => {
    // e.preventDefault();
    try {
      const response = await axios.get(`${host}/search?search=${search}`).then((response) => {
        const data = response.data;
        setUserSearchResults(data.users)
        setCmsSearchResults(data.cms_uniqueResults)
        setArtSearchResults(data.artwork)
      })

    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="body-con">
      <Helmet>
        <title>{title}</title>
      </Helmet>

      {isLoggedIn ? (
        type === 'admin' ? <NavbarAdmin /> : <NavbarUser />
      ) : (
        <NavbarGuest />
      )}
      <div class="body-nopadding">
        <div className="cover-index" style={{ backgroundImage: "url('images/seamoon_index.jpg')" }}>
          <div className="container-xl">
            <div class="search-container">
              <div className="search-box">
                {/* <Form
                onFinish={handleSearch}
              >

              </Form> */}
                <Link to="/search" id="search" >
                  <Search placeholder="ค้นหา.."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    htmlType="submit"
                    onSearch={handleSearch}
                    allowClear size="large" />
                </Link>
              </div>
            </div>

          </div>

        </div>
        <div className="container-xl">


          <div className=" content-container user-profile-contentCard" >
            {submenu !== 'search' ? <>
              <div>
                <Tabs activeKey={activateKey} defaultActiveKey="explore" onChange={setActivateKey} items={menus} />
              </div>
              {submenu == null
                ? null : submenu == "search" && <Search />}
            </> :
              <SearchResults search={search} user_SearchResult={user_SearchResult} cms_SearchResult={cms_SearchResult} art_SearchResult={art_SearchResult} />}
          </div>
        </div>
      </div>
    </div>
  );
}


function Commissions({ IFollowingIDs }) {

  const [Message, setMessage] = useState('');
  const [sortBy, setSortBy] = useState('ล่าสุด');
  const [filterBy, setFilterBy] = useState('all');
  const [cmsStatus, setCmsStatus] = useState('open');
  const [topicValues, setTopicValues] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
  const [topics, setTopics] = useState([]); //หัวข้อที่ดึงจาก DB
  const [commission, setCommission] = useState([]);
  const [filteredCms, setFilteredCms] = useState([])

  useEffect(() => {
    topic();
  }, []);

  useEffect(() => {
    fetchData();
  }, [sortBy, filterBy, topicValues, cmsStatus]);

  const topic = async () => {
    await axios.get(`${host}/getTopic`).then((response) => {
      const data = response.data;
      setTopics(data.topics)
    });
  }

  const all_option = [
    { value: 0, label: 'เลือกทั้งหมด' },
    ...topics.map((data) => ({
      value: data.tp_id,
      label: data.tp_name,
    })),
  ]

  const { Option } = Select;

  const children = [];

  // all_option.map((item, index) => (
  //   index === "0" ? <button>เลือกทั้งหมด</button> : children.push(<Option key={index}>{item}</Option>)
  // ))

  all_option.map((item) => (
    item.value === 0 ? (
      <button key={item.key}>เลือกทั้งหมด</button>
    ) : (
      children.push(<Option key={item.key} value={item.value}>{item.label}</Option>)
    )
  ));

  const newTopicValues = [];
  const [checkAll, setCheckAll] = useState(false)

  // value is topicValues
  function handleChange(value) {
    // console.log(topicValues[topicValues.length - 1])
    if (value.includes(0)) {
      if (value[value.length - 1] === 0) {
        // console.log("เลือกทั้งหมด = เพิ่งเพิ่มเข้ามา")
        all_option.map((item) => {
          newTopicValues.push(item.value);
        });

        setTopicValues(newTopicValues)
      } else {
        // console.log("เลือกทั้งหมด แต่กดเลือกไม่ครบ = มียุแล้ว")
        const filteredArray = value.filter(item => item !== 0);
        // อัปเดตค่าใน state ด้วยอาร์เรย์ที่ไม่มีสมาชิกที่มีค่า 0
        setTopicValues(filteredArray);
        //ถ้าความยาว=อาเรย์-1 แล้วไม่มีสมาชิก0 ในนั้น ให้ยกเลิกตัวเลือกทั้งหมดออก
      }
    } else {
      // console.log("เข้า",value);
      setTopicValues(value)
    }
  }

  const fetchData = () => {
    if (filterBy === 'all') {
      sortAndFilterData(); //หากเลือกนัดวาดทั้งหมดจะทำ
    } else {
      filter(); //หากเลือกนัดวาดที่ติดตามจะทำ
    }
  };

  const sortAndFilterData = () => {
    axios.get(`${host}/getCommission?sortBy=${sortBy}&topicValues=${topicValues}&cmsStatus=${cmsStatus}`).then((response) => {
      const data = response.data;
      setCommission(data.commissions)
      setFilteredCms(data.commissions.slice(startIndex, endIndex))
      setMessage('');
    });
  }

  //หาก filter กรองจาก ทำอันนี้
  const filter = () => {
    axios.get(`${host}/getCommission/Ifollow?sortBy=${sortBy}&IFollowingIDs=${IFollowingIDs}&topicValues=${topicValues}&cmsStatus=${cmsStatus}`).then((response) => {
      const data = response.data;
      if (data.status === 'ok') {
        setCommission(data.commissions)
        setFilteredCms(data.commissions.slice(startIndex, endIndex))
        setMessage('');
      } else {
        console.log('เข้า');
        setCommission([]);
        setFilteredCms([]);
        setMessage("ไม่มีคอมมิชชัน")
      }
    });
  }

  const handleSortByChange = (selectedOption) => {
    setSortBy(selectedOption);
  };

  const handleCmsStatusChange = (selectedOption) => {
    setCmsStatus(selectedOption)
  }
  const [activePage, setActivePage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(30);
  const itemsPerPage = 30;

  useEffect(() => {
    if (commission) {
      //หน้าเพจ - 1 = index 0 * จำนวนแสดงต่อหน้า 0-9 10-19 20-29
      const newStartIndex = (activePage - 1) * itemsPerPage;
      //เอาจำนวนที่เริ่ม + จำนวนที่แสดง (0+10 = 10) จะเป็น index 0-10 
      const newEndIndex = newStartIndex + (itemsPerPage);
      //index เริ่มและ index สุดท้าย
      setFilteredCms(commission.slice(newStartIndex, newEndIndex))
      setStartIndex(newStartIndex);
      setEndIndex(newEndIndex);
      // setFilterCmsReq(allData);
      console.log(activePage, newStartIndex, newEndIndex)
    }
  }, [activePage]);


  return (
    <>
      <div className="content-box">
        <div className="content-top">
          <p className="h3">คอมมิชชัน</p>
          {/* <p>ดูทั้งหมด&gt;</p> */}
          <div className="submenu-filter">

            เรียงตาม :
            <Select
              value={{ value: sortBy, label: sortBy }}
              style={{ width: 120 }}
              onChange={handleSortByChange}
              options={[
                { value: 'ล่าสุด', label: 'ล่าสุด' },
                { value: 'เก่าสุด', label: 'เก่าสุด' },
                { value: 'ราคา ↑', label: 'ราคา ↑' },
                { value: 'ราคา ↓', label: 'ราคา ↓' },
                { value: 'คะแนนรีวิว ↑', label: 'คะแนนรีวิว ↑' },
                { value: 'คะแนนรีวิว ↓', label: 'คะแนนรีวิว ↓' },
              ]}
            />


            สถานะ :<Select
              defaultValue="open"
              style={{ width: 100 }}
              onChange={handleCmsStatusChange}
              options={[
                { value: 'open', label: 'เปิด' },
                { value: 'close', label: 'ปิด' },
                { value: 'all', label: 'ทั้งหมด' },
              ]}
            />

            หัวข้อ : <Select
              mode="multiple"
              style={{ width: '10rem' }}
              placeholder="Please select"
              value={topicValues}
              id="topicSelector"
              onChange={handleChange}
              maxTagCount='responsive'
              options={all_option}
              allowClear
            >
              {/* {children} */}
            </Select>

            กรองจาก :
            <Select
              value={{ value: filterBy, label: filterBy === 'all' ? 'นักวาดทั้งหมด' : 'นักวาดที่ติดตาม' }}
              onChange={(selectedOption) => setFilterBy(selectedOption)}
              options={[
                { value: 'all', label: 'นักวาดทั้งหมด' },
                { value: 'follow', label: 'นักวาดที่ติดตาม' },
              ]}
            />

          </div>
        </div>


        {Message == '' ? (
          <div className="content-items">
            {filteredCms.length != 0 ? 
              (filteredCms?.map((cms) => (
                <Link to={`/cmsdetail/${cms.cms_id}`}>
                  <CmsItem src={cms.ex_img_path} headding={cms.cms_name} price={cms.pkg_min_price} desc={cms.cms_desc} total_reviews={cms.total_reviews} cms_all_review={cms.cms_all_review} status={cms.cms_status}/>
                </Link>
              ))) 
              : 
              <>
              <Flex justify="center">
                <Empty description={
                  <span>
                    ยังไม่มีข้อมูล
                  </span>
                } />
              </Flex>
              </>
            }
          </div>
        ) : (
          <Flex justify="center">
            <Empty description={
              <span>
                ยังไม่มีข้อมูล
              </span>
            } />
          </Flex>
        )}

        <Pagination
          total={commission == undefined ? 0 : commission.length}
          showQuickJumper
          showTotal={(total) => `จำนวน ${total} รายการ`}
          defaultPageSize={itemsPerPage}
          current={activePage}
          responsive
          onChange={setActivePage}
        />
      </div>
    </>
  )

}

function Explore({ type, isLoggedIn, cmsLatests, cmsArtists, IFollowerData, gallerylatest, galleryIfollow, topTenArtist }) {
  return (
    <>
          <div className="content-box">
        <div className="content-top">
          <p className="h3">TOP 10 นักวาดประจำสัปดาห์ (การจ้าง)</p>
        </div>

        <Swiper
          slidesPerView="auto"
          centeredSlides={false}
          slidesPerGroupSkip={1}
          spaceBetween={10}
          modules={[Navigation]}
          className="artistbox-swiper"
        >
          
          { topTenArtist.length != 0 ? topTenArtist.map(data => (
            <SwiperSlide>
              <a key={data.id} href={`/profile/${data.id}`}>
                <ArtistBox img={data.urs_profile_img} name={data.urs_name} all_review={data.urs_all_review} total_reviews={data.total_reviews}/>
              </a>
            </SwiperSlide>
          )) : <p>ไม่มีข้อมูลมากพอ</p>}
          
        </Swiper>
      </div>

      <div class="content-box">
        <div class="content-top">
          <p className="h3">คอมมิชชันล่าสุด</p>
          <Link to="/commissions"><p>ดูทั้งหมด&gt;</p></Link>
        </div>
      </div>
      <Swiper
        slidesPerView="auto"
        centeredSlides={false}
        slidesPerGroupSkip={1}
        spaceBetween={10}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        scrollbar={false}
        navigation={true}
        modules={[Keyboard, Scrollbar, Navigation]}
        className="cms-item-swiper"
      >
        {
          cmsLatests.length != 0 ?
          (cmsLatests.map(cmsLatest => (
            <SwiperSlide key={cmsLatest.cms_id}>
              <Link to={`/cmsdetail/${cmsLatest.cms_id}`} >
                <CmsItem 
                  src={cmsLatest.ex_img_path} 
                  headding={cmsLatest.cms_name} 
                  price={cmsLatest.pkg_min_price} 
                  desc={cmsLatest.cms_desc} 
                  cms_all_review={cmsLatest.cms_all_review} 
                  total_reviews={cmsLatest.total_reviews} 
                  status={cmsLatest.cms_status} />
              </Link>
            </SwiperSlide>
          ))) : <p>ยังไม่มีคอมมิชชัน</p>
        }
      </Swiper >

      <div class="content-box">
        <div class="content-top">
          <p className="h3">ผลงานล่าสุด</p>
          <Link to="/gallery"><p>ดูทั้งหมด&gt;</p></Link>
        </div>
        <Swiper
          slidesPerView="auto"
          centeredSlides={false}
          slidesPerGroupSkip={1}
          spaceBetween={10}
          grabCursor={true}
          keyboard={{
            enabled: true,
          }}
          scrollbar={false}
          navigation={true}
          modules={[Keyboard, Scrollbar, Navigation]}
          className="gall-item-swiper"
        >
          {
            gallerylatest.length != 0 ?
            (gallerylatest.map(data => (
              <SwiperSlide key={data.artw_id}>
                <Link to={`/artworkdetail/${data.artw_id}`}><img src={data.ex_img_path} /></Link>
              </SwiperSlide>
            ))) : <p>ยังไม่มีผลงานวาด</p>
          }
        </Swiper>

      </div>

      {isLoggedIn === true && type === "user" ? (
        <>
            <div className="content-box">
              <div className="content-top">
                <p className="h3">นักวาดที่คุณกำลังติดตาม</p>
                <Link to="/artists"><p>ดูทั้งหมด&gt;</p></Link>
              </div>

              <Swiper
                slidesPerView="auto"
                centeredSlides={false}
                slidesPerGroupSkip={1}
                spaceBetween={10}
                modules={[Navigation]}
                className="artistbox-swiper"
              >
                {
                  IFollowerData != "คุณไม่มีนักวาดที่ติดตาม" ? 
                  (IFollowerData.map(data => (
                    <SwiperSlide>
                      <a key={data.id} href={`/profile/${data.id}`}>
                        <ArtistBox img={data.urs_profile_img} name={data.urs_name} all_review={data.urs_all_review} total_reviews={data.total_reviews}/>
                      </a>
                    </SwiperSlide>
                  ))) : <p>คุณไม่มีนักวาดที่ติดตาม</p>
                }
                
              </Swiper>
            </div>

            <div className="content-box">
              <div className="content-top">
                <p className="h3">คอมมิชชันของนักวาดที่ติดตาม</p>
                <Link to="/commissions"><p>ดูทั้งหมด&gt;</p></Link>
              </div>
              <Swiper
                slidesPerView="auto"
                centeredSlides={false}
                slidesPerGroupSkip={1}
                spaceBetween={10}
                grabCursor={true}
                keyboard={{
                  enabled: true,
                }}
                scrollbar={false}
                navigation={true}
                modules={[Keyboard, Scrollbar, Navigation]}
                className="cms-item-swiper"
              >
                {
                  cmsArtists !== "คุณไม่มีนักวาดที่ติดตาม" ? (
                    cmsArtists.length !== 0 ? (
                      <Swiper>
                        {cmsArtists.map(cmsArtstdata => (
                          <SwiperSlide key={cmsArtstdata.cms_id}>
                            <Link to={`/cmsdetail/${cmsArtstdata.cms_id}`}>
                              <CmsItem
                                src={cmsArtstdata.ex_img_path}
                                headding={cmsArtstdata.cms_name}
                                price={cmsArtstdata.pkg_min_price}
                                desc={cmsArtstdata.cms_desc}
                                cms_all_review={cmsArtstdata.cms_all_review}
                                total_reviews={cmsArtstdata.total_reviews}
                                status={cmsArtstdata.cms_status}
                              />
                            </Link>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <p>ยังไม่มีคอมมิชชัน</p>
                    )
                  ) : (
                    <p>คุณไม่มีนักวาดที่ติดตาม</p>
                  )
                }

              </Swiper >
            </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

function Gallery({ IFollowingIDs }) {
  const [Message, setMessage] = useState('');
  const [sortBy, setSortBy] = useState('ล่าสุด'); //เรียงตาม
  const [filterBy, setFilterBy] = useState('all'); //กรองจาก
  const [topicValues, setTopicValues] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
  const [topics, setTopics] = useState([]); //หัวข้อที่ดึงจาก DB
  const [allGallery, setAllGallery] = useState([]);

  const newTopicValues = [];
  const { Option } = Select;
  const children = [];

  useEffect(() => {
    topic();
  }, []);

  useEffect(() => {
    fetchData();
  }, [sortBy, filterBy, topicValues]);

  const topic = () => {
    axios.get(`${host}/getTopic`).then((response) => {
      const data = response.data;
      setTopics(data.topics)
    });
  }

  const all_option = [
    { value: 0, label: 'เลือกทั้งหมด' },
    ...topics.map((data) => ({
      value: data.tp_id,
      label: data.tp_name,
    })),
  ]
  
  all_option.map((item) => (
    item.value === 0 ? (
      <button key={item.key}>เลือกทั้งหมด</button>
    ) : (
      children.push(<Option key={item.key} value={item.value}>{item.label}</Option>)
    )
  ));

  function handleChange(value) {
    // console.log(topicValues[topicValues.length - 1])
    if (value.includes(0)) {
      if (value[value.length - 1] === 0) {
        // console.log("เลือกทั้งหมด = เพิ่งเพิ่มเข้ามา")
        all_option.map((item) => {
          newTopicValues.push(item.value);
        });
        setTopicValues(newTopicValues)
      } else {
        // console.log("เลือกทั้งหมด แต่กดเลือกไม่ครบ = มียุแล้ว")
        const filteredArray = value.filter(item => item !== 0);
        // อัปเดตค่าใน state ด้วยอาร์เรย์ที่ไม่มีสมาชิกที่มีค่า 0
        setTopicValues(filteredArray);
        //ถ้าความยาว=อาเรย์-1 แล้วไม่มีสมาชิก0 ในนั้น ให้ยกเลิกตัวเลือกทั้งหมดออก
      }
    } else {
      setTopicValues(value)
    }
  }

  const fetchData = () => {
    if (filterBy == 'all') {
      sortAndFilterData();
    } else {
      filter();
    }
  };

  //หาก filter แค่เรียงตาม ทำอันนี้
  const sortAndFilterData = () => {
    axios.get(`${host}/gallerry/all?sortBy=${sortBy}&filterBy=${filterBy}&topicValues=${topicValues}`).then((response) => {
      const data = response.data;
      setAllGallery(data.results)
      setMessage('');
    });
  }

  //หาก filter กรองจาก ทำอันนี้
  const filter = () => {
    axios.get(`${host}/galleryIFollowArtist?sortBy=${sortBy}&IFollowingIDs=${IFollowingIDs}&topicValues=${topicValues}`).then((response) => {
      const data = response.data;
      if (data.status === 'ok') {
        setAllGallery(data.results)
        setMessage('');
      } else {
        setAllGallery([]);
        setMessage("ไม่มีนักวาดที่กำลังติดตาม")
      }
    });
  }

  const handleSortByChange = (selectedOption) => {
    setSortBy(selectedOption);
  };

  // const handleTopicChange = (selectedOption) => {
  //   setSelectedTopic(selectedOption);
  // };

  return (
    <div className="content-box">
      <div className="content-top">
        <p className="h3">งานวาด</p>
        {/* <p>ดูทั้งหมด&gt;</p> */}
        <div className="submenu-filter">

          เรียงตาม :
          <Select
            value={{ value: sortBy, label: sortBy }}
            style={{ width: 120 }}
            onChange={handleSortByChange}
            options={[
              { value: 'ล่าสุด', label: 'ล่าสุด' },
              { value: 'เก่าสุด', label: 'เก่าสุด' },
            ]}
          />
          {/* หัวข้อ :
          <Select
            value={{ value: selectedTopic, label: selectedTopic.label }}
            style={{ width: 120 }}
            onChange={handleTopicChange}
            options={[
              { value: 'เลือกทั้งหมด', label: 'เลือกทั้งหมด' },
              ...topics.map((data) => ({
                value: data.tp_id,
                label: data.tp_name,
              })),
            ]}
          /> */}
          หัวข้อ : <Select
              mode="multiple"
              style={{ width: '10rem' }}
              placeholder="Please select"
              value={topicValues}
              id="topicSelector"
              onChange={handleChange}
              maxTagCount='responsive'
              options={all_option}
              allowClear
            >
              {/* {children} */}
            </Select>

          กรองจาก :
          <Select
            value={{ value: filterBy, label: filterBy === 'all' ? 'นักวาดทั้งหมด' : 'นักวาดที่ติดตาม' }}
            onChange={(selectedOption) => setFilterBy(selectedOption)}
            options={[
              { value: 'all', label: 'นักวาดทั้งหมด' },
              { value: 'follow', label: 'นักวาดที่ติดตาม' },
            ]}
          />

        </div>

      </div>
      {Message == '' ? (

        <div className="content-items">
          {allGallery.length != 0 ? 
            (allGallery.map((data) => (
              <Link key={data.artw_id} to={`/artworkdetail/${data.artw_id}`}>
                <div className="artwork"><img src={data.ex_img_path} /></div>
              </Link>
            ))) : (<>
              <Flex justify="center">
                <Empty description={
                  <span>
                    ยังไม่มีข้อมูล
                  </span>
                } />
              </Flex>
            </>)
          }
        </div>
      ) : (
        <Flex justify="center">
          <Empty description={
            <span>
              ยังไม่มีข้อมูล
            </span>
          } />
        </Flex>
      )}


    </div>
  )
}

function Artists({ IFollowingIDs }) {
  const [allartist, setAllArtist] = useState([]);
  const [Message, setMessage] = useState('');
  const [sortBy, setSortBy] = useState('ล่าสุด');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    if (filterBy === 'all') {
      fetchData();
      setMessage('');
    } else {
      fetchData2();
    }
  }, [sortBy, filterBy])

  const fetchData = () => {
    axios.get(`${host}/allArtist?sortBy=${sortBy}&filterBy=${filterBy}`).then((response) => {
      const data = response.data;
      setAllArtist(data.results)
    });
  };

  const fetchData2 = () => {
    axios.get(`${host}/getAritisIFollow?sortBy=${sortBy}&IFollowingIDs=${IFollowingIDs}`).then((response) => {
      const data = response.data;
      if (data.status === 'ok') {
        setAllArtist(data.results)
      } else {
        setMessage("ไม่มีนักวาดที่กำลังติดตาม")
      }
    });
  }

  const handleSortByChange = (selectedOption) => {
    console.log("Selected Sort By:", selectedOption);
    setSortBy(selectedOption);
  };

  return (
    <>
      <div className="content-top">
        <p className="h3">นักวาด</p>
        {/* <p>ดูทั้งหมด&gt;</p> */}
        <div className="submenu-filter">

          เรียงตาม :
          <Select
            value={{ value: sortBy, label: sortBy }}
            style={{ width: 120 }}
            onChange={handleSortByChange}
            options={[
              { value: 'ล่าสุด', label: 'ล่าสุด' },
              { value: 'เก่าสุด', label: 'เก่าสุด' },
            ]}
          />

          กรองจาก :
          <Select
            value={{ value: filterBy, label: filterBy === 'all' ? 'นักวาดทั้งหมด' : 'นักวาดที่ติดตาม' }}
            onChange={(selectedOption) => setFilterBy(selectedOption)}
            options={[
              { value: 'all', label: 'นักวาดทั้งหมด' },
              { value: 'follow', label: 'นักวาดที่ติดตาม' },
            ]}
          />

        </div>
      </div>
      {Message == '' ? (
        <div className="artistbox-items">
          {allartist.map(data => (
            <a key={data.id} href={`/profile/${data.id}`}>
              <ArtistBox img={data.urs_profile_img} name={data.urs_name} all_review={data.urs_all_review} total_reviews={data.total_reviews}/>
            </a>
          ))}
        </div>
      ) : (
        <Flex justify="center">
          <Empty description={
            <span>
              ยังไม่มีข้อมูล
            </span>
          } />
        </Flex>
      )}
    </>
  )
}

function SearchResults({ search, user_SearchResult, cms_SearchResult, art_SearchResult }) {

  // const [search, setSearch] = useState('');
  // const [user_SearchResult, setUserSearchResults] = useState([]);
  // const [cms_SearchResult, setCmsSearchResults] = useState([]);
  // const [art_SearchResult, setArtSearchResults] = useState([]);

  // const handleSearch = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.get(`${host}/search?search=${search}`).then((response) => {
  //       const data = response.data;
  //       setUserSearchResults(data.users)
  //       setCmsSearchResults(data.cms_uniqueResults)
  //       setArtSearchResults(data.artwork)
  //     })

  //   } catch (error) {
  //     console.error('Error searching:', error);
  //   }
  // };
  const menus = [
    {
      key: '1',
      label: <Link to="/" id="explore" >ทั้งหมด</Link>,
      // children: <explore type={type} isLoggedIn={isLoggedIn} cmsLatests={cmsLatests} cmsArtists={cmsArtists} IFollowerData={IFollowerData} gallerylatest={gallerylatest} galleryIfollow={galleryIfollow} />,
    },
    {
      key: '2',
      label: <Link to="/commissions" id="commissions">คอมมิชชัน</Link>,
      // children: <Commissions IFollowingIDs={IFollowingIDs} />,
    },
    {
      key: '3',
      label: <Link to="/gallery" id="gallery">งานวาด</Link>,
      // children: <Gallery IFollowingIDs={IFollowingIDs} />,
    },
    {
      key: '4',
      label: <Link to="/artists" id="artists" >นักวาด</Link>,
      // children: <Artists IFollowingIDs={IFollowingIDs} />,
    },
  ];

  return (
    <>
      {/* <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาา..."
        />
        <button type="submit">Search</button>
      </form> */}

      <div>
        <Tabs defaultActiveKey="1" items={menus} />
      </div>
      <h3>ผลการค้นหาของ {search}</h3>
      <div className="content-box">

        <div className="content-top">
          <p className="h3">นักวาด</p>
          <Link to="/artists"><p>ดูทั้งหมด&gt;</p></Link>
        </div>

        <Swiper
          slidesPerView="auto"
          centeredSlides={false}
          slidesPerGroupSkip={1}
          spaceBetween={10}

          // scrollbar={true}
          // navigation={true}
          modules={[Navigation]}
          className="artistbox-swiper"
        >
          {user_SearchResult.length != 0 ? (user_SearchResult.map(data => (
            <SwiperSlide>
              <a key={data.id} href={`/profile/${data.id}`}>
                <ArtistBox img={data.urs_profile_img} name={data.urs_name} all_review={data.urs_all_review} total_reviews={data.total_reviews}/>
              </a>
            </SwiperSlide>
          ))) : (<>ไม่เจอผลลัพธ์</>)
          }
        </Swiper>

      </div>

      <div className="content-box">
        <div className="content-top">
          <p className="h3">คอมมิชชัน</p>
          <Link to="/commissions"><p>ดูทั้งหมด&gt;</p></Link>
        </div>
      </div>
      <Swiper
        slidesPerView="auto"
        centeredSlides={false}
        slidesPerGroupSkip={1}
        spaceBetween={10}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        scrollbar={false}
        navigation={true}
        modules={[Keyboard, Scrollbar, Navigation]}
        className="cms-item-swiper"
      >
        {/* <SwiperSlide >
        <CmsItem src="/monlan.png" headding="คอมมิชชัน SD" price="100" desc="คมช.เส้นเปล่า-ลงสีรับทุกสเกล สามารถเพิ่มตัวละครหรือเพิ่มพร็อพได้ โดยราคาขึ้นอยู่กับรายละเอียดที่เพิ่มเข้ามา" />
      </SwiperSlide> */}
        {cms_SearchResult.length != 0 ? (cms_SearchResult.map(data => (
          <SwiperSlide key={data.cms_id}>
            <Link to={`/cmsdetail/${data.cms_id}`}>
              <CmsItem src={data.ex_img_path} headding={data.cms_name} price={data.pkg_min_price} desc={data.cms_desc} total_reviews={data.total_reviews} cms_all_review={data.cms_all_review} status={data.cms_status}/>
            </Link>
          </SwiperSlide>
        ))) : (<>ไม่เจอผลลัพธ์</>)
        }
      </Swiper >

      <div class="content-box">
        <div class="content-top">
          <p className="h3">ผลงาน</p>
          <Link to="/gallery"><p>ดูทั้งหมด&gt;</p></Link>
        </div>
        <div class="content-items">
        </div>
      </div>
      <Swiper
        slidesPerView="auto"
        centeredSlides={false}
        slidesPerGroupSkip={1}
        spaceBetween={10}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        scrollbar={false}
        navigation={true}
        modules={[Keyboard, Scrollbar, Navigation]}
        className="gall-item-swiper"
      >
        {art_SearchResult.length != 0 ? (art_SearchResult.map((data, index) => (
          <SwiperSlide >
            <Link to={`/artworkdetail/${data.artw2_id}`}><img src={data.ex_img_path} /></Link>
          </SwiperSlide>
        ))) : (<>ไม่เจอผลลัพธ์</>)
        }
      </Swiper>


    </>
  )
}


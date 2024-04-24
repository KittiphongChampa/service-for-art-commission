import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import LineChart from "../../components/DashboardArtist/LineChart";
import BarChart from "../../components/DashboardArtist/BarChart";
import PieChart from "../../components/DashboardArtist/PieChart";
import Scrollbars from "react-scrollbars-custom";
import { useAuth } from "../../context/AuthContext";
import { host } from "../../utils/api";
import { Flex, Select } from "antd";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const { userdata, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [CountFollower, setCountFollower] = useState();
  const [SumProfit, setSumProfit] = useState();
  const [CountOrder, setCountOrder] = useState();

  let [status, setStatus] = useState(true);

  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 1)
  ); // วันแรกของปีปัจจุบัน
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), 11, 31)
  ); // วันสุดท้ายของปีปัจจุบัน

  const [topCMS, setTopCMS] = useState([]);
  const [topCTM, setTopCtm] = useState([]);
  const [countTopic, setCountTopic] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    getSumProfit();
    getCountFollower();
    getCountOrder();
    getTopCommission();
    getTopCustomer();
  }, []);

  const getCountFollower = async () => {
    await axios
      .get(`${host}/count/Follower`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        const data = response.data;
        setCountFollower(data.myfollower);
      });
  };

  const getSumProfit = async () => {
    await axios
      .get(`${host}/sum/profit`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        const data = response.data;
        setSumProfit(data.sumprofit);
      });
  };

  const getCountOrder = async () => {
    await axios
      .get(`${host}/count/order`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        const data = response.data;
        setCountOrder(data.order_count);
      });
  };

  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "รายได้",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });

  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "จำนวนผู้ติดตาม",
        data: [],
        fill: false,
        borderColor: "blue",
        backgroundColor: "blue",
        tension: 0.1,
      },
    ],
  });

  const [filterBy, setFilterBy] = useState("year");

  useEffect(() => {
    handleDateChange();
  }, [filterBy]);

  const handleDateChange = () => {
    setFilterBy(filterBy);
    const currentDate = new Date();
    let newStartDate = new Date();
    let newEndDate = new Date();

    switch (filterBy) {
      case "year":
        newStartDate = new Date(currentDate.getFullYear(), 0, 1);
        newEndDate = new Date(currentDate.getFullYear(), 11, 31);
        break;
      case "today":
        newStartDate.setDate(currentDate.getDate() - 1);
        newEndDate.setDate(currentDate.getDate());
        break;
      case "last7days":
        newStartDate.setDate(currentDate.getDate() - 6);
        newEndDate.setDate(currentDate.getDate());
        break;
      case "last30days":
        newStartDate.setDate(currentDate.getDate() - 29);
        newEndDate.setDate(currentDate.getDate());
        break;
      case "thisMonth":
        newStartDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        newEndDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        break;
      default:
        break;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate || currentDate);

    // getYearData(newStartDate, newEndDate || currentDate);
    if (filterBy === "year") {
      setStatus(true);
    } else {
      setStatus(false);
    }
  };

  useEffect(() => {
    // getCountTopic();
    if (status === true) {
      getYearData(startDate, endDate);
      getYearDataBenefit(startDate, endDate);
    } else {
      getOutOfYearData(startDate, endDate);
      getOutOfYearBenefit(startDate, endDate);
    }
  }, [startDate, endDate]);

  const getTopCommission = async () => {
    const response = await axios.get(`${host}/get/top/commission`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    // console.log(response);
    if (response.status === 200) {
      setTopCMS(response.data.combinedResult);
    }
  };
  const getTopCustomer = async () => {
    const response = await axios.get(`${host}/get/top/customer`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.status === 200) {
      setTopCtm(response.data.results);
    }
  };

  // การทำงาน filter ของจำนวนผู้ติดตาม
  const getYearData = async (start, end) => {
    const response = await axios.get(`${host}/getYearDataArtist`, {
      params: {
        startDate: start,
        endDate: end,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = response.data.results;
    const datetime = data.map((item) => item.date);
    const follower = data.map((item) => item.follower);

    // สร้างข้อมูลสำหรับทุกเดือน
    const allMonths = Array.from({ length: 12 }, (_, index) => {
      const currentMonth = (index + 1).toString().padStart(2, "0");
      return `${start.getFullYear()}-${currentMonth}`;
    });

    // รวมข้อมูลจาก database และกรอกค่าเป็น 0 ในเดือนที่ไม่มีข้อมูล
    const newData = allMonths.map((month) => {
      const dataIndex = datetime.indexOf(month);
      return {
        date: month,
        follower: dataIndex !== -1 ? follower[dataIndex] : 0,
      };
    });

    setLineChartData({
      labels: newData.map((item) => item.date),
      datasets: [
        {
          label: "จำนวนผู้ติดตาม",
          data: newData.map((item) => item.follower),
          fill: false,
          borderColor: "blue",
          backgroundColor: "blue",
          tension: 0.1,
        },
      ],
    });
  };

  const getOutOfYearData = async (start, end) => {
    const response = await axios.get(`${host}/getOutOfYearDataArtist`, {
      params: {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = response.data.results;

    // สร้างข้อมูลสำหรับทุกวันในช่วง filterStartDate ถึง filterEndDate
    const filteredData = getFilteredData(data, start, end);

    // รวมข้อมูลจาก filteredData และกรอกค่าเป็น 0 ในวันที่ไม่มีข้อมูล
    const newData = fillMissingData(filteredData, start, end);
    setLineChartData({
      labels: newData.map((item) => item.date),
      datasets: [
        {
          label: "จำนวนผู้ติดตาม",
          data: newData.map((item) => item.follower),
          fill: false,
          borderColor: "blue",
          backgroundColor: "blue",
          tension: 0.1,
        },
      ],
    });
  };

  function getFilteredData(data, startDate, endDate) {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  function fillMissingData(data, startDate, endDate) {
    const allDays = Array.from(
      { length: (endDate - startDate) / (24 * 60 * 60 * 1000) + 1 },
      (_, index) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + index);
        return currentDate.toISOString().split("T")[0];
      }
    );

    const newData = allDays.map((day) => {
      const dataIndex = data.findIndex((item) => item.date === day);
      return dataIndex !== -1 ? data[dataIndex] : { date: day, follower: 0 };
    });

    return newData;
  }

  // การทำงาน filter ของรายได้
  const getYearDataBenefit = async (start, end) => {
    const response = await axios.get(`${host}/get/profit/yeardata`, {
      params: {
        startDate: start,
        endDate: end,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const data = response.data.results;
    const datetime = data.map((item) => item.monthData);
    const profit = data.map((item) => item.profit);

    // สร้างข้อมูลสำหรับทุกเดือน
    const allMonths = Array.from({ length: 12 }, (_, index) => {
      const currentMonth = (index + 1).toString().padStart(2, "0");
      return `${start.getFullYear()}-${currentMonth}`;
    });

    // รวมข้อมูลจาก database และกรอกค่าเป็น 0 ในเดือนที่ไม่มีข้อมูล
    const newData = allMonths.map((month) => {
      const dataIndex = datetime.indexOf(month);
      return {
        date: month,
        profit: dataIndex !== -1 ? profit[dataIndex] : 0,
      };
    });

    setBarChartData({
      labels: newData.map((item) => item.date),
      datasets: [
        {
          label: "รายได้",
          data: newData.map((item) => item.profit),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    });
  };

  const getOutOfYearBenefit = async (start, end) => {
    const response = await axios.get(`${host}/get/profit/outofyear`, {
      params: {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = response.data.results;
    console.log(data);

    // สร้างข้อมูลสำหรับทุกวันในช่วง filterStartDate ถึง filterEndDate
    const filteredData = getFilteredDataProfit(data, start, end);

    // รวมข้อมูลจาก filteredData และกรอกค่าเป็น 0 ในวันที่ไม่มีข้อมูล
    const newData = fillMissingDataProfit(filteredData, start, end);
    setBarChartData({
      labels: newData.map((item) => item.monthData),
      datasets: [
        {
          label: "รายได้ต่อเดือน",
          data: newData.map((item) => item.profit),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    });
  };

  function getFilteredDataProfit(data, startDate, endDate) {
    return data.filter((item) => {
      const itemDate = new Date(item.monthData);
      // console.log(itemDate.toLocaleString('th-TH'));

      // เปรียบเทียบวันที่ของข้อมูลกับวันที่เริ่มต้นและสิ้นสุดที่กำหนด
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  function fillMissingDataProfit(data, startDate, endDate) {
    const allDays = Array.from(
      { length: (endDate - startDate) / (24 * 60 * 60 * 1000) + 1 },
      (_, index) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + index);
        return currentDate.toISOString().split("T")[0];
      }
    );

    const newData = allDays.map((day) => {
      const dataIndex = data.findIndex((item) => item.monthData === day);
      return dataIndex !== -1 ? data[dataIndex] : { monthData: day, profit: 0 };
    });

    return newData;
  }

  const getCountTopic = async () => {
    await axios.get(`${host}/getCountTopic`).then((response) => {
      const data = response.data;
      if (data.status === "ok") {
        setCountTopic(data.results);
      } else {
        console.log("ไม่มี");
      }
    });
  };

  const [activePage, setActivePage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(9);
  const itemsPerPage = 10;

  const [windowSize, setWindowSize] = useState(
    window.innerWidth <= 767 ? "small" : "big"
  );

  window.onresize = reportWindowSize;
  function reportWindowSize() {
    // console.log(window.innerHeight, window.innerWidth)
    if (window.innerWidth <= 767) {
      setWindowSize("small");
    } else {
      setWindowSize("big");
    }
    console.log(windowSize);
  }

  const top5TableOrderedData = (data) => {
    if (windowSize != "small") {
      return data?.map((item, index) => (
        <tr
          className="order-data-row"
          key={index + 1 + startIndex}
          id={index + 1 + startIndex}
        >
          <td>{index + 1}</td>
          <td>
            <img
              src={item.urs_profile_img}
              style={{ width: 20,height:20, borderRadius: 50 }}
            />{" "}
            {item.urs_name}
          </td>
          <td>{item.order_count}</td>
          <td>{item.profit}</td>
        </tr>
      ));
    } else {
      return data?.map((item, index) => (
        <>
          <tr
            className="order-data-row"
            key={index + 1 + startIndex}
            id={index + 1 + startIndex}
          >
            <td>
              <Flex justify="space-between">
                <p>ลำดับ</p>
                <p>{index + 1}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row">
            <td>
              <Flex justify="space-between">
                <p>ข้อมูลลูกค้า</p>
                <div><img
                  src={item.urs_profile_img}
                  style={{ width: 20, height:20,borderRadius: 50 }}
                />{" "}
                {item.urs_name}</div>
                
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row">
            <td>
              <Flex justify="space-between">
                <p>จำนวนออเดอร์ทั้งหมด</p>
                <p>{item.order_count}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row last">
            <td>
              <Flex justify="space-between">
                <p>จำนวนเงินที่ได้ทั้งหมด</p>
                <p>{item.profit}</p>
              </Flex>
            </td>
          </tr>
        </>
      ));
    }
  };

  const top5TableGoodSoldData = (data) => {
    if (windowSize != "small") {
      return data?.map((item, index) => (
        <tr
          className="order-data-row"
          key={index + 1 + startIndex}
          id={index + 1 + startIndex}
        >
          <td>{index + 1}</td>
          {/* <td>
            <img
              src={item.cms_name}
              style={{ width: 20, borderRadius: 50 }}
            />{" "}
            {item.urs_name}
          </td> */}
          <td>{item.cms_name}</td>
          <td>{item.customers.length}</td>
          <td>{item.profit}</td>
        </tr>
      ));
    } else {
      return data?.map((item, index) => (
        <>
          <tr
            className="order-data-row"
            key={index + 1 + startIndex}
            id={index + 1 + startIndex}
          >
            <td>
              <Flex justify="space-between">
                <p>ลำดับ</p>
                <p>{index + 1}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row">
            <td>
              <Flex justify="space-between">
                <p>ชื่อคอมมิชชัน</p>
                <p>{item.cms_name}</p>

                
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row">
            <td>
              <Flex justify="space-between">
                <p>ลูกค้าทั้งหมด(คน)</p>
                <p>{item.customers.length}</p>
              </Flex>
            </td>
          </tr>
          <tr className="order-data-row last">
            <td>
              <Flex justify="space-between">
                <p>จำนวนเงินที่ได้ทั้งหมด</p>
                <p>{item.profit}</p>
              </Flex>
            </td>
          </tr>
        </>
      ));
    }
  };

  return (
    <>
      {/* <div className="artist-mn-container"> */}
      <div className="headding">
        <h1 className="h3 color-font">แดชบอร์ด</h1>
      </div>
      {/* <div className="artist-mn-card"> */}
      {/* <Scrollbars> */}
      <Flex gap="small" wrap="wrap">
        <div className="dashboard-item">
          <h3 className="h4 color-font ">{SumProfit}</h3>
          <p>รายได้</p>
        </div>

        <div className="dashboard-item">
          <h3 className="h4 color-font ">{CountOrder}</h3>
          <p>ออเดอร์</p>
        </div>

        <div className="dashboard-item">
          <h3 className="h4 color-font ">1</h3>
          <p>คอมมิชชัน</p>
        </div>

        <div className="dashboard-item">
          <h3 className="h4 color-font ">{CountFollower}</h3>
          <p>ผู้ติดตาม</p>
        </div>
      </Flex>

      {/* <div style={{ marginTop: "20px" }}>
        <label>กรองจาก: </label>
        <select onChange={(e) => handleDateChange(e.target.value)}>
          <option value="year">ปีนี้</option>
          <option value="today">วันนี้</option>
          <option value="last7days">7 วันที่แล้ว</option>
          <option value="last30days">30 วันที่แล้ว</option>
          <option value="thisMonth">เดือนนี้</option>
        </select>
      </div> */}

      <Flex align="center" className="mt-4">
        <p style={{ whiteSpace: "nowrap" }}>กรองจาก : </p>
        <Select
          // value={{ value: sortby, label: sortby }}
          style={{ width: 120 }}
          // onChange={handlesortbyChange}
          value={filterBy}
          onChange={setFilterBy}
          options={[
            { value: "year", label: "ปีนี้" },
            { value: "today", label: "วันนี้" },
            { value: "last7days", label: "7 วันที่แล้ว" },
            { value: "last30days", label: "30 วันที่แล้ว" },
            { value: "thisMonth", label: "เดือนนี้" },
          ]}
        />
      </Flex>

      <div style={{ marginTop: "15px" }}>
        <h4 className="h4 color-font ">รายได้</h4>
        <div
          style={{
            width: "100%",
          }}
        >
          <BarChart barChartData={barChartData} />
        </div>
      </div>
      {/* <div
                style={{
                  borderRadius: "20px",
                  border: "3px",
                  backgroundColor: "white",
                  width: "850px",
                  padding: "20px",
                }}
              >
                <h4>หัวข้อที่นิยม</h4>
                <PieChart countTopic={countTopic}/>
              </div> */}

      <div style={{ marginTop: "15px" }}>
        <h4 className="h4 color-font ">จำนวนผู้ติดตาม</h4>
        <div
          style={{
            width: "100%",
          }}
        >
          <LineChart lineChartData={lineChartData} />
        </div>
      </div>

      <h4 className="h4 color-font  mt-4">5 อันดับคอมมิชชันที่ขายดี</h4>
      <table className="overview-order-table">
        {windowSize != 'small' &&
          <tr>
            <th>ลำดับ</th>
            <th>ชื่อคอมมิชชัน</th>
            <th>ลูกค้าทั้งหมด(คน)</th>
            <th>จำนวนเงินที่ได้ทั้งหมด</th>
          </tr>}

        {topCMS?.length != 0 ? (
          top5TableGoodSoldData(topCMS)
        ) : (
          <tr style={{ textAlign: 'center' }}>
            <td colSpan={4}>ยังไม่มีข้อมูล</td>
          </tr>
        )}

      </table>
      {/* <div style={{ display: "flex", marginTop: "15px" }}>
        <table className="table is-striped is-fullwidth color-font">
          <thead>
            {windowSize != "samll" && (
              <tr>
                <th>ลำดับ</th>
                <th>ชื่อคอมมิชชัน</th>
                <th>ลูกค้าทั้งหมด(คน)</th>
                <th>จำนวนเงินที่ได้ทั้งหมด</th>
              </tr>
            )}
          </thead>
          <tbody>
            {topCMS.length == 0 ? (
              <tr style={{ textAlign: "center" }}>
                <td colSpan={4}>ยังไม่มีข้อมูล</td>
              </tr>
            ) : (
              topCMS.map((item, index) => (
                <tr key={item.cms_id}>
                  <td>{index + 1}</td>
                  <td>{item.cms_name}</td>
                  <td>{item.customers.length}</td>
                  <td>{item.profit}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div> */}

      <h4 className="h4 color-font  mt-4">5 อันดับลูกค้าที่มีออเดอร์สูงสุด</h4>
      <div style={{ display: "flex", marginTop: "15px" }}>
        <table className="overview-order-table">
          {windowSize != 'small' &&
            <tr>
              <th>ลำดับ</th>
              <th>ข้อมูลลูกค้า</th>
              <th>จำนวนออเดอร์ทั้งหมด</th>
              <th>จำนวนเงินที่ได้ทั้งหมด</th>
            </tr>}

          {topCTM?.length != 0 ? (
            top5TableOrderedData(topCTM)
          ) : (
            <tr style={{ textAlign: 'center' }}>
              <td colSpan={4}>ยังไม่มีข้อมูล</td>
            </tr>
          )}
        </table>

        {/* <table className="table is-striped is-fullwidth color-font">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ข้อมูลลูกค้า</th>
              <th>จำนวนออเดอร์ทั้งหมด</th>
              <th>จำนวนเงินที่ได้ทั้งหมด</th>
            </tr>
          </thead>
          <tbody>
            {topCTM.length == 0 ? (
              <tr style={{ textAlign: "center" }}>
                <td colSpan={4}>ยังไม่มีข้อมูล</td>
              </tr>
            ) : (
              topCTM.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={item.urs_profile_img}
                      style={{ width: 20, borderRadius: 50 }}
                    />{" "}
                    {item.urs_name}
                  </td>
                  <td>{item.order_count}</td>
                  <td>{item.profit}</td>
                </tr>
              ))
            )}
          </tbody>
        </table> */}
      </div>
      {/* </Scrollbars> */}
      {/* </div> */}
      {/* </div> */}
    </>
  );
}

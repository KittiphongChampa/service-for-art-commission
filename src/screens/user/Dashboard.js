import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import LineChart from "../../components/DashboardArtist/LineChart";
import BarChart from "../../components/DashboardArtist/BarChart";
import PieChart from "../../components/DashboardArtist/PieChart";
import Scrollbars from "react-scrollbars-custom";
import { useAuth } from '../../context/AuthContext';
import { host } from "../../utils/api";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const { userdata, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  let [status, setStatus] = useState(true);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1)); // วันแรกของปีปัจจุบัน
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), 11, 31)); // วันสุดท้ายของปีปัจจุบัน
  const [countTopic, setCountTopic] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [])

  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'จำนวนผู้ติดตาม',
        data: [], 
        fill: false,
        borderColor: 'blue',
        backgroundColor: 'blue',
        tension: 0.1,
      }
    ],
  });

  const handleDateChange = (filterType) => {
    const currentDate = new Date();
    let newStartDate = new Date();
    let newEndDate = new Date();

    switch (filterType) {
      case "year":
        newStartDate = new Date(currentDate.getFullYear(), 0, 1);
        newEndDate = new Date(currentDate.getFullYear(), 11, 31);
        break;
      case "today":
        newStartDate.setDate(currentDate.getDate());
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
          currentDate.getMonth(),1
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
    if (filterType === "year") {
      setStatus(true);
    } else {
      setStatus(false);
    }
  };

  useEffect(() => {
    getCountTopic();
    if (status === true) {
      getYearData(startDate, endDate);
    } else {
      getOutOfYearData(startDate, endDate);
    }
  }, [startDate, endDate]);

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
          label: 'จำนวนผู้ติดตาม',
          data: newData.map((item) => item.follower),
          fill: false,
          borderColor: 'blue',
          backgroundColor: 'blue',
          tension: 0.1,
        }
      ],
    })
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
          label: 'จำนวนผู้ติดตาม',
          data: newData.map((item) => item.follower),
          fill: false,
          borderColor: 'blue',
          backgroundColor: 'blue',
          tension: 0.1,
        }
      ],
    })
  };

  const getFilteredData = (data, startDate, endDate) => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const fillMissingData = (data, startDate, endDate) => {
    const allDays = Array.from({ length: (endDate - startDate) / (24 * 60 * 60 * 1000) + 1 },(_, index) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + index);
        return currentDate.toISOString().split("T")[0];
      }
    );

    const newData = allDays.map((day) => {
      const dataIndex = data.findIndex((item) => item.date === day);
      return dataIndex !== -1 ? data[dataIndex]: { date: day, follower: 0 };
    });

    return newData;
  };

  const getCountTopic = async() =>{
    await axios .get(`${host}/getCountTopic`).then((response) => {
      const data = response.data;
      if (data.status === 'ok') {
        setCountTopic(data.results)
      }else{
        console.log('ไม่มี');
      }
      
    })
  }

  return (
    <>
      {/* <div className="artist-mn-container"> */}
        <div className="headding">
        <h1 className="h3">แดชบอร์ด</h1>
        </div>
        {/* <div className="artist-mn-card"> */}
          <Scrollbars>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  padding: 30,
                  borderRadius: "1rem",
                  backgroundColor: "white",
                  color: "#525764",
                  border: "1px solid #919ab0",
                  marginRight: 10,
                  width: "250px",
                }}
              >
                <h3>50,124</h3>
                <p>รายได้</p>
              </div>

              <div
                style={{
                  padding: 30,
                  borderRadius: "1rem",
                  backgroundColor: "white",
                  color: "#525764",
                  border: "1px solid #919ab0",
                  marginRight: 10,
                  width: "250px",
                }}
              >
                <h3>50</h3>
                <p>ออเดอร์</p>
              </div>

              <div
                style={{
                  padding: 30,
                  borderRadius: "1rem",
                  backgroundColor: "white",
                  color: "#525764",
                  border: "1px solid #919ab0",
                  marginRight: 10,
                  width: "250px",
                }}
              >
                <h3>80</h3>
                <p>คอมมิชชัน</p>
              </div>

              <div
                style={{
                  padding: 30,
                  borderRadius: "1rem",
                  backgroundColor: "white",
                  color: "#525764",
                  border: "1px solid #919ab0",
                  marginRight: 10,
                  width: "250px",
                }}
              >
                <h3>124</h3>
                <p>ผู้ติดตาม</p>
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <label>Filter: </label>
              <select onChange={(e) => handleDateChange(e.target.value)}>
                <option value="year">ปีนี้</option>
                <option value="today">วันนี้</option>
                <option value="last7days">7 วันที่แล้ว</option>
                <option value="last30days">30 วันที่แล้ว</option>
                <option value="thisMonth">เดือนนี้</option>
              </select>
            </div>

            <div style={{ display: "flex", marginTop: "15px" }}> 
              <div
                style={{
                  borderRadius: "20px",
                  border: "3px",
                  backgroundColor: "white",
                  width: "850px",
                  padding: "20px",
                }}
              >
                <h4>รายได้</h4>
                <BarChart />
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
              
            </div>

            <div style={{ display: "flex", marginTop: "15px" }}>
              <div
                style={{
                  borderRadius: "20px",
                  border: "3px",
                  backgroundColor: "white",
                  width: "850px",
                  padding: "20px",
                }}
              >
                <h4>จำนวนผู้ติดตาม</h4>
                <LineChart lineChartData={lineChartData}/>
              </div>
            </div>
          </Scrollbars>
        {/* </div> */}
      {/* </div> */}
    </>
  );
}

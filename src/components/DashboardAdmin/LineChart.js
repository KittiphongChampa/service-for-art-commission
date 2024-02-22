import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment'; 
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Dropdown from 'react-dropdown';
import { Line } from "react-chartjs-2";
import { host } from "../../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const LineChart = () => {
  let [status, setStutus] = useState(true)
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1)); // วันแรกของปีปัจจุบัน
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), 11, 31)); // วันสุดท้ายของปีปัจจุบัน
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'นักวาด',
        data: [],
        fill: false,
        borderColor: 'red',
        backgroundColor: 'red',
        tension: 0.1,
      },
      {
        label: 'ผู้ใช้งานทั่วไป',
        data: [],
        borderColor: 'blue',
        backgroundColor: 'blue',
        tension: 0.1,
      },
    ],
  });

  const handleDateChange = (filterType) => {
    const currentDate = new Date();
    let newStartDate = new Date();
    let newEndDate = new Date();
  
    switch (filterType) {
      case 'year':
        newStartDate = new Date(currentDate.getFullYear(), 0, 1);
        newEndDate = new Date(currentDate.getFullYear(), 11, 31);
        break;
      case 'today':
        newStartDate.setDate(currentDate.getDate());
        newEndDate.setDate(currentDate.getDate());
        break;
      case 'last7days':
        newStartDate.setDate(currentDate.getDate() - 6);
        newEndDate.setDate(currentDate.getDate());
        break;
      case 'last30days':
        newStartDate.setDate(currentDate.getDate() - 29);
        newEndDate.setDate(currentDate.getDate());
        break;
      case 'thisMonth':
        newStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        newEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        break;
      default:
        break;
    }
  
    setStartDate(newStartDate);
    setEndDate(newEndDate || currentDate);
  
    // getYearData(newStartDate, newEndDate || currentDate);
    if (filterType === 'year') {
      setStutus(true)
    } else {
      setStutus(false)
    }
  };

  useEffect(() => {
    if (status === true) {
      getYearData(startDate, endDate);
    } else {
      getOutOfYearData(startDate, endDate);
    }
  }, [startDate, endDate]);

  // ใน useEffect
  const getYearData = async (start, end) => {
    const response = await axios.get(`${host}/getYearData`, {
      params: {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
      },
    });
    const data = response.data.results;
    const datetime = data.map((item) => item.date);
    const artistsData = data.map((item) => item.artist_count);
    const usersData = data.map((item) => item.customer_count);
    const signup_count = data.map((item) => item.signup_count);

    // สร้างข้อมูลสำหรับทุกเดือน
    const allMonths = Array.from({ length: 12 }, (_, index) => {
      const currentMonth = (index + 1).toString().padStart(2, '0');
      return `${start.getFullYear()}-${currentMonth}`;
    });

    // รวมข้อมูลจาก database และกรอกค่าเป็น 0 ในเดือนที่ไม่มีข้อมูล
    const newData = allMonths.map((month) => {
      const dataIndex = datetime.indexOf(month);
      return {
        date: month,
        artist_count: dataIndex !== -1 ? artistsData[dataIndex] : 0,
        customer_count: dataIndex !== -1 ? usersData[dataIndex] : 0,
        signup_count: dataIndex !== -1 ? signup_count[dataIndex] : 0,
      };
    });

    setLineChartData({
      labels: newData.map((item) => item.date),
      datasets: [
        {
          label: 'นักวาด',
          data: newData.map((item) => item.artist_count),
          fill: false,
          borderColor: 'red',
          backgroundColor: 'red',
          tension: 0.1,
        },
        {
          label: 'ผู้ใช้งานทั่วไป',
          data: newData.map((item) => item.customer_count),
          borderColor: 'blue',
          backgroundColor: 'blue',
          tension: 0.1,
        },
      ],
    });
  };

  const getOutOfYearData = async (start, end) => {
    const response = await axios.get(`${host}/getOutOfYearData`, {
      params: {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
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
          label: 'นักวาด',
          data: newData.map((item) => item.artist_count),
          fill: false,
          borderColor: 'red',
          backgroundColor: 'red',
          tension: 0.1,
        },
        {
          label: 'ผู้ใช้งานทั่วไป',
          data: newData.map((item) => item.customer_count),
          borderColor: 'blue',
          backgroundColor: 'blue',
          tension: 0.1,
        },
      ],
    });
  };
  const getFilteredData = (data, startDate, endDate) => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const fillMissingData = (data, startDate, endDate) => {
    const allDays = Array.from({ length: (endDate - startDate) / (24 * 60 * 60 * 1000) + 1 }, (_, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index);
      return currentDate.toISOString().split('T')[0];
    });
  
    const newData = allDays.map((day) => {
      const dataIndex = data.findIndex((item) => item.date === day);
      return dataIndex !== -1 ? data[dataIndex] : { date: day, signup_count: 0, artist_count: 0, customer_count: 0 };
    });
  
    return newData;
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <label>Filter: </label>
        <select onChange={(e) => handleDateChange(e.target.value)}>
          <option value="year">ปีนี้</option>
          <option value="today">วันนี้</option>
          <option value="last7days">7 วันที่แล้ว</option>
          <option value="last30days">30 วันที่แล้ว</option>
          <option value="thisMonth">เดือนนี้</option>
        </select>
      </div>
      <Line options={options} data={lineChartData} />
    </div>
  );
};

export default LineChart;
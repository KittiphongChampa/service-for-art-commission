import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import { host } from "../../utils/api";

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
    responsive: true,
    // plugins: {
    //   legend: {
    //     position: 'top',
    //   },
    //   title: {
    //     display: true,
    //     text: 'จำนวนนักวาดต่อผู้ใช้งานทั่วไป',
    //   },
    // },
};

const PieChart = () => {
    const [artist, setArtist] = useState([]);
    const [customer, setCustomer] = useState([]);
    // console.log(artist, customer);
    useEffect(() => {
      getData();
    },[]);
    const getData = async () => {
        await axios.get(`${host}/getdataPieChart`).then((response) => {
            const data = response.data;
            if (data.results[0] !== undefined) {
              setArtist(data.results[0]);
            } else {
              setArtist(0);
            }
            if (data.results[1] !== undefined) {
              setCustomer(data.results[1]);
            } else {
              setCustomer(0);
            }
        })
    }
    const pieChartData = {
        labels: ['นักวาด', 'ผู้ใช้งานทั่วไป'],
        datasets: [
            {
            data: [artist.count, customer.count],
            backgroundColor: ['#6394DE', '#212280'],
            borderColor: ['#6394DE','#212280'],
            },
        ],
    };
    return (
      <div style={{width: '100%'}}>
        <Pie options={options} data={pieChartData} />
      </div>
    );
};
  
export default PieChart;
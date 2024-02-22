import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthNames = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const data = {
  labels: monthNames,
  datasets: [
    {
      label: 'รายได้ต่อเดือน',
      data: [1000, 1200, 800, 1500, 2000, 2500, 3000, 2800, 3200, 1800, 2200, 2800],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      // text: 'รายได้ต่อเดือน',
    },
  },
};

const BarChart = () => {
  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;

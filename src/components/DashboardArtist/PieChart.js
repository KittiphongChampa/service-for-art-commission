import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


export const options = {
    responsive: true,
};

const PieChart = ({countTopic}) => {
  // console.log(countTopic);
    const data = {

        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        labels: countTopic.map((item) => item.tp_name),
        datasets: [
          {
            label: countTopic.map((item) => item.tp_name),
            data: countTopic.map((item) => item.tp_amount_used),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            // borderColor: [
            //   'rgba(255, 99, 132, 1)',
            //   'rgba(54, 162, 235, 1)',
            //   'rgba(255, 206, 86, 1)',
            //   'rgba(75, 192, 192, 1)',
            //   'rgba(153, 102, 255, 1)',
            //   'rgba(255, 159, 64, 1)',
            // ],
            borderWidth: 1,
          },
        ],
    }

    return (
        <div style={{width: 450}}>
          <Pie options={options} data={data} />
        </div>
    );
}

export default PieChart;
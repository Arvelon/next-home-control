"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  LineElement,
} from "chart.js";
import Chart from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import { format } from "date-fns";
import "chartjs-adapter-date-fns";
import {be} from 'date-fns/locale';


export default function Graph({ dataset }) {
  console.log(dataset);
  ChartJS.register(
    CategoryScale,
    TimeScale,
    LinearScale,
    BarElement,
    Title,
    LineElement,
    Tooltip,
    Legend
  );
  console.log(dataset);

  const temparr = dataset.map(entry => parseFloat(entry.temperature))
  const min = Math.min(...temparr)
  const max = Math.max(...temparr)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      // adapters: {
      //   date: {
      //     locale: be,
      //   },
      // },
      x: {
        type: "time",
        time: {
          // Luxon format string
          tooltipFormat: "DD T",
        },
        // title: {
        //   display: true,
        //   text: "Time",
        // },
      },
      y: {
        // title: {
        //   display: true,
        //   text: "value",
        // },
        min: min-0.1,
        max: max+0.1
      },
    },
  };
  //
  console.log(dataset);

  const labels = dataset.map((i, key) => new Date(i.timestamp));
  console.log(labels);

  const temps = dataset.map((i, key) => parseFloat(i.temperature));
  console.log(temps);

  // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temps,
        fill: true,
        borderWidth: 1.5,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.3)",
      },
    ],
  };

  return <Line options={options} data={data} />;
}

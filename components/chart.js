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
import { be } from "date-fns/locale";

export default function Graph({
  dataset,
  valueName,
  colorRgb,
  mode,
  scale,
  disabled,
  dayMode,
  precision,
  labelOverride,
}) {
  if (disabled || !dataset || !dataset.length)
    return (
      <p className="text-red-500 border-2 border-dashed border-slate-500 p-4">
        Data Source Offline
      </p>
    );
  const originalData = dataset;
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
  const temparr =
    scale == "date"
      ? Object.values(dataset)
      : dataset
          .slice(0, precision)
          .map((entry) => parseFloat(entry[valueName]));
  const min = Math.min(...temparr);
  const max = Math.max(...temparr);
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
          unit: dayMode ? "day" : false,
          tooltipFormat: "dd/MM/yyyy HH:mm:ss",
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
        min: min - 0.1,
        max: max + 0.1,
      },
    },
  };
  //

  const labels =
    scale == "date"
      ? Object.keys(dataset.slice(0, precision)).map((ts) => new Date(ts))
      : dataset.slice(0, precision).map((i, key) => new Date(i.timestamp));

  const temps =
    scale == "date"
      ? Object.values(dataset.slice(0, precision))
      : dataset.slice(0, precision).map((i, key) => parseFloat(i[valueName]));

  const data = {
    labels:
      valueName === "count"
        ? originalData.map((d) => new Date(d.date))
        : labels,
    datasets: [
      {
        label:
          labelOverride ||
          valueName.charAt(0).toUpperCase() + valueName.slice(1),
        data: valueName === "count" ? originalData.map((d) => d.count) : temps,
        fill: true,
        pointRadius: 1.5,
        borderWidth: 1.5,
        borderColor: `rgba(${colorRgb || "255, 99, 132"}, 1)`,
        backgroundColor: `rgba(${colorRgb || "255, 99, 132"}, 0.2)`,
      },
    ],
  };

  return (
    <div className="h-4/5 w-11/12 flex justify-center">
      {!mode ? (
        <Line options={options} data={data} />
      ) : (
        <Bar options={options} data={data} />
      )}
    </div>
  );
}

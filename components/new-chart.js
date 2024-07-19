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
import { Bar, Line } from "react-chartjs-2";
import { useMemo } from "react";

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

export default function NewChart({
  data,
  label,
  precision,
  scale = "linear",
  valueName,
  dayMode = false,
  colorRgb = "51, 153, 255",
  unit,
  chartTypeBar = false,
}) {
  const chartData = useMemo(() => {
    if (!data || !valueName) return null;

    const temparr =
      scale === "date"
        ? Object.values(data)
        : data.slice(0, precision).map((entry) => parseFloat(entry[valueName]));

    const min = Math.min(...temparr);
    const max = Math.max(...temparr);

    const labels =
      scale === "date"
        ? Object.keys(data.slice(0, precision)).map((ts) => new Date(ts))
        : data.slice(0, precision).map((i) => new Date(i.timestamp));

    const temps =
      scale === "date"
        ? Object.values(data.slice(0, precision))
        : data.slice(0, precision).map((i) => parseFloat(i[valueName]));

    const chartData = {
      labels:
        valueName === "count" ? data.map((d) => new Date(d.date)) : labels,
      datasets: [
        {
          label: valueName.charAt(0).toUpperCase() + valueName.slice(1),
          data: valueName === "count" ? data.map((d) => d.count) : temps,
          fill: true,
          pointRadius: 1.5,
          borderWidth: 1.5,
          borderColor: `rgba(${colorRgb || "255, 99, 132"}, 1)`,
          backgroundColor: `rgba(${colorRgb || "255, 99, 132"}, 0.2)`,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            unit: dayMode ? "day" : false,
            tooltipFormat: "dd/MM/yyyy HH:mm:ss",
          },
        },
        y: {
          min: min - 0.1,
          max: max + 0.1,
        },
      },
    };

    return { data: chartData, options };
  }, [data, precision, scale, valueName, dayMode, colorRgb]);

  if (!chartData) {
    return (
      <div className="w-11/12 h-96 border-2 border-dashed border-slate-400 opacity-75 my-16 flex items-center">
        <p className="text-2xl text-center w-full">
          {label} [
          <span className="text-red-500 uppercase font-semibold">offline</span>]
        </p>
      </div>
    );
  }

  return (
    <div className="h-72 w-11/12 flex-col justify-center my-10">
      <h1 className="text-slate-300 mt-4 mb-2 text-2xl flex justify-between pr-3">
        <span>{label}</span>
        <span>
          {chartData.data.datasets[0].data[0].toFixed(2)}
          {unit ?? ""}
        </span>
      </h1>
      {!chartTypeBar ? (
        <Line options={chartData.options} data={chartData.data} />
      ) : (
        <Bar options={chartData.options} data={chartData.data} />
      )}
    </div>
  );
}

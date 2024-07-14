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
import { useEffect, useState, useMemo } from "react";

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
  namespace,
  label,
  precision,
  scale = "linear",
  valueName,
  dayMode = false,
  colorRgb = "51, 153, 255",
  unit,
  chartTypeBar = false,
}) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const url =
      process.env.NEXT_PUBLIC_HOST + "/stream/" + namespace + "/" + precision;
    const headers = new Headers();
    headers.append("ngrok-skip-browser-warning", "true");
    console.log(url);
    const res = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    return await res.json();
  };

  useEffect(() => {
    const processDataStream = async () => {
      if (!valueName) return;

      try {
        const res = await fetchData();
        const stream = res.data;
        if (!stream) throw new Error();

        const temparr =
          scale === "date"
            ? Object.values(stream)
            : stream
                .slice(0, precision)
                .map((entry) => parseFloat(entry[valueName]));

        const min = Math.min(...temparr);
        const max = Math.max(...temparr);

        const labels =
          scale === "date"
            ? Object.keys(stream.slice(0, precision)).map((ts) => new Date(ts))
            : stream.slice(0, precision).map((i) => new Date(i.timestamp));

        const temps =
          scale === "date"
            ? Object.values(stream.slice(0, precision))
            : stream.slice(0, precision).map((i) => parseFloat(i[valueName]));

        const data = {
          labels:
            valueName === "count"
              ? stream.map((d) => new Date(d.date))
              : labels,
          datasets: [
            {
              label: valueName.charAt(0).toUpperCase() + valueName.slice(1),
              data: valueName === "count" ? stream.map((d) => d.count) : temps,
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

        setChartData({ data, options });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };

    processDataStream();
  }, [namespace, precision, scale, valueName, dayMode, colorRgb]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return chartData ? (
    <div className="h-72 w-11/12 flex-col justify-center mb-20">
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
  ) : (
    <h1 className="border-2 border-dashed border-slate-500 p-4 my-8 text-2xl">
      {label} <span className="font-bold text-red-500">[Offline]</span>
    </h1>
  );
}

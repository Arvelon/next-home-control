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
import { useState, useEffect } from "react";
import { TbAlertHexagonFilled } from "react-icons/tb";
import socket from "@/services/socket";

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
  device,
  lightMode,
  dayMode = false,
  colorRgb = "51, 153, 255",
  unit,
  chartTypeBar = false,
  globalSensorSettings,
}) {
  const [chartData, setChartData] = useState(null);
  const [socketReady, setSocketReady] = useState(false);
  const [sensorSettings, setSensorSettings] = useState(undefined);

  useEffect(() => {
    if (!data || !valueName) return;

    if (
      localStorage.getItem("sensor-settings") !== "undefined" &&
      localStorage.getItem("sensor-settings") !== "null"
    ) {
      setSensorSettings(JSON.parse(localStorage.getItem("sensor-settings")));
    }

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

    setChartData({ data: chartData, options });
  }, [data, precision, scale, valueName, dayMode, colorRgb]);

  useEffect(() => {
    if (!chartData) return;
    // if (socketReady) return;
    // console.log("INIT");
    // Listen for 'connect' event
    socket.on("connect", () => {
      console.log("Connected to the socket");
    });
    // console.log("init: " + "sensor:" + device);
    // Listen for custom events (e.g., 'message')
    socket.on("sensor:" + device, (parameterDto) => {
      console.log("Message from socket:" + device, parameterDto);
      pushParameter(parameterDto);
    });
    setSocketReady(true);

    // Clean up the effect
    return () => {
      socket.off("connect");
      socket.off("sensor:" + device);
    };
  }, [chartData]);

  useEffect(() => {
    console.log("g", globalSensorSettings);
    setSensorSettings(globalSensorSettings);
  }, [globalSensorSettings]);

  const pushParameter = (parameter) => {
    // if (!chartData) return;
    console.log(parameter);
    console.log(chartData);
    const clone = _.cloneDeep(chartData);
    clone.data.labels.unshift(new Date(parameter.parameter.timestamp));
    clone.data.datasets[0].data.unshift(
      parseFloat(parameter.parameter[valueName])
    );
    console.log(clone);
    setChartData(clone);
  };

  if (!chartData || !chartData.data.datasets[0].data[0]) {
    return (
      <div className="w-11/12 h-48 border-2 border-dashed border-slate-400 opacity-75 my-16 flex items-center">
        <p className="text-2xl text-center w-full">
          {label} [
          <span className="text-red-500 uppercase font-semibold">
            waiting for data
          </span>
          ]
        </p>
      </div>
    );
  }

  const isOutOfSync = () => {
    if (!chartData) return true;
    const lastTimestamp = chartData.data.datasets[0].data[0].timestamp;
    if (lastTimestamp < new Date().getTime() - 300_000) {
      return true;
    } else {
      return false;
    }
  };

  return sensorSettings &&
    sensorSettings[device] &&
    sensorSettings[device].enabled ? (
    <div className="h-48 w-11/12 flex-col justify-center my-10">
      <h1
        className={`mt-4 mb-2 text-lg flex justify-between pr-3 ${
          lightMode ? "text-slate-700" : "text-slate-300"
        }`}
      >
        <span>{label}</span>
        <div className="flex items-center">
          <span>
            {isOutOfSync() ? (
              <span className="flex items-center mr-2">
                <span className="text-sm text-red-500 mr-2">OUT OF SYNC</span>
                <TbAlertHexagonFilled className="text-red-500" />
              </span>
            ) : (
              ""
            )}
          </span>
          <span>
            {chartData &&
              chartData.data &&
              chartData.data.datasets[0].data[0]?.toFixed(2)}
            {unit ?? ""}
          </span>
        </div>
      </h1>
      {!chartTypeBar ? (
        <Line options={chartData.options} data={chartData.data} />
      ) : (
        <Bar options={chartData.options} data={chartData.data} />
      )}
    </div>
  ) : (
    ""
  );
}

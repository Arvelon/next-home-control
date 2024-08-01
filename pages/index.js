import { TbAlertHexagonFilled } from "react-icons/tb";
import { FaPlay } from "react-icons/fa";
import { addDays, format, formatDistance, subDays, subMinutes } from "date-fns";
import { MdLightMode } from "react-icons/md";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import CardChart from "@/components/card-chart";
import { ta } from "date-fns/locale";
import NewChart from "@/components/new-chart";
import { fetchSensor, fetchSensors } from "@/services/data-service";
import Overview from "@/components/overview";
import { sensors } from "@/config/runtimesettings";
import _ from "lodash";

export default function Home({ data }) {
  const [precision, setPrecision] = useState(59);
  const [chartTypeBar, setChartTypeBar] = useState(false);
  const [showOutOfSync, setShowOutOfSync] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [sensorSettings, setSensorSettings] = useState(false);

  const lastUpdated = new Date().getTime();

  useEffect(() => {
    setPrecision(parseInt(localStorage.getItem("precision")) || 60);
    setLightMode(
      localStorage.getItem("lightMode") &&
        localStorage.getItem("lightMode") === "true"
    );

    // setInterval(() => {
    //   checkOutOfSync();
    // }, 30000);
  }, []);

  useEffect(() => {
    localStorage.setItem("precision", precision);
    if (
      !window.location.search.includes("precision") ||
      (window.location.search !== "?precision=" + precision && precision !== 59)
    )
      window.location = "/?precision=" + precision;
  }, [precision]);

  useEffect(() => {
    localStorage.setItem("lightMode", lightMode);
  }, [lightMode]);

  const checkOutOfSync = () => {
    if (lastUpdated < new Date().getTime() - 300_000) {
      setShowOutOfSync(true);
    }
  };

  return (
    <div
      className={`pb-24 flex flex-col items-center ${
        lightMode ? "bg-slate-200 text-slate-950" : "black-bg text-slate-300"
      }`}
    >
      <div className="absolute right-0 px-2 py-1">
        {process.env.NEXT_PUBLIC_APP_VERSION || "-"}
      </div>

      {showOutOfSync && (
        <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-60 flex flex-col justify-center items-center">
          <TbAlertHexagonFilled
            className="text-red-500 text-9xl hover:text-red-950 cursor-pointer"
            onClick={() => window.location.reload()}
          />
          <p className="text-3xl mt-2">Out of sync</p>
        </div>
      )}

      <Overview
        data={data}
        lightMode={lightMode}
        updateGlobalSettings={(settings) => setSensorSettings(settings)}
      />

      <h1
        className={`text-slate-300 mt-8 mb-4 text-2xl ${
          lightMode ? "text-slate-700" : "text-slate-300"
        }`}
      >
        Temperature
      </h1>
      <div className="flex mb-2 fixed bottom-0 shadow-md">
        <button
          onClick={() => setPrecision(1440)}
          className={`border  py-1 w-12 ${
            precision === 1440
              ? "bg-slate-200 text-black"
              : "text-white bg-slate-800"
          }`}
        >
          24h
        </button>
        <button
          onClick={() => setPrecision(120)}
          className={`border  py-1 w-12 ${
            precision === 120
              ? "bg-slate-200 text-black"
              : "text-white bg-slate-800"
          }`}
        >
          2h
        </button>
        <button
          onClick={() => setPrecision(60)}
          className={`border  py-1 w-12 ${
            precision === 60
              ? "bg-slate-200 text-black"
              : "text-white bg-slate-800"
          }`}
        >
          1h
        </button>
        <button
          onClick={() => setPrecision(10)}
          className={`border  py-1 w-12 ${
            precision === 10
              ? "bg-slate-200 text-black"
              : "text-white bg-slate-800"
          }`}
        >
          10m
        </button>
        <button
          onClick={() => setPrecision(1)}
          className={`border  py-1 w-12 flex justify-center items-center ${
            precision === 1
              ? "bg-slate-200 text-black"
              : "text-white bg-slate-800"
          }`}
        >
          <FaPlay />
        </button>
        <button
          onClick={() => setLightMode(!lightMode)}
          className={`border  py-1 w-12 flex justify-center items-center ${
            lightMode ? "bg-slate-200 text-black" : "text-white bg-slate-950"
          }`}
        >
          <MdLightMode />
        </button>
        {/* <button
          onClick={() => setChartTypeBar(!chartTypeBar)}
          className={`border py-1 w-12`}
        >
          {chartTypeBar ? "Line" : "Bar"}
        </button> */}
      </div>

      {/* TEMPERATURE CHARTS */}
      {sensors.map((sensor, key) => (
        <NewChart
          key={key}
          precision={precision}
          data={data[sensor.namespace]}
          label={sensor.label}
          device={sensor.namespace}
          valueName="temperature"
          unit="°C"
          colorRgb="255, 99, 132"
          chartTypeBar={chartTypeBar}
          lightMode={lightMode}
          globalSensorSettings={sensorSettings}
        />
      ))}

      {/* HUMIDITY CHARTS */}
      <h1
        className={`text-slate-300 mt-20 text-2xl ${
          lightMode ? "text-slate-700" : "text-slate-300"
        }`}
      >
        Humidity
      </h1>
      {sensors.map((sensor, key) => (
        <NewChart
          key={key}
          precision={precision}
          data={data[sensor.namespace]}
          label={sensor.label}
          device={sensor.namespace}
          valueName="humidity"
          unit="°C"
          colorRgb="51, 153, 255"
          chartTypeBar={chartTypeBar}
          lightMode={lightMode}
          globalSensorSettings={sensorSettings}
        />
      ))}
    </div>
  );
}
export const getServerSideProps = async ({ query }) => {
  const sensors = [
    "climate_sensor_1",
    "climate_sensor_2",
    "climate_sensor_3",
    "esp32_001",
  ];
  const precision = query.precision || 10;

  try {
    const data = {};

    for (const sensor of sensors) {
      const res = await fetchSensor(sensor, precision);

      if (res && res.data) {
        data[sensor] = res.data;
      } else {
        data[sensor] = [];
      }
    }
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    return {
      props: {
        data: error.toString(),
      },
    };
  }
};

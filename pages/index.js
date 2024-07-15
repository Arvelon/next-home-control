import Image from "next/image";
import Graph from "../components/chart";
import { addDays, format, formatDistance, subDays, subMinutes } from "date-fns";
import { addValue, getValue, setValue } from "@/config/firebase";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import CardChart from "@/components/card-chart";
import { ta } from "date-fns/locale";
import NewChart from "@/components/new-chart";
import { fetchSensor, fetchSensors } from "@/services/data-service";

export default function Home({ data }) {
  const [precision, setPrecision] = useState(59);
  const [chartTypeBar, setChartTypeBar] = useState(false);

  useEffect(() => {
    console.log(data);
    setPrecision(parseInt(localStorage.getItem("precision")) || 60);
  }, []);

  useEffect(() => {
    localStorage.setItem("precision", precision);
    if (
      !window.location.search.includes("precision") ||
      (window.location.search !== "?precision=" + precision && precision !== 59)
    )
      window.location = "/?precision=" + precision;
  }, [precision]);

  // const dataValidator = (fullStack) => {
  //   if (!sensor1 || !sensor1.length) return;
  //   // These conditions have overlap, but they are executet in the right order so there is no issue
  //   const green = sensor1.length == fullStack;

  //   const yellow =
  //     sensor1.length < (fullStack / 4) * 3 || sensor1.length < fullStack; // > 75% && !green

  //   const red = sensor1.length < (fullStack / 4) * 3;

  //   const cyan = sensor1.length > fullStack * 1.2;

  //   return (
  //     <div className="flex flex-col w-11/12 mt-4">
  //       <p>
  //         Stack size:{" "}
  //         <span
  //           className={
  //             cyan
  //               ? "text-cyan-500"
  //               : green
  //               ? "text-green-500"
  //               : red
  //               ? "text-red-500"
  //               : "text-yellow-500"
  //           }
  //         >
  //           {sensor1.length}{" "}
  //           {sensor1.length < fullStack
  //             ? "(" + ((sensor1.length / 1440) * 100).toFixed(0) + "%)"
  //             : ""}
  //         </span>
  //       </p>
  //       <p>
  //         Latest datapoint:{" "}
  //         <span
  //           className={
  //             new Date(sensor1[0].timestamp) < subMinutes(new Date(), 2)
  //               ? "text-red-500"
  //               : "text-green-500"
  //           }
  //         >
  //           {sensor1[0].timestamp}
  //         </span>
  //       </p>
  //       <p>Oldest datapoint: {sensor1[sensor1.length - 1].timestamp}</p>
  //     </div>
  //   );
  // };

  return (
    <div
      className={`pb-24 flex flex-col items-center bg-slate-950 text-slate-300 `}
    >
      <div className="absolute right-0 px-2 py-1">
        {process.env.NEXT_PUBLIC_APP_VERSION || "-"}
      </div>
      <h1 className="text-slate-300 mt-4 mb-2 text-3xl">Temperature</h1>
      <div className="flex mb-2">
        <button
          onClick={() => setPrecision(1440)}
          className={`border py-1 w-12 ${
            precision === 1440 ? "font-bold" : ""
          }`}
        >
          24h
        </button>
        <button
          onClick={() => setPrecision(120)}
          className={`border py-1 w-12 ${precision === 120 ? "font-bold" : ""}`}
        >
          2h
        </button>
        <button
          onClick={() => setPrecision(60)}
          className={`border py-1 w-12 ${precision === 60 ? "font-bold" : ""}`}
        >
          1h
        </button>
        <button
          onClick={() => setPrecision(10)}
          className={`border py-1 w-12 ${precision === 10 ? "font-bold" : ""}`}
        >
          10m
        </button>
        <button
          onClick={() => setChartTypeBar(!chartTypeBar)}
          className={`border py-1 w-12`}
        >
          {chartTypeBar ? "Line" : "Bar"}
        </button>
      </div>
      {/* <NewChart
        precision={precision}
        namespace="aggregated_data"
        label="Aggregated 1 test"
        valueName="temperature"
        unit="°C"
        colorRgb="0, 200, 100"
        chartTypeBar={chartTypeBar}
      />
      ---------------------------------------------------------------- */}
      <NewChart
        precision={precision}
        data={data.climate_sensor_1}
        label="Sensor 1 (Living Room)"
        valueName="temperature"
        unit="°C"
        colorRgb="255, 99, 132"
        chartTypeBar={chartTypeBar}
      />
      <NewChart
        precision={precision}
        data={data.climate_sensor_2}
        label="Sensor 2 (Upstairs)"
        valueName="temperature"
        unit="°C"
        colorRgb="255, 99, 132"
        chartTypeBar={chartTypeBar}
      />
      <NewChart
        precision={precision}
        data={data.climate_sensor_3}
        label="Sensor 3 (Outside)"
        valueName="temperature"
        unit="°C"
        colorRgb="255, 99, 132"
        chartTypeBar={chartTypeBar}
      />
      <NewChart
        precision={precision}
        data={data.climate_sensor_1}
        label="Sensor 1 (Living Room)"
        valueName="humidity"
        unit="%"
        colorRgb="51, 153, 255"
        chartTypeBar={chartTypeBar}
      />
      <NewChart
        precision={precision}
        data={data.climate_sensor_2}
        label="Sensor 2 (Upstairs)"
        valueName="humidity"
        unit="%"
        colorRgb="51, 153, 255"
        chartTypeBar={chartTypeBar}
      />
      <NewChart
        precision={precision}
        data={data.climate_sensor_3}
        label="Sensor 3 (Outside)"
        valueName="humidity"
        unit="%"
        colorRgb="51, 153, 255"
        chartTypeBar={chartTypeBar}
      />
      {/* {dataValidator(120)} */}
    </div>
  );
}
export const getServerSideProps = async ({ query }) => {
  const sensors = ["climate_sensor_1", "climate_sensor_2", "climate_sensor_3"];
  const precision = query.precision || 10;

  try {
    const data = {};

    for (const sensor of sensors) {
      const res = await fetchSensor(sensor, precision);
      data[sensor] = res.data;
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

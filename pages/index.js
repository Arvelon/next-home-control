import Image from "next/image";
import Graph from "../components/chart";
import { addDays, format, formatDistance, subDays, subMinutes } from "date-fns";
import { addValue, getValue, setValue } from "@/config/firebase";
import { useEffect, useState } from "react";
import { fetchSensors } from "@/services/data-service";

export default function Home() {
  const [activeCard, setActiveCard] = useState(false);
  const [mode, setMode] = useState("line");
  const [precision, setPrecision] = useState(undefined);
  const [tempBarMode, setTempBarMode] = useState(false);
  const [humbarMode, setHumbarMode] = useState(false);
  const [timer, setTimer] = useState(60);

  // Datasets
  const [sensor1, setSensor1] = useState(undefined);
  const [sensor2, setSensor2] = useState(undefined);
  const [sensor3, setSensor3] = useState(undefined);
  const [sensor1Aggregated, setSensor1Aggregated] = useState(undefined);
  // End datasets

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Reload the current page
      location.reload();
    }, 60000);

    const counterInterval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setPrecision(parseInt(localStorage.getItem("precision")) || 60);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once on mount

  useEffect(() => {
    localStorage.setItem("precision", precision);

    if (precision)
      fetchSensors(precision).then((res) => {
        setSensor1(res.data.sensor1);
        setSensor2(res.data.sensor2);
        setSensor3(res.data.sensor3);
      });
  }, [precision]);

  const addCum = async () => {
    const res = await fetch("api/ejaculation");
    const json = await res.json();
    window.location.reload();
  };

  const dataValidator = (fullStack) => {
    if (!sensor1) return;
    // These conditions have overlap, but they are executet in the right order so there is no issue
    const green = sensor1.length == fullStack;

    const yellow =
      sensor1.length < (fullStack / 4) * 3 || sensor1.length < fullStack; // > 75% && !green

    const red = sensor1.length < (fullStack / 4) * 3;

    const cyan = sensor1.length > fullStack * 1.2;

    return (
      <div className="flex flex-col w-11/12 mt-4">
        <p>
          Stack size:{" "}
          <span
            className={
              cyan
                ? "text-cyan-500"
                : green
                ? "text-green-500"
                : red
                ? "text-red-500"
                : "text-yellow-500"
            }
          >
            {sensor1.length}{" "}
            {sensor1.length < fullStack
              ? "(" + ((sensor1.length / 1440) * 100).toFixed(0) + "%)"
              : ""}
          </span>
        </p>
        <p>
          Latest datapoint:{" "}
          <span
            className={
              new Date(sensor1[0].timestamp) < subMinutes(new Date(), 2)
                ? "text-red-500"
                : "text-green-500"
            }
          >
            {sensor1[0].timestamp}
          </span>
        </p>
        <p>Oldest datapoint: {sensor1[sensor1.length - 1].timestamp}</p>
      </div>
    );
  };

  return (
    <div
      className={`pb-24 flex flex-col items-center bg-slate-950 text-slate-300`}
    >
      <div className="absolute right-0 px-2 py-1">v0.0.3 {timer}</div>

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
          onClick={() => setTempBarMode(!tempBarMode)}
          className={`border py-1 w-12`}
        >
          {tempBarMode ? "Line" : "Bar"}
        </button>
      </div>
      <Graph
        mode={tempBarMode}
        dataset={sensor1}
        precision={precision}
        scale={"time"}
        valueName="temperature"
        colorRgb="255, 99, 132"
        // dayMode
      />
      <Graph
        mode={tempBarMode}
        dataset={sensor1Aggregated}
        precision={1000}
        scale={"time"}
        valueName="temperature"
        colorRgb="255, 99, 132"
        labelOverride="Aggregated Temperature"
        // dayMode
      />
      <h1 className="text-slate-300 mt-4 mb-2 text-2xl">
        Sensor 2 (Upstairs) {sensor2 && sensor2[0].temperature.toFixed(2)}°C
      </h1>
      <Graph
        mode={tempBarMode}
        dataset={sensor2}
        precision={precision}
        scale={"time"}
        valueName="temperature"
        colorRgb="255, 99, 132"
        // dayMode
      />
      <h1 className="text-slate-300 mt-4 mb-2 text-2xl">
        Sensor 3 (Outside) {sensor3 && sensor3[0].temperature.toFixed(2)}°C
      </h1>
      <Graph
        mode={tempBarMode}
        dataset={sensor3}
        precision={precision}
        scale={"time"}
        valueName="temperature"
        colorRgb="255, 99, 132"
        // dayMode
      />

      <h1 className="text-slate-300 mt-4 mb-2 text-3xl">Humidity</h1>

      <h1 className="text-slate-300 mt-4 mb-2 text-2xl">
        Sensor 1 (Living room) {sensor1 && sensor1[0].humidity.toFixed(2)}%
      </h1>

      <Graph
        mode={humbarMode}
        dataset={sensor1}
        scale={"time"}
        precision={precision}
        valueName="humidity"
        colorRgb="51, 153, 255"
        // dayMode
      />
      <h1 className="text-slate-300 mt-4 mb-2 text-2xl">
        Sensor 2 (Upstairs) {sensor2 && sensor2[0].humidity.toFixed(2)}%
      </h1>
      <Graph
        mode={humbarMode}
        dataset={sensor2}
        scale={"time"}
        precision={precision}
        valueName="humidity"
        colorRgb="51, 153, 255"
        // dayMode
      />
      <h1 className="text-slate-300 mt-4 mb-2 text-2xl">
        Sensor 3 (Outside) {sensor3 && sensor3[0].humidity.toFixed(2)}%
      </h1>
      <Graph
        mode={humbarMode}
        dataset={sensor3}
        scale={"time"}
        precision={precision}
        valueName="humidity"
        colorRgb="51, 153, 255"
        // dayMode
      />
      {/* {cum_data.length > 0 && (
        <>
          <div className="flex mb-2">
            <button onClick={() => addCum()} className={`border py-1 w-12`}>
              Add
            </button>
          </div>
          <Graph
            mode={humbarMode}
            dataset={cum_data}
            scale={"time"}
            precision={365}
            valueName="count"
            colorRgb="51, 153, 255"
            labelOverride="Pressure release"
            dayMode
          />
        </>
      )} */}
      {dataValidator(120)}
    </div>
  );
}
// export const getServerSideProps = async ({query}) => {

//   const tp = parseInt(query.tp)

//   const fetchSince = tp ? tp : 60
//   const url = process.env.HOST + "/ago/"+fetchSince;
//   console.log('url: ', url)
//   // Create headers object with the custom header
//   const headers = new Headers();
//   headers.append("ngrok-skip-browser-warning", "true");
// console.log(url)
//   // Fetch with custom headers
//   const res = await fetch(url, {
//     method: "GET", // or 'POST' or other HTTP methods
//     headers: headers,
//   });
//   const data = await res.json();

//   // const dataPoints = data.data.filter(
//   //   (entry) => new Date(entry.timestamp).getTime() > subDays(new Date(), 1)
//   // );

//   const agg_url = process.env.HOST + "/aggregated/all";

//   // Fetch with custom headers
//   const agg_res = await fetch(agg_url, {
//     method: "GET", // or 'POST' or other HTTP methods
//     headers: headers,
//   });
//   const agg_data = await agg_res.json();

//   // const cum_url = process.env.HOST + "/allEjaculationData";

//   // Fetch with custom headers
//   // const cum_res = await fetch(cum_url, {
//   //   method: "GET", // or 'POST' or other HTTP methods
//   //   headers: headers,
//   // });
//   // const cum_data = await cum_res.json();

//   // const interpolated_data = []
//   // cum_data.data.forEach(entry => {
//   //   const date = new Date(entry.date)
//   //   const nextDate = addDays(date, 1)
//   //   console.log(nextDate)
//   //   console.log(format(nextDate, 'yyyy-MM-dd'))
//   //   const result = cum_data.data.find(x => x.date === nextDate)
//   //   if(result) return

//   // })

//   console.log(data)
//   return {
//     props: {
//       sensor1: data.data.sensor1,
//       sensor2: data.data.sensor2,
//       sensor3: data.data.sensor3,
//       aggregated_data: agg_data.data,
//       // cum_data: cum_data.data,
//       // temperature,
//       // humidity,
//       // smoke,
//       // ejaculation,
//       // main,
//     },
//     // revalidate: 60
//   };
// };

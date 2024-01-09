import Image from "next/image";
import Graph from "../components/chart";
import { format, formatDistance, subDays, subMinutes } from "date-fns";
import { addValue, getValue, setValue } from "@/config/firebase";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import CardChart from "@/components/card-chart";
import { ta } from "date-fns/locale";

export default function Home({ data }) {
  const [activeCard, setActiveCard] = useState(false);
  // const [gridState, setGridState] = useState("grid-cols-1 grid-rows-2");
  const [mode, setMode] = useState("line");
  const [temperaturePrecision, setTemperaturePrecision] = useState(60);
  const [humidityPrecision, setHumidityPrecision] = useState(60);
  const [hActive, setHActive] = useState(true);
  // const [jActive, setJActive] = useState(false);
  // const [eActive, setEActive] = useState(false);
// console.log(data)
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Reload the current page
      location.reload();
    }, 60000);

    const counterInterval = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    setTemperaturePrecision(parseInt(localStorage.getItem('temperaturePrecision')))
    setHumidityPrecision(parseInt(localStorage.getItem('humhumidityPrecision')))

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once on mount


  useEffect(() => {
    localStorage.setItem('temperaturePrecision', temperaturePrecision)
    localStorage.setItem('humhumidityPrecision', humidityPrecision)
  }, [temperaturePrecision, humidityPrecision])

  const focusHandler = (card, action, e) => {
    // console.log(card, action);
    // console.log(e);
    // console.log(e.target.id);
    setActiveCard(
      e.target.id === "close" || e.target.parentNode.id === "close"
        ? false
        : card
    );
  };

  // const interval = setInterval(async () => {
  //   const temp = await fetch(process.env.HOST + "/api/temperature");
  //   setLiveTemp(await temp.json())
  // }, 300)

  // const setGrid = async (direction, increase) => {
  //   const config = await getValue("main", "config");
  //   console.log(config);

  //   if (increase) {
  //     config[direction] += 1;
  //   } else {
  //     config[direction] -= 1;
  //   }
  //   // console.log("r", config);
  //   const gridString = "grid-rows-" + config.rows + " grid-cols-" + config.cols;
  //   setGridState(gridString);
  //   setValue("main", "config", config);
  //   // console.log(gridString);
  // };
  // setGrid('cols', false)

  // useEffect(() => {
  //   const viewSettings = localStorage.getItem('viewSettings');
  //   const settings = viewSettings ? JSON.parse(viewSettings) : false;
  //   if(settings) {

  //   }
  // })

  return (
    <div
      className={`h-screen pb-24 flex flex-col items-center bg-slate-950 text-slate-300`}
    >
      <div className="absolute right-0 px-2 py-1">{timer}</div>

      <h1 className="text-slate-300 mt-4 mb-2 text-2xl">
        {data[0].temperature.toFixed(2)}°C
      </h1>
      <div className="flex mb-2">
        <button
          onClick={() => setTemperaturePrecision(1440)}
          className={`border py-1 w-12 ${
            temperaturePrecision === 1440 ? "font-bold" : ""
          }`}
        >
          24h
        </button>
        <button
          onClick={() => setTemperaturePrecision(60)}
          className={`border py-1 w-12 ${
            temperaturePrecision === 60 ? "font-bold" : ""
          }`}
        >
          1h
        </button>
        <button
          onClick={() => setTemperaturePrecision(10)}
          className={`border py-1 w-12 ${
            temperaturePrecision === 10 ? "font-bold" : ""
          }`}
        >
          10m
        </button>
      </div>
      <Graph
        mode={mode}
        dataset={data}
        precision={temperaturePrecision}
        scale={"time"}
        valueName="temperature"
        colorRgb="255, 99, 132"
        // dayMode
      />
      <h1 className="text-slate-300 mt-4 mb-2 text-2xl">
        {data[0].humidity.toFixed(2)}%
      </h1>
      <div className="flex mb-2">
        <button
          onClick={() => setHumidityPrecision(1440)}
          className={`border py-1 w-12 ${
            humidityPrecision === 1440 ? "font-bold" : ""
          }`}
        >
          24h
        </button>
        <button
          onClick={() => setHumidityPrecision(60)}
          className={`border py-1 w-12 ${
            humidityPrecision === 60 ? "font-bold" : ""
          }`}
        >
          1h
        </button>
        <button
          onClick={() => setHumidityPrecision(10)}
          className={`border py-1 w-12 ${
            humidityPrecision === 10 ? "font-bold" : ""
          }`}
        >
          10m
        </button>
      </div>
      <Graph
        mode={mode}
        dataset={data}
        scale={"time"}
        precision={humidityPrecision}
        valueName="humidity"
        colorRgb="51, 153, 255"
        // dayMode
      />
      <div className="flex flex-col w-11/12 mt-4">
        <p>Stack size: <span className={data.length >= 1440 ? 'text-green-500' : data.length >= 60 ? 'text-yellow-500' : 'text-red-500'}>{data.length} {data.length < 1440 ? '(' + (data.length / 1440 * 100).toFixed(0) + '%)' : ''}</span></p>
        <p>
          Latest datapoint:{" "}
          <span
            className={
              new Date(data[0].timestamp) < subMinutes(new Date(), 2)
                ? "text-red-500"
                : "text-green-500"
            }
          >
            {data[0].timestamp}
          </span>
        </p>
        <p>Oldest datapoint: {data[data.length - 1].timestamp}</p>
      </div>
    </div>
  );
}
export const getServerSideProps = async () => {
  // const temp = await fetch(process.env.HOST + "/api/temperature");
  // const hum = await fetch(process.env.HOST + "/api/humidity");
  // const smok = await fetch(process.env.HOST + "/api/smoke");
  // const eja = await fetch(process.env.HOST + "/api/ejaculation");
  // const main = await getValue("main", "test");

  // const temperature = await temp.json();
  // const humidity = await hum.json();
  // const smoke = await smok.json();
  // const ejaculation = await eja.json();

  // if (!temp.ok || !hum.ok || !smok.ok || !eja.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   throw new Error("Failed to fetch data");
  // }

  const url = process.env.HOST + "/latest";
  // Create headers object with the custom header
  const headers = new Headers();
  headers.append("ngrok-skip-browser-warning", "true");

  // Fetch with custom headers
  const res = await fetch(url, {
    method: "GET", // or 'POST' or other HTTP methods
    headers: headers,
  });
  const data = await res.json();

  const dataPoints = data.data.filter(entry => new Date(entry.timestamp).getTime() < subDays(new Date(), 1))

  return {
    props: {
      data: dataPoints,
      // temperature,
      // humidity,
      // smoke,
      // ejaculation,
      // main,
    },
    // revalidate: 60
  };
};

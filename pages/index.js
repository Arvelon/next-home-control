import Image from "next/image";
import Graph from "../components/chart";
import { format, formatDistance } from "date-fns";
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
    <div className={`h-screen pb-24 flex flex-col items-center bg-white text-black`}>
      <h1 className="text-black mt-4 mb-2 text-2xl">{data[0].temperature.toFixed(2)}°C</h1>
      <div className="flex mb-2">
        <button onClick={() => setTemperaturePrecision(1440)} className={`border py-1 w-12 ${temperaturePrecision === 1440 ? 'font-bold' : ''}`}>24h</button>
        <button onClick={() => setTemperaturePrecision(60)} className={`border py-1 w-12 ${temperaturePrecision === 60 ? 'font-bold' : ''}`}>1h</button>
        <button onClick={() => setTemperaturePrecision(10)} className={`border py-1 w-12 ${temperaturePrecision === 10 ? 'font-bold' : ''}`}>10m</button>
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
      <h1 className="text-black mt-4 text-2xl">{data[0].humidity.toFixed(2)}%</h1>
      <div className="flex mb-2">
        <button onClick={() => setHumidityPrecision(1440)} className={`border py-1 w-12 ${humidityPrecision === 1440 ? 'font-bold' : ''}`}>24h</button>
        <button onClick={() => setHumidityPrecision(60)} className={`border py-1 w-12 ${humidityPrecision === 60 ? 'font-bold' : ''}`}>1h</button>
        <button onClick={() => setHumidityPrecision(10)} className={`border py-1 w-12 ${humidityPrecision === 10 ? 'font-bold' : ''}`}>10m</button>
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
        <p>Stack size: {data.length}</p><p>Latest datapoint: {data[0].timestamp}</p><p>Oldest datapoint: {data[data.length-1].timestamp}</p>
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

  const url = process.env.HOST + '/latest'
  // Create headers object with the custom header
  const headers = new Headers();
  headers.append('ngrok-skip-browser-warning', 'true');
  
  // Fetch with custom headers
  const res = await fetch(url, {
    method: 'GET', // or 'POST' or other HTTP methods
    headers: headers,
  })
  const data = await res.json()
  return {
    props: {
      data: data.data,
      // temperature,
      // humidity,
      // smoke,
      // ejaculation,
      // main,
    },
    // revalidate: 60
  };
};

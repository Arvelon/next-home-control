import Image from "next/image";
import Graph from "../components/chart";
import { format, formatDistance } from "date-fns";
import { addValue, getValue, setValue } from "@/config/firebase";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import CardChart from "@/components/card-chart";
import { ta } from "date-fns/locale";

export default function Home({ temperature, humidity, smoke, ejaculation, main }) {
  const [activeCard, setActiveCard] = useState(false);
  const [gridState, setGridState] = useState("grid-cols-1 grid-rows-2");
  const [mode, setMode] = useState("line");
  const [tActive, setTActive] = useState(true);
  const [hActive, setHActive] = useState(true);
  const [jActive, setJActive] = useState(false);
  const [eActive, setEActive] = useState(false);

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
  // setTimeout(() => window.location.reload(true), 300000)

  const setGrid = async (direction, increase) => {
    const config = await getValue("main", "config");
    console.log(config);

    if (increase) {
      config[direction] += 1;
    } else {
      config[direction] -= 1;
    }
    // console.log("r", config);
    const gridString = "grid-rows-" + config.rows + " grid-cols-" + config.cols;
    setGridState(gridString);
    setValue("main", "config", config);
    // console.log(gridString);
  };
  // setGrid('cols', false)

  // useEffect(() => {
  //   const viewSettings = localStorage.getItem('viewSettings');
  //   const settings = viewSettings ? JSON.parse(viewSettings) : false;
  //   if(settings) {

  //   }
  // })

  return (
    <main className={`h-screen pb-24`}>
      <CardChart
        disabled={!tActive}
        activeCard={activeCard}
        data={temperature}
        color="255, 99, 132"
        namespace="temperature"
        mode={mode}
        focusHandler={focusHandler}
        unit="°C"
      />

      <CardChart
        disabled={!hActive}
        activeCard={activeCard}
        data={humidity}
        color="51, 153, 255"
        namespace="humidity"
        mode={mode}
        focusHandler={focusHandler}
        unit="%"
      />

      <CardChart
        disabled={!jActive}
        activeCard={activeCard}
        data={smoke}
        color="0, 204, 0"
        scale="date"
        namespace="smoke"
        mode={mode}
        focusHandler={focusHandler}
        unit="joints"
      />

      <CardChart
        disabled={!eActive}
        activeCard={activeCard}
        data={ejaculation}
        color="0, 204, 0"
        scale="date"
        namespace="ejaculation"
        mode={mode}
        focusHandler={focusHandler}
        unit="ejaculations"
      />

      <div className="fixed flex w-screen bg-white bottom-0 p-4 z-40">
        <button
          className="shadow rounded-sm py-1 px-2 mr-4"
          onClick={() => setMode(mode === "line" ? "bar" : "line")}
        >
          {mode === "line" ? "Bar Chart" : "Line Chart"}
        </button>
        <button
          className="shadow rounded-sm py-1 px-2 mr-4"
          onClick={() =>
            addValue("smoke_log", { timestamp: new Date().getTime() })
          }
        >
          Log Generic
        </button>
        <button
          className="shadow rounded-sm py-1 px-2 mr-4"
          onClick={() =>
            addValue("ejaculation_log", { timestamp: new Date().getTime() })
          }
        >
          Log Enumeration
        </button>
        <button
          className="shadow rounded-sm py-1 px-2 mr-4"
          onClick={() => setTActive(!tActive)}
        >
          Temperature
        </button>
        <button
          className="shadow rounded-sm py-1 px-2 mr-4"
          onClick={() => setHActive(!hActive)}
        >
          Humidity
        </button>
        <button
          className="shadow rounded-sm py-1 px-2 mr-4"
          onClick={() => setJActive(!jActive)}
        >
          {/* Joints */}
          Generic
        </button>
        <button
          className="shadow rounded-sm py-1 px-2 mr-4"
          onClick={() => setEActive(!eActive)}
        >
          {/* Joints */}
          Enumeration
        </button>
        {/* <div className="flex flex-col items-center mr-4">
          <span className="text-center">cols</span>
          <div className="flex justify-between">
            <button
              className="shadow rounded-sm py-1 px-2"
              onClick={() => setGrid("cols", true)}
            >
              +
            </button>
            <button
              className="shadow rounded-sm py-1 px-2"
              onClick={() => setGrid("cols", false)}
            >
              -
            </button>
          </div>
        </div> */}
        <div className="flex flex-col items-center">
          <span className="text-center">rows</span>
          <div className="flex justify-between">
            <button
              className="shadow rounded-sm py-1 px-2"
              onClick={() => setGrid("rows", true)}
            >
              +
            </button>
            <button
              className="shadow rounded-sm py-1 px-2"
              onClick={() => setGrid("rows", false)}
            >
              -
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
export const getServerSideProps = async () => {
  const temp = await fetch(process.env.HOST + "/api/temperature");
  const hum = await fetch(process.env.HOST + "/api/humidity");
  const smok = await fetch(process.env.HOST + "/api/smoke");
  const eja = await fetch(process.env.HOST + "/api/ejaculation");
  const main = await getValue("main", "test");

  const temperature = await temp.json();
  const humidity = await hum.json();
  const smoke = await smok.json();
  const ejaculation = await eja.json();

  if (!temp.ok || !hum.ok || !smok.ok || !eja.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return {
    props: {
      temperature,
      humidity,
      smoke,
      ejaculation,
      main,
    },
    // revalidate: 60
  };
};

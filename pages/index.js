import Image from "next/image";
import Graph from "../components/chart";
import { addDays, format, formatDistance, subDays, subMinutes } from "date-fns";
import { addValue, getValue, setValue } from "@/config/firebase";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import CardChart from "@/components/card-chart";
import { ta } from "date-fns/locale";

export default function Home({ data, aggregated_data, cum_data }) {
  const [activeCard, setActiveCard] = useState(false);
  // const [gridState, setGridState] = useState("grid-cols-1 grid-rows-2");
  const [mode, setMode] = useState("line");
  const [temperaturePrecision, setTemperaturePrecision] = useState(60);
  const [humidityPrecision, setHumidityPrecision] = useState(60);
  const [tempBarMode, setTempBarMode] = useState(false);
  const [humbarMode, setHumbarMode] = useState(false);
  // const [jActive, setJActive] = useState(false);
  // const [eActive, setEActive] = useState(false);
  // console.log(data)
  const [timer, setTimer] = useState(60);
  // console.log(data);
  console.log(cum_data)
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Reload the current page
      location.reload();
    }, 60000);

    const counterInterval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setTemperaturePrecision(
      parseInt(localStorage.getItem("temperaturePrecision")) || 60
    );
    setHumidityPrecision(
      parseInt(localStorage.getItem("humidityPrecision")) || 60
    );

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once on mount

  useEffect(() => {
    console.log(temperaturePrecision, humidityPrecision);
    localStorage.setItem("temperaturePrecision", temperaturePrecision);
    localStorage.setItem("humidityPrecision", humidityPrecision);
  }, [temperaturePrecision, humidityPrecision]);

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

  const addCum = async () => {
    await fetch(process.env.NEXT_PUBLIC_HOST + "/updateEjaculationCount");
    window.location.reload();
  };

  const dataValidator = (fullStack) => {

    // These conditions have overlap, but they are executet in the right order so there is no issue
    const green = data.length == fullStack

    const yellow = data.length < (fullStack / 4 * 3) || data.length < fullStack // > 75% && !green

    const red = data.length < (fullStack / 4 * 3)

    const cyan = data.length > fullStack * 1.2

    return (
      <div className="flex flex-col w-11/12 mt-4">
        <p>
          Stack size:{" "}
          <span
            className={
              cyan ? "text-cyan-500" :
                green
                  ? "text-green-500"
                  : red
                    ? "text-red-500"
                    : "text-yellow-500"
            }
          >
            {data.length}{" "}
            {data.length < 1440
              ? "(" + ((data.length / 1440) * 100).toFixed(0) + "%)"
              : ""}
          </span>
        </p>
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
    )
  }

  return (
    <div
      className={`pb-24 flex flex-col items-center bg-slate-950 text-slate-300`}
    >
      <div className="absolute right-0 px-2 py-1">{timer}</div>

      <h1 className="text-slate-300 mt-4 mb-2 text-2xl">
        {data[0].temperature.toFixed(2)}°C
      </h1>
      <div className="flex mb-2">
        <button
          onClick={() => setTemperaturePrecision(1440)}
          className={`border py-1 w-12 ${temperaturePrecision === 1440 ? "font-bold" : ""
            }`}
        >
          24h
        </button>
        <button
          onClick={() => setTemperaturePrecision(60)}
          className={`border py-1 w-12 ${temperaturePrecision === 60 ? "font-bold" : ""
            }`}
        >
          1h
        </button>
        <button
          onClick={() => setTemperaturePrecision(10)}
          className={`border py-1 w-12 ${temperaturePrecision === 10 ? "font-bold" : ""
            }`}
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
        dataset={data}
        precision={temperaturePrecision}
        scale={"time"}
        valueName="temperature"
        colorRgb="255, 99, 132"
      // dayMode
      />
      <Graph
        mode={tempBarMode}
        dataset={aggregated_data}
        precision={1000}
        scale={"time"}
        valueName="temperature"
        colorRgb="255, 99, 132"
        labelOverride="Aggregated Temperature"
      // dayMode
      />
      <h1 className="text-slate-300 mt-4 mb-2 text-2xl">
        {data[0].humidity.toFixed(2)}%
      </h1>
      <div className="flex mb-2">
        <button
          onClick={() => setHumidityPrecision(1440)}
          className={`border py-1 w-12 ${humidityPrecision === 1440 ? "font-bold" : ""
            }`}
        >
          24h
        </button>
        <button
          onClick={() => setHumidityPrecision(60)}
          className={`border py-1 w-12 ${humidityPrecision === 60 ? "font-bold" : ""
            }`}
        >
          1h
        </button>
        <button
          onClick={() => setHumidityPrecision(10)}
          className={`border py-1 w-12 ${humidityPrecision === 10 ? "font-bold" : ""
            }`}
        >
          10m
        </button>
        <button
          onClick={() => setHumbarMode(!humbarMode)}
          className={`border py-1 w-12`}
        >
          {tempBarMode ? "Line" : "Bar"}
        </button>
      </div>
      <Graph
        mode={humbarMode}
        dataset={data}
        scale={"time"}
        precision={humidityPrecision}
        valueName="humidity"
        colorRgb="51, 153, 255"
      // dayMode
      />
      {cum_data.length > 0 && (
        <>
          <Graph
            mode={humbarMode}
            dataset={cum_data}
            scale={"time"}
            precision={365}
            valueName="humidity"
            colorRgb="51, 153, 255"
            labelOverride="Pressure release"
          // dayMode
          />
          <div className="flex mb-2">
            <button onClick={() => addCum()} className={`border py-1 w-12`}>
              Add
            </button>
          </div>
        </>
      )}
      {dataValidator(1440)}
    </div>
  );
}
export const getServerSideProps = async () => {

  const url = process.env.HOST + "/n/1440";
  // Create headers object with the custom header
  const headers = new Headers();
  headers.append("ngrok-skip-browser-warning", "true");

  // Fetch with custom headers
  const res = await fetch(url, {
    method: "GET", // or 'POST' or other HTTP methods
    headers: headers,
  });
  const data = await res.json();

  const dataPoints = data.data.filter(
    (entry) => new Date(entry.timestamp).getTime() > subDays(new Date(), 1)
  );

  const agg_url = process.env.HOST + "/aggregated/all";

  // Fetch with custom headers
  const agg_res = await fetch(agg_url, {
    method: "GET", // or 'POST' or other HTTP methods
    headers: headers,
  });
  const agg_data = await agg_res.json();

  const cum_url = process.env.HOST + "/allEjaculationData";

  // Fetch with custom headers
  const cum_res = await fetch(cum_url, {
    method: "GET", // or 'POST' or other HTTP methods
    headers: headers,
  });
  const cum_data = await cum_res.json();
  console.log(cum_data);

  // const interpolated_data = []
  // cum_data.data.forEach(entry => {
  //   const date = new Date(entry.date)
  //   const nextDate = addDays(date, 1)
  //   console.log(nextDate)
  //   console.log(format(nextDate, 'yyyy-MM-dd'))
  //   const result = cum_data.data.find(x => x.date === nextDate)
  //   if(result) return

  // })

  return {
    props: {
      data: dataPoints,
      aggregated_data: agg_data.data,
      cum_data: cum_data.data,
      // temperature,
      // humidity,
      // smoke,
      // ejaculation,
      // main,
    },
    // revalidate: 60
  };
};

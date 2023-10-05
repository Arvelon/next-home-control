import Image from "next/image";
import Graph from "../components/chart";
import { format } from "date-fns";
import { getValue, setValue } from "@/config/firebase";
import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

export default function Home({ temperature, humidity, main }) {
  const [activeCard, setActiveCard] = useState(false);

  const focusHandler = (card, action, e) => {
    // console.log(card, action);
    console.log(e)
    console.log(e.target.id)
    setActiveCard(e.target.id === "close" || e.target.parentNode.id === "close" ? false : card);
  };

  return (
    <main className="flex flex-col md:flex-row h-screen">
      <div
        id="temperature"
        className={`z-10 flex flex-col ${
          activeCard === "temperature" ? "w-full h-full" : "w-full md:w-1/2 h-full md:h-1/2"
        } items-center bg-white rounded-xl m-1 pb-5`}
        onClick={(e) => focusHandler("temperature", "focus", e)}
      >
        {activeCard == "temperature" && (
          <div className="flex justify-end w-full">
            <AiFillCloseCircle
            id="close"
            className="text-3xl text-gray-700 opacity-50 mt-1 mr-1"
          />
          </div>
        )}
        <div className="py-4 pt-8">
          <h1 className="text-center text-4xl">
            {temperature[temperature.length - 1].temperature}°C
          </h1>
          <span>
            {parseInt(
              (new Date().getTime() -
                parseInt(temperature[temperature.length - 1].timestamp)) /
                1000 /
                60
            )}{" "}
            {parseInt(
              (new Date().getTime() -
                parseInt(temperature[temperature.length - 1].timestamp)) /
                1000 /
                60
            ) == 1
              ? " minute"
              : " minutes"}{" "}
            ago (
            {format(
              new Date(temperature[temperature.length - 1].timestamp),
              "MMMM do yyyy HH:mm"
            )}
            )
          </span>
        </div>
        <div className="h-4/5 w-11/12 flex justify-center">
          {temperature && (
            <Graph
              dataset={temperature}
              valueName="temperature"
              colorRgb="255, 99, 132"
            />
          )}
        </div>
        <div>
          {/* <button onClick={() => setValue('main', 'private', {last_porn: new Date().getTime()})}>I watched Porn ({})</button>
        <button onClick={() => setValue('main', 'private', {last_smoke: new Date().getTime()})}>I smoked</button>
        <button onClick={() => setValue('main', 'private', {last_weed: new Date().getTime()})}>I smoked weed</button>
        <button onClick={() => setValue('main', 'private', {last_masturbation: new Date().getTime()})}>I masturbated</button>
        <button onClick={() => setValue('main', 'private', {last_ejaculation: new Date().getTime()})}>I ejaculated</button> */}
        </div>
      </div>

      <div
        id="humidity"
        className={`z-10 flex flex-col ${
          activeCard === "humidity" ? "w-full h-full" : "w-full md:w-1/2 h-full md:h-1/2"
        } items-center bg-white rounded-xl m-1 pb-5`}
        onClick={(e) => focusHandler("humidity", "focus", e)}
      >
        {activeCard == "humidity" && (
          <div className="flex justify-end w-full">
            <AiFillCloseCircle
            id="close"
            className="text-3xl text-gray-700 opacity-50 mt-1 mr-1"
          />
          </div>
        )}
        <div className="py-4 pt-8">
          <h1 className="text-center text-4xl">
            {humidity[humidity.length - 1].humidity}%
          </h1>
          <span>
            {parseInt(
              (new Date().getTime() -
                parseInt(humidity[humidity.length - 1].timestamp)) /
                1000 /
                60
            )}{" "}
            {parseInt(
              (new Date().getTime() -
                parseInt(humidity[humidity.length - 1].timestamp)) /
                1000 /
                60
            ) == 1
              ? " minute"
              : " minutes"}{" "}
            ago (
            {format(
              new Date(humidity[humidity.length - 1].timestamp),
              "MMMM do yyyy HH:mm"
            )}
            )
          </span>
        </div>
        <div className="h-4/5 w-11/12 flex justify-center">
          {humidity && (
            <Graph
              dataset={humidity}
              valueName="humidity"
              colorRgb="51, 153, 255"
            />
          )}
        </div>
        <div>
          {/* <button onClick={() => setValue('main', 'private', {last_porn: new Date().getTime()})}>I watched Porn ({})</button>
        <button onClick={() => setValue('main', 'private', {last_smoke: new Date().getTime()})}>I smoked</button>
        <button onClick={() => setValue('main', 'private', {last_weed: new Date().getTime()})}>I smoked weed</button>
        <button onClick={() => setValue('main', 'private', {last_masturbation: new Date().getTime()})}>I masturbated</button>
        <button onClick={() => setValue('main', 'private', {last_ejaculation: new Date().getTime()})}>I ejaculated</button> */}
        </div>
      </div>
    </main>
  );
}
export const getServerSideProps = async () => {
  const temp = await fetch(process.env.HOST + "/api/temperature");
  const hum = await fetch(process.env.HOST + "/api/humidity");
  const main = await getValue("main", "test");

  const temperature = await temp.json();
  const humidity = await hum.json();
  console.log(humidity);

  if (!temp.ok || !hum.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return {
    props: {
      temperature,
      humidity,
      main,
    },
    // revalidate: 60
  };
};

import { sensors } from "@/config/runtimesettings";
import { useEffect, useState } from "react";

export default function Overview({ data, lightMode, updateGlobalSettings }) {
  console.log("Overview");

  const [sensorSettings, setSensorSettings] = useState(undefined);

  useEffect(() => {
    console.log(sensorSettings);
    if (sensorSettings === undefined) return;
    localStorage.setItem("sensor-settings", JSON.stringify(sensorSettings));
  }, [sensorSettings]);

  useEffect(() => {
    console.log(localStorage.getItem("sensor-settings"));
    if (
      localStorage.getItem("sensor-settings") !== "undefined" &&
      localStorage.getItem("sensor-settings") !== "null"
    ) {
      setSensorSettings(JSON.parse(localStorage.getItem("sensor-settings")));
      updateGlobalSettings(JSON.parse(localStorage.getItem("sensor-settings")));
    } else {
      console.log("Sensor Settings nope");
      let newSettings = {};
      sensors.forEach(
        (sensor) => (newSettings[sensor.namespace] = { enabled: true })
      );
      setSensorSettings(newSettings);
      updateGlobalSettings(newSettings);
    }
  }, []);

  const toggleChart = (device) => {
    console.log(sensorSettings);
    const clone = _.cloneDeep(sensorSettings);

    clone[device].enabled = !clone[device]?.enabled || false;
    setSensorSettings(clone);
    updateGlobalSettings(clone);
    console.log(clone);
  };

  return (
    <>
      {typeof data === "object" ? (
        <div className="w-11/12 flex flex-col items-center md:pb-10">
          <h1
            className={`text-slate-300 mt-4 mb-4 text-3xl ${
              lightMode ? "text-slate-700" : "text-slate-300"
            }`}
          >
            Overview
          </h1>

          <div className="grid grid-cols-2 mt-4 w-full">
            {sensors.map((sensor, key) => {
              return (
                <div
                  key={key}
                  className={`border m-1 py-3 ${
                    lightMode ? "border-slate-200" : "border-slate-500"
                  }
                  ${
                    sensorSettings &&
                    sensorSettings[sensor.namespace] &&
                    sensorSettings[sensor.namespace].enabled
                      ? ""
                      : "opacity-50"
                  }`}
                  onClick={() => toggleChart(sensor.namespace)}
                >
                  <div className="text-center font-semibold mb-1">
                    {sensor.label.includes("(") ? (
                      <>
                        <p>{sensor.label.split("(")[0]}</p>
                        <p>({sensor.label.split("(")[1]}</p>
                      </>
                    ) : (
                      <p>{sensor.label}</p>
                    )}
                  </div>

                  <div className="flex justify-between md:justify-center items-center px-3">
                    <div className="m-0 text-lg text-red-400 md:px-4">
                      {data[sensor.namespace][0]?.temperature.toFixed(2)}°C
                    </div>
                    <div className="m-0 text-lg text-blue-400 md:px-4">
                      {data[sensor.namespace][0]?.humidity.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="w-11/12 flex flex-col items-center pb-20">
          <h1 className="text-slate-300 mt-4 mb-10 text-3xl">Overview</h1>
          <div className="w-1/2 border-2 border-slate-500 border-dashed p-20">
            <p className="text-center">
              [
              <span className="text-red-500 font-semibold text-center">
                OFFLINE
              </span>
              ]
            </p>
          </div>
        </div>
      )}
    </>
  );
}

import { sensors } from "@/config/runtimesettings";

export default function Overview({ data }) {
  console.log("Overview");
  return (
    <>
      {typeof data === "object" ? (
        <div className="w-11/12 flex flex-col items-center md:pb-10">
          <h1 className="text-slate-300 mt-8 mb-2 text-3xl">Overview</h1>

          <div className="grid grid-cols-2 mt-4 w-full">
            {sensors.map((sensor, key) => {
              return (
                <div key={key} className="border border-slate-500 m-1 py-3">
                  <p className="text-center font-semibold mb-1">
                    {sensor.label.includes("(") ? (
                      <>
                        <p>{sensor.label.split("(")[0]}</p>
                        <p>({sensor.label.split("(")[1]}</p>
                      </>
                    ) : (
                      <p>{sensor.label}</p>
                    )}
                  </p>

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

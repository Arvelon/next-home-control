export default function Overview({ data }) {
  return (
    <>
      {typeof data === "object" ? (
        <div className="w-11/12 flex flex-col items-center pb-20">
          <h1 className="text-slate-300 mt-4 mb-2 text-3xl">Overview</h1>

          <div className="grid grid-cols-2 mb-20 mt-4 w-full">
            {Object.keys(data).map((sensor, key) => {
              return (
                <div key={key} className="border border-slate-500 m-1">
                  <p className="text-center mt-4 font-semibold">{sensor}</p>

                  <div className="flex flex-col md:flex-row justify-center items-center">
                    <div className="m-4 text-2xl text-red-400">
                      {data[sensor][0].temperature.toFixed(2)}°C
                    </div>
                    <div className="m-4 text-2xl text-blue-400">
                      {data[sensor][0].humidity.toFixed(2)}%
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

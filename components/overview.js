export default function Overview({ data }) {
  console.log(data);

  return (
    <div className="w-11/12 flex flex-col items-center">
      <h1 className="text-slate-300 mt-4 mb-2 text-3xl">Overview</h1>

      <div className="grid grid-cols-2 m-20 w-full">
        {Object.keys(data).map((sensor, key) => {
          return (
            <div key={key} className="border border-slate-500 m-1">
              <p className="text-center mt-4 font-semibold">{sensor}</p>
              <div className="flex justify-center">
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
  );
}

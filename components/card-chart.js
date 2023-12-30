import { format } from "date-fns";
import Graph from "./chart";
import { AiFillCloseCircle } from "react-icons/ai";

export default function CardChart({
  activeCard,
  data,
  namespace,
  mode,
  focusHandler,
  color,
  unit,
  scale,
  disabled,
}) {
  console.log(data)
  return (
    <>
      {!disabled && (
        <div
          id={namespace}
          className={`z-10 flex flex-col ${
            activeCard === namespace
              ? "absolute w-11/12 shadow-lg h-screen z-50"
              : "w-full h-full"
          } items-center bg-white rounded-xl m-1 pb-5`}
          onClick={(e) => focusHandler("data", "focus", e)}
        >
          {activeCard == "data" && (
            <div className="flex justify-end w-full">
              <AiFillCloseCircle
                id="close"
                className="text-3xl text-gray-700 opacity-50 mt-1 mr-1"
              />
            </div>
          )}
          {/* <div className="py-4 pt-8"> */}
            {/* <h1 className="text-center text-4xl">
              {scale == "date"
                ? data[format(new Date(), "MM-dd-yyyy")] ||
                  0 + (" " + unit || " units")
                : data[data.length - 1][namespace] + (" " + unit || " units")}
            </h1>

            {scale !== "date" && (
              <span>
                {parseInt(
                  (new Date().getTime() -
                    parseInt(data[data.length - 1].timestamp)) /
                    1000 /
                    60
                )}{" "}
                {parseInt(
                  (new Date().getTime() -
                    parseInt(data[data.length - 1].timestamp)) /
                    1000 /
                    60
                ) == 1
                  ? " minute"
                  : " minutes"}{" "}
                ago (
                {format(
                  new Date(data[data.length - 1].timestamp),
                  "MMMM do yyyy HH:mm"
                )}
                )
              </span>
            )} */}
          {/* </div> */}

          {data && (
            <Graph
              mode={mode}
              dataset={data}
              scale={scale}
              valueName={namespace}
              colorRgb={color}
              // dayMode
            />
          )}
        </div>
      )}
    </>
  );
}

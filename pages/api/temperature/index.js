import fsPromises from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getAll, getValue } from "../../../config/firebase";
import { format } from "date-fns";
const dataFilePath = path.join(process.cwd(), "db/data.json");

export default async function handler(req, res) {
    console.log("GET /temperature");
    const data = await getAll("temperature_log", 75);


    const tempsPerDay = {}

    // Average PEr Day code
    // data.forEach(entry => {
    //     const date = format(new Date(entry.timestamp), "yyyy-MM-dd")
    //     // console.log(date)

    //     const list = tempsPerDay[date] || [];
    //     list.push(parseFloat(entry.temperature))
    //     tempsPerDay[date] = list
    // })
    // console.log(tempsPerDay)

    // const averagesPerDay = []
    // Object.entries(tempsPerDay).map(([date, list]) => {
    //     let sum = 0
    //     list.forEach(entry => sum += entry)
    //     const average = sum / list.length
    //     averagesPerDay.push({timestamp: new Date(date).getTime(), temperature: average})
    // })


    // console.log(averagesPerDay);
    res.status(200).json(data);
    
}

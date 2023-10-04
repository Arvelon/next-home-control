import fsPromises from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { addValue } from "../../../config/firebase";
const dataFilePath = path.join(process.cwd(), "db/data.json");


export default async function handler(req, res) {
  const { query } = req;
  const { temp } = query;

  console.log("GET /temperature/add");
  const data = await addValue("temperature_log", {timestamp: new Date().getTime(), temperature: temp});
  console.log(data);
  res.status(200).json(data);
}

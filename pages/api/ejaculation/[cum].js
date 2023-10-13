import fsPromises from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { addValue } from "../../../config/firebase";
const dataFilePath = path.join(process.cwd(), "db/data.json");


export default async function handler(req, res) {
  const { query } = req;
  const { hum } = query;

  console.log("GET /humidity/add");
  const data = await addValue("humidity_log", {timestamp: new Date().getTime(), humidity: hum});
  // console.log(data);
  res.status(200).json(data);
}

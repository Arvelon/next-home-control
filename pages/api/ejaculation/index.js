import fsPromises from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getAll, getValue } from "../../../config/firebase";
import { format } from "date-fns";
const dataFilePath = path.join(process.cwd(), "db/data.json");

export default async function handler(req, res) {
  console.log("GET /ejaculation");
  
  // console.log(data);

  const resp = await fetch(process.env.HOST + "/updateEjaculationCount")

  // console.log(groupByCategory);

  
  //   console.log(format(new Date(), "dd-MM-yyyy"))
  //   console.log(new Date())

  res.status(200).json(await resp.json());
}

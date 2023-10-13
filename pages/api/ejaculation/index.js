import fsPromises from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getAll, getValue } from "../../../config/firebase";
import { format } from "date-fns";
const dataFilePath = path.join(process.cwd(), "db/data.json");

export default async function handler(req, res) {
  console.log("GET /ejaculation");
  const data = await getAll("ejaculation_log");
  // console.log(data);

  const groupByCategory = data.reduce((group, entry) => {
    const { timestamp } = entry;
    const ts = format(new Date(timestamp), "MM-dd-yyyy");
    group[ts] = group[ts] ?? 0;
    group[ts] += 1;
    return group;
  }, {});

  // console.log(groupByCategory);

  
  //   console.log(format(new Date(), "dd-MM-yyyy"))
  //   console.log(new Date())

  res.status(200).json(groupByCategory);
}

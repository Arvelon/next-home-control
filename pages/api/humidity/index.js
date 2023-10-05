import fsPromises from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getAll, getValue } from "../../../config/firebase";
const dataFilePath = path.join(process.cwd(), "db/data.json");

export default async function handler(req, res) {
    console.log("GET /humidity");
    const data = await getAll("humidity_log");
    // console.log(data);
    res.status(200).json(data);
}

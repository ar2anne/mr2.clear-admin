import { NextApiRequest, NextApiResponse } from "next";
import data from "../../../data.json";

export default (req:NextApiRequest,res:NextApiResponse)=> {
    if (req.method != "GET") return res.writeHead(405).end("Method not allowed");
    const {id} = req.query;
    const item = (data as any[]).find(x=> x.mId == id);
    if (!item) return res.writeHead(404).end("Product not found");
    return res.json(item);
}
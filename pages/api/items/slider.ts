import paginate from "@shared/paginate";
import { NextApiRequest, NextApiResponse } from "next";
import data from "../../../data.json";

export default (req:NextApiRequest,res:NextApiResponse)=> {
    if (req.method != "GET") return res.writeHead(405).end("Method not allowed");
    const result = (data as any[]).filter(x=> x.mIsNewArrival);
    return res.json(
        paginate(result,5,1)
    );
}
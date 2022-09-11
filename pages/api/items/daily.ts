import paginate from "@shared/paginate";
import { NextApiRequest, NextApiResponse } from "next";
import data from "../../../data.json";

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != "GET") return res.writeHead(405).end("Method not allowed");
    var result = data as any[];
    result = result
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return res.json(paginate(result,16,1));
}
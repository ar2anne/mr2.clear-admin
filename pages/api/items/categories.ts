import { NextApiRequest, NextApiResponse } from "next";
import data from "../../../data.json";

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != "GET") return res.writeHead(405).end("Method not allowed");
    return res.json(
        Array.from(
            new Set(
                (data as any[])
                    .map(x => x.mCategories).flat(1)
            )
        )
    );
}
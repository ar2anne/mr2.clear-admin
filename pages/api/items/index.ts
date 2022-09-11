import fullTextSearch from "@shared/full-text-search";
import paginate from "@shared/paginate";
import sleep from "@shared/sleep";
import { NextApiRequest, NextApiResponse } from "next";
import data from "../../../data.json";

export default async (req:NextApiRequest,res:NextApiResponse)=> {
    if (req.method != "GET") return res.writeHead(405).end("Method not allowed");
    var result = data as any[];
    const {page,s,rate,minPrice,maxPrice} = req.query;

    if (s && (s.toString().trim() != "")) {
        result = fullTextSearch(result,s);
    }

    if (rate) {
        const rateNum = parseInt(rate.toString());
        if (rateNum > 0) result = result.filter(x=> x.mStarRatings >= rateNum);
    }

    if (minPrice) {
        const minPriceNum = parseInt(minPrice.toString());
        result = result.filter(x=> x.msrp >= minPriceNum)
    }

    if (maxPrice) {
        const maxPriceNum = parseInt(maxPrice.toString());
        result = result.filter(x=> x.msrp <= maxPriceNum);
    }

    await sleep(1000);
    return res.json({
        items: paginate(result,12,page as any),
        pageCount: Math.round((result.length / 12))
    });
}
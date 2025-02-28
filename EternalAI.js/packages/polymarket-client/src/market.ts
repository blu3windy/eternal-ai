import {config as dotenvConfig} from "dotenv";
import {resolve} from "path";
import {Chain, ClobClient} from "@polymarket/clob-client";

dotenvConfig({path: resolve(__dirname, "../.env")});

export class Market {
    clobClient: ClobClient

    constructor() {
        const host = process.env.CLOB_API_URL || "http://localhost:8080";
        const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
        this.clobClient = new ClobClient(host, chainId);
    }

    getMarket = async (condition_id: string) => {
        return await this.clobClient.getMarket(condition_id);
    }

    getMarkets = async (next_cursor: string) => {
        return await this.clobClient.getMarkets(next_cursor);
    }

    getSamplingMarkets = async (next_cursor: string) => {
        return await this.clobClient.getSamplingMarkets(next_cursor);
    }

    getSimplifiedMarkets = async (next_cursor: string) => {
        return await this.clobClient.getSimplifiedMarkets(next_cursor);
    }

    getSamplingSimplifiedMarkets = async (next_cursor: string) => {
        return await this.clobClient.getSamplingSimplifiedMarkets(next_cursor);
    }
}
import {config as dotenvConfig} from "dotenv";
import {resolve} from "path";
import {Chain, ClobClient} from "@polymarket/clob-client";

dotenvConfig({path: resolve(__dirname, "../.env")});

export class Market {
    clobClient: any

    constructor() {
        const host = process.env.CLOB_API_URL || "http://localhost:8080";
        const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
        this.clobClient = new ClobClient(host, chainId);
    }

    getMarkets = async () => {
        return await this.clobClient.getMarkets();
    }

    getSamplingMarkets = async () => {
        return await this.clobClient.getSamplingMarkets();
    }

    getSimplifiedMarkets = async () => {
        return await this.clobClient.getSimplifiedMarkets();
    }

    getSamplingSimplifiedMarkets = async () => {
        return await this.clobClient.getSamplingSimplifiedMarkets();
    }
}
import {ETH_CHAIN_ID, getRPC, zeroAddress} from "./const";
import {ethers} from "ethers";
import {Token} from "@uniswap/sdk-core";
import {changeWallet, createWallet} from "./libs/providers";
import {createTrade} from "./libs/trading";
import {CurrentConfig, Environment} from "./libs/config";

export class SwapReq {
    token_in: string = ""
    token_in_address: string = ""
    token_in_amount: number = 0
    token_out: string = ""
    token_out_address: string = ""

    constructor(token_in: string, token_in_address: string, token_in_amount: number, token_out: string, token_out_address: string) {
        this.token_in = token_in;
        this.token_in_address = token_in_address;
        this.token_in_amount = token_in_amount;
        this.token_out = token_out;
        this.token_out_address = token_out_address;
    }

    static fromJSON(json: string): SwapReq {
        const parsed = JSON.parse(json);
        return Object.assign(new SwapReq('', '', 0, '', ''), parsed);
    }

    convert_in_out = async () => {
        if (this.token_in.toLowerCase() == "eth") {
            this.token_in_address = zeroAddress;
        } else {
            const token_address = await this.convert_token_address(this.token_in.toLowerCase())
            if (!token_address) this.token_in_address = zeroAddress
            else this.token_in_address = token_address
        }

        if (this.token_out.toLowerCase() == "eth") {
            this.token_out_address = zeroAddress;
        } else {
            const token_address = await this.convert_token_address(this.token_out.toLowerCase())
            if (!token_address) this.token_out_address = zeroAddress
            else this.token_out_address = token_address
        }
    }

    get_token_address_from_info = (token_info: any, symbol: string) => {
        let result = null;
        if (token_info["symbol"] && token_info["symbol"] == symbol) {
            if (token_info["platforms"]) {
                if (token_info["platforms"]["ethereum"]) {
                    result = token_info["platforms"]["ethereum"]
                }
            }
        }
        return result;
    }

    convert_token_address = async (symbol: string) => {
        let result = null;
        const token_info_response = await fetch("https://api.coingecko.com/api/v3/coins/" + symbol)
        if (token_info_response.ok) {
            const data = await token_info_response.json();
            result = this.get_token_address_from_info(data, symbol)
        }
        if (!result) {
            const token_info_list_response = await fetch("https://api.coingecko.com/api/v3/coins/list?include_platform=true&status=active")
            if (token_info_list_response.ok) {
                const list = await token_info_list_response.json();
                for (const token_info of list) {
                    result = this.get_token_address_from_info(token_info, symbol)
                    if (result) break
                }
            }
        }
        return result
    }
}


export interface PoolInfo {
    token0: string
    token1: string
    fee: number
    tickSpacing: number
    sqrtPriceX96: ethers.BigNumberish
    liquidity: ethers.BigNumberish
    tick: number
}

export class UniSwapAI {
    swap_v3 = async (privateKey: string, req: SwapReq, chain_id: number, rpc: string) => {
        if (privateKey == "") {
            throw new Error("invalid private key")
        }
        CurrentConfig.env = Environment.MAINNET
        // CurrentConfig.rpc.mainnet = rpc || getRPC(chain_id)
        CurrentConfig.rpc.mainnet = getRPC(ETH_CHAIN_ID)
        CurrentConfig.wallet.privateKey = privateKey
        CurrentConfig.tokens.in = new Token(
            // chain_id,
            parseInt(ETH_CHAIN_ID, 16),
            req.token_in_address,
            // "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            18,
            req.token_in,
            req.token_in
        )

        CurrentConfig.tokens.amountIn = req.token_in_amount

        CurrentConfig.tokens.out = new Token(
            // chain_id,
            parseInt(ETH_CHAIN_ID, 16),
            req.token_out_address,
            18,
            req.token_out,
            req.token_out
        )


        const newWallet = createWallet();
        console.log("Wallet: ", newWallet.address)
        changeWallet(newWallet);

        try {
            const trade = await createTrade()
            /*const state = await executeTrade(trade)
            return state*/
        } catch (e) {
            console.log(`Error ${e}`)
        }
        return null
    }
}
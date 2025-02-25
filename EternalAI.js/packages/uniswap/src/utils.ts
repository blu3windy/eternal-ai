import {Token, TradeType} from '@uniswap/sdk-core'
import {Trade} from '@uniswap/v3-sdk'
import {BigNumberish, ethers} from 'ethers'

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}

export function stringToBytes(str: string): any {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

export const poaMiddleware = (options: any) => {
    return (next: any) => {
        return async (payload: any) => {
            if (payload.method === 'eth_sendTransaction' || payload.method === 'eth_call') {
                console.log("------options", options)
                const {from} = payload.params[0];
                payload.params[0].chainId = options.chain_id;
            }
            return next(payload);
        };
    };
};

const MAX_DECIMALS = 4

export function fromReadableAmount(
    amount: number,
    decimals: number
): BigNumberish {
    return ethers.utils.parseUnits(amount.toString(), decimals)
}

export function toReadableAmount(rawAmount: number, decimals: number): string {
    return ethers.utils.formatUnits(rawAmount, decimals).slice(0, MAX_DECIMALS)
}

export function displayTrade(trade: Trade<Token, Token, TradeType>): string {
    return `${trade.inputAmount.toExact()} ${
        trade.inputAmount.currency.symbol
    } for ${trade.outputAmount.toExact()} ${trade.outputAmount.currency.symbol}`
}
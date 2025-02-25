import {Token} from '@uniswap/sdk-core'
import {FeeAmount} from '@uniswap/v3-sdk'

import {USDC_TOKEN, WETH_TOKEN} from './constants'

// Sets if the example should run locally or on chain
export enum Environment {
    LOCAL,
    MAINNET,
    WALLET_EXTENSION,
}

// Inputs that configure this example to run
export interface ExampleConfig {
    env: Environment
    rpc: {
        local: string
        mainnet: string
    }
    wallet: {
        address: string
        privateKey: string
    }
    tokens: {
        in: Token
        amountIn: number
        out: Token
        poolFee: number
    }
}

// Example Configuration

export let CurrentConfig: ExampleConfig = {
    env: Environment.MAINNET,
    rpc: {
        local: '',
        mainnet: '',
    },
    wallet: {
        address: '',
        privateKey:
            '',
    },
    tokens: {
        in: WETH_TOKEN,
        amountIn: 1,
        out: USDC_TOKEN,
        poolFee: FeeAmount.MEDIUM,
    },
}
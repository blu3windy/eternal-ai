// import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import {computePoolAddress, Pool} from '@uniswap/v3-sdk'
import {ethers} from 'ethers'

import {CurrentConfig} from './config'
import {POOL_FACTORY_CONTRACT_ADDRESS} from './constants'
import {getProvider} from './providers'
import {Token} from "@uniswap/sdk-core";
import {IV3PoolABI} from "./IV3Pool"

interface PoolInfo {
    token0: string
    token1: string
    fee: number
    tickSpacing: number
    sqrtPriceX96: ethers.BigNumberish
    liquidity: ethers.BigNumberish
    tick: number
}


export async function getPoolInfoByToken(tokenIn: Token, tokenOut: Token, poolFee: number): Promise<Pool> {
    const provider = getProvider()
    if (!provider) {
        throw new Error('No provider')
    }


    const currentPoolAddress = computePoolAddress({
        factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
        tokenA: tokenIn,
        tokenB: tokenOut,
        fee: poolFee
    })

    const poolContract = new ethers.Contract(
        currentPoolAddress,
        IV3PoolABI.abi,
        provider
    )


    //const token0 = await poolContract.token0()
    //const token1 = await poolContract.token1()
    //const fee = await poolContract.fee()
    //const tickSpacing = await poolContract.tickSpacing()
    const liquidity = await poolContract.liquidity()
    const slot0 = await poolContract.slot0()

    const p = new Pool(
        tokenIn,
        tokenOut,
        poolFee,
        slot0[0].toString(),
        liquidity.toString(),
        slot0[1]
    )
    return p
}

export async function getPoolInfo(): Promise<PoolInfo> {
    const provider = getProvider()
    if (!provider) {
        throw new Error('No provider')
    }
    const currentPoolAddress = computePoolAddress({
        factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
        tokenA: CurrentConfig.tokens.in,
        tokenB: CurrentConfig.tokens.out,
        fee: CurrentConfig.tokens.poolFee,
    })
    console.log("currentPoolAddress", currentPoolAddress)

    const poolContract = new ethers.Contract(
        currentPoolAddress,
        IV3PoolABI.abi,
        provider
    )

    // console.log("token0", await poolContract.token0())

    const [token0, token1, fee, tickSpacing, liquidity, slot0] =
        await Promise.all([
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.tickSpacing(),
            poolContract.liquidity(),
            poolContract.slot0(),
        ])

    return {
        token0,
        token1,
        fee,
        tickSpacing,
        liquidity,
        sqrtPriceX96: slot0[0],
        tick: slot0[1],
    }
}
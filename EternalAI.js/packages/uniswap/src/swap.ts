import {RPC_URL, zeroAddress} from "./const";
import {ethers} from "ethers";
import {ChainId, Currency, CurrencyAmount, Percent, Token, TradeType} from "@uniswap/sdk-core";
import {computePoolAddress, FeeAmount, Pool, Route, SwapOptions, SwapQuoter, SwapRouter, Trade} from "@uniswap/v3-sdk";
import {
    ERC20_ABI,
    MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS,
    POOL_FACTORY_CONTRACT_ADDRESS,
    QUOTER_CONTRACT_ADDRESS,
    SWAP_ROUTER_ADDRESS, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER, TransactionState
} from "@/swap_const";
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import {fromReadableAmount} from "@/utils";

export type TokenTrade = Trade<Token, Token, TradeType>

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
    web3: any = null

    create_web3 = (rpc: string) => {
        if (this.web3 == null) {
            if (rpc != "") {
                this.web3 = new ethers.providers.JsonRpcProvider(rpc);
            } else {
                this.web3 = new ethers.providers.JsonRpcProvider(RPC_URL.ETH_CHAIN_ID)
            }
        }
    }

    swap_v3 = async (privateKey: string, req: SwapReq, chain_id: number, rpc: string) => {
        this.create_web3(rpc)
        if (!privateKey) {
            throw new Error('private key is missing');
        }

        const wallet = new ethers.Wallet(privateKey, this.web3);
        if (!chain_id) {
            chain_id = ChainId.MAINNET;
        }

        // Define tokens
        const tokenA = new Token(chain_id, req.token_in_address, 18);
        const tokenB = new Token(chain_id, req.token_out_address, 18);
    }

    createTrade = async (req: SwapReq, tokenA: Token, tokenB: Token) => {
        const poolInfo = await this.getPoolInfo(tokenA, tokenB, FeeAmount.LOW);

        const pool = new Pool(
            tokenA,
            tokenB,
            FeeAmount.LOW,
            poolInfo.sqrtPriceX96.toString(),
            poolInfo.liquidity.toString(),
            poolInfo.tick
        )

        const swapRoute = new Route(
            [pool],
            CurrentConfig.tokens.in,
            CurrentConfig.tokens.out
        )

        const amountOut = await this.getOutputQuote(req, tokenA, tokenB, swapRoute)
        const uncheckedTrade = Trade.createUncheckedTrade({
            route: swapRoute,
            inputAmount: CurrencyAmount.fromRawAmount(
                tokenA,
                fromReadableAmount(
                    req.token_in_amount,
                    18
                ).toString()
            ),
            outputAmount: CurrencyAmount.fromRawAmount(
                tokenB,
                JSBI.BigInt(amountOut)
            ),
            tradeType: TradeType.EXACT_INPUT,
        })

        return uncheckedTrade
    }

    executeTrade = async (tokenA: Token, trade: TokenTrade, walletAddress: string) => {
        const provider = this.web3

        if (!walletAddress || !provider) {
            throw new Error('Cannot execute a trade without a connected wallet')
        }

        // Give approval to the router to spend the token
        const tokenApproval = await this.getTokenTransferApproval(tokenA, walletAddress)

        // Fail if transfer approvals do not go through
        if (tokenApproval !== TransactionState.Sent) {
            return TransactionState.Failed
        }

        const options: SwapOptions = {
            slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
            deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
            recipient: walletAddress,
        }

        const methodParameters = SwapRouter.swapCallParameters([trade], options)

        const tx = {
            data: methodParameters.calldata,
            to: SWAP_ROUTER_ADDRESS,
            value: methodParameters.value,
            from: walletAddress,
            maxFeePerGas: MAX_FEE_PER_GAS,
            maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
        }

        const res = await sendTransaction(tx)

        return res
    }

    getTokenTransferApproval = async (token: Token, address: string) => {
        const provider = this.web3
        if (!provider || !address) {
            console.log('No Provider Found')
            return TransactionState.Failed
        }

        try {
            const tokenContract = new ethers.Contract(
                token.address,
                ERC20_ABI,
                provider
            )

            const transaction = await tokenContract.populateTransaction.approve(
                SWAP_ROUTER_ADDRESS,
                fromReadableAmount(
                    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
                    token.decimals
                ).toString()
            )

            return sendTransaction({
                ...transaction,
                from: address,
            })
        } catch (e) {
            console.error(e)
            return TransactionState.Failed
        }
    }

    sendTransaction = async (private_key: string,
                             transaction: ethers.providers.TransactionRequest
    ): Promise<TransactionState> => {
        if (transaction.value) {
            transaction.value = BigNumber.from(transaction.value)
        }
        const wallet = new ethers.Wallet(private_key, this.web3)
        const txRes = await wallet.sendTransaction(transaction)

        let receipt = null
        const provider = this.web3
        if (!provider) {
            return TransactionState.Failed
        }

        while (receipt === null) {
            try {
                receipt = await provider.getTransactionReceipt(txRes.hash)

                if (receipt === null) {
                    continue
                }
            } catch (e) {
                console.log(`Receipt error:`, e)
                break
            }
        }

        // Transaction was successful if status === 1
        if (receipt) {
            return TransactionState.Sent
        } else {
            return TransactionState.Failed
        }
    }

    getOutputQuote = async (req: SwapReq, tokenA: Token, tokenB: Token, route: Route<Currency, Currency>) => {
        const provider = this.web3;

        if (!provider) {
            throw new Error('Provider required to get pool state')
        }

        const {calldata} = await SwapQuoter.quoteCallParameters(
            route,
            CurrencyAmount.fromRawAmount(
                tokenA,
                fromReadableAmount(
                    req.token_in_amount,
                    18
                ).toString()
            ),
            TradeType.EXACT_INPUT,
            {
                useQuoterV2: true,
            }
        )

        const quoteCallReturnData = await provider.call({
            to: QUOTER_CONTRACT_ADDRESS,
            data: calldata,
        })

        return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData)
    }

    getPoolInfo = async (tokenA: Token, tokenB: Token, poolFee: any = FeeAmount.LOW): Promise<PoolInfo> => {
        const provider = this.web3
        if (!provider) {
            throw new Error('No provider')
        }

        const currentPoolAddress = computePoolAddress({
            factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
            tokenA: tokenA,
            tokenB: tokenB,
            fee: poolFee,
        })

        const poolContract = new ethers.Contract(
            currentPoolAddress,
            IUniswapV3PoolABI.abi,
            provider
        )

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
}
import {
  Currency,
  CurrencyAmount,
  Percent,
  Token,
  TradeType,
} from '@uniswap/sdk-core';
import {
  Pool,
  Route,
  SwapOptions,
  SwapQuoter,
  SwapRouter,
  Trade,
} from '@uniswap/v3-sdk';

import JSBI from 'jsbi';
import * as ethers from 'ethers';

import { CurrentConfig } from './config';
import {
  ERC20_ABI,
  QUOTER_CONTRACT_ADDRESS,
  SWAP_ROUTER_ADDRESS,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
  WETH_TOKEN,
} from './constants';
import { MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS } from './constants';
import { getPoolInfo, getPoolInfoByToken } from './pool';
import {
  getProvider,
  getWallet,
  getWalletAddress,
  sendTransaction,
  TransactionState,
} from './providers';
import { fromReadableAmount } from './utils';
import { ZeroAddress } from '../const';
import { TTransactionResponse } from '@/types';

export type TokenTrade = Trade<Token, Token, TradeType>;

// Trading Functions

export async function buildPools() {
  let listPools: any[] = [];

  if (
    CurrentConfig.tokens.in.address == ZeroAddress ||
    CurrentConfig.tokens.out.address == ZeroAddress ||
    CurrentConfig.tokens.in.address == WETH_TOKEN.address ||
    CurrentConfig.tokens.out.address == WETH_TOKEN.address
  ) {
    const poolInfo = await getPoolInfo();
    console.log('--------> poolInfo', JSON.stringify(poolInfo, null, 4));
    const pool = new Pool(
      CurrentConfig.tokens.in,
      CurrentConfig.tokens.out,
      CurrentConfig.tokens.poolFee,
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      poolInfo.tick
    );
    listPools.push(pool);
  } else {
    // get getPoolInfoByToken
    const pool1 = await getPoolInfoByToken(
      CurrentConfig.tokens.in,
      WETH_TOKEN,
      CurrentConfig.tokens.poolFee
    );
    const pool2 = await getPoolInfoByToken(
      WETH_TOKEN,
      CurrentConfig.tokens.out,
      CurrentConfig.tokens.poolFee
    );
    listPools.push(pool1);
    listPools.push(pool2);
  }
  return listPools;
}

export async function createTrade(): Promise<TokenTrade> {
  // console.log("--------> CurrentConfig", CurrentConfig)
  const listPools = await buildPools();
  const swapRoute = new Route(
    listPools,
    CurrentConfig.tokens.in,
    CurrentConfig.tokens.out
  );

  // console.log(`Rout: ${JSON.stringify(swapRoute)}`)

  const amountOut = await getOutputQuote(swapRoute);

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.in,
      fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString()
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.out,
      JSBI.BigInt(amountOut)
    ),
    tradeType: TradeType.EXACT_INPUT,
  });
  // console.log(`Created uncheckedTrade: \n\n ${JSON.stringify(uncheckedTrade, null, 4)} \n\n`)
  return uncheckedTrade;
}

export async function isTokenApproved(
  token: Token,
  owner: string,
  spender: string,
  amount: string
): Promise<boolean> {
  const provider = getProvider();
  if (!provider) {
    throw new Error('Provider required to check token approval');
  }
  try {
    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      provider
    );

    const transaction = await tokenContract.populateTransaction.allowance(
      owner,
      spender
    );

    return false;
    // return allowance.gte(amount);
  } catch (error) {
    console.log('isTokenApproved error:', (error as Error).message);
    return false;
  }
}

export async function executeTrade(
  trade: TokenTrade
): Promise<TTransactionResponse> {
  const walletAddress = getWalletAddress();
  const wallet = getWallet();
  const provider = getProvider();

  if (!walletAddress || !provider) {
    throw new Error('Cannot execute a trade without a connected wallet');
  }

  // Give approval to the router to spend the token
  const tokenApproval = await getTokenTransferApproval(CurrentConfig.tokens.in);

  // Fail if transfer approvals do not go through
  if (!!tokenApproval && tokenApproval.state !== TransactionState.Sent) {
    return {
      state: TransactionState.Failed,
      tx: null,
      message: 'Token transfer approval failed',
    };
  }

  const options: SwapOptions = {
    slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 30, // 20 minutes from the current Unix time
    recipient: walletAddress,
  };

  const methodParameters = SwapRouter.swapCallParameters([trade], options);

  const txs = {
    data: methodParameters.calldata,
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
    // maxFeePerGas: MAX_FEE_PER_GAS,
    // maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    gasPrice: await wallet.provider.getGasPrice(),
    gasLimit: 1000000,
  };

  console.log(`Execute tx swap`, JSON.stringify(txs, null, 4));

  const { state, tx } = await sendTransaction(txs);

  return { state, tx };
}

// Helper Quoting and Pool Functions

async function getOutputQuote(route: Route<Currency, Currency>) {
  const provider = getProvider();

  if (!provider) {
    throw new Error('Provider required to get pool state');
  }

  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.in,
      fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString()
    ),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    }
  );

  const quoteCallReturnData = await provider.call({
    to: QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  });

  return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData);
}

export async function getTokenTransferApproval(
  token: Token,
  amount?: number
): Promise<TTransactionResponse> {
  const provider = getProvider();
  const address = getWalletAddress();
  if (!provider || !address) {
    console.log('No Provider Found');
    return { state: TransactionState.Failed, tx: null };
  }

  const amountToApprove = fromReadableAmount(
    amount || TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
    token.decimals
  ).toString();

  // check if token is already approved
  try {
    const alreadyApproved = await isTokenApproved(
      token,
      address,
      SWAP_ROUTER_ADDRESS,
      amountToApprove
    );
    if (!alreadyApproved) {
      const tokenContract = new ethers.Contract(
        token.address,
        ERC20_ABI,
        provider
      );
      let transaction;
      try {
        transaction = await tokenContract.populateTransaction.approve(
          SWAP_ROUTER_ADDRESS,
          amountToApprove
        );
        return sendTransaction({
          ...transaction,
          from: address,
        });
      } catch (error) {
        console.log('getTokenTransferApproval error:', error);
        return {
          state: TransactionState.Failed,
          tx: null,
          message:
            'getTokenTransferApproval error: ' + (error as Error).message,
        };
      }
    }
    return {
      state: TransactionState.Sent,
      tx: null,
    };
  } catch (error) {
    return {
      state: TransactionState.Failed,
      tx: null,
      message: 'getTokenTransferApproval error: ' + (error as Error).message,
    };
  }
}

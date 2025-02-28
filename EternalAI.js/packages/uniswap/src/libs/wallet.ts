// This file contains code to easily connect to and get information from a wallet on chain

import { Currency } from '@uniswap/sdk-core';
import { BigNumber, ethers } from 'ethers';
import { providers } from 'ethers';
import JSBI from 'jsbi';

import {
  ERC20_ABI,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  WETH_ABI,
  WETH_CONTRACT_ADDRESS,
} from './constants';
import {
  getProvider,
  getWalletAddress,
  sendTransaction,
  TransactionState,
} from './providers';
import { toReadableAmount } from './utils';

export async function getCurrencyBalance(
  provider: providers.Provider,
  address: string,
  currency: Currency
): Promise<string> {
  // Handle ETH directly
  if (currency.isNative) {
    return ethers.utils.formatEther(await provider.getBalance(address));
  }

  // Get currency otherwise
  const ERC20Contract = new ethers.Contract(
    currency.address,
    ERC20_ABI,
    provider
  );
  const balance: number = await ERC20Contract.balanceOf(address);
  const decimals: number = await ERC20Contract.decimals();

  // Format with proper units (approximate)
  return toReadableAmount(balance, decimals);
}

export async function getCurrencyDecimal(
  provider: providers.Provider,
  address: string
): Promise<number> {
  // Get currency otherwise
  const ERC20Contract = new ethers.Contract(address, ERC20_ABI, provider);
  const decimals: number = await ERC20Contract.decimals();

  return decimals;
}

// wraps ETH (rounding up to the nearest ETH for decimal places)
export async function wrapETH(eth: number) {
  const provider = getProvider();
  const address = getWalletAddress();
  if (!provider || !address) {
    throw new Error('Cannot wrap ETH without a provider and wallet address');
  }

  const wethContract = new ethers.Contract(
    WETH_CONTRACT_ADDRESS,
    WETH_ABI,
    provider
  );


  const value = ethers.utils.parseEther(eth.toString());


  const transaction = {
    data: wethContract.interface.encodeFunctionData('deposit'),
    value: value,
    from: address,
    to: WETH_CONTRACT_ADDRESS,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };

  const { state, tx } = await sendTransaction(transaction);
  if (state === TransactionState.Sent) {
    console.log('Wrap ETH success with amount: ', eth);
  }
}

// unwraps ETH (rounding up to the nearest ETH for decimal places)
export async function unwrapETH(eth: number) {
  const provider = getProvider();
  const address = getWalletAddress();
  if (!provider || !address) {
    throw new Error('Cannot unwrap ETH without a provider and wallet address');
  }

  const wethContract = new ethers.Contract(
    WETH_CONTRACT_ADDRESS,
    WETH_ABI,
    provider
  );

  const transaction = {
    data: wethContract.interface.encodeFunctionData('withdraw', [
      BigNumber.from(Math.ceil(eth))
        .mul(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)).toString())
        .toString(),
    ]),
    from: address,
    to: WETH_CONTRACT_ADDRESS,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };

  await sendTransaction(transaction);
}

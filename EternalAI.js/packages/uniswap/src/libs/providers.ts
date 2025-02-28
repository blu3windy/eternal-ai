import { TTransactionResponse } from './../type';
import { BigNumber, ethers, providers, Wallet } from 'ethers';
import { CurrentConfig, Environment } from './config';

let wallet: ethers.Wallet;

export function changeWallet(newWallet: any) {
  wallet = newWallet;
}

let walletExtensionAddress: string | null = null;

// Interfaces

export enum TransactionState {
  Failed = 'Failed',
  New = 'New',
  Rejected = 'Rejected',
  Sending = 'Sending',
  Sent = 'Sent',
}

// Provider and Wallet Functions

export function getProvider(): providers.Provider | null {
  if (!wallet) {
    wallet = createWallet();
  }

  return wallet.provider;
}

export function getWalletAddress(): string | null {
  return CurrentConfig.env === Environment.WALLET_EXTENSION
    ? walletExtensionAddress
    : wallet.address;
}

export function getWallet(): ethers.Wallet {
  return wallet;
}

export async function sendTransaction(
  transaction: ethers.providers.TransactionRequest
): Promise<TTransactionResponse> {
  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value);
  }
  return sendTransactionViaWallet(transaction);
}

// Internal Functionality

export function createWallet(): ethers.Wallet {
  let provider = new ethers.providers.JsonRpcProvider(
    CurrentConfig.rpc.mainnet
  );
  if (CurrentConfig.env == Environment.LOCAL) {
    provider = new ethers.providers.JsonRpcProvider(CurrentConfig.rpc.local);
  }
  return new ethers.Wallet(CurrentConfig.wallet.privateKey, provider);
}

// Transacting with a wallet extension via a Web3 Provider
async function sendTransactionViaWallet(
  transaction: ethers.providers.TransactionRequest
): Promise<TTransactionResponse> {
  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value);
  }
  const txRes = await wallet.sendTransaction(transaction);

  let receipt = null;
  const provider = getProvider();
  if (!provider) {
    return { state: TransactionState.Failed, tx: receipt };
  }

  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(txRes.hash);

      if (receipt === null) {
        continue;
      }
    } catch (e) {
      console.log(`Receipt error:`, e);
      break;
    }
  }

  // Transaction was successful if status === 1
  if (receipt) {
    console.log('receipt tx', receipt.transactionHash);

    return { state: TransactionState.Sent, tx: receipt };
  } else {
    return { state: TransactionState.Failed, tx: null };
  }
}

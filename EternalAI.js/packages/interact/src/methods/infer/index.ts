import * as ethers from 'ethers';

import { InteractWallet } from '../types';
import {
  CreateInferPayload,
  ListenInferPayload,
  SendInferResponse,
} from './types';
import { abis, AGENT_CONTRACT_ADDRESSES } from './constants';
import { ChainId } from '@/constants';

const contracts: Record<string, ethers.Contract> = {};

const getContract = (contractAddress: string, wallet: InteractWallet) => {
  if (!contracts[contractAddress]) {
    contracts[contractAddress] = new ethers.Contract(
      contractAddress,
      abis,
      wallet.provider
    );
  }
  return contracts[contractAddress];
};

const Infer = {
  getSystemPrompt: async (chainId: ChainId, wallet: InteractWallet) => {
    try {
      console.log('infer getSystemPrompt - start');
      const contractAddress = AGENT_CONTRACT_ADDRESSES[chainId];
      const contract = getContract(contractAddress, wallet);
      const systemPrompt = await contract.getSystemPrompt();
      console.log('infer getSystemPrompt - succeed', systemPrompt);
      return systemPrompt;
    } catch (e) {
      console.log('infer getSystemPrompt - failed', e);
      throw e;
    } finally {
      console.log('infer getSystemPrompt - end');
    }
  },
  createPayload: async (
    wallet: InteractWallet,
    payload: CreateInferPayload
  ) => {
    try {
      console.log('infer createPayload - start', payload);
      const contractAddress = AGENT_CONTRACT_ADDRESSES[payload.chainId];
      const contract = getContract(contractAddress, wallet);

      const systemPrompt = await Infer.getSystemPrompt(payload.chainId, wallet);

      const { model, chainId, prompt } = payload;

      const messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const encoder = new TextEncoder();

      const promptPayload = encoder.encode(
        JSON.stringify({
          messages,
          model,
        })
      );
      const callData = contract.interface.encodeFunctionData('prompt(bytes)', [
        promptPayload,
      ]);

      const from = await wallet.getAddress();
      const [gasLimit, gasPrice, nonce] = await Promise.all([
        contract.estimateGas.prompt(promptPayload),
        wallet.provider.getGasPrice(),
        wallet.provider.getTransactionCount(from),
      ]);

      const params = {
        to: contractAddress, // smart contract address
        from: from, // sender address
        data: callData, // data
        chainId: ethers.BigNumber.from(chainId).toNumber(),
        gasLimit: gasLimit,
        gasPrice: gasPrice,
        nonce: nonce,
      } satisfies ethers.ethers.providers.TransactionRequest;
      console.log('infer createPayload - succeed', params);
      return params;
    } catch (e) {
      console.log('infer createPayload - failed', e);
      throw e;
    } finally {
      console.log('infer createPayload - end');
    }
  },
  sendPrompt: async (
    wallet: InteractWallet,
    signedTx: string
  ): Promise<SendInferResponse> => {
    try {
      console.log('infer execute - start');

      console.log('infer execute - send transaction', signedTx);
      const txResponse = await wallet.provider.sendTransaction(signedTx);

      console.log('infer execute - waiting', txResponse);
      const receipt = await txResponse.wait();

      return receipt.transactionHash;
    } catch (e) {
      console.log('infer execute - failed', e);
      throw e;
    } finally {
      console.log('infer execute - end');
    }
  },
  getWorkerHubAddress: async (chainId: ChainId, wallet: InteractWallet) => {
    try {
      console.log('infer getWorkerHubAddress - start');
      const contractAddress = AGENT_CONTRACT_ADDRESSES[chainId];
      const contract = getContract(contractAddress, wallet);
      const schedule = await contract.getPromptSchedulerAddress();
      console.log('infer getWorkerHubAddress - succeed', schedule);
      return schedule;
    } catch (e) {
      console.log('infer getWorkerHubAddress - failed', e);
      throw e;
    } finally {
      console.log('infer getWorkerHubAddress - end');
    }
  },
  listenPromptResponse: async (chainId: ChainId, wallet: InteractWallet) => {
    try {
      console.log('infer listenPromptResponse - start');
      // do for BSC chain
      // TODO: implement this
      console.log('infer listenPromptResponse - succeed');
    } catch (e) {
      console.log('infer listenPromptResponse - failed', e);
      throw e;
    } finally {
      console.log('infer listenPromptResponse - end');
    }
  },
};

export default Infer;

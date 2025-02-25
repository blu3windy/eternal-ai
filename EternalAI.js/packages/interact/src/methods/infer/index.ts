import * as ethers from 'ethers';

import { InteractWallet } from '../types';
import { SendInferResponse } from './types';
import {
  AGENT_ABI,
  IPFS,
  LIGHTHOUSE_IPFS,
  LISTEN_PROMPTED_RESPONSE_CHAIN,
  PROMPT_SCHEDULER_ABI,
  WORKER_HUB_ABI,
} from './constants';
import { ChainId } from '../../constants';
import { InferPayloadWithMessages, InferPayloadWithPrompt } from '../../types';
import { sleep } from '../../utils/time';

const contracts: Record<string, ethers.Contract> = {};

const getAgentContract = (contractAddress: string, wallet: InteractWallet) => {
  if (!contracts[contractAddress]) {
    contracts[contractAddress] = new ethers.Contract(
      contractAddress,
      AGENT_ABI,
      wallet.provider
    );
  }
  return contracts[contractAddress];
};

const getWorkerHubContract = (
  contractAddress: string,
  wallet: InteractWallet
) => {
  if (!contracts[contractAddress]) {
    contracts[contractAddress] = new ethers.Contract(
      contractAddress,
      PROMPT_SCHEDULER_ABI,
      wallet.provider
    );
  }
  return contracts[contractAddress];
};

export class InferenceResponse {
  result_uri: string;
  storage: string;
  data: string;

  constructor(result_uri: string, storage: string, data: string) {
    this.result_uri = result_uri;
    this.storage = storage;
    this.data = data;
  }

  static fromJSON(json: string): InferenceResponse {
    const parsed = JSON.parse(json);
    return Object.assign(new InferenceResponse('', '', ''), parsed);
  }
}

const Infer = {
  getSystemPrompt: async (
    chainId: ChainId,
    contractAddress: string,
    wallet: InteractWallet
  ) => {
    try {
      console.log('infer getSystemPrompt - start');
      const contract = getAgentContract(contractAddress, wallet);
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
  createPayloadWithPrompt: async (
    wallet: InteractWallet,
    payload: InferPayloadWithPrompt
  ) => {
    try {
      console.log('infer createPayloadWithPrompt - start', payload);
      const contractAddress = payload.agentAddress;
      const contract = getAgentContract(contractAddress, wallet);

      const systemPrompt = await Infer.getSystemPrompt(
        payload.chainId,
        contractAddress,
        wallet
      );

      const { chainId, prompt } = payload;

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

      const promptPayload = ethers.utils.toUtf8Bytes(
        JSON.stringify({
          messages,
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
      console.log('infer createPayloadWithPrompt - succeed', params);
      return params;
    } catch (e) {
      console.log('infer createPayloadWithPrompt - failed', e);
      throw e;
    } finally {
      console.log('infer createPayloadWithPrompt - end');
    }
  },
  createPayloadWithMessages: async (
    wallet: InteractWallet,
    payload: InferPayloadWithMessages
  ) => {
    try {
      console.log('infer createPayloadWithMessages - start', payload);
      const contractAddress = payload.agentAddress;
      const contract = getAgentContract(contractAddress, wallet);

      const { chainId, messages } = payload;

      const promptPayload = ethers.utils.toUtf8Bytes(
        JSON.stringify({
          messages,
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
      console.log('infer createPayloadWithMessages - succeed', params);
      return params;
    } catch (e) {
      console.log('infer createPayloadWithMessages - failed', e);
      throw e;
    } finally {
      console.log('infer createPayloadWithMessages - end');
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
  getWorkerHubAddress: async (agentAddress: string, wallet: InteractWallet) => {
    try {
      console.log('infer getWorkerHubAddress - start');
      const contractAddress = agentAddress;
      const contract = getAgentContract(contractAddress, wallet);
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
  getInferId: async (
    wallet: InteractWallet,
    workerHubAddress: string,
    promptedTxHash: string
  ) => {
    const txReceipt = await wallet.provider.getTransactionReceipt(
      promptedTxHash
    );
    if (!txReceipt || txReceipt.status != 1) {
      throw new Error('Transaction receipt not found.');
    } else {
      const logs = txReceipt.logs;
      if (logs.length > 0) {
        for (const log of logs) {
          try {
            const event = (WORKER_HUB_ABI as Array<any>).find(
              (event) => event.type === 'event' && event.name === 'NewInference'
            );
            if (event) {
              // TODO: update this to use ethers.utils.defaultAbiCoder.decode
              const decoded = ethers.utils.defaultAbiCoder.decode(
                event.inputs,
                log.data
              );
              const inferenceId = decoded.inferenceId;
              return inferenceId;
            } else {
              throw new Error('No Infer Id');
            }
          } catch (error) {
            continue;
          }
        }
        throw new Error('No Infer Id');
      }
    }
  },

  processOutput: (out: any) => {
    const str: string = ethers.utils.toUtf8String(out);
    try {
      const result = InferenceResponse.fromJSON(str);
      return result;
    } catch (e) {
      return null;
    }
  },
  processOutputToInferResponse: async (output: ethers.Bytes) => {
    const inferResponse = Infer.processOutput(output);
    if (!inferResponse) {
      return null;
    } else {
      if (
        inferResponse.storage == 'lighthouse-filecoint' ||
        inferResponse.result_uri.includes('ipfs://')
      ) {
        const light_house = inferResponse.result_uri.replace(
          IPFS,
          LIGHTHOUSE_IPFS
        );
        const light_house_reponse = await fetch(light_house);
        if (light_house_reponse.ok) {
          const result = await light_house_reponse.text();
          return result;
        }
        return null;
      } else {
        if (inferResponse.data != '') {
          const decodedString = atob(inferResponse.data);
          return decodedString;
        }
        return null;
      }
    }
  },
  getInferenceByInferenceId: async (
    wallet: InteractWallet,
    workerHubAddress: string,
    inferId: string
  ) => {
    const contract = getWorkerHubContract(workerHubAddress, wallet);
    try {
      const inferenceInfo = await contract.getInferenceInfo(inferId);
      const output = inferenceInfo[10];
      const bytesData = ethers.utils.arrayify(output);
      if (bytesData.length != 0) {
        const result = await Infer.processOutputToInferResponse(bytesData);
        if (result) {
          return result;
        } else {
          return null;
        }
      } else {
        throw new Error(`waiting process inference ${inferId}`);
      }
    } catch (e) {
      throw e;
    }
  },
  listenPromptResponse: async (
    chainId: ChainId,
    wallet: InteractWallet,
    workerHubAddress: string,
    promptedTxHash: string
  ) => {
    try {
      console.log('infer listenPromptResponse - start');
      if (
        LISTEN_PROMPTED_RESPONSE_CHAIN.v1.includes(chainId) &&
        LISTEN_PROMPTED_RESPONSE_CHAIN.v2.includes(chainId)
      ) {
        throw Error('Not supported chain');
      }

      let result: any;
      const inferId = await Infer.getInferId(
        wallet,
        workerHubAddress,
        promptedTxHash
      );

      if (LISTEN_PROMPTED_RESPONSE_CHAIN.v1.includes(chainId)) {
        // TODO: unsupported
        throw Error('Not supported chain');
      } else if (LISTEN_PROMPTED_RESPONSE_CHAIN.v2.includes(chainId)) {
        while (true) {
          try {
            result = await Infer.getInferenceByInferenceId(
              wallet,
              workerHubAddress,
              inferId
            );
            break;
          } catch (e) {
            console.log('Can not get result for inference, try again', e);
            await sleep(30);
          }
        }
      } else {
        console.log('infer listenPromptResponse - succeed', null);
        return null;
      }

      console.log('infer listenPromptResponse - succeed', result);
      return result;
    } catch (e) {
      console.log('infer listenPromptResponse - failed', e);
      throw e;
    } finally {
      console.log('infer listenPromptResponse - end');
    }
  },
};

export default Infer;

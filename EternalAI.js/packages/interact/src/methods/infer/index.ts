import * as ethers from 'ethers';

import { InteractWallet } from '../types';
import {
  CreateInferPayload,
  ListenInferPayload,
  SendInferResponse,
} from './types';

const abis: ethers.ContractInterface = [
  {
    inputs: [],
    name: 'ModelIdAlreadySet',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newValue',
        type: 'uint256',
      },
    ],
    name: 'IdentifierUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'newValue',
        type: 'string',
      },
    ],
    name: 'MetadataUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'newValue',
        type: 'string',
      },
    ],
    name: 'NameUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'newAddress',
        type: 'address',
      },
    ],
    name: 'WorkerHubUpdate',
    type: 'event',
  },
  {
    inputs: [],
    name: 'identifier',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_input',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: '_rawFlag',
        type: 'bool',
      },
    ],
    name: 'infer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_input',
        type: 'bytes',
      },
    ],
    name: 'infer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_input',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: '_creator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_flag',
        type: 'bool',
      },
    ],
    name: 'infer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_input',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: '_creator',
        type: 'address',
      },
    ],
    name: 'infer',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_workerHub',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_modelCollection',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_identifier',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_metadata',
        type: 'string',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'metadata',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'modelCollection',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_modelId',
        type: 'uint256',
      },
    ],
    name: 'setModelId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_identifier',
        type: 'uint256',
      },
    ],
    name: 'updateIdentifier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadata',
        type: 'string',
      },
    ],
    name: 'updateMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
    ],
    name: 'updateName',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_workerHub',
        type: 'address',
      },
    ],
    name: 'updateWorkerHub',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'workerHub',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];
const HYBRID_MODEL_ADDRESS = '0x644292a7e238dd4eb7fc7f4c4afd8eb3c3d4111d'; // smart contract address

const Infer = {
  createPayload: async (
    wallet: InteractWallet,
    payload: CreateInferPayload
  ) => {
    try {
      console.log('infer createPayload - start');
      const contract = new ethers.Contract(
        HYBRID_MODEL_ADDRESS,
        abis,
        wallet.provider
      );

      const { messages, model, chainId } = payload;

      const callData = contract.interface.encodeFunctionData('infer', [
        JSON.stringify({
          messages,
          model,
        }),
      ]);

      const params = {
        to: HYBRID_MODEL_ADDRESS, // smart contract address
        from: wallet.address, // sender address
        data: callData, // data
        chainId: ethers.BigNumber.from(chainId).toNumber(),
      } satisfies ethers.ethers.providers.TransactionRequest;
      console.log('infer createPayload - params', {
        params,
      });
      const tx = await wallet.signTransaction(params);
      console.log('infer createPayload - succeed', tx);
      return tx;
    } catch (e) {
      console.log('infer createPayload - failed', e);
      throw e;
    } finally {
      console.log('infer createPayload - end');
    }
  },
  sendInfer: async (
    wallet: InteractWallet,
    signedTx: string
  ): Promise<SendInferResponse> => {
    try {
      console.log('infer execute - start');

      console.log('infer execute - send transaction', signedTx);
      const txResponse = await wallet.provider.sendTransaction(signedTx);

      console.log('infer execute - waiting', txResponse);
      const receipt = await txResponse.wait();

      console.log('infer execute - receipt', receipt);
      const iface = new ethers.utils.Interface(abis);
      const events = receipt.logs
        .map((log) => {
          try {
            return iface.parseLog(log);
          } catch (error) {
            return null;
          }
        })
        .filter((event) => event !== null);

      const newInference = events?.find(
        ((event: ethers.utils.LogDescription) =>
          event.name === 'NewInference') as any
      );
      console.log('infer execute - event', { newInference });
      if (newInference?.args) {
        const result = {
          inferenceId: newInference.args.inferenceId,
          creator: newInference.args.creator,
          tx: txResponse.hash,
          receipt,
        };
        console.log('infer execute - succeed', result);
        return result;
      } else {
        console.log('infer execute - failed', {
          message: 'NewInference event not found',
        });
        throw new Error('NewInference event not found');
      }
    } catch (e) {
      console.log('infer execute - failed', e);
      throw e;
    } finally {
      console.log('infer execute - end');
    }
  },
  listenInferResponse: async (
    wallet: InteractWallet,
    payload: ListenInferPayload
  ) => {
    console.log('infer listenInferResponse - start');
    wallet.provider.on(payload.inferenceId, (log) => {});
  },
};

export default Infer;

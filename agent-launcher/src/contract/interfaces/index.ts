import { CHAIN_TYPE } from "@constants/chains";

interface ContractParams {
  contractAddress: string;
  chain?: CHAIN_TYPE;
}

export type { ContractParams };

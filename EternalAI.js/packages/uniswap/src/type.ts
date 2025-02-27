import { TransactionState } from './libs/providers';

export type TTransactionResponse = {
  state: TransactionState | null;
  tx: any;
  message?: string;
};

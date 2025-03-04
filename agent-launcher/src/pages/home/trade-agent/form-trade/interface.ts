import { IToken } from "@interfaces/token";

export enum EAgentTrade {
  BUY = "BUY",
  SELL = "SELL",
}

export interface IFormValues {
  type: EAgentTrade;
  current_token?: IToken;
  // tokenIn: IToken;
  // tokenOut: IToken;
  amount?: string;
  is_need_approve: boolean;
  estimate_swap: string;
  balance?: string;
}

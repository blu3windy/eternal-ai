import { IToken } from "@interfaces/token";

export interface IAgentTradeContext {
  loading: boolean;
  pairs: IToken[];
  fee: string;
}

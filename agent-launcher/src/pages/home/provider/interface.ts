import { IAgentToken, IChainConnected } from "../../../services/api/agents-token/interface.ts";
import {Wallet} from "ethers";

export interface IAgentContext {
  loading: boolean;
  selectedAgent?: IAgentToken;
  setSelectedAgent: any;
  currentModel: any;
  setCurrentModel: any;
  chainList: IChainConnected[];
  startAgent: any;
  stopAgent: any;
  isStarting: boolean;
  isStopping: boolean;
  handleStopDockerAgent: any;
  runningAgents: number[];
  isTrade: boolean;
  setIsTrade: (v: any) => void;
  agentWallet?: Wallet;
  setAgentWallet: (v: any) => void;
  isRunning: boolean;
}

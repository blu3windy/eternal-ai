import {IAgentToken, IChainConnected,} from "../../../services/api/agents-token/interface.ts";
import {Wallet} from "ethers";

export enum ETradePlatform {
  eternal = "eternal",
  exchange3th = "exchange3th",
  none = "none",
}

export interface IAgentContext {
  loading: boolean;
  selectedAgent?: IAgentToken;
  setSelectedAgent: any;
  currentModel: any;
  setCurrentModel: any;
  chainList: IChainConnected[];
  installAgent: any;
  startAgent: any;
  stopAgent: any;
  isInstalling: boolean;
  isStarting: boolean;
  isStopping: boolean;
  runningAgents: number[];
  isTrade: boolean;
  setIsTrade: (v: any) => void;
  agentWallet?: Wallet;
  setAgentWallet: (v: any) => void;
  isRunning: boolean;
  tradePlatform: ETradePlatform;
  coinPrices: any[];
  createAgentWallet: any;
  isInstalled: boolean;
  installedAgents: string[];
  isCanChat: boolean;
  isBackupedPrvKey: boolean;
  setIsBackupedPrvKey: any;
  requireInstall: boolean;
  isModelRequirementSetup: boolean;
}

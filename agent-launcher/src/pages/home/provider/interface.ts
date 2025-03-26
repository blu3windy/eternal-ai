import { IAgentToken, } from "../../../services/api/agents-token/interface.ts";
import { Wallet } from "ethers";
import { CategoryOption } from '../list-agent/constants';

export enum ETradePlatform {
  eternal = "eternal",
  exchange3th = "exchange3th",
  none = "none",
}

export interface IAgentContext {
  loading: boolean;
  selectedAgent?: IAgentToken & any;
  setSelectedAgent: any;
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
  installedUtilityAgents: string[];
  isCanChat: boolean;
  isBackupedPrvKey: boolean;
  setIsBackupedPrvKey: any;
  requireInstall: boolean;
  isModelRequirementSetup: boolean;
  installedModelAgents: IAgentToken[];
  availableModelAgents: IAgentToken[];
  unInstallAgent: any;
  isUnInstalling: boolean;
  installedSocialAgents: number[];
  isCustomUI: boolean;
  customUIPort: string;
  agentStates: Record<number, {
    data: IAgentToken;
    isRunning: boolean;
    isInstalling: boolean;
    isUnInstalling: boolean;
    isStarting: boolean;
    isStopping: boolean;
    isInstalled: boolean;
  }>;
  liveViewUrl?: string;
  isSearchMode: boolean;
  setIsSearchMode: (value: boolean) => void;
  category: CategoryOption;
  setCategory: (category: CategoryOption) => void;
}

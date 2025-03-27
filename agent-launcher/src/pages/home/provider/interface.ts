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
  selectedAgent: IAgentToken | undefined;
  setSelectedAgent: (agent: IAgentToken) => void;
  installAgent: (agent: IAgentToken) => void;
  startAgent: (agent: IAgentToken, needUpdateCode?: boolean) => void;
  stopAgent: (agent: IAgentToken) => void;
  isInstalling: boolean;
  isStarting: boolean;
  isStopping: boolean;
  runningAgents: IAgentToken[];
  isTrade: boolean;
  setIsTrade: (value: boolean) => void;
  agentWallet: Wallet | undefined;
  setAgentWallet: (wallet: Wallet) => void;
  isRunning: boolean;
  tradePlatform: ETradePlatform;
  coinPrices: any[];
  createAgentWallet: (agent: IAgentToken) => void;
  isInstalled: boolean;
  installedUtilityAgents: string[];
  isCanChat: boolean;
  isBackupedPrvKey: boolean;
  setIsBackupedPrvKey: (value: boolean) => void;
  requireInstall: boolean;
  isModelRequirementSetup: boolean;
  installedModelAgents: IAgentToken[];
  availableModelAgents: IAgentToken[];
  unInstallAgent: (agent: IAgentToken) => void;
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
    customUIPort?: string;
  }>;
  liveViewUrl: string;
  isSearchMode: boolean;
  setIsSearchMode: (value: boolean) => void;
  category: CategoryOption;
  setCategory: (value: CategoryOption) => void;
  installedAgentIds: {
    utility: number[];
    model: number[];
    social: number[];
  };
  getDependAgents: any;
  currentActiveModel: {
    agent: IAgentToken | undefined,
    dependAgents: string[];
  };
}

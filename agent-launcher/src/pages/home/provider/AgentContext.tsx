import { CategoryOption } from '@pages/home/list-agent/constants';
import React from "react";
import { ETradePlatform, IAgentContext } from "./interface";

const initialValue: IAgentContext = {
   loading: false,
   selectedAgent: undefined,
   setSelectedAgent: () => { },
   installAgent: () => { },
   startAgent: () => { },
   stopAgent: () => { },
   isInstalling: false,
   isStarting: false,
   isStopping: false,
   runningAgents: [],
   isTrade: false,
   setIsTrade(v) { },
   agentWallet: undefined,
   setAgentWallet: (v) => { },
   isRunning: false,
   tradePlatform: ETradePlatform.eternal,
   coinPrices: [],
   createAgentWallet: () => { },
   isInstalled: false,
   isCanChat: false,
   isBackupedPrvKey: false,
   setIsBackupedPrvKey: () => { },
   requireInstall: false,
   isModelRequirementSetup: false,
   installedModelAgents: [],
   availableModelAgents: [],
   unInstallAgent: () => { },
   isUnInstalling: false,
   installedSocialAgents: [],
   isCustomUI: false,
   customUIPort: '',
   agentStates: {},
   liveViewUrl: '',
   isSearchMode: false,
   setIsSearchMode: () => { },
   category: CategoryOption.All,
   setCategory: () => { },
   getDependAgents: () => { },
   currentActiveModel: { agent: undefined, dependAgents: [] },
   installedAgentIds: {
      utility: [],
      model: [],
      social: []
   },
   agentCategories: [],
};

export const AgentContext = React.createContext<IAgentContext>(initialValue);

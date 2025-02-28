import {IAgentToken, IChainConnected} from "../../../services/api/agents-token/interface.ts";

export interface IAgentContext {
  loading: boolean;
  selectedAgent?: IAgentToken;
  setSelectedAgent: any;
  currentModel: any;
  setCurrentModel: any;
  chainList: IChainConnected[];
  installAgent: any;
  isInstalled: boolean;
  isStarting: boolean;
  isStopping: boolean;
  handleStopDockerAgent: any;
}

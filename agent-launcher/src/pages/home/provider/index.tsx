import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState, } from "react";
import { ETradePlatform, IAgentContext } from "./interface";
import { IAgentToken, IChainConnected, } from "../../../services/api/agents-token/interface.ts";
import { BASE_CHAIN_ID } from "@constants/chains";
import { checkFileExistsOnLocal, getFilePathOnLocal, writeFileToLocal, } from "@contract/file";
import CAgentTokenAPI from "../../../services/api/agents-token";
import { Wallet } from "ethers";
import { EAgentTokenStatus } from "../../../services/api/agent/types.ts";
import { SUPPORT_TRADE_CHAIN } from "../trade-agent/form-trade/index.tsx";
import { compareString } from "@utils/string.ts";
import { useAuth } from "@pages/authen/provider.tsx";
import localStorageService from "../../../storage/LocalStorageService.ts";
import STORAGE_KEYS from "@constants/storage-key.ts";
import uniq from "lodash.uniq";
import CAgentContract from "@contract/agent/index.ts";
import {AgentType} from "@pages/home/list-agent";

const initialValue: IAgentContext = {
   loading: false,
   selectedAgent: undefined,
   setSelectedAgent: () => {},
   currentModel: undefined,
   setCurrentModel: () => {},
   chainList: [],
   installAgent: () => {},
   startAgent: () => {},
   stopAgent: () => {},
   isInstalling: false,
   isStarting: false,
   isStopping: false,
   runningAgents: [],
   isTrade: false,
   setIsTrade(v) {},
   agentWallet: undefined,
   setAgentWallet: (v) => {},
   isRunning: false,
   tradePlatform: ETradePlatform.eternal,
   coinPrices: [],
   createAgentWallet: () => {},
};

export const AgentContext = React.createContext<IAgentContext>(initialValue);

const AgentProvider: React.FC<
    PropsWithChildren & { tokenAddress?: string }
> = ({
   children,
   tokenAddress: _tokenAddress,
}: PropsWithChildren & { tokenAddress?: string }): React.ReactElement => {
   const [loading, setLoading] = useState(true);
   const [selectedAgent, setSelectedAgent] = useState<IAgentToken | undefined>(
      undefined
   );
   const [chainList, setChainList] = useState<IChainConnected[]>([]);
   const [isInstalling, setIsInstalling] = useState(false);
   const [isStarting, setIsStarting] = useState(false);
   const [isStopping, setIsStopping] = useState(false);
   const [runningAgents, setRunningAgents] = useState<number[]>([]);
   const [isTrade, setIsTrade] = useState(false);
   const [agentWallet, setAgentWallet] = useState<Wallet | undefined>(undefined);
   const [coinPrices, setCoinPrices] = useState([]);
   const [isInstalled, setIsInstalled] = useState(false);

   const cPumpAPI = new CAgentTokenAPI();

   const [currentModel, setCurrentModel] = useState<{
    name: string;
    id: string;
  } | null>(null);

   const { genAgentSecretKey } = useAuth();

   console.log("stephen: selectedAgent", selectedAgent);
   console.log("stephen: currentModel", currentModel);
   console.log("stephen: agentWallet", agentWallet);
   console.log("================================");

   useEffect(() => {
      if (selectedAgent) {
         const agentsHasWallet = localStorageService.getItem(STORAGE_KEYS.AGENTS_HAS_WALLET);
         if (agentsHasWallet && agentsHasWallet.includes(selectedAgent?.id?.toString())) {
            createAgentWallet();
         } else {
            setAgentWallet(undefined)
         }

         const installedAgents = localStorageService.getItem(STORAGE_KEYS.INSTALLED_AGENTS);

         if (installedAgents && installedAgents.includes(selectedAgent?.id?.toString())) {
            setIsInstalled(true);
         } else {
            setIsInstalled(false);
         }
      }
   }, [selectedAgent]);

   const createAgentWallet = async () => {
      try {
         if (!selectedAgent) return;
         const prvKey = await genAgentSecretKey({ chainId: selectedAgent?.network_id.toString(), agentName: selectedAgent?.agent_name });
         setAgentWallet(new Wallet(prvKey));

         const agentIds = JSON.parse(localStorageService.getItem(STORAGE_KEYS.AGENTS_HAS_WALLET)!);

         localStorageService.setItem(STORAGE_KEYS.AGENTS_HAS_WALLET, JSON.stringify(agentIds ? uniq([...agentIds, selectedAgent?.id]) : [selectedAgent?.id]));
      } catch (err) {
         console.error("Create agent wallet error:", err);
      } finally {

      }
   }

   const getTradePlatform = (_pumpToken: IAgentToken | undefined) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (SUPPORT_TRADE_CHAIN.includes((_pumpToken?.meme?.network_id || "") as any)) {
         if (
            compareString(_pumpToken?.meme?.status, EAgentTokenStatus.add_pool_2)
         ) {
            return ETradePlatform.exchange3th;
         } else if (
            compareString(_pumpToken?.meme?.status, EAgentTokenStatus.add_pool_1)
          || compareString(_pumpToken?.meme?.status, EAgentTokenStatus.reached_mc)
         ) {
            return ETradePlatform.eternal;
         }
      }

      return ETradePlatform.none;
   };

   const tradePlatform = useMemo(() => {
      return getTradePlatform(selectedAgent as any);
   }, [selectedAgent]);

   const isRunning = useMemo(() => {
      return runningAgents.includes(selectedAgent?.id as number);
   }, [runningAgents, selectedAgent]);

   useEffect(() => {
      if (selectedAgent && chainList) {
         const supportModelObj = chainList?.find((v) =>
            compareString(v.chain_id, selectedAgent.network_id)
         )?.support_model_names;

         if (supportModelObj) {
            setCurrentModel({
               name:
              selectedAgent.agent_base_model || Object.keys(supportModelObj)[0],
               id:
              supportModelObj[selectedAgent.agent_base_model]
              || Object.values(supportModelObj)[0],
            });
         }
      }
   }, [selectedAgent, chainList]);

   const fetchChainList = useCallback(async () => {
      const chainList = await cPumpAPI.getChainList();
      if (!!chainList && chainList.length > 0) {
         const list = chainList.map((chain) => {
            const modelDetailParams = chain?.model_details?.[0]?.params
               ? JSON.parse(chain?.model_details?.[0]?.params)
               : {};

            const _chain = {
               ...chain,
               tag: `@${modelDetailParams?.model_name || ""}`,
            };

            if (!chain.balance) {
               return {
                  ..._chain,
                  balance: "0",
                  formatBalance: "0",
               };
            }
            return _chain;
         });

         setChainList(list);
      }
   }, []);

   const fetchCoinPrices = async () => {
      try {
         const _resCoinPrices: any = await cPumpAPI.getCoinPrices();
         setCoinPrices(_resCoinPrices);
      } catch (error) {}
   };

   const getRunningAgents = () => {
      try {
         setRunningAgents([]);
      } catch (err) {
      } finally {
      }
   };

   useEffect(() => {
      fetchChainList();
      getRunningAgents();
      fetchCoinPrices();
   }, []);


   const installAgent = (agent: IAgentToken) => {
      if (agent.agent_type === AgentType.UtilityJS || agent.agent_id === AgentType.UtilityJS) {
         installUtilityAgent(agent);
      } else if (agent.agent_type === AgentType.Model) {

      } else {

      }
   }

   const startAgent = (agent: IAgentToken) => {
      installUtilityAgent(agent);
      setRunningAgents((prev) => [...prev, agent.id]);
   };

   const stopAgent = async (agent: IAgentToken) => {
      setRunningAgents((prev) => prev.filter((id) => id !== agent.id));
      await handleStopDockerAgent(agent);
   };

   const installUtilityAgent = async (agent: IAgentToken) => {
      try {
         if (agent && !!agent.agent_contract_address) {
            setIsStarting(true);
            const cAgent = new CAgentContract({ contractAddress: agent.agent_contract_address, chainId: agent?.network_id || BASE_CHAIN_ID });

            const codeLanguage = await cAgent.getCodeLanguage();
            const codeVersion = await cAgent.getCurrentVersion();
            const oldCodeVersion = Number(localStorage.getItem(agent.agent_contract_address));
            const fileNameOnLocal = `prompt.${codeLanguage}`;
            const folderNameOnLocal = `${agent.id}`;

            let filePath: string | undefined = "";
            const isExisted = await checkFileExistsOnLocal(
               fileNameOnLocal,
               folderNameOnLocal
            );
            if (isExisted && (oldCodeVersion && oldCodeVersion === codeVersion)) {
               filePath = await getFilePathOnLocal(fileNameOnLocal, folderNameOnLocal);
            } else {
               const code = await cAgent.getCode(codeVersion);
               filePath = await writeFileToLocal(fileNameOnLocal, folderNameOnLocal, code);
            }

            const agentIds = JSON.parse(localStorageService.getItem(STORAGE_KEYS.INSTALLED_AGENTS)!);
            localStorageService.setItem(STORAGE_KEYS.INSTALLED_AGENTS, JSON.stringify(agentIds ? uniq([...agentIds, selectedAgent?.id]) : [selectedAgent?.id]));

            await handleRunDockerAgent(filePath, agent);
         }
      } catch (error: any) {
         alert(error?.message || "Something went wrong");
      } finally {
         setIsStarting(false);
      }
   };

   const handleRunDockerAgent = async (filePath?: string, agent?: IAgentToken) => {
      if (!agent) return;

      try {
         setIsStarting(true);
         await window.electronAPI.dockerRunAgent(agent?.agent_name, agent?.network_id.toString());
      } catch (e) {
         console.log('handleRunDockerAgent', e);
      } finally {
         setIsStarting(false);
      }
   };

   const handleStopDockerAgent = async (agent?: IAgentToken) => {
      if (!agent) return;
      try {
         setIsStopping(true);
         await window.electronAPI.dockerStopAgent(agent?.agent_name, agent?.network_id.toString());
      } catch (e) {
         console.log('handleStopDockerAgent', e);
      } finally {
         setIsStopping(false);
      }
   };

   const contextValues: any = useMemo(() => {
      return {
         loading,
         selectedAgent,
         setSelectedAgent,
         currentModel,
         setCurrentModel,
         chainList,
         installAgent,
         startAgent,
         stopAgent,
         isInstalling,
         isStarting,
         isStopping,
         runningAgents,
         isTrade,
         setIsTrade,
         agentWallet,
         setAgentWallet,
         isRunning,
         tradePlatform,
         coinPrices,
         createAgentWallet,
         isInstalled,
      };
   }, [
      loading,
      selectedAgent,
      setSelectedAgent,
      currentModel,
      setCurrentModel,
      chainList,
      installAgent,
      startAgent,
      stopAgent,
      isInstalling,
      isStarting,
      isStopping,
      runningAgents,
      isTrade,
      setIsTrade,
      agentWallet,
      setAgentWallet,
      isRunning,
      tradePlatform,
      coinPrices,
      createAgentWallet,
      isInstalled,
   ]);

   return (
      <AgentContext.Provider value={contextValues}>
         {children}
      </AgentContext.Provider>
   );
};

export default AgentProvider;

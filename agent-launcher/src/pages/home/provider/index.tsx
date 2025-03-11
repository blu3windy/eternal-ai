import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { ETradePlatform, IAgentContext } from "./interface";
import { IAgentToken, } from "../../../services/api/agents-token/interface.ts";
import { BASE_CHAIN_ID } from "@constants/chains";
import { checkFileExistsOnLocal, getFilePathOnLocal, writeFileToLocal, } from "@contract/file";
import CAgentTokenAPI from "../../../services/api/agents-token";
import { Wallet } from "ethers";
import { EAgentTokenStatus } from "../../../services/api/agent/types.ts";
import { SUPPORT_TRADE_CHAIN } from "../trade-agent/form-trade/index.tsx";
import { compareString, isBase64, splitBase64 } from "@utils/string.ts";
import { useAuth } from "@pages/authen/provider.tsx";
import localStorageService from "../../../storage/LocalStorageService.ts";
import STORAGE_KEYS from "@constants/storage-key.ts";
import uniq from "lodash.uniq";
import CAgentContract from "@contract/agent/index.ts";
import { AgentType, SortOption } from "@pages/home/list-agent";
import sleep from "@utils/sleep.ts";

const initialValue: IAgentContext = {
   loading: false,
   selectedAgent: undefined,
   setSelectedAgent: () => {},
   currentModel: undefined,
   setCurrentModel: () => {},
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
   isInstalled: false,
   installedUtilityAgents: [],
   isCanChat: false,
   isBackupedPrvKey: false,
   setIsBackupedPrvKey: () => {},
   requireInstall: false,
   isModelRequirementSetup: false,
   installedModelAgents: [],
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
   const [isInstalling, setIsInstalling] = useState(false);
   const [isStarting, setIsStarting] = useState(false);
   const [isStopping, setIsStopping] = useState(false);
   const [isTrade, setIsTrade] = useState(false);
   const [agentWallet, setAgentWallet] = useState<Wallet | undefined>(undefined);
   const [coinPrices, setCoinPrices] = useState([]);
   const [isInstalled, setIsInstalled] = useState(false);
   const [installedUtilityAgents, setInstalledUtilityAgents] = useState<string[]>([]);
   const [isRunning, setIsRunning] = useState(false);
   const refInterval = useRef<any>();
   const [isBackupedPrvKey, setIsBackupedPrvKey] = useState(false);
   const [isModelRequirementSetup, setIsModelRequirementSetup] = useState(false);
   const [installedModelAgents, setInstalledModelAgents] = useState<IAgentToken[]>([]);

   const [currentModel, setCurrentModel] = useState<IAgentToken | null>(null);

   const { genAgentSecretKey } = useAuth();

   const cPumpAPI = new CAgentTokenAPI();

   useEffect(() => {
      const agentIdsHasBackup = JSON.parse(localStorageService.getItem(STORAGE_KEYS.AGENTS_HAS_BACKUP_PRV_KEY)!);
      
      setIsBackupedPrvKey(agentWallet && selectedAgent && agentIdsHasBackup && agentIdsHasBackup?.some?.(id => id === selectedAgent?.id));
   }, [selectedAgent, agentWallet]);


   const requireInstall = useMemo(() => {
      if (selectedAgent) {
         return [AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Model, AgentType.Infra].includes(selectedAgent?.agent_type as AgentType);
      }

      return false;
   }, [selectedAgent?.id]);

   const isCanChat = useMemo(() => {
      return !requireInstall || (requireInstall && isInstalled && (!selectedAgent?.required_wallet || (selectedAgent?.required_wallet && !!agentWallet && isBackupedPrvKey)));
   }, [requireInstall, selectedAgent?.id, agentWallet, isInstalled, isBackupedPrvKey]);

   console.log("stephen: selectedAgent", selectedAgent);
   // console.log("stephen: currentModel", currentModel);
   // console.log("stephen: agentWallet", agentWallet);
   // console.log("stephen: installedAgents", installedAgents);
   // console.log("stephen: isCanChat", isCanChat);
   // console.log("stephen: isRunning", isRunning);
   // console.log("stephen: requireInstall", requireInstall);
   // console.log("stephen: isInstalled", isInstalled);
   console.log("================================");

   useEffect(() => {
      fetchChainList();
      fetchCoinPrices();
      handleGetExistAgentFolders();
   }, []);

   useEffect(() => {
      if (selectedAgent) {
         const agentsHasWallet = localStorageService.getItem(STORAGE_KEYS.AGENTS_HAS_WALLET);
         if (agentsHasWallet && agentsHasWallet.includes(selectedAgent?.id?.toString())) {
            createAgentWallet();
         } else {
            setAgentWallet(undefined)
         }

         intervalCheckAgentRunning(selectedAgent);
      }
   }, [selectedAgent?.id]);

   const intervalCheckAgentRunning = (agent: IAgentToken) => {
      if (refInterval.current) {
         clearInterval(refInterval.current);
      }

      checkAgentRunning(agent);

      refInterval.current = setInterval(checkAgentRunning, 30000, agent);
   }

   useEffect(() => {
      if (selectedAgent) {
         if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra].includes(selectedAgent.agent_type)) {
            checkUtilityAgentInstalled(selectedAgent);
         } else if ([AgentType.Model].includes(selectedAgent.agent_type)) {
            checkModelAgentInstalled(selectedAgent);
         } else {
            setIsInstalled(false);
            cPumpAPI.saveAgentInstalled({ ids: [selectedAgent.id], action: "uninstall" });
         }
      }
   }, [selectedAgent?.id, installedUtilityAgents]);

   const checkAgentRunning = async (agent) => {
      try {
         if(agent) {
            if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra].includes(agent.agent_type)) {
               const res = await cPumpAPI.checkAgentServiceRunning({ agent });
               setIsRunning(true);
            } else if ([AgentType.Model].includes(agent.agent_type)) {

            }
         }
      } catch (err) {
         console.error("Check agent running error:", err);
         setIsRunning(false);
      }
   }

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
   }, [selectedAgent?.id]);


   // useEffect(() => {
   //    if (selectedAgent && chainList) {
   //       const supportModelObj = chainList?.find((v) =>
   //          compareString(v.chain_id, selectedAgent.network_id)
   //       )?.support_model_names;
   //
   //       if (supportModelObj) {
   //          setCurrentModel({
   //             name:
   //            selectedAgent.agent_base_model || Object.keys(supportModelObj)[0],
   //             id:
   //            supportModelObj[selectedAgent.agent_base_model]
   //            || Object.values(supportModelObj)[0],
   //          });
   //       }
   //    }
   // }, [selectedAgent, chainList]);

   const fetchChainList = useCallback(async () => {
      const params: any = {
         page: 1,
         limit: 100,
         sort_col: SortOption.CreatedAt,
         agent_types: [AgentType.Model].join(','),
         chain: '',
      };
      const { agents: newTokens } = await cPumpAPI.getAgentTokenList(params);
      const chainList = await cPumpAPI.getChainList();

      console.log('stephen newTokens', newTokens);
      console.log('stephen chainList', chainList);

      setInstalledModelAgents(newTokens);

      // if (!!chainList && chainList.length > 0) {
      //    const list = chainList.map((chain) => {
      //       const modelDetailParams = chain?.model_details?.[0]?.params
      //          ? JSON.parse(chain?.model_details?.[0]?.params)
      //          : {};
      //
      //       console.log('stephen: modelDetailParams', modelDetailParams);
      //
      //       const _chain = {
      //          ...chain,
      //          tag: `@${modelDetailParams?.model_name || ""}`,
      //       };
      //
      //       if (!chain.balance) {
      //          return {
      //             ..._chain,
      //             balance: "0",
      //             formatBalance: "0",
      //          };
      //       }
      //       return _chain;
      //    });
      //
      //    console.log('stephen list', chainList);
      //
      //    setChainList(list);
      // }
   }, []);

   const fetchCoinPrices = async () => {
      try {
         const _resCoinPrices: any = await cPumpAPI.getCoinPrices();
         setCoinPrices(_resCoinPrices);
      } catch (error) {}
   };


   const installAgent = async (agent: IAgentToken) => {
      try {
         setIsInstalling(true);

         if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra].includes(agent.agent_type)) {
            await installUtilityAgent(agent);
         } else if (agent.agent_type === AgentType.Model) {
           await handleInstallModelAgent();

            const ipfsHash = await getModelAgentHash(agent);
           console.log('====ipfsHash', ipfsHash);
           await window.electronAPI.modelInstall(ipfsHash);
            setIsInstalled(true);
            cPumpAPI.saveAgentInstalled({ ids: [agent.id] });

           await handleRunModelAgent(ipfsHash);
         } else {

         }
      } catch (e) {
         console.log('installAgent e', e);
      } finally {
         setIsInstalling(false);
         handleGetExistAgentFolders();
      }
   }

   const startAgent = async (agent: IAgentToken) => {
      try {
         setIsStarting(true);

         if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra].includes(agent.agent_type)) {
            await startDependAgents(agent);

            await handleRunDockerAgent(agent);
         } else if (agent.agent_type === AgentType.Model) {
            await handleInstallModelAgent();

           const ipfsHash = await getModelAgentHash(agent);
           console.log('====ipfsHash', ipfsHash);
           await handleRunModelAgent(ipfsHash);
         } else {

         }

         await sleep(3000);
      } catch (e) {
         console.log('startAgent e', e);
      } finally {
         setIsStarting(false);

         intervalCheckAgentRunning(agent);
      }
   };

   const stopAgent = async (agent: IAgentToken) => {
      try {
         setIsStopping(true);

         if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra].includes(agent.agent_type)) {
            await handleStopDockerAgent(agent);
            await stopDependAgents(agent);
         } else if (agent.agent_type === AgentType.Model) {

         } else {

         }

         await sleep(2000);
      } catch (e) {
         console.log('stopAgent e', e);
      } finally {
         setIsStopping(false);

         intervalCheckAgentRunning(agent);
      }
   };

   const getModelAgentHash = async (agent: IAgentToken) => {
      if (agent && !!agent.agent_contract_address) {
         const chainId = agent?.network_id || BASE_CHAIN_ID;
         const cAgent = new CAgentContract({ contractAddress: agent.agent_contract_address, chainId: chainId });
         const codeVersion = await cAgent.getCurrentVersion();
        const ipfsHash = await cAgent.getAgentCode(codeVersion);
        return ipfsHash;
      }
    }

   const installUtilityAgent = async (agent: IAgentToken) => {
      if (agent && !!agent.agent_contract_address) {
         const chainId = agent?.network_id || BASE_CHAIN_ID;
         const cAgent = new CAgentContract({ contractAddress: agent.agent_contract_address, chainId: chainId });

         const codeLanguage = await cAgent.getCodeLanguage();
         let codeLang = 'js';
         if (codeLanguage === 'python') {
            codeLang = 'py';
         }
      
         const codeVersion = await cAgent.getCurrentVersion();

         const oldCodeVersion = Number(localStorage.getItem(agent.agent_contract_address));
         const fileNameOnLocal = `prompt.${codeLang}`;
         const folderNameOnLocal = `${agent.network_id}-${agent.agent_name}`;

         let filePath: string | undefined = "";
         const isExisted = await checkFileExistsOnLocal(
            fileNameOnLocal,
            folderNameOnLocal
         );
         if (isExisted && (oldCodeVersion && oldCodeVersion === codeVersion)) {
            filePath = await getFilePathOnLocal(fileNameOnLocal, folderNameOnLocal);
            console.log('filePath isExisted', filePath)
         } else {
            const codeBase64 = await cAgent.getAgentCode(codeVersion);
            const base64Array = splitBase64(codeBase64);
            const code = base64Array.map(item => isBase64(item) ? atob(item) : item).join('\n');
            filePath = await writeFileToLocal(fileNameOnLocal, folderNameOnLocal, `${code || ''}`);
            console.log('filePath New', filePath)
         }
      }
   };

    const removeUtilityAgent = async (agent: IAgentToken) => {
      if (agent && !!agent.agent_name) {
        try {
          const folderNameOnLocal = `${agent.network_id}-${agent.agent_name}`;
          await window.electronAPI.removeFolder(folderNameOnLocal);
        } catch (error) {
        }
      }
    };

    const startDependAgents = async (agent: IAgentToken) => {
      const dependAgents = await getDependAgents(agent);
      if (dependAgents.length > 0) {
        await Promise.all(dependAgents.map(async (agent) => {
          try {
            await handleRunDockerAgent(agent);
          } catch (error) {
          }
        }));
      };
    };

    const stopDependAgents = async (agent: IAgentToken) => {
      const dependAgents = await getDependAgents(agent);
      if (dependAgents.length > 0) {
        await Promise.all(dependAgents.map(async (agent) => {
          try {
            await handleStopDockerAgent(agent);
          } catch (error) {
          }
        }));
      };
    };

    const getDependAgents = async (agent: IAgentToken) => {
      if (agent && !!agent.agent_contract_address) {
        const chainId = agent?.network_id || BASE_CHAIN_ID;
        const cAgent = new CAgentContract({ contractAddress: agent.agent_contract_address, chainId: chainId });
        const codeVersion = await cAgent.getCurrentVersion();

        const depsAgentStrs = await cAgent.getDepsAgents(codeVersion);
        if (depsAgentStrs.length > 0) {
          const dependAgents = await installDependAgents(depsAgentStrs, chainId);
          return dependAgents;
        }
      }
      return [];
    };

   const installDependAgents = async (agents: string[], chainId: number) => {
      const installedAgents = new Set<string>();

      const agentsData = await Promise.all(agents.map(async (agentContractAddr) => {
        if (installedAgents.has(agentContractAddr)) {
            return null; 
        }

        installedAgents.add(agentContractAddr);

        const cAgent = new CAgentContract({ contractAddress: agentContractAddr, chainId });
        const codeLanguage = await cAgent.getCodeLanguage();
        let codeLang = 'js';
        if (codeLanguage === 'python') {
          codeLang = 'py';
        }
        const codeVersion = await cAgent.getCurrentVersion();
        const agentName = await cAgent.getAgentName();
        const depsAgentStrs = await cAgent.getDepsAgents(codeVersion);

        let dependAgents: any[] = [];
        if (depsAgentStrs.length > 0) {
            dependAgents = await installDependAgents(depsAgentStrs, chainId);
        }

        const oldCodeVersion = Number(localStorage.getItem(agentContractAddr));
        const fileNameOnLocal = `prompt.${codeLang}`;
        const folderNameOnLocal = `${chainId}-${agentName}`;

        const isExisted = await checkFileExistsOnLocal(fileNameOnLocal, folderNameOnLocal);
        if (isExisted && (oldCodeVersion && oldCodeVersion === codeVersion)) {
            await getFilePathOnLocal(fileNameOnLocal, folderNameOnLocal);
        } else {
            const codeBase64 = await cAgent.getAgentCode(codeVersion);
            const base64Array = splitBase64(codeBase64);
            const code =base64Array.map(item => isBase64(item) ? atob(item) : item).join('\n');
            await writeFileToLocal(fileNameOnLocal, folderNameOnLocal, `${code || ''}`);
        }
        return [
            ...dependAgents,
            {
                agent_name: agentName,
                network_id: chainId,
                agent_contract_address: agentContractAddr
            }
        ];
      }));
      
      return agentsData.flat().filter(Boolean);
    };
   

   const handleRunDockerAgent = async (agent?: IAgentToken) => {
      if (!agent) return;

      try {
         await window.electronAPI.dockerRunAgent(agent?.agent_name, agent?.network_id.toString());
      } catch (e) {
         console.log('handleRunDockerAgent', e);
      } finally {
      }
   };

   const handleStopDockerAgent = async (agent?: IAgentToken) => {
      if (!agent) return;

      await window.electronAPI.dockerStopAgent(agent?.agent_name, agent?.network_id.toString());
   };

   const handleGetExistAgentFolders = async () => {
      try {
         const folders = await window.electronAPI.getExistAgentFolders();
         setInstalledUtilityAgents(folders || [])
      } catch (error) {
        
      }
   }

   const checkUtilityAgentInstalled = async (agent: IAgentToken) => {
      try {
         if (installedUtilityAgents?.some?.(key => key === `${agent.network_id}-${agent.agent_name}`)) {
            setIsInstalled(true);
            cPumpAPI.saveAgentInstalled({ ids: [agent.id] });
         } else {
            setIsInstalled(false);
            cPumpAPI.saveAgentInstalled({ ids: [agent.id], action: "uninstall" });
         }
      } catch (e) {
         console.log('checkUtilityAgentInstalled e', e);
      } finally {

      }
   }

   const handleInstallModelAgent = async () => {
      if(!isModelRequirementSetup) {
         await window.electronAPI.modelStarter();
         setIsModelRequirementSetup(true);
      }
   }

   const handleRunModelAgent = async (hash?: string) => {
      if (!hash) return;

      try {
         await window.electronAPI.modelRun(hash);
      } catch (e) {
         console.log('handleRunModelAgent', e);
      } finally {

      }
   };

   const checkModelAgentInstalled = async (agent: IAgentToken) => {
      try {
         const ipfsHash = await getModelAgentHash(agent);
         const res = await window.electronAPI.modelCheckInstall([ipfsHash]);

         if (res[ipfsHash]) {
            setIsInstalled(true);
            cPumpAPI.saveAgentInstalled({ ids: [agent.id] });
         } else {
            setIsInstalled(false);
            cPumpAPI.saveAgentInstalled({ ids: [agent.id], action: "uninstall" });
         }
      } catch (e) {
         console.log('checkModelAgentInstalled e', e);
      } finally {

      }
   }

   const contextValues: any = useMemo(() => {
      return {
         loading,
         selectedAgent,
         setSelectedAgent,
         currentModel,
         setCurrentModel,
         installAgent,
         startAgent,
         stopAgent,
         isInstalling,
         isStarting,
         isStopping,
         isTrade,
         setIsTrade,
         agentWallet,
         setAgentWallet,
         isRunning,
         tradePlatform,
         coinPrices,
         createAgentWallet,
         isInstalled,
         installedUtilityAgents,
         isCanChat,
         isBackupedPrvKey,
         setIsBackupedPrvKey,
         requireInstall,
         isModelRequirementSetup,
         installedModelAgents,
      };
   }, [
      loading,
      selectedAgent,
      setSelectedAgent,
      currentModel,
      setCurrentModel,
      installAgent,
      startAgent,
      stopAgent,
      isInstalling,
      isStarting,
      isStopping,
      isTrade,
      setIsTrade,
      agentWallet,
      setAgentWallet,
      isRunning,
      tradePlatform,
      coinPrices,
      createAgentWallet,
      isInstalled,
      installedUtilityAgents,
      isCanChat,
      isBackupedPrvKey,
      setIsBackupedPrvKey,
      requireInstall,
      isModelRequirementSetup,
      installedModelAgents,
   ]);

   return (
      <AgentContext.Provider value={contextValues}>
         {children}
      </AgentContext.Provider>
   );
};

export default AgentProvider;

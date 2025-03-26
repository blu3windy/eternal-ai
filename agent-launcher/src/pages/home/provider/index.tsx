import React, { PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
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
import { ModelInfo } from "../../../../electron/share/model.ts";
import { MODEL_HASH } from "@components/Loggers/action.button.tsx";
import sleep from "@utils/sleep.ts";
import throttle from "lodash/throttle";

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
   availableModelAgents: [],
   unInstallAgent: () => {},
   isUnInstalling: false,
   installedSocialAgents: [],
   isCustomUI: false,
   customUIPort: '',
   agentStates: {},
   liveViewUrl: '',
   isSearchMode: false,
   setIsSearchMode: () => {},
};

export const AgentContext = React.createContext<IAgentContext>(initialValue);

const AgentProvider: React.FC<
    PropsWithChildren & { tokenAddress?: string }
> = ({
   children,
   tokenAddress: _tokenAddress,
}: PropsWithChildren & { tokenAddress?: string }): React.ReactElement => {
   const [loading, setLoading] = useState(true);
   const [selectedAgent, _setSelectedAgent] = useState<IAgentToken | undefined>(undefined);
   const [isTrade, setIsTrade] = useState(false);
   const [agentWallet, setAgentWallet] = useState<Wallet | undefined>(undefined);
   const [coinPrices, setCoinPrices] = useState([]);
   const [installedUtilityAgents, setInstalledUtilityAgents] = useState<string[]>([]);
   const refInterval = useRef<any>();
   const [isBackupedPrvKey, setIsBackupedPrvKey] = useState(false);
   const [isModelRequirementSetup, setIsModelRequirementSetup] = useState(false);
   const [installedModelAgents, setInstalledModelAgents] = useState<IAgentToken[]>([]);
   const [availableModelAgents, setAvailableModelAgents] = useState<IAgentToken[]>([]);
   const [installedSocialAgents, setInstalledSocialAgents] = useState<number[]>([]);
   const [customUIPort, setCustomUIPort] = useState<string>('');
   const [liveViewUrl, setLiveViewUrl] = useState<string>('');
   const [currentModel, setCurrentModel] = useState<IAgentToken | null>(null);
   const [isSearchMode, setIsSearchMode] = useState(false);

   const [agentStates, setAgentStates] = useState<Record<number, {
      data: IAgentToken;
      isRunning: boolean;
      isInstalling: boolean;
      isUnInstalling: boolean;
      isStarting: boolean;
      isStopping: boolean;
      isInstalled: boolean;
    }>>({});

   const { genAgentSecretKey } = useAuth();

   const cPumpAPI = new CAgentTokenAPI();

   const checkBackup = throttle(async () => {
      const values = await localStorageService.getItem(STORAGE_KEYS.AGENTS_HAS_BACKUP_PRV_KEY);
      if (!values) {
         setIsBackupedPrvKey(false);
         return;
      }
      const agentIdsHasBackup = JSON.parse(values);
      setIsBackupedPrvKey(agentWallet && selectedAgent && agentIdsHasBackup && agentIdsHasBackup?.some?.(id => id === selectedAgent?.id));
   }, 1000);

   useEffect(() => {
      checkBackup();
   }, [selectedAgent, agentWallet]);


   const requireInstall = useMemo(() => {
      return true;
      // if (selectedAgent) {
      //    return [AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Model, AgentType.Infra].includes(selectedAgent?.agent_type as AgentType);
      // }
      //
      // return false;
   }, []);

   const isInstalling = useMemo(() => {
      if (selectedAgent) {
         return agentStates[selectedAgent.id]?.isInstalling || false;
      }

      return false;
   }, [selectedAgent, agentStates]);

   const isUnInstalling = useMemo(() => {
      if (selectedAgent) {
         return agentStates[selectedAgent.id]?.isUnInstalling || false;
      }

      return false;
   }, [selectedAgent, agentStates]);

   const isStarting = useMemo(() => {
      if (selectedAgent) {
         return agentStates[selectedAgent.id]?.isStarting || false;
      }

      return false;
   }, [selectedAgent, agentStates]);

   const isStopping = useMemo(() => {
      if (selectedAgent) {
         return agentStates[selectedAgent.id]?.isStopping || false;
      }

      return false;
   }, [selectedAgent, agentStates]);

   const isRunning = useMemo(() => {
      if (selectedAgent) {
         return agentStates[selectedAgent.id]?.isRunning || false;
      }

      return false;
   }, [selectedAgent, agentStates]);

   const isInstalled = useMemo(() => {
      if (selectedAgent) {
         return agentStates[selectedAgent.id]?.isInstalled || false;
      }

      return false;
   }, [selectedAgent, agentStates]);

   const isCanChat = useMemo(() => {
      return !requireInstall || (requireInstall && isInstalled && (!selectedAgent?.required_wallet || (selectedAgent?.required_wallet && !!agentWallet && isBackupedPrvKey)));
   }, [requireInstall, selectedAgent?.id, agentWallet, isInstalled, isBackupedPrvKey]);

   console.log("stephen: selectedAgent", selectedAgent);
   console.log("stephen: availableModelAgents", availableModelAgents);
   // console.log("stephen: currentModel", currentModel);
   // console.log("stephen: agentWallet", agentWallet);
   // console.log("stephen: installedAgents", installedAgents);
   // console.log("stephen: isCanChat", isCanChat);
   // console.log("stephen: isRunning", isRunning);
   // console.log("stephen: requireInstall", requireInstall);
   // console.log("stephen: isInstalled", isInstalled);
   // console.log('stephen availableModelAgents', availableModelAgents);
   console.log("stephen: installedUtilityAgents", installedUtilityAgents);
   console.log('stephen installedModelAgents', installedModelAgents);
   console.log('stephen agentStates', agentStates);// console.log('stephen: isCustomUI', isCustomUI);
   console.log("==============================");

   useEffect(() => {
      fetchCoinPrices();
      fetchAvailableModelAgents();
      fetchInstalledUtilityAgents();
      // loadAgentStates();
   }, []);

   useEffect(() => {
      fetchInstalledModelAgents();
   }, [availableModelAgents]);

   // const loadAgentStates = async () => {
   //    const savedStates = await localStorageService.getItem(STORAGE_KEYS.AGENT_STATES);
   //    if (savedStates) {
   //       setAgentStates(JSON.parse(savedStates));
   //    }
   // };

   useEffect(() => {
      const saveAgentStates = async () => {
         await localStorageService.setItem(STORAGE_KEYS.AGENT_STATES, JSON.stringify(agentStates));
      };
      saveAgentStates();
   }, [agentStates]);
  
   const updateAgentState = (agentId: number, state: {
      data?: IAgentToken;
      isRunning?: boolean;
      isInstalling?: boolean;
      isUnInstalling?: boolean;
      isStarting?: boolean;
      isStopping?: boolean;
      isInstalled?: boolean;
    }) => {
      setAgentStates(prev => ({
         ...prev,
         [agentId]: {
            ...prev[agentId],
            ...state
         }
      }));
   };
  
   useEffect(() => {
      const fetchWalletData = async () => {
         if (selectedAgent) {
            // Await the result of the asynchronous getItem call
            const walletData = await localStorageService.getItem(STORAGE_KEYS.AGENTS_HAS_WALLET);
            const agentsHasWallet = JSON.parse(walletData || '[]'); // Default to an empty array if null

            if (agentsHasWallet && agentsHasWallet.includes(selectedAgent?.id)) {
               createAgentWallet(selectedAgent);
            } else {
               setAgentWallet(undefined);
            }

            intervalCheckAgentRunning(selectedAgent);
         }
      };

      fetchWalletData(); // Call the async function
   }, [selectedAgent?.id]);

   const intervalCheckAgentRunning = (agent: IAgentToken) => {
      if (refInterval.current) {
         clearInterval(refInterval.current);
      }

      checkAgentRunning(agent);
      
      refInterval.current = setInterval(() => {
         checkAgentRunning(agent, 0, false);
      }, 30000);
   }

   useEffect(() => {
      if (selectedAgent) {
         if ([AgentType.Normal, AgentType.Reasoning, AgentType.KnowledgeBase, AgentType.Eliza, AgentType.Zerepy].includes(selectedAgent.agent_type)) {
            checkSocialAgentInstalled(selectedAgent);
         } else if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.CustomUI, AgentType.CustomPrompt, AgentType.ModelOnline].includes(selectedAgent.agent_type)) {
            checkUtilityAgentInstalled(selectedAgent);
         } else if ([AgentType.Model].includes(selectedAgent.agent_type)) {
            checkModelAgentInstalled(selectedAgent);
         }
      }
   }, [selectedAgent?.id, installedUtilityAgents, installedModelAgents, installedSocialAgents]);

   const getUtilityAgentCodeLanguage = (agent: IAgentToken) => {
      if ([AgentType.CustomUI].includes(agent.agent_type)) {
         return 'custom-ui';
      } else if ([AgentType.CustomPrompt].includes(agent.agent_type)) {
         return 'custom-prompt';
      } else if ([AgentType.UtilityPython].includes(agent.agent_type)) {
         return 'py';
      } else if ([AgentType.UtilityJS].includes(agent.agent_type)) {
         return 'js';
      }

      return '';
   }

   const checkAgentRunning = async (agent: IAgentToken, retryCount = 0, isRetry = false) => {
      // If this is a retry attempt and we're already checking, don't proceed
      if (isRetry && refInterval.current) {
         console.log("Skipping retry as interval check is already running");
         return;
      }

      try {
         console.log("checkAgentRunning: agent", agent);
         if(agent) {
            if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.CustomPrompt].includes(agent.agent_type)) {
               const res = await cPumpAPI.checkAgentServiceRunning({ agent });

               setLiveViewUrl(res?.live_view_url || '');

               updateAgentState(agent.id, {
                  data: agent,
                  isRunning: true,
               });
            } else if ([AgentType.CustomUI].includes(agent.agent_type)) {
               const port = await globalThis.electronAPI.dockerRunningPort(agent.agent_name?.toLowerCase(), agent.network_id.toString());
               setCustomUIPort(port);

               updateAgentState(agent.id, {
                  data: agent,
                  isRunning: true,
               });
            } else if ([AgentType.Model].includes(agent.agent_type)) {
               const runningModelHash = await globalThis.electronAPI.modelCheckRunning();
               const ipfsHash = await getModelAgentHash(agent);

               updateAgentState(agent.id, {
                  data: agent,
                  isRunning: ipfsHash === runningModelHash,
               });
            } else {
               updateAgentState(agent.id, {
                  data: agent,
                  isRunning: true,
               });
            }
         }
      } catch (err) {
         console.log("checkAgentRunning error:", err);
         updateAgentState(agent.id, {
            data: agent,
            isRunning: false,
         });
         setCustomUIPort('');

         // Retry check running
         if (retryCount < 3) {
            console.log(`Retrying checkAgentRunning (attempt ${retryCount + 1}/3)...`);
            // Wait for 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
            return checkAgentRunning(agent, retryCount + 1, true);
         }
      }
   }

   const createAgentWallet = async (agent: IAgentToken) => {
      try {
         if (!agent) return;

         const prvKey = await genAgentSecretKey({ chainId: agent?.network_id.toString(), agentName: agent?.agent_name });
         setAgentWallet(new Wallet(prvKey));

         // Await the result of the asynchronous getItem call
         const walletData = await localStorageService.getItem(STORAGE_KEYS.AGENTS_HAS_WALLET);
         const agentsHasWallet = JSON.parse(walletData || '[]'); // Default to an empty array if null

         await localStorageService.setItem(STORAGE_KEYS.AGENTS_HAS_WALLET, JSON.stringify(agentsHasWallet ? uniq([...agentsHasWallet, agent?.id]) : [agent?.id]));
      } catch (err) {
         console.log("Create agent wallet error:", err);
      } finally {

      }
   };

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

   const fetchAvailableModelAgents = async () => {
      try {
         const params: any = {
            page: 1,
            limit: 100,
            sort_col: SortOption.CreatedAt,
            agent_types: [AgentType.Model, AgentType.ModelOnline].join(','),
            chain: '',
         };
         const { agents: newTokens } = await cPumpAPI.getAgentTokenList(params);

         const agentHashes = await Promise.all(
            newTokens.map(t => getModelAgentHash(t))
         );

         const res = newTokens.map((t, index) => ({ ...t, ipfsHash: agentHashes[index] }));

         setAvailableModelAgents(res);
      } catch (e) {

      } finally {

      }
   }

   const fetchInstalledModelAgents = async () => {
      const installedModels: ModelInfo[] = await globalThis.electronAPI.modelDownloadedList();
      const runningModelHash = await globalThis.electronAPI.modelCheckRunning();
      const installedHashes = [...installedModels.map(r => r.hash)];

      let installedAgents: IAgentToken[] = availableModelAgents?.filter((t, index) => installedHashes.includes(t.ipfsHash as string) || t.agent_type === AgentType.ModelOnline);

      installedAgents = installedAgents?.sort((a, b) => {
         if (a.agent_type === AgentType.ModelOnline) return -1;
         if (b.agent_type === AgentType.ModelOnline) return 1;
         return 0;
      });
      
      installedAgents = installedAgents?.map(agent => {
         return {
            ...agent,
            sizeGb: installedModels.find(m => m.hash === agent.ipfsHash)?.sizeGb || 0
         }
      }) as IAgentToken[] || [];

      setInstalledModelAgents(installedAgents);

      if (!runningModelHash) {
         const defaultModelAgent = installedAgents.find((t, index) => compareString(t.ipfsHash, MODEL_HASH)) || installedAgents[0];

         if (defaultModelAgent) {
            await startAgent(defaultModelAgent);
         }
      } else {
         const runningModelAgent = installedAgents?.find(t => compareString(t.ipfsHash, runningModelHash?.trim()));

         if(runningModelAgent) {
            setCurrentModel(runningModelAgent);
         }
      }
   }

   const fetchCoinPrices = async () => {
      try {
         const _resCoinPrices: any = await cPumpAPI.getCoinPrices();
         setCoinPrices(_resCoinPrices);
      } catch (error) {}
   };


   const setAgentInstalled = (agent: IAgentToken) => {
      console.log("stephen: setAgentInstalled", agent);
      updateAgentState(agent.id, {
         data: agent,
         isInstalled: true,
      });

      cPumpAPI.saveAgentInstalled({ ids: [agent.id] });
   }

   const setAgentUnInstalled = (agent: IAgentToken) => {
      console.log("stephen: setAgentUnInstalled", agent);
      updateAgentState(agent.id, {
         data: agent,
         isInstalled: false,
      });

      cPumpAPI.saveAgentInstalled({ ids: [agent.id], action: "uninstall" });
   }

   const installAgent = async (agent: IAgentToken) => {
      try {
         updateAgentState(agent.id, {
            data: agent,
            isInstalling: true,
         });

         if ([AgentType.Normal, AgentType.Reasoning, AgentType.KnowledgeBase, AgentType.Eliza, AgentType.Zerepy].includes(agent.agent_type)) {
            const values = await localStorageService.getItem(STORAGE_KEYS.INSTALLED_SOCIAL_AGENTS);
            const agentIds = values ? JSON.parse(values) : [];

            await localStorageService.setItem(STORAGE_KEYS.INSTALLED_SOCIAL_AGENTS, JSON.stringify(agentIds ? uniq([...agentIds, selectedAgent?.id]) : [selectedAgent?.id]));

            fetchInstalledSocialAgents(); //fetch then check agent installed in useEffect

            // setAgentInstalled(agent);
         } else if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.CustomUI, AgentType.CustomPrompt, AgentType.ModelOnline].includes(agent.agent_type)) {
            await installUtilityAgent(agent);

            await startAgent(agent);

            fetchInstalledUtilityAgents(); //fetch then check agent installed in useEffect

            // setAgentInstalled(agent);
         } else if (agent.agent_type === AgentType.Model) {
            await handleInstallModelAgentRequirement();

            const ipfsHash = await getModelAgentHash(agent);
            console.log('====ipfsHash', ipfsHash);
            await globalThis.electronAPI.modelInstall(ipfsHash);

            await startAgent(agent);

            fetchInstalledModelAgents(); //fetch then check agent installed in useEffect

            // setAgentInstalled(agent);
         }
      } catch (e) {
         console.log('installAgent e', e);
      } finally {
         updateAgentState(agent.id, {
            data: agent,
            isInstalling: false,
         });
      }
   }

   const startAgent = async (agent: IAgentToken, needUpdateCode?: boolean) => {
      console.log("stephen: startAgent", agent);
      try {
         updateAgentState(agent.id, {
            data: agent,
            isStarting: true,
         });

         if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.CustomUI, AgentType.CustomPrompt, AgentType.ModelOnline].includes(agent.agent_type)) {
            console.log('stephen: startAgent Utility install', new Date().toLocaleTimeString());
            await installUtilityAgent(agent, needUpdateCode);
            await startDependAgents(agent);
            console.log('stephen: startAgent Utility start docker', new Date().toLocaleTimeString());

            await handleRunDockerAgent(agent);
            console.log('stephen: startAgent Utility finish docker', new Date().toLocaleTimeString());
         } else if (agent.agent_type === AgentType.Model) {
            console.log('stephen: startAgent Model install', new Date().toLocaleTimeString());
            await handleInstallModelAgentRequirement();
            
            console.log('stephen: startAgent Model get hash', new Date().toLocaleTimeString());
            const ipfsHash = await getModelAgentHash(agent);
            console.log('startAgent ====ipfsHash', ipfsHash);

            console.log('stephen: startAgent Model run', new Date().toLocaleTimeString());
            await handleRunModelAgent(ipfsHash);
            setCurrentModel(agent);
            console.log('stephen: startAgent Model finish run', new Date().toLocaleTimeString());
         } else {

         }

         await sleep(2000);
      } catch (e) {
         console.log('startAgent e', e);
      } finally {
         updateAgentState(agent.id, {
            data: agent,
            isStarting: false,
         });

         intervalCheckAgentRunning(agent);
      }
   };

   const stopAgent = async (agent: IAgentToken) => {
      try {
         updateAgentState(agent.id, {
            data: agent,
            isStopping: true,
         });

         if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.CustomUI, AgentType.CustomPrompt, AgentType.ModelOnline].includes(agent.agent_type)) {
            await handleStopDockerAgent(agent);
            await stopDependAgents(agent);
         } else if (agent.agent_type === AgentType.Model) {

         } else {

         }

         await sleep(2000);
      } catch (e) {
         console.log('stopAgent e', e);
      } finally {
         updateAgentState(agent.id, {
            data: agent,
            isStopping: false,
         });

         intervalCheckAgentRunning(agent);
      }
   };

   const unInstallAgent = async (agent: IAgentToken) => {
      console.log('unInstallAgent', agent);
      try {
         updateAgentState(agent.id, {
            data: agent,
            isUnInstalling: true,
         });

         if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.CustomUI, AgentType.CustomPrompt, AgentType.ModelOnline].includes(agent.agent_type)) {
            await stopAgent(agent);

            await removeUtilityAgent(agent);

            fetchInstalledUtilityAgents();
         } else if (agent.agent_type === AgentType.Model) {
            const newAgent = installedModelAgents.filter(a => a.id !== agent.id)[0];

            if (newAgent) {
               await startAgent(newAgent);
            }

            const ipfsHash = await getModelAgentHash(agent);
            console.log('unInstallAgent ====ipfsHash', ipfsHash);
            await globalThis.electronAPI.modelDelete(ipfsHash);

            fetchInstalledModelAgents();
         } else {

         }
      } catch (e) {
         console.log('unInstallAgent e', e);
      } finally {
         updateAgentState(agent.id, {
            data: agent,
            isUnInstalling: false,
         });
      }
   }

   const getModelAgentHash = async (agent: IAgentToken) => {
      if (agent && !!agent.agent_contract_address) {
         const chainId = agent?.network_id || BASE_CHAIN_ID;
         const cAgent = new CAgentContract({ contractAddress: agent.agent_contract_address, chainId: chainId });
         const codeVersion = await cAgent.getCurrentVersion();
         const ipfsHash = await cAgent.getAgentCode(codeVersion);
         return ipfsHash?.replaceAll('\n', '');
      }
   }

   const installUtilityAgent = async (agent: IAgentToken, needUpdateCode?: boolean) => {
      if (agent && !!agent.agent_contract_address) {
         const chainId = agent?.network_id || BASE_CHAIN_ID;
         const cAgent = new CAgentContract({
            contractAddress: agent.agent_contract_address,
            chainId: chainId
         });

         let fileNameOnLocal = 'prompt.js';
         if ([AgentType.UtilityPython, AgentType.CustomUI, AgentType.CustomPrompt].includes(agent.agent_type)) {
            fileNameOnLocal = 'app.zip';
         }

         const codeVersion = await cAgent.getCurrentVersion();

         const values = await localStorageService.getItem(agent.agent_contract_address);
         const oldCodeVersion = values ? Number(values) : 0;

         const folderNameOnLocal = `${agent.network_id}-${agent.agent_name}`;

         let filePath: string | undefined = "";
         const isExisted = await checkFileExistsOnLocal(
            fileNameOnLocal,
            folderNameOnLocal
         );

         if (!isExisted || needUpdateCode || oldCodeVersion <= 0) {
            const rawCode = await cAgent.getAgentCode(codeVersion);
            if ([AgentType.UtilityPython, AgentType.CustomUI, AgentType.CustomPrompt].includes(agent.agent_type)) {
               filePath = await globalThis.electronAPI.writezipFile(fileNameOnLocal, folderNameOnLocal, rawCode, agent.agent_type === AgentType.UtilityPython ? 'app' : undefined);
               await localStorageService.setItem(agent.agent_contract_address, codeVersion.toString());
               console.log('filePath New', filePath);

               if (agent.agent_type === AgentType.UtilityPython) {
                  await globalThis.electronAPI.copyRequireRunPython(folderNameOnLocal);
               }
               if (filePath) {
                  globalThis.electronAPI.unzipFile(filePath, filePath.replaceAll(`/${fileNameOnLocal}`, ''));
               }
            } else {
               const base64Array = splitBase64(rawCode);
               const code = base64Array.reverse().map(item => isBase64(item) ? atob(item) : item).join('\n');

               filePath = await writeFileToLocal(fileNameOnLocal, folderNameOnLocal, `${code || ''}`);
               await localStorageService.setItem(agent.agent_contract_address, codeVersion.toString());
               console.log('filePath New', filePath);
            }
         } else {
            filePath = await getFilePathOnLocal(fileNameOnLocal, folderNameOnLocal);
            console.log('filePath isExisted', filePath)
         }
      }
   };

   const removeUtilityAgent = async (agent: IAgentToken) => {
      if (agent && !!agent.agent_name) {
         try {
            const folderNameOnLocal = `${agent.network_id}-${agent.agent_name?.toLowerCase()}`;
            await globalThis.electronAPI.removeFolder(folderNameOnLocal);
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
      }
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
      }
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

         const values = await localStorageService.getItem(agentContractAddr);
         const oldCodeVersion = values ? Number(values) : 0;

         const fileNameOnLocal = `prompt.${codeLang}`;
         const folderNameOnLocal = `${chainId}-${agentName?.toLowerCase()}`;

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
         const lang = getUtilityAgentCodeLanguage(agent);

         const options: any = {
            type: lang,
            port: agent.docker_port
         };

         if (agent?.required_wallet) {
            options.privateKey = agentWallet?.privateKey;
            options.address = agentWallet?.address;
         }

         console.log("stephen: options", agent?.agent_name?.toLowerCase(), agent?.network_id.toString(), JSON.stringify(options));

         await globalThis.electronAPI.dockerRunAgent(agent?.agent_name?.toLowerCase(), agent?.network_id.toString(), JSON.stringify(options));
      } catch (e) {
         console.log('handleRunDockerAgent', e);
      } finally {
      }
   };

   const handleStopDockerAgent = async (agent?: IAgentToken) => {
      if (!agent) return;

      await globalThis.electronAPI.dockerStopAgent(agent?.agent_name?.toLowerCase(), agent?.network_id.toString());
   };

   const fetchInstalledUtilityAgents = async () => {
      try {
         const folders = await globalThis.electronAPI.getExistAgentFolders();
         setInstalledUtilityAgents(folders || [])
      } catch (error) {
        
      }
   }

   const checkUtilityAgentInstalled = async (agent: IAgentToken) => {
      try {
         if (installedUtilityAgents?.some?.(key => key === `${agent.network_id}-${agent.agent_name?.toLowerCase()}`)) {
            setAgentInstalled(agent);
         } else {
            setAgentUnInstalled(agent);
         }
      } catch (e) {
         console.log('checkUtilityAgentInstalled e', e);
      } finally {

      }
   }

   const handleInstallModelAgentRequirement = async () => {
      if(!isModelRequirementSetup) {
         await globalThis.electronAPI.modelStarter();
         setIsModelRequirementSetup(true);
      }
   }

   const handleRunModelAgent = async (hash?: string) => {
      if (!hash) return;

      try {
         await globalThis.electronAPI.modelRun(hash);
      } catch (e) {
         console.log('handleRunModelAgent', e);
      } finally {

      }
   };

   const checkModelAgentInstalled = async (agent: IAgentToken) => {
      try {
         const ipfsHash = await getModelAgentHash(agent);

         const installedModels: ModelInfo[] = await globalThis.electronAPI.modelDownloadedList();
         const installedHashes = [...installedModels.map(r => r.hash)];

         if (installedHashes.includes(ipfsHash)) {
            setAgentInstalled(agent);
         } else {
            setAgentUnInstalled(agent);
         }
      } catch (e) {
         console.log('checkModelAgentInstalled e', e);
      } finally {

      }
   }

   const fetchInstalledSocialAgents = async () => {
      try {
         const values = await localStorageService.getItem(STORAGE_KEYS.INSTALLED_SOCIAL_AGENTS);
         const agentIds = values ? JSON.parse(values) : [];

         setInstalledSocialAgents(agentIds || [])
      } catch (error) {

      }
   }

   const checkSocialAgentInstalled = async (agent: IAgentToken) => {
      try {
         const values = await localStorageService.getItem(STORAGE_KEYS.INSTALLED_SOCIAL_AGENTS);
         const agentIds = values ? JSON.parse(values) : [];

         if (agentIds && agentIds.includes(agent.id)) {
            setAgentInstalled(agent);
         } else {
            setAgentUnInstalled(agent);
         }
      } catch (e) {
         console.log('checkModelAgentInstalled e', e);
      } finally {

      }
   }

   const setSelectedAgent = useCallback((newAgent: IAgentToken) => {
      _setSelectedAgent(newAgent);

      const isInstalled = agentStates[newAgent.id]?.isInstalled || false;
      const isRunning = agentStates[newAgent.id]?.isRunning || false;
      console.log("stephen: setSelectedAgent", { newAgent, isInstalled, isRunning });
      console.log("stephen: setSelectedAgent agentStates", { agentStates });

      if (isInstalled && !isRunning) {
         startAgent(newAgent);
      }
   }, [agentStates]);

   const checkAllInstalledAgentsRunning = async () => {
      try {
         // Check utility agents
         const utilityParams: any = {
            page: 1,
            limit: 100,
            sort_col: SortOption.CreatedAt,
            agent_types: [
               AgentType.UtilityJS, 
               AgentType.UtilityPython, 
               AgentType.Infra, 
               AgentType.CustomUI, 
               AgentType.CustomPrompt
            ].join(','),
            chain: '',
         };
         const { agents: utilityAgents } = await cPumpAPI.getAgentTokenList(utilityParams);

         // Check running status for each installed utility agent
         for (const folderName of installedUtilityAgents) {
            const [networkId, agentName] = folderName.split('-');
            if (!networkId || !agentName) continue;

            // Find agent info from API result
            const agent = utilityAgents.find(a => 
               a.network_id.toString() === networkId && 
               a.agent_name?.toLowerCase() === agentName?.toLowerCase()
            );
            
            if (agent) {
               if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.CustomPrompt].includes(agent.agent_type)) {
                  try {
                     const res = await cPumpAPI.checkAgentServiceRunning({ agent });
                     updateAgentState(agent.id, {
                        data: agent,
                        isInstalled: true,
                        isRunning: true
                     });
                  } catch (err) {
                     updateAgentState(agent.id, {
                        data: agent,
                        isInstalled: true,
                        isRunning: false
                     });
                  }
               } 
               else if (agent.agent_type === AgentType.CustomUI) {
                  try {
                     const port = await globalThis.electronAPI.dockerRunningPort(agentName, networkId);
                     updateAgentState(agent.id, {
                        data: agent,
                        isInstalled: true,
                        isRunning: !!port
                     });
                  } catch (err) {
                     updateAgentState(agent.id, {
                        data: agent,
                        isInstalled: true,
                        isRunning: false
                     });
                  }
               }
            }
         }

         // Check model agents
         const runningModelHash = await globalThis.electronAPI.modelCheckRunning();
         for (const agent of installedModelAgents) {
            const ipfsHash = await getModelAgentHash(agent);
            updateAgentState(agent.id, {
               data: agent,
               isInstalled: true,
               isRunning: ipfsHash === runningModelHash
            });
         }

         // Check social agents
         const socialParams: any = {
            page: 1,
            limit: 100,
            sort_col: SortOption.CreatedAt,
            agent_types: [
               AgentType.Normal,
               AgentType.Reasoning,
               AgentType.KnowledgeBase,
               AgentType.Eliza,
               AgentType.Zerepy
            ].join(','),
            chain: '',
         };
         const { agents: socialAgents } = await cPumpAPI.getAgentTokenList(socialParams);

         // Check running status for each installed social agent
         for (const agentId of installedSocialAgents) {
            const agent = socialAgents.find(a => a.id === agentId);
            if (agent) {
               updateAgentState(agent.id, {
                  data: agent,
                  isInstalled: true,
                  isRunning: true // Social agents are always running after installed
               });
            }
         }
      } catch (err) {
         console.log("checkAllInstalledAgentsRunning error:", err);
      }
   };

   const intervalCheckAllAgents = () => {
      checkAllInstalledAgentsRunning();
      
      if (refInterval.current) {
         clearInterval(refInterval.current);
      }
      
      refInterval.current = setInterval(() => {
         checkAllInstalledAgentsRunning();
      }, 30000);
   };

   // Start checking when installed agents list changes
   useEffect(() => {
      intervalCheckAllAgents();
      
      return () => {
         if (refInterval.current) {
            clearInterval(refInterval.current);
         }
      };
   }, [installedUtilityAgents, installedModelAgents, installedSocialAgents]);

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
         availableModelAgents,
         unInstallAgent,
         isUnInstalling,
         installedSocialAgents,
         isCustomUI: selectedAgent?.agent_type === AgentType.CustomUI,
         customUIPort,
         agentStates,
         liveViewUrl,
         isSearchMode,
         setIsSearchMode,
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
      availableModelAgents,
      unInstallAgent,
      isUnInstalling,
      installedSocialAgents,
      customUIPort,
      agentStates,
      liveViewUrl,
      isSearchMode,
      setIsSearchMode,
   ]);

   return (
      <AgentContext.Provider value={contextValues}>
         {children}
      </AgentContext.Provider>
   );
};

export default AgentProvider;
import { showMessage } from "@components/Toast/toast.tsx";
import { BASE_CHAIN_ID } from "@constants/chains";
import STORAGE_KEYS from "@constants/storage-key.ts";
import CAgentContract from "@contract/agent/index.ts";
import { checkFileExistsOnLocal, writeFileToLocal } from "@contract/file";
import { useDebounce } from '@hooks/useDebounce';
import { useAuth } from "@pages/authen/provider.tsx";
import { AgentType, CategoryOption, SortOption } from "@pages/home/list-agent/constants.ts";
import { MonitorContext } from "@providers/Monitor/MonitorContext.tsx";
import { ContainerData } from "@providers/Monitor/interface.ts";
import installAgentStorage from "@storage/InstallAgentStorage.ts";
import storageModel from "@storage/StorageModel.ts";
import { requestReloadListAgent, requestReloadMonitor } from "@stores/states/common/reducer.ts";
import { setReadyPort } from "@utils/agent.ts";
import { compareString, isBase64, splitBase64 } from "@utils/string.ts";
import { Wallet } from "ethers";
import uniq from "lodash.uniq";
import uniqBy from "lodash.uniqby";
import throttle from "lodash/throttle";
import React, { PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { ModelInfo } from "../../../../electron/share/model.ts";
import { EAgentTokenStatus } from "../../../services/api/agent/types.ts";
import CAgentTokenAPI from "../../../services/api/agents-token/index.ts";
import { IAgentToken, } from "../../../services/api/agents-token/interface.ts";
import localStorageService from "../../../storage/LocalStorageService.ts";
import { SUPPORT_TRADE_CHAIN } from "../trade-agent/form-trade/index.tsx";
import { AgentContext } from "./AgentContext.tsx";
import { ETradePlatform } from "./interface.ts";

const AgentProvider: React.FC<
    PropsWithChildren & { tokenAddress?: string }
> = ({
   children,
   tokenAddress: _tokenAddress,
}: PropsWithChildren & { tokenAddress?: string }): React.ReactElement => {
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(true);
   const [selectedAgent, _setSelectedAgent] = useState<IAgentToken | undefined>(undefined);
   const [isTrade, setIsTrade] = useState(false);
   const [agentWallet, setAgentWallet] = useState<Wallet | undefined>(undefined);
   const [coinPrices, setCoinPrices] = useState([]);
   const [agentCategories, setAgentCategories] = useState([]);
   const refInterval = useRef<any>();
   const [isBackupedPrvKey, setIsBackupedPrvKey] = useState(false);
   const [isModelRequirementSetup, setIsModelRequirementSetup] = useState(false);
   const [liveViewUrl, setLiveViewUrl] = useState<string>('');
   const [isSearchMode, setIsSearchMode] = useState(false);
   const [category, setCategory] = useState<number>(0);

   const refInstalledUtilityAgents = useRef<string[]>([]);
   const refInstalledUtilityAgentIds = useRef<number[]>([]);
   const refInstalledModelAgents = useRef<IAgentToken[]>([]);
   const refAvailableModelAgents = useRef<IAgentToken[]>([]);
   const refInstalledSocialAgents = useRef<number[]>([]);

   const debouncedUtilityAgents = useDebounce(refInstalledUtilityAgents.current, 300);
   const debouncedUtilityAgentIds = useDebounce(refInstalledUtilityAgentIds.current, 300);
   const debouncedModelAgents = useDebounce(refInstalledModelAgents.current, 300);
   const debouncedAvailableModelAgents = useDebounce(refAvailableModelAgents.current, 300);
   const debouncedSocialAgents = useDebounce(refInstalledSocialAgents.current, 300);

   const { containers, installedAgents } = useContext(MonitorContext);


   const [agentStates, setAgentStates] = useState<Record<number, {
      data: IAgentToken;
      isRunning: boolean;
      isInstalling: boolean;
      isUnInstalling: boolean;
      isStarting: boolean;
      isStopping: boolean;
      isInstalled: boolean;
      customUIPort?: string;
    }>>({});

   const { genAgentSecretKey } = useAuth();

   const cPumpAPI = new CAgentTokenAPI();

   const checkBackupPrvKey = useCallback(async () => {
      const values = await localStorageService.getItem(STORAGE_KEYS.AGENTS_HAS_BACKUP_PRV_KEY);
      if (!values) {
         setIsBackupedPrvKey(false);
         return;
      }
      const agentIdsHasBackup = JSON.parse(values);
      setIsBackupedPrvKey(agentWallet && selectedAgent && agentIdsHasBackup && agentIdsHasBackup?.some?.(id => id === selectedAgent?.id));
   }, [selectedAgent, agentWallet]);

   const debouncedCheckBackupPrvKey = useDebounce(checkBackupPrvKey, 300);

   useEffect(() => {
      checkBackupPrvKey();
   }, [debouncedCheckBackupPrvKey]);


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
         const matchingContainer = containers?.find((container: ContainerData) => compareString(container.agent?.agent_name, selectedAgent?.agent_name));
         if (matchingContainer?.agent && [AgentType.Model, AgentType.ModelOnline, AgentType.CustomUI].includes(matchingContainer?.agent?.agent_type)) {
            return matchingContainer ? matchingContainer?.state === 'running' || false : agentStates[selectedAgent.id]?.isRunning; 
         } else {
            return matchingContainer?.state === 'running' || agentStates[selectedAgent.id]?.isRunning || false;
         }
      }

      return false;
   }, [selectedAgent, agentStates, containers]);

   const isInstalled = useMemo(() => {
      if (selectedAgent) {
         return agentStates[selectedAgent.id]?.isInstalled || false;
      }

      return false;
   }, [selectedAgent, agentStates]);

   useEffect(() => {
      const fetchUtilityAgentIds = async () => {
         try {
            const installIds = await installAgentStorage.getAgentIds();
            let ids = '';
            if (installIds.length > 0) {
               ids = installIds.join(',');
            }
            const utilityParams: any = {
               page: 1,
               limit: 100,
               sort_col: SortOption.CreatedAt,
               agent_types: [
                  AgentType.UtilityJS, 
                  AgentType.UtilityPython, 
                  AgentType.Infra, 
                  AgentType.CustomUI, 
                  AgentType.CustomPrompt,
                  AgentType.ModelOnline,
               ].join(','),
               chain: '',
               ids,
            };
            const { agents: utilityAgents } = await cPumpAPI.getAgentTokenList(utilityParams);

            const utilityAgentIds = debouncedUtilityAgents.map(folderName => {
               const [networkId, ...agentNameParts] = folderName.split('-');
               const agentName = agentNameParts.join('-');
               const agent = utilityAgents.find(a => 
                  a.network_id.toString() === networkId 
                  && a.agent_name?.toLowerCase() === agentName?.toLowerCase()
               );
               return agent?.id;
            }).filter(Boolean) as number[];

            refInstalledUtilityAgentIds.current = utilityAgentIds;
         } catch (err) {
            console.log("fetchUtilityAgentIds error:", err);
            refInstalledUtilityAgentIds.current = [];
         }
      };

      fetchUtilityAgentIds();
   }, [debouncedUtilityAgents]);

   const installedAgentIds = useMemo(() => {
      return {
         utility: debouncedUtilityAgentIds,
         model: debouncedModelAgents.map(agent => agent.id),
         social: debouncedSocialAgents
      };
   }, [debouncedUtilityAgentIds, debouncedModelAgents, debouncedSocialAgents]);

   const customUIPort = useMemo(() => {
      if (selectedAgent) {
         return agentStates[selectedAgent.id]?.customUIPort;
      }
      return undefined;
   }, [selectedAgent, agentStates]);

   const isCanChat = useMemo(() => {
      return !requireInstall || (requireInstall && isInstalled && (!selectedAgent?.required_wallet || (selectedAgent?.required_wallet && !!agentWallet && isBackupedPrvKey)));
   }, [requireInstall, selectedAgent?.id, agentWallet, isInstalled, isBackupedPrvKey]);

   // console.log("stephen: selectedAgent", selectedAgent);
   // console.log("stephen: availableModelAgents", availableModelAgents);
   // console.log("stephen: currentModel", currentModel);
   // console.log("stephen: agentWallet", agentWallet);
   // console.log("stephen: installedAgents", installedAgents);
   // console.log("stephen: isCanChat", isCanChat);
   // console.log("stephen: isRunning", isRunning);
   // console.log("stephen: requireInstall", requireInstall);
   // console.log("stephen: isInstalled", isInstalled);
   // console.log('stephen availableModelAgents', availableModelAgents);
   // console.log("stephen: installedUtilityAgents", installedUtilityAgents);
   // console.log('stephen installedModelAgents', installedModelAgents);
   // console.log('stephen agentStates', agentStates);
   // console.log("stephen: customUIPort", customUIPort);
   // console.log('stephen agentCategories', agentCategories);
   // console.log("==============================");

   useEffect(() => {
      fetchCoinPrices();
      fetchAvailableModelAgents();
      fetchInstalledUtilityAgents();
      fetchAgentCategories();
      // loadAgentStates();

   }, []);

   useEffect(() => {
      fetchInstalledModelAgents();
   }, [debouncedAvailableModelAgents]);

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
      customUIPort?: string;
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
            const walletData = await localStorageService.getItem(STORAGE_KEYS.AGENTS_HAS_WALLET);
            const agentsHasWallet = JSON.parse(walletData || '[]');

            if (agentsHasWallet && agentsHasWallet.includes(selectedAgent?.id)) {
               createAgentWallet(selectedAgent);
            } else {
               setAgentWallet(undefined);
            }
         }
      };

      fetchWalletData();
   }, [selectedAgent?.id]);

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
   }, [selectedAgent?.id, debouncedUtilityAgents, debouncedModelAgents, debouncedSocialAgents]);

   const getUtilityAgentCodeLanguage = (agent: IAgentToken) => {
      if ([AgentType.CustomUI].includes(agent.agent_type)) {
         return 'custom-ui';
      } else if ([AgentType.CustomPrompt].includes(agent.agent_type)) {
         return 'custom-prompt';
      } else if ([AgentType.UtilityPython].includes(agent.agent_type)) {
         return 'py';
      } else if ([AgentType.UtilityJS].includes(agent.agent_type)) {
         return 'js';
      } else if ([AgentType.ModelOnline].includes(agent.agent_type)) {
         return 'open-ai';
      }

      return '';
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

         refAvailableModelAgents.current = res;
         fetchInstalledModelAgents();
      } catch (e) {

      } finally {

      }
   }

   const fetchInstalledModelAgents = async () => {
      const installedModels: ModelInfo[] = await globalThis.electronAPI.modelDownloadedList();
      // const runningModelHash = await globalThis.electronAPI.modelCheckRunning();
      const installedHashes = [...installedModels.map(r => r.hash)];

      let installedAgents: IAgentToken[] = refAvailableModelAgents.current?.filter((t, index) => installedHashes.includes(t.ipfsHash as string) || t.agent_type === AgentType.ModelOnline);

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

      refInstalledModelAgents.current = installedAgents;
      checkInstalledModelAgentsRunning();

      // if (!runningModelHash) {
      //    const defaultModelAgent = installedAgents.find((t, index) => compareString(t.ipfsHash, MODEL_HASH)) || installedAgents[0];

      //    if (defaultModelAgent) {
      //       await startAgent(defaultModelAgent);
      //    }
      // } else {
      //    const runningModelAgent = installedAgents?.find(t => compareString(t.ipfsHash, runningModelHash?.trim()));

      //    if(runningModelAgent) {
      //       setCurrentModel(runningModelAgent);
      //    }
      // }
   }

   const fetchCoinPrices = async () => {
      try {
         const _resCoinPrices: any = await cPumpAPI.getCoinPrices();
         setCoinPrices(_resCoinPrices);
      } catch (error) {}
   };

   const fetchAgentCategories = async () => {
      try {
         const res: any = await cPumpAPI.getAgentCategories();
         setAgentCategories([{id: 0, name: 'All'}, ...res]);
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

   const installAgent = async (agent: IAgentToken, needUpdateCode?: boolean) => {
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

            await startAgent(agent, needUpdateCode);

            fetchInstalledUtilityAgents(); //fetch then check agent installed in useEffect

            if (agent.agent_type === AgentType.ModelOnline) {
               fetchInstalledModelAgents();
            }

            // setAgentInstalled(agent);
         } else if (agent.agent_type === AgentType.Model) {
            await handleInstallModelAgentRequirement();

            const ipfsHash = await getModelAgentHash(agent);
            console.log('====ipfsHash', ipfsHash);
            await globalThis.electronAPI.modelInstall(ipfsHash);

            await startAgent(agent, needUpdateCode);

            fetchInstalledModelAgents(); //fetch then check agent installed in useEffect

            // setAgentInstalled(agent);
         }
      } catch (e) {
         console.log('installAgent e', e);
      } finally {
         setTimeout(() => {
            updateAgentState(agent.id, {
               data: agent,
               isInstalling: false,
            });
         }, 1000);
         dispatch(requestReloadListAgent());
      }
   }

   const throttledCheckAll = useMemo(
      () => throttle(async () => {
         try {
            await checkAllInstalledAgentsRunning();
         } catch (err) {
            console.log("Throttled check error:", err);
         }
      }, 1000),
      [debouncedUtilityAgents, debouncedModelAgents, debouncedSocialAgents, selectedAgent?.id]
   );

   useEffect(() => {
      return () => {
         throttledCheckAll.cancel();
      };
   }, []);

   const startAgent = async (agent: IAgentToken, needUpdateCode?: boolean) => {
      console.log("stephen: startAgent", agent);
      console.time('LEON: startAgent');
      try {
         updateAgentState(agent.id, {
            data: agent,
            isStarting: true,
         });
         await installAgentStorage.addAgent([agent.id]);

         if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.CustomUI, AgentType.CustomPrompt, AgentType.ModelOnline].includes(agent.agent_type)) {
            console.time('LEON: installUtilityAgent');
            await installUtilityAgent(agent, needUpdateCode);
            console.timeEnd('LEON: installUtilityAgent');

            if ([AgentType.ModelOnline].includes(agent.agent_type)) {
               await setReadyPort();
            }

            const tasks: Promise<void>[] = []

            tasks.push(startDependAgents(agent));
            tasks.push(handleRunDockerAgent(agent));

            console.time('LEON: run tasks');
            await Promise.all(tasks);
            console.timeEnd('LEON: run tasks');

            console.time('LEON: fetchInstalledUtilityAgents');
            fetchInstalledUtilityAgents();
            console.timeEnd('LEON: fetchInstalledUtilityAgents');

            if (agent.agent_type === AgentType.ModelOnline) {
               console.time('LEON: fetchInstalledModelAgents');   
               fetchInstalledModelAgents();
               console.timeEnd('LEON: fetchInstalledModelAgents');

               console.time('LEON: setActiveModel');
               await storageModel.setActiveModel({
                  ...agent,
                  hash: ""
               });
               console.timeEnd('LEON: setActiveModel');
            }
         } else if (agent.agent_type === AgentType.Model) {
            console.log('stephen: startAgent Model install', new Date().toLocaleTimeString());
            await handleInstallModelAgentRequirement();
            
            console.log('stephen: startAgent Model get hash', new Date().toLocaleTimeString());
            const ipfsHash = await getModelAgentHash(agent);
            console.log('startAgent ====ipfsHash', ipfsHash);

            console.log('stephen: startAgent Model set ready port', new Date().toLocaleTimeString());
            await setReadyPort();

            console.log('stephen: startAgent Model run', new Date().toLocaleTimeString());
            await handleRunModelAgent(ipfsHash);
            console.log('stephen: startAgent Model finish run', new Date().toLocaleTimeString());

            fetchInstalledModelAgents();

            await storageModel.setActiveModel({
               ...agent,
               hash: ipfsHash
            });
         }

         if ([AgentType.Model, AgentType.ModelOnline, AgentType.CustomUI].includes(agent.agent_type)) {
            checkAgentRunning(agent);
            setTimeout(() => {
               updateAgentState(agent.id, {
                  data: agent,
                  isStarting: false,
               });
            }, 4000);
         } else {
            dispatch(requestReloadMonitor());
            setTimeout(() => {
               updateAgentState(agent.id, {
                  data: agent,
                  isStarting: false,
                  isRunning: true,
               });
            }, 3000);
         }

         console.timeEnd('LEON: startAgent');
         // await sleep(2000);
      } catch (e: any) {

         console.log('startAgent e', e);

         if ([AgentType.Model, AgentType.ModelOnline].includes(agent.agent_type)) {
            const activeModel = await storageModel.getActiveModel();
            if (activeModel) {
               await setReadyPort();
            }
         }
         toast.error(`Start agent failed.`);
         updateAgentState(agent.id, {
            data: agent,
            isStarting: false,
            isRunning: false,
         });
      }
   };

   const stopAgent = async (agent: IAgentToken, isUpdateCode?: boolean) => {
      try {
         updateAgentState(agent.id, {
            data: agent,
            isStopping: true,
         });

         if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.CustomUI, AgentType.CustomPrompt, AgentType.ModelOnline].includes(agent.agent_type)) {
            await handleStopDockerAgent(agent);
            // await stopDependAgents(agent);
         } else if (agent.agent_type === AgentType.Model) {

         } else {

         }

         // await sleep(2000);
      } catch (e) {
         console.log('stopAgent e', e);
      } finally {
         setTimeout(() => {
            updateAgentState(agent.id, {
               data: agent,
               isStopping: false,
               isRunning: false,
            });
         }, 4000);
         throttledCheckAll();
         if (isUpdateCode) {
            updateAgentState(agent.id, {
               data: agent,
               isStarting: true,
            });
         }
      }
   };

   const unInstallAgent = async (agent: IAgentToken, needRemoveStorage: boolean = true) => {
      console.log('unInstallAgent', agent);
      try {
         updateAgentState(agent.id, {
            data: agent,
            isUnInstalling: true,
         });

         if (needRemoveStorage) {
            await installAgentStorage.removeAgent(`${agent.id}`);
         }
         
         if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.CustomUI, AgentType.CustomPrompt, AgentType.ModelOnline].includes(agent.agent_type)) {
            await stopAgent(agent);

            if (agent.agent_type === AgentType.ModelOnline) {
               const activeModel = await storageModel.getActiveModel();
               if (activeModel?.id === agent.id) {
                  const newAgent = refInstalledModelAgents.current.filter(a => a.id !== agent.id)[0];
                  if (newAgent) {
                     await startAgent(newAgent);
                  }
               }

               await globalThis.electronAPI.modelDelete('', agent.agent_name?.toLowerCase(), agent.network_id?.toString());
            } else {
               await removeUtilityAgent(agent);
            }

            fetchInstalledUtilityAgents();
         } else if (agent.agent_type === AgentType.Model) {
            const activeModel = await storageModel.getActiveModel();
            if (activeModel?.id === agent.id) {
               const newAgent = refInstalledModelAgents.current.filter(a => a.id !== agent.id)[0];
               if (newAgent) {
                  await startAgent(newAgent);
               }
            }

            const ipfsHash = await getModelAgentHash(agent);
            console.log('unInstallAgent ====ipfsHash', ipfsHash);
            await globalThis.electronAPI.modelDelete(ipfsHash);

            fetchInstalledModelAgents();
         } else {

         }

         const lang = getUtilityAgentCodeLanguage(agent);
         await Promise.all([
            await storageModel.removeEnvironment({
               contractAddress: agent.agent_contract_address,
               chainId: agent.network_id
            }),
            await globalThis.electronAPI.dockerDeleteImage(agent.agent_name?.toLowerCase(), agent.network_id?.toString(), lang),
            await storageModel.removeDependAgents({
               contractAddress: agent.agent_contract_address,
               chainId: agent.network_id
            }),
         ])
      } catch (e) {
         console.log('unInstallAgent e', e);
      } finally {
         setTimeout(() => {
            dispatch(requestReloadMonitor());
            updateAgentState(agent.id, {
               data: agent,
               isUnInstalling: false,
            });
            if (needRemoveStorage) {
               dispatch(requestReloadListAgent());
               showMessage({
                  message: `Delete ${agent?.display_name || agent?.agent_name} successfully.`,
                  status: 'success',
               });
            }
         }, 2000);
         
         checkAgentRunning(agent);
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
         let fileNameOnLocal = 'prompt.js';
         if ([AgentType.UtilityPython, AgentType.CustomUI, AgentType.CustomPrompt, AgentType.ModelOnline].includes(agent.agent_type)) {
            fileNameOnLocal = 'app.zip';
         }
         const folderNameOnLocal = `${agent.network_id}-${agent.agent_name}`;

         const isExisted = await checkFileExistsOnLocal(
            fileNameOnLocal,
            folderNameOnLocal
         );

         if (isExisted && !needUpdateCode) {
            console.log('stephen: startAgent return', new Date().toLocaleTimeString());
            return;
         }

         const chainId = agent?.network_id || BASE_CHAIN_ID;
         const cAgent = new CAgentContract({
            contractAddress: agent.agent_contract_address,
            chainId: chainId
         });

         const codeVersion = await cAgent.getCurrentVersion();

         const values = await localStorageService.getItem(agent.agent_contract_address);
         const oldCodeVersion = values ? Number(values) : 0;

         let filePath: string | undefined = "";
         
         if (!isExisted || needUpdateCode || oldCodeVersion <= 0) {
            const rawCode = await cAgent.getAgentCode(codeVersion);
            if ([AgentType.UtilityPython, AgentType.CustomUI, AgentType.CustomPrompt, AgentType.ModelOnline].includes(agent.agent_type)) {
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
            // filePath = await getFilePathOnLocal(fileNameOnLocal, folderNameOnLocal);
            console.log('filePath isExisted')
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
      console.time('LEON: startDependAgents');
      console.time('LEON: getDependAgents');
      const dependAgents = await getDependAgents(agent);
      console.timeEnd('LEON: getDependAgents');
      console.log('LEON: getDependAgents', dependAgents);

      if (dependAgents.length > 0) {
         await Promise.all(dependAgents.map(async (agent) => {
            await wrapCheckForceUpdateThenStartAgent(agent);
         }));
      }
      console.timeEnd('LEON: startDependAgents');
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
         const depsAgentStrs = agent.depend_agents ? agent.depend_agents.split(',').map(addr => addr.trim()) : [];
         if (depsAgentStrs.length > 0) {
            const dependAgents = await installDependAgents(depsAgentStrs);
            return dependAgents;
         }
      }
      return [];
   };

   const installDependAgents = async (agents: string[]) => {
      const installedAgents = new Set<string>();
      const cPumpAPI = new CAgentTokenAPI();
      const agent_types = [
            AgentType.CustomUI, 
            AgentType.CustomPrompt,
            AgentType.ModelOnline,
            AgentType.Model
         ].join(',');

      const agentsData = await Promise.all(agents.map(async (agentContractAddr) => {
         if (installedAgents.has(agentContractAddr)) {
            return null; 
         }
         installedAgents.add(agentContractAddr);

         
         const { agents } = (await cPumpAPI.getAgentTokenList({ contract_addresses: agentContractAddr, page: 1, limit: 1, agent_types }));
         const agent = agents?.[0];
         if (!agent) {
            return null;
         }

         let dependAgents: any[] = [];
         const depsAgentStrs = agent.depend_agents ? agent.depend_agents.split(',').map(addr => addr.trim()) : [];

         if (depsAgentStrs.length > 0) {
            dependAgents = await installDependAgents(depsAgentStrs);
         }

         return [
            ...dependAgents,
            agent
         ];
      }));
      
      return agentsData.flat().filter(Boolean);
   };
   

   const handleRunDockerAgent = async (agent?: IAgentToken) => {
      if (!agent) return;

      const lang = getUtilityAgentCodeLanguage(agent);

      const options: any = {
         type: lang,
         port: agent.docker_port
      };

      const environment = await storageModel.getEnvironment({
         contractAddress: agent.agent_contract_address,
         chainId: agent.network_id
      });

      console.log('LEON: environment', environment, JSON.stringify(environment));

      if (environment) {
         options.environment = environment;
      }

      if (agent?.required_wallet) {
         options.privateKey = agentWallet?.privateKey;
         options.address = agentWallet?.address;
      }

      console.log("stephen: options", agent?.agent_name?.toLowerCase(), agent?.network_id.toString(), JSON.stringify(options));

      await globalThis.electronAPI.dockerRunAgent(agent?.agent_name?.toLowerCase(), agent?.network_id.toString(), JSON.stringify(options));
   };

   const handleStopDockerAgent = async (agent?: IAgentToken) => {
      if (!agent) return;

      await globalThis.electronAPI.dockerStopAgent(agent?.agent_name?.toLowerCase(), agent?.network_id.toString());
   };

   const fetchInstalledUtilityAgents = async () => {
      try {
         const folders = await globalThis.electronAPI.getExistAgentFolders();
         refInstalledUtilityAgents.current = folders || [];
         checkInstalledUtilityAgentsRunning();
      } catch (error) {
         console.error('Error fetching installed utility agents:', error);
         refInstalledUtilityAgents.current = [];
      }
   }

   const checkUtilityAgentInstalled = async (agent: IAgentToken) => {
      try {
         if (refInstalledUtilityAgents.current?.some?.(key => key === `${agent.network_id}-${agent.agent_name?.toLowerCase()}`)) {
            setAgentInstalled(agent);
         } else {
            setAgentUnInstalled(agent);
         }
      } catch (e) {
         console.log('checkUtilityAgentInstalled e', e);
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

         refInstalledSocialAgents.current = agentIds || [];
      } catch (error) {
         console.error('Error fetching installed social agents:', error);
         refInstalledSocialAgents.current = [];
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
      const isStarting = agentStates[newAgent.id]?.isStarting || false;
      console.log("stephen: setSelectedAgent", { newAgent, isInstalled, isRunning });
      console.log("stephen: setSelectedAgent agentStates", { agentStates });

      if (isInstalled && !isRunning && !isStarting && newAgent?.agent_type !== AgentType.ModelOnline) {
         console.log();
         
         startAgent(newAgent);
      }
   }, [agentStates]);

   const checkInstalledUtilityAgentsRunning = async () => {
      // Check utility agents
      let utilityAgents = installedAgents;
      if (utilityAgents.length <= 0) {
         const installIds = await installAgentStorage.getAgentIds();
         const agent_types = [
            AgentType.CustomUI, 
            AgentType.CustomPrompt,
            AgentType.ModelOnline,
         ].join(',');
         const utilityParams: any = {
            page: 1,
            limit: installIds?.length || 200,
            sort_col: SortOption.CreatedAt,
            agent_types: agent_types,
            chain: '',
            ids: installIds.length > 0 ? '' : installIds.join(','),
         };

         const [{ agents }, { agents: agentsAll }] = await Promise.all([
            cPumpAPI.getAgentTokenList(utilityParams),
            cPumpAPI.getAgentTokenList({ page: 1, limit: 100, agent_types }),
         ]);
         utilityAgents = uniqBy([...agents, ...agentsAll], 'id');
      }
      
      const activeModel = await storageModel.getActiveModel();

      // Check running status for each installed utility agent
      await Promise.all(refInstalledUtilityAgents.current.map(async (folderName) => {
         const [networkId, ...agentNameParts] = folderName.split('-');
         const agentName = agentNameParts.join('-');
         if (!networkId || !agentName) return;

         // Find agent info from API result
         const agent = utilityAgents.find(a => 
            a.network_id.toString() === networkId 
            && a.agent_name?.toLowerCase() === agentName?.toLowerCase()
         );
         if (!agent) return;
         await checkAgentRunning(agent, activeModel);
      }));
      dispatch(requestReloadMonitor());
   };

   const checkAgentRunning = async (agent: IAgentToken, activeModel?: IAgentToken) => {
      if ([AgentType.CustomPrompt, AgentType.ModelOnline].includes(agent.agent_type)) {
         try {
            if (agent.agent_type === AgentType.ModelOnline) {
               let _activeModel = activeModel;
               if (!_activeModel) {
                  _activeModel = await storageModel.getActiveModel();
               }
               await cPumpAPI.checkAgentModelServiceRunning();
               updateAgentState(agent.id, {
                  data: agent,
                  isInstalled: true,
                  isRunning: agent.id === _activeModel?.id
               });
            } else {
               await cPumpAPI.checkAgentServiceRunning({ agent });
               updateAgentState(agent.id, {
                  data: agent,
                  isInstalled: true,
                  isRunning: true
               });
            }
         } catch (err) {
            updateAgentState(agent.id, {
               data: agent,
               isInstalled: true,
               isRunning: false
            });
         }
      } else if (agent.agent_type === AgentType.CustomUI) {
         try {
            const port = await globalThis.electronAPI.dockerRunningPort(agent.agent_name?.toLowerCase(), agent.network_id.toString());
            updateAgentState(agent.id, {
               data: agent,
               isInstalled: true,
               isRunning: !!port,
               customUIPort: port
            });

         } catch (err) {
            updateAgentState(agent.id, {
               data: agent,
               isInstalled: true,
               isRunning: false,
               customUIPort: undefined
            });
         }
      }
   }

   const wrapCheckForceUpdateThenStartAgent = async (agent: IAgentToken) => {
      if (!agent.is_force_update) {
         startAgent(agent);
         return;
      }
      let codeVersion = agent?.code_version ? Number(agent?.code_version) : 0;
      const values = await localStorageService.getItem(agent.agent_contract_address);
      const oldCodeVersion = values ? Number(values) : undefined;

      if (!oldCodeVersion || (codeVersion > 1 && codeVersion > oldCodeVersion)) {
         updateAgentState(agent.id, {
            data: agent,
            isStarting: true,
         });
         await stopAgent(agent, true);
         await unInstallAgent(agent, false);
         await installAgent(agent, true);
      } else {
         startAgent(agent);
      }
   }

   const checkInstalledModelAgentsRunning = async () => {
      // Check model agents
      const activeModel = await storageModel.getActiveModel();

      for (const agent of refInstalledModelAgents.current) {
         updateAgentState(agent.id, {
            data: agent,
            isInstalled: true,
            isRunning: agent.id === activeModel?.id
         });
      }
      dispatch(requestReloadMonitor());
   }

   const checkAllInstalledAgentsRunning = async () => {
      try {
         await Promise.all([
            checkInstalledUtilityAgentsRunning(),
            checkInstalledModelAgentsRunning(),
         ]);
         
      } catch (err) {
         console.log("checkAllInstalledAgentsRunning error:", err);
      }
   };

   useEffect(() => {
      checkAllInstalledAgentsRunning();
   }, []);

   const [currentActiveModel, setCurrentActiveModel] = useState<{
      agent: IAgentToken | undefined,
      dependAgents: string[];
   }>();

   useEffect(() => {
      onGetCurrentModel();
   }, [selectedAgent, isRunning]);

   const onGetCurrentModel = async () => {
      try {
         const model = await storageModel.getActiveModel();
         if (model?.agent_type === AgentType.ModelOnline) {
            setCurrentActiveModel({
               agent: model,
               dependAgents: [],
            });
            const chainId = model?.network_id || BASE_CHAIN_ID;
            const cAgent = new CAgentContract({ contractAddress: model.agent_contract_address, chainId: chainId });
            const codeVersion = await cAgent.getCurrentVersion();
            const depsAgentStrs = await cAgent.getDepsAgents(codeVersion);

            setCurrentActiveModel({
               agent: model,
               dependAgents: depsAgentStrs,
            });
         }
      } catch (error) {
      }
   }

   const contextValues: any = useMemo(() => {
      return {
         loading,
         selectedAgent,
         setSelectedAgent,
         installAgent,
         startAgent: wrapCheckForceUpdateThenStartAgent,
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
         isCanChat,
         isBackupedPrvKey,
         setIsBackupedPrvKey,
         requireInstall,
         isModelRequirementSetup,
         installedModelAgents: refInstalledModelAgents.current,
         availableModelAgents: refAvailableModelAgents.current,
         unInstallAgent,
         isUnInstalling,
         installedSocialAgents: refInstalledSocialAgents.current,
         isCustomUI: selectedAgent?.agent_type === AgentType.CustomUI,
         customUIPort,
         agentStates,
         liveViewUrl,
         isSearchMode,
         setIsSearchMode,
         category,
         setCategory,
         currentActiveModel,
         installedAgentIds,
         agentCategories,
      };
   }, [
      loading,
      selectedAgent,
      setSelectedAgent,
      installAgent,
      startAgent,
      wrapCheckForceUpdateThenStartAgent,
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
      isCanChat,
      isBackupedPrvKey,
      setIsBackupedPrvKey,
      requireInstall,
      isModelRequirementSetup,
      refInstalledModelAgents.current,
      refAvailableModelAgents.current,
      unInstallAgent,
      isUnInstalling,
      refInstalledSocialAgents.current,
      customUIPort,
      agentStates,
      liveViewUrl,
      isSearchMode,
      setIsSearchMode,
      category,
      setCategory,
      currentActiveModel,
      installedAgentIds,
      agentCategories,
   ]);

   return (
      <AgentContext.Provider value={contextValues}>
         {children}
      </AgentContext.Provider>
   );
};

export default AgentProvider;
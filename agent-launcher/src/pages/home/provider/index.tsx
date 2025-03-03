import React, {PropsWithChildren, useCallback, useEffect, useMemo, useState,} from "react";
import {IAgentContext} from "./interface";
import {IAgentToken, IChainConnected,} from "../../../services/api/agents-token/interface.ts";
import {BASE_CHAIN_ID} from "@constants/chains";
import {checkFileExistsOnLocal, getFilePathOnLocal, readFileOnChain, writeFileToLocal,} from "@contract/file";
import {AgentType} from "@pages/home/list-agent/index.tsx";
import CAgentTokenAPI from "../../../services/api/agents-token";
import {compareString} from "@utils/string.ts";
import {Wallet} from "ethers";

const initialValue: IAgentContext = {
  loading: false,
  selectedAgent: undefined,
  setSelectedAgent: () => {},
  currentModel: undefined,
  setCurrentModel: () => {},
  chainList: [],
  startAgent: () => {},
  stopAgent: () => {},
  isStarting: false,
  isStopping: false,
  handleStopDockerAgent: () => {},
  runningAgents: [],
  isTrade: false,
  setIsTrade(v) {},
  agentWallet: undefined,
  setAgentWallet: (v) => {},
  isRunning: false,
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
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [runningAgents, setRunningAgents] = useState<number[]>([]);
  const [isTrade, setIsTrade] = useState(false);
  const [agentWallet, setAgentWallet] = useState<Wallet | undefined>(undefined);

  const cPumpAPI = new CAgentTokenAPI();

  const [currentModel, setCurrentModel] = useState<{
    name: string;
    id: string;
  } | null>(null);

  console.log('stephen: selectedAgent', selectedAgent);
  console.log('stephen: currentModel', currentModel);
  console.log('================================');

  const isRunning = useMemo(() => {
    return runningAgents.includes(selectedAgent?.id as number);
  }, [runningAgents, selectedAgent]);

  useEffect(() => {
    if (selectedAgent && chainList) {
      const supportModelObj = chainList?.find((v) =>
        compareString(v.chain_id, selectedAgent.network_id),
      )?.support_model_names;

      if (supportModelObj) {
        setCurrentModel({
          name: selectedAgent.agent_base_model || Object.keys(supportModelObj)[0],
          id: supportModelObj[selectedAgent.agent_base_model] || Object.values(supportModelObj)[0],
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

  const getRunningAgents = () => {
    try {
      setRunningAgents([14483]);
    } catch (err) {
    } finally {
    }
  };

  useEffect(() => {
    fetchChainList();
    getRunningAgents();
  }, []);

  // useEffect(() => {
  //   const wallet = new Wallet("0x5776efc21d0e98afd566d3cb46e2eb1ccd7406f4feaee9c28b0fcffc851cc8b3", new JsonRpcProvider("https://eth.llamarpc.com"));
  //   setAgentWallet(wallet);
  // }, []);

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
      if (agent && agent.agent_type === AgentType.Utility && agent.source_url) {
        const source_urls: string[] = JSON.parse(agent.source_url);
        if (source_urls?.length > 0) {
          const sourceFile = source_urls?.find((url) => url.startsWith('ethfs_'));
          if (sourceFile) {
            setIsStarting(true);
            const filePath = await readSourceFile(sourceFile, `prompt.js`, `${agent.id}.js`, agent?.network_id || BASE_CHAIN_ID);
            await handleRunDockerAgent(filePath, agent);
          }
        }
      }
    } catch (error: any) {
      alert(error?.message || "Something went wrong");
    } finally {
      setIsStarting(false);
    }
  };

  const readSourceFile = async (
    filename: string,
    fileNameOnLocal: string,
    folderName: string,
    chainId: number
  ) => {
    try {
      let filePath: string | undefined = "";
      const isExisted = await checkFileExistsOnLocal(
        fileNameOnLocal,
        folderName
      );
      if (isExisted) {
        filePath = await getFilePathOnLocal(fileNameOnLocal, folderName);
      } else {
        const data = await readFileOnChain(chainId, filename);
        filePath = await writeFileToLocal(fileNameOnLocal, folderName, data);
      }
      return filePath;
    } catch (error: any) {
      throw error;
    }
  };

  // handle run docker here
  const handleRunDockerAgent = async (filePath?: string, agent?: IAgentToken) => {
    console.log("====: filePath", filePath);
    if (!filePath) return;
    await window.electronAPI.dockerRunAgent(agent?.agent_name, agent?.network_id);
  };

  const handleStopDockerAgent = async (agent?: IAgentToken) => {
    try {
      setIsStopping(true);
      await window.electronAPI.dockerStopAgent(agent?.agent_name, agent?.network_id);
    } catch (err) {
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
      startAgent,
      stopAgent,
      isStarting,
      isStopping,
      runningAgents,
      isTrade,
      setIsTrade,
      agentWallet,
      setAgentWallet,
      isRunning,
    };
  }, [
    loading,
    selectedAgent,
    setSelectedAgent,
    currentModel,
    setCurrentModel,
    chainList,
    startAgent,
    stopAgent,
    isStarting,
    isStopping,
    runningAgents,
    isTrade,
    setIsTrade,
    agentWallet,
    setAgentWallet,
    isRunning
  ]);

  return (
    <AgentContext.Provider value={contextValues}>
      {children}
    </AgentContext.Provider>
  );
};

export default AgentProvider;

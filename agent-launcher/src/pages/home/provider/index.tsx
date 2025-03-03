import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ETradePlatform, IAgentContext } from "./interface";
import {
  IAgentToken,
  IChainConnected,
} from "../../../services/api/agents-token/interface.ts";
import { BASE_CHAIN_ID } from "@constants/chains";
import {
  checkFileExistsOnLocal,
  getFilePathOnLocal,
  readFileOnChain,
  writeFileToLocal,
} from "@contract/file";
import { AgentType } from "@pages/home/list-agent/index.tsx";
import CAgentTokenAPI from "../../../services/api/agents-token";
import { compareString } from "@utils/string.ts";
import { Wallet } from "ethers";
import { EAgentTokenStatus } from "../../../services/api/agent/types.ts";
import { SUPPORT_TRADE_CHAIN } from "../trade-agent/form-trade/index.tsx";

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
  tradePlatform: ETradePlatform.eternal,
  coinPrices: [],
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
  const [coinPrices, setCoinPrices] = useState([]);

  const cPumpAPI = new CAgentTokenAPI();

  const [currentModel, setCurrentModel] = useState<{
    name: string;
    id: string;
  } | null>(null);

  console.log("stephen: selectedAgent", selectedAgent);
  console.log("stephen: currentModel", currentModel);
  console.log("================================");

  const getTradePlatform = (_pumpToken: IAgentToken | undefined) => {
    if (SUPPORT_TRADE_CHAIN.includes(_pumpToken?.meme?.network_id as any)) {
      if (
        compareString(_pumpToken?.meme?.status, EAgentTokenStatus.add_pool_2)
      ) {
        return ETradePlatform.exchange3th;
      } else if (
        compareString(_pumpToken?.meme?.status, EAgentTokenStatus.add_pool_1) ||
        compareString(_pumpToken?.meme?.status, EAgentTokenStatus.reached_mc)
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
            supportModelObj[selectedAgent.agent_base_model] ||
            Object.values(supportModelObj)[0],
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
      setRunningAgents([14483]);
    } catch (err) {
    } finally {
    }
  };

  useEffect(() => {
    fetchChainList();
    getRunningAgents();
    fetchCoinPrices();
  }, []);

  // useEffect(() => {
  //   const wallet = new Wallet("0x5776efc21d0e98afd566d3cb46e2eb1ccd7406f4feaee9c28b0fcffc851cc8b3", new JsonRpcProvider("https://eth.llamarpc.com"));
  //   setAgentWallet(wallet);
  // }, []);

  const startAgent = (agent: IAgentToken) => {
    installUtilityAgent(agent);
    setRunningAgents((prev) => [...prev, agent.id]);
  };

  const stopAgent = (agent: IAgentToken) => {
    setRunningAgents((prev) => prev.filter((id) => id !== agent.id));
  };

  const installUtilityAgent = async (agent: IAgentToken) => {
    try {
      if (
        agent &&
        agent.agent_type === AgentType.Utility &&
        agent.source_url &&
        agent.source_url.length > 0
      ) {
        const sourceFile = agent?.source_url?.find((url) =>
          url.startsWith("ethfs_")
        );
        if (sourceFile) {
          setIsStarting(true);
          const filePath = await readSourceFile(
            sourceFile,
            `prompt.js`,
            `${agent.id}.js`,
            agent?.network_id || BASE_CHAIN_ID
          );
          await handleRunDockerAgent(filePath);
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
  const handleRunDockerAgent = async (filePath?: string) => {
    if (!filePath) return;
    console.log("====: filePath", filePath);
  };

  const handleStopDockerAgent = async (filePath?: string) => {
    if (!filePath) return;
    console.log("====: filePath", filePath);
    try {
      setIsStopping(true);
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
      tradePlatform,
      coinPrices,
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
    isRunning,
    tradePlatform,
    coinPrices,
  ]);

  return (
    <AgentContext.Provider value={contextValues}>
      {children}
    </AgentContext.Provider>
  );
};

export default AgentProvider;

import React, { PropsWithChildren, useMemo, useState, useEffect } from "react";
import { IAgentContext } from "./interface";
import {IAgentToken} from "../../../services/api/agents-token/interface.ts";
import { BASE_CHAIN_ID } from '@constants/chains';
import { checkFileExistsOnLocal, getFilePathOnLocal, readFileOnChain, writeFileToLocal } from '@contract/file';
import { AgentType } from '@pages/home/list-agent/index.tsx';

const initialValue: IAgentContext = {
  loading: false,
  selectedAgent: undefined,
  setSelectedAgent: () => {}
};

export const AgentContext = React.createContext<IAgentContext>(initialValue);

const AgentProvider: React.FC<
  PropsWithChildren & { tokenAddress?: string }
> = ({
   children,
   tokenAddress: _tokenAddress,
}: PropsWithChildren & { tokenAddress?: string }): React.ReactElement => {
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<IAgentToken | undefined>(undefined);

  console.log('stephen: selectedAgent', selectedAgent);

  const contextValues: any = useMemo(() => {
    return {
      loading,
      selectedAgent,
      setSelectedAgent,
    };
  }, [
    loading,
    selectedAgent,
    setSelectedAgent
  ]);

  useEffect(() => {
    installUtilityAgent();
  }, [selectedAgent]);

  const installUtilityAgent = async () => {
    try {
      if (selectedAgent && selectedAgent.agent_type === AgentType.Utility && selectedAgent.source_url && selectedAgent.source_url.length > 0) {
        const sourceFile = selectedAgent?.source_url?.find((url) => url.startsWith('ethfs_'));
        if (sourceFile) {
          const filePath = await readSourceFile(sourceFile, `agent_${selectedAgent.agent_id}.js` ,selectedAgent?.network_id || BASE_CHAIN_ID);
          await handleRunDockerAgent(filePath);
        }
      }
    } catch (error: any) {
      alert(error?.message ||'Something went wrong');
    }
  }

  const readSourceFile = async (filename: string, filenameOnLocal: string, chainId: number) => {
    try {
      let filePath: string | undefined = '';
      const isExisted = await checkFileExistsOnLocal(filenameOnLocal);
      if (isExisted) {
        filePath = await getFilePathOnLocal(filenameOnLocal);
      } else {
        const data = await readFileOnChain(chainId, filename);
        filePath = await writeFileToLocal(filenameOnLocal, data);
      }
      return filePath;
    } catch (error: any) {
      throw error;
    }
  }

  // handle run docker here
  const handleRunDockerAgent = async (filePath?: string) => {
    if (!filePath) return;
    console.log('====: filePath', filePath);
  }

   return (
      <AgentContext.Provider value={contextValues}>
         {children}
      </AgentContext.Provider>
   );
};

export default AgentProvider;

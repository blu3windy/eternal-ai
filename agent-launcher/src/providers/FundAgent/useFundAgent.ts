import { create } from "zustand";
import { AgentInfo } from "../../services/api/agent/types.ts";

interface IProps {
  depositAgentID?: string;
  setDepositAgentID: (_?: string) => void;

  depositAgentInfo?: AgentInfo;
  setDepositAgentInfo: (_?: AgentInfo) => void;
}

const useFundAgent = create<IProps, any>((set, get) => ({
   depositAgentID: '',
   setDepositAgentID: (depositAgentID) => {
      set({ depositAgentID });
   },

   depositAgentInfo: undefined,
   setDepositAgentInfo: (depositAgentInfo) => {
      set({ depositAgentInfo });
   },
}));

export default useFundAgent;

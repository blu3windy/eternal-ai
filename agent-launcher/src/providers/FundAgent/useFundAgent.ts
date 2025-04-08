import { create } from "zustand";
import { IDepositInfo } from "./types.ts";

interface IProps {
  depositInfo?: IDepositInfo;
  setDepositInfo: (_?: IDepositInfo) => void;
}

const useFundAgent = create<IProps, any>((set, get) => ({
   depositInfo: undefined,
   setDepositInfo: (depositInfo) => {
      set({ depositInfo: depositInfo });
   },
}));

export default useFundAgent;

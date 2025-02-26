'use client';

import React, {createContext, useMemo} from 'react';
import DepositModal from "./Deposit/Deposit.modal.tsx";

interface IProps {}

const context = createContext<IProps>({} as IProps);

export default function FundAgentProvider({ children }: React.PropsWithChildren) {
  const values = useMemo(() => {
    return {
    };
  }, []);

  return (
    <context.Provider
      value={values}
    >
      {children}
      <DepositModal />
    </context.Provider>
  );
}

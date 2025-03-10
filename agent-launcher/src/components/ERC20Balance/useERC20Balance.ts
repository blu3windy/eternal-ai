import { CHAIN_TYPE } from "@constants/chains";
import CTokenContract from "@contract/token";
import { IToken } from "@interfaces/token";
import { useAuth } from "@pages/authen/provider";
import { commonSelector } from "@stores/states/common/selector";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export interface IProps {
  token?: IToken | undefined;
  onBalanceChange?: (_amount: string | undefined) => void;
  chain?: CHAIN_TYPE;
  walletAddress?: string;
}

const useERC20Balance = (props: IProps) => {
  const { token, onBalanceChange, chain, walletAddress } = props;
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [balance, setBalance] = useState("0");
  const needReload = useSelector(commonSelector).needReload;
  const { signer } = useAuth();
  const address = signer?.address;
  const cTokenContract = useRef(new CTokenContract()).current;

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const tokenBalance = await getTokenBalance(token);
      setBalance(tokenBalance || "0");

      onBalanceChange && onBalanceChange(tokenBalance);
    } catch (error) {
      setLoading(false);
      setLoaded(true);
      throw error;
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  };

  const getTokenBalance = async (token: IToken | undefined) => {
    if (!token || !token?.address) return "0";
    try {
      const response = await cTokenContract.getTokenBalance(
        token.address,
        chain,
        walletAddress
      );

      return response || "0";
    } catch (error) {
      console.log("error", error);
      // throw error;
      return "0";
    }
  };

  useEffect(() => {
    if (token?.address) {
      fetchBalance();
    } else {
      setLoaded(true);
    }
  }, [token?.address, needReload, address, chain, walletAddress]);

  return {
    loading,
    balance,
    loaded,
  };
};

export default useERC20Balance;

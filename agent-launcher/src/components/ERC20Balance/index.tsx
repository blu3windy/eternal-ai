import { Skeleton, Text } from "@chakra-ui/react";
import { CHAIN_TYPE } from "@constants/chains";
import React from "react";
import useERC20Balance from "./useERC20Balance";
import { formatCurrency } from "@utils/format";
import { IToken } from "@interfaces/token";
import { MAX_DECIMAL, MIN_DECIMAL } from "@constants/chains";

export interface ItemBalanceProps {
  token?: IToken | undefined;
  onBalanceChange?: (_amount: string | undefined) => void;
  maxDecimal?: number;
  chain?: CHAIN_TYPE;
  walletAddress?: string;
}

const ERC20Balance = (props: ItemBalanceProps) => {
  const {
    token,
    onBalanceChange,
    maxDecimal = MAX_DECIMAL,
    chain = CHAIN_TYPE.BASE,
    walletAddress,
  } = props;

  const { balance, loading } = useERC20Balance({
    token,
    onBalanceChange,
    chain,
    walletAddress,
  });

  return (
    <Skeleton isLoaded={!loading && Boolean(token)}>
      <Text color={"#000"} fontWeight={500} fontSize={["12px", "14px"]}>
        {Number(balance) === 0 || !balance
          ? "0"
          : formatCurrency(balance, MIN_DECIMAL, maxDecimal)}
      </Text>
    </Skeleton>
  );
};

export default ERC20Balance;

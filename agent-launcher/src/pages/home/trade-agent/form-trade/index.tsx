import { Flex, Text } from "@chakra-ui/react";
import Percent24h from "@components/Percent";
import { AgentContext } from "@pages/home/provider";
import { formatCurrency } from "@utils/format";
import { Form, Formik } from "formik";
import { useContext, useRef } from "react";
import {
  APE_CHAIN_ID,
  ARBITRUM_CHAIN_ID,
  AVAX_CHAIN_ID,
  BASE_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_ID,
  BSC_CHAIN_ID,
  CELO_CHAIN_ID,
  SYMBIOSIS_CHAIN_ID,
} from "../../../../constants/chains";
import FormTradeAgent from "./form";
import { EAgentTrade, IFormValues } from "./interface";
import s from "./styles.module.scss";
import { AgentTradeContext } from "../provider";
import AppLoading from "@components/AppLoading";
import CAgentTradeContract from "@contract/agent-trade";
import { ETradePlatform } from "@pages/home/provider/interface";
import { compareString } from "@utils/string";
import { InfoToChainType } from "../provider/constant";
import { useDispatch, useSelector } from "react-redux";
import { commonSelector } from "@stores/states/common/selector";
import { agentsTradeSelector } from "@stores/states/agent-trade/selector";
import { requestReload } from "@stores/states/common/reducer";
import { IBodyEternalSwap } from "@contract/agent-trade/interface";
import BigNumber from "bignumber.js";
import { showMessage } from "@components/Toast/toast";
import { getExplorerByChain } from "@utils/helpers";
import { getErrorMessage } from "@utils/error";

export const SUPPORT_TRADE_CHAIN = [
  BASE_CHAIN_ID,
  ARBITRUM_CHAIN_ID,
  BSC_CHAIN_ID,
  APE_CHAIN_ID,
  AVAX_CHAIN_ID,
  CELO_CHAIN_ID,
  SYMBIOSIS_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_ID,
];

const FormTradeAgentContainer = () => {
  const { selectedAgent, tradePlatform } = useContext(AgentContext);
  const { pairs, fee } = useContext(AgentTradeContext);
  const agentTradeContract = useRef(new CAgentTradeContract()).current;
  const { currentChain } = useSelector(agentsTradeSelector);
  const dispatch = useDispatch();

  const onSubmit = async (values: IFormValues, actions: any) => {
    try {
      actions.setSubmitting(true);
      if (values.is_need_approve) {
        await agentTradeContract.approveToken({
          token_address: values?.current_token?.address as any,
          spender_address: compareString(
            tradePlatform,
            ETradePlatform.exchange3th
          )
            ? InfoToChainType[currentChain].swapRouter
            : InfoToChainType[currentChain].platformSwapRouter,
          chain: currentChain,
        });
      }

      const body: IBodyEternalSwap = {
        tokenIn: values.tokenIn.address,
        tokenOut: values.tokenOut.address,
        amount: values?.amount?.toString() as any,
        type: values.type,
        fee: fee,
        maximum: new BigNumber(values.estimate_swap)
          .multipliedBy(0.95)
          .toFixed(18),
        chain: currentChain,
      };

      if (compareString(tradePlatform, ETradePlatform.exchange3th)) {
        const tx: any = await agentTradeContract.swapIn3th(body);
        showMessage({
          message: `Place trade successfully.`,
          url: getExplorerByChain({
            chainId: selectedAgent?.token_network_id as any,
            type: "tx",
            address: tx || "",
          }) as any,
        });
      } else {
        const tx: any = await agentTradeContract.eternalSwap(body);
        showMessage({
          message: `Place trade successfully.`,
          url: getExplorerByChain({
            chainId: selectedAgent?.token_network_id as any,
            type: "tx",
            address: tx || "",
          }) as any,
        });
      }

      dispatch(requestReload());
    } catch (error) {
      console.error(error);
      showMessage({
        message: getErrorMessage(error).message,
        status: "error",
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Flex p={"24px"} flexDirection={"column"} gap={"24px"}>
      <Flex justifyContent={"space-between"}>
        <Flex
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          className={s.col}
        >
          <Text className={s.title}>Market cap</Text>
          <Text className={s.value}>
            {`$${formatCurrency(
              selectedAgent?.meme?.market_cap,
              0,
              3,
              "BTC",
              false,
              true
            )}`}
          </Text>
        </Flex>
        <Flex
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          className={s.col}
        >
          <Text className={s.title}>24H %</Text>
          <Percent24h
            percent={selectedAgent?.meme?.percent}
            clsName={s.value}
          />
        </Flex>
        <Flex
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          className={s.col}
        >
          <Text className={s.title}>Holder</Text>
          <Text className={s.value}>
            {`${formatCurrency(
              selectedAgent?.meme?.holders,
              0,
              3,
              "BTC",
              false,
              true
            )}`}
          </Text>
        </Flex>
      </Flex>

      {pairs?.length > 0 ? (
        <Formik
          initialValues={
            {
              type: EAgentTrade.BUY,
              current_token: pairs?.[0],
              is_need_approve: true,
              estimate_swap: "0",
            } as IFormValues
          }
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormTradeAgent />
            </Form>
          )}
        </Formik>
      ) : tradePlatform === ETradePlatform.none ? (
        selectedAgent?.meme?.trade_url ? (
          <Flex
            onClick={() =>
              globalThis.electronAPI.openExternal(selectedAgent?.meme?.trade_url)
            }
            className={s.btnTrade}
          >
            Buy ${selectedAgent?.token_symbol}
          </Flex>
        ) : (
          <></>
        )
      ) : (
        <AppLoading />
      )}
    </Flex>
  );
};

export default FormTradeAgentContainer;

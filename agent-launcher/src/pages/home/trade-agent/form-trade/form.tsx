/* eslint-disable indent */
import { Box, Button, Flex, Skeleton, Text } from "@chakra-ui/react";
import FieldAmountFormik from "@components/Form/Field.AmountFormik";
import InputWrapper from "@components/Form/inputWrapper";
import CAgentTradeContract from "@contract/agent-trade";
import { IToken } from "@interfaces/token";
import { AgentContext } from "@pages/home/provider";
import { ETradePlatform } from "@pages/home/provider/interface";
import { agentsTradeSelector } from "@stores/states/agent-trade/selector";
import { commonSelector } from "@stores/states/common/selector";
import { compareString, formatName, parseSymbolName } from "@utils/string";
import BigNumber from "bignumber.js";
import cx from "clsx";
import { Field, useFormikContext } from "formik";
import first from "lodash/first";
import last from "lodash/last";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { AgentTradeContext } from "../provider";
import BuySellChooseAmount from "./chooseAmount";
import { EAgentTrade, IFormValues } from "./interface";
import s from "./styles.module.scss";
import { InfoToChainType } from "../provider/constant";
import { useDebounce } from "@hooks/useDebounce";
import ERC20Balance from "@components/ERC20Balance";
import BuySellTokens from "./currentSelectToken";
import TextNumberTooSmallDecimal from "@components/TextNumberTooSmallDecimal";

const FormTradeAgent = () => {
  const agentContract = useRef(new CAgentTradeContract()).current;

  const { pairs, loading, fee } = useContext(AgentTradeContext);
  const { tradePlatform, selectedAgent } = useContext(AgentContext);
  const [estimating, setEstimating] = useState(false);
  const formik = useFormikContext();
  const { needReload } = useSelector(commonSelector);
  const { currentChain } = useSelector(agentsTradeSelector);

  const values = formik.values as IFormValues;
  const type = values.type;
  const amount = values.amount;
  const estimate_swap = values.estimate_swap;
  const is_need_approve = values.is_need_approve;
  const current_token = values.current_token;

  const amountDebounced: any = useDebounce(amount);

  const tokenList: IToken[] = useMemo(() => {
    return pairs;
  }, [pairs]);

  const getIsNeedApprove = async () => {
    try {
      if (!current_token) {
        formik.setFieldValue("is_need_approve", true);
        return;
      }
      const rs = await agentContract.isNeedApprove({
        token_address: current_token.address,
        spender_address: compareString(
          tradePlatform,
          ETradePlatform.exchange3th
        )
          ? InfoToChainType[currentChain].swapRouter
          : InfoToChainType[currentChain].platformSwapRouter,
        chain: currentChain,
      });

      formik.setFieldValue("is_need_approve", rs);
    } catch (error) {
      console.log("error getIsNeedApprove", error);

      formik.setFieldValue("is_need_approve", true);
      //
    }
  };

  useEffect(() => {
    if (compareString(type, EAgentTrade.BUY)) {
      formik.setFieldValue("tokenIn", first(tokenList));
      formik.setFieldValue("tokenOut", last(tokenList));
    } else {
      formik.setFieldValue("tokenOut", first(tokenList));
      formik.setFieldValue("tokenIn", last(tokenList));
    }
  }, [tokenList, type]);

  useEffect(() => {
    getIsNeedApprove();
  }, [current_token, needReload, tradePlatform, currentChain]);

  const getEstimateSwap = async (amount: string) => {
    try {
      setEstimating(true);
      const _amount = new BigNumber(
        new BigNumber(amount).toFixed(8)
      ).toString();

      if (!_amount || parseFloat(_amount) <= 0 || isNaN(parseFloat(_amount))) {
        return;
      }

      if (compareString(tradePlatform, ETradePlatform.eternal)) {
        const rs = await agentContract.runeEstimateSwap({
          tokenIn: values.tokenIn.address,
          tokenOut: values.tokenOut.address,
          amount: _amount.toString(),
          type: values.type,
          fee: fee,
          chain: currentChain,
        });
        formik.setFieldValue("estimate_swap", rs.amountOutFormatted);
      } else if (compareString(tradePlatform, ETradePlatform.exchange3th)) {
          const rs = await agentContract.uniEstimateSwap({
            tokenIn: values.tokenIn.address,
            tokenOut: values.tokenOut.address,
            amount: _amount.toString(),
            type: values.type,
            fee: fee,
            chain: currentChain,
          });
          formik.setFieldValue("estimate_swap", rs.amountOutFormatted);
      }
    } catch (error) {
      console.log("err", error);
    } finally {
      setEstimating(false);
    }
  };

  useEffect(() => {
    getEstimateSwap(amountDebounced as any);
  }, [amountDebounced, formik.values, fee, type, currentChain]);

  const validateAmount = useCallback(
    (value: any) => {
      if (!value) {
        return `Required`;
      }
      if (new BigNumber(value).gt(values?.balance || "0")) {
        return `Unsufficient balance.`;
      }

      return undefined;
    },
    [values?.balance]
  );

  const isDisabled = useMemo(() => {
    return (
      compareString(tradePlatform, ETradePlatform.none)
      || formik.isSubmitting
      || !amount
      || !estimate_swap
      || parseFloat(estimate_swap) <= 0
      || estimating
      || validateAmount(amount) !== undefined
      || loading
    );
  }, [
    tradePlatform,
    formik.isSubmitting,
    amount,
    estimate_swap,
    estimating,
    loading,
  ]);

  const btnLabel = useMemo(() => {
    let title = "Enter an amount";

    if (
      parseFloat(amount || "0") > 0
      && validateAmount(amount) === undefined
      && parseFloat(estimate_swap) > 0
    ) {
      title = compareString(type, EAgentTrade.BUY)
        ? "Buy"
        : is_need_approve
        ? "Approve and sell"
        : "Sell";
    }
    return title;
  }, [is_need_approve, amount, estimate_swap, type, values]);

  return (
    <Flex className={s.formContainer}>
      <Flex className={s.switch}>
        <Box
          className={compareString(type, EAgentTrade.BUY) ? s.buy : ""}
          onClick={() => {
            formik.setFieldValue("type", EAgentTrade.BUY);
            formik.setFieldValue("current_token", first(tokenList));
          }}
        >
          <Text fontSize="18px !important">Buy</Text>
        </Box>
        <Box
          className={compareString(type, EAgentTrade.SELL) ? s.sell : ""}
          onClick={() => {
            formik.setFieldValue("type", EAgentTrade.SELL);
            formik.setFieldValue("current_token", last(tokenList));
          }}
        >
          <Text fontSize="18px !important">Sell</Text>
        </Box>
      </Flex>
      <InputWrapper
        label="Amount"
        labelColor={"rgba(0, 0, 0, 0.7)"}
        className={s.inputAmountWrapper}
        rightLabel={
          <Flex
            onClick={() => formik.setFieldValue("amount", values.balance)}
            gap={"2px"}
            alignItems={"center"}
          >
            <Text
              fontWeight={400}
              fontSize={"14px"}
              color={"rgba(0, 0, 0, 0.6)"}
            >
              Balance:
            </Text>
            <ERC20Balance
              token={current_token}
              maxDecimal={5}
              onBalanceChange={(_amount) =>
                formik.setFieldValue("balance", _amount)
              }
              chain={currentChain}
            />
            <Text color={"#000"} fontWeight={500} fontSize={"14px"}>
              {formatName(parseSymbolName(current_token)?.symbol as string, 50)}
            </Text>
          </Flex>
        }
      >
        <Field
          component={FieldAmountFormik}
          name="amount"
          placeholder={"0.0"}
          precision={8}
          min={1e-8}
          step={1e-8}
          rightComp={<BuySellTokens tokenExtra={selectedAgent} />}
          validate={validateAmount}
        />
      </InputWrapper>
      <BuySellChooseAmount />
      <Flex my={"12px"} flexDirection={"column"}>
        <Flex gap={"2px"} alignItems={"center"}>
          <Text fontWeight={400} fontSize={"14px"} color={"#657786"}>
            Receive:
          </Text>
          {Boolean(estimate_swap) && (
            <>
              {estimating ? (
                <Skeleton height={"10px"} width={"20px"} />
              ) : (
                <TextNumberTooSmallDecimal
                  value={estimate_swap}
                  style={{ fontSize: "14px" }}
                  symbol={
                    parseSymbolName({
                      symbol: values.tokenOut?.symbol,
                      name: values.tokenOut?.symbol,
                    } as any)?.symbol
                  }
                  decimals={4}
                />
              )}
            </>
          )}
        </Flex>
      </Flex>
      <Button
        type="submit"
        isDisabled={isDisabled}
        isLoading={formik.isSubmitting}
        loadingText={"Processing"}
        className={cx(
          s.btnSubmit,
          compareString(type, EAgentTrade.BUY) ? s.buy : s.sell
        )}
      >
        {btnLabel}
      </Button>
    </Flex>
  );
};

export default FormTradeAgent;

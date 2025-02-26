import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";
import s from "./styles.module.scss";
import { Field, useFormikContext } from "formik";
import { compareString } from "@utils/string";
import { EAgentTrade, IFormValues } from "./interface";
import InputWrapper from "@components/Form/inputWrapper";
import FieldAmountFormik from "@components/Form/Field.AmountFormik";
import BuySellChooseAmount from "./chooseAmount";
import BigNumber from "bignumber.js";
import cx from "clsx";

const FormTradeAgent = () => {
  const formik = useFormikContext();

  const values = formik.values as IFormValues;
  const type = values.type;
  const amount = values.amount;
  const estimate_swap = values.estimate_swap;
  const is_need_approve = values.is_need_approve;

  const validateAmount = useCallback(
    (value: any) => {
      if (!value) {
        return `Required`;
      }
      if (new BigNumber(value).gt(values?.balance)) {
        return `Unsufficient balance.`;
      }

      return undefined;
    },
    [values?.balance]
  );

  const btnLabel = useMemo(() => {
    let title = "Enter an amount";

    if (
      parseFloat(amount) > 0 &&
      validateAmount(amount) === undefined &&
      parseFloat(estimate_swap) > 0
    ) {
      title = compareString(type, EAgentTrade.BUY)
        ? "Buy"
        : is_need_approve
        ? "Approve and sell"
        : "Sell";
    }
    return title;
  }, [is_need_approve, amount, validateAmount, estimate_swap, type, values]);

  return (
    <Flex className={s.formContainer}>
      <Flex className={s.switch}>
        <Box
          className={compareString(type, EAgentTrade.BUY) ? s.buy : ""}
          onClick={() => {
            formik.setFieldValue("type", EAgentTrade.BUY);
            // formik.setFieldValue("current_token", first(tokenList));
          }}
        >
          <Text fontSize="18px !important">Buy</Text>
        </Box>
        <Box
          className={compareString(type, EAgentTrade.SELL) ? s.sell : ""}
          onClick={() => {
            formik.setFieldValue("type", EAgentTrade.SELL);
            // formik.setFieldValue("current_token", last(tokenList));
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
              color={"rgba(255, 255, 255, 0.6)"}
            >
              Balance:
            </Text>
            {/* <ERC20Balance
              token={current_token}
              maxDecimal={5}
              onBalanceChange={(_amount) =>
                formik.setFieldValue("balance", _amount)
              }
              chain={currentChain}
            />
            <Text color={"#fff"} fontWeight={500} fontSize={"14px"}>
              {formatName(parseSymbolName(current_token)?.symbol as string, 50)}
            </Text> */}
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
          //   rightComp={<BuySellTokens tokenExtra={pumpToken} />}
          //   validate={validateAmount}
        />
      </InputWrapper>
      <BuySellChooseAmount />
      <Button
        type="submit"
        //   isDisabled={isDisabled}
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

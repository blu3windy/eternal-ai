import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import s from "./styles.module.scss";
import { Field, useFormikContext } from "formik";
import { compareString } from "@utils/string";
import { EAgentTrade, IFormValues } from "./interface";
import InputWrapper from "@components/Form/inputWrapper";
import FieldAmountFormik from "@components/Form/Field.AmountFormik";

const FormTradeAgent = () => {
  const formik = useFormikContext();

  const values = formik.values as IFormValues;
  const type = values.type;
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
        labelColor={"#fff"}
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
    </Flex>
  );
};

export default FormTradeAgent;

import { Flex, Text } from "@chakra-ui/react";
import Percent24h from "@components/Percent";
import { formatCurrency } from "@utils/format";
import { Form, Formik } from "formik";
import FormTradeAgent from "./form";
import { EAgentTrade, IFormValues } from "./interface";
import s from "./styles.module.scss";
import { useContext } from "react";
import { AgentContext } from "@pages/home/provider";
import Curving from "../curving";
import {
  BASE_CHAIN_ID,
  SYMBIOSIS_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_ID,
} from "../../../../constants/chains";

export const SUPPORT_TRADE_CHAIN = [
  BASE_CHAIN_ID,
  SYMBIOSIS_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_ID,
];

const FormTradeAgentContainer = () => {
  const { selectedAgent } = useContext(AgentContext);

  const onSubmit = async (values: IFormValues, actions: any) => {
    try {
      actions.setSubmitting(true);
    } catch (error) {
      console.error(error);
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
      <Formik
        initialValues={
          {
            type: EAgentTrade.BUY,
            current_token: undefined,
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
      <Curving />
    </Flex>
  );
};

export default FormTradeAgentContainer;

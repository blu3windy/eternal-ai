import { Flex, SimpleGrid, Text } from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import cs from "classnames";
import { useFormikContext } from "formik";
import s from "./styles.module.scss";

const PERCENTS = [10, 20, 50, 100];

const BuySellChooseAmount = () => {
  const formik: any = useFormikContext();

  const active = (_a: any) => {
    return new BigNumber(
      new BigNumber(formik.values.amount)
        .dividedBy(formik.values.balance)
        .multipliedBy(100)
        .toFixed(8, BigNumber.ROUND_DOWN)
    ).isEqualTo(_a);
  };

  return (
    <SimpleGrid gap={"8px"} columns={PERCENTS.length}>
      {PERCENTS.map((a: any, i) => (
        <Flex
          className={cs(
            s.itemChooseAmount,
            active(a) ? s.itemChooseAmountActive : ""
          )}
          cursor={"pointer"}
          onClick={() => {
            formik.setFieldValue(
              "amount",
              new BigNumber(
                new BigNumber(a)
                  .multipliedBy(formik.values.balance)
                  .dividedBy(100)
                  .toFixed(8, BigNumber.ROUND_DOWN)
              ).toString()
            );
          }}
          key={a}
        >
          <Text>{i === PERCENTS.length - 1 ? "Max" : `${a}%`} </Text>
        </Flex>
      ))}
    </SimpleGrid>
  );
};

export default BuySellChooseAmount;

import { Text } from "@chakra-ui/react";
import { formatCurrency } from "@utils/format";
import clsx from "clsx";
import s from "./styles.module.scss";

const Percent24h = ({
  percent = 0,
  clsName,
}: {
  percent?: number;
  clsName?: string;
}) => {
  let cls = s.normal;
  if (percent < 0) {
    cls = s.low;
  } else if (percent >= 0) {
    cls = s.hight;
  }
  return (
    <Text className={clsx(s.percent, cls, clsName)}>
      {percent >= 0 ? "+" : "-"}
      {Math.abs(percent) > 0 ? formatCurrency(Math.abs(percent), 2, 2) : ""}%
    </Text>
  );
};

export default Percent24h;

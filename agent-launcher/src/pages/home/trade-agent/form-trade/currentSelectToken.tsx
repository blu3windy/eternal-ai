import { Flex, Image, Text } from "@chakra-ui/react";
import { IToken } from "@interfaces/token";
import {
  compareString,
  formatName,
  getTokenIconUrl,
  parseSymbolName,
  TOKEN_ICON_DEFAULT,
} from "@utils/string";
import { useFormikContext } from "formik";
import { IFormValues } from "./interface";

export const ItemBuySellToken = ({
  item,
  isFormatName,
  tokenExtra,
}: {
  item: IToken | undefined;
  isFormatName?: boolean;
  tokenExtra?: any;
}) => {
  return (
    <Flex alignItems={"center"} gap={"8px"}>
      <Image
        borderRadius={"100px"}
        width={"24px"}
        height={"24px"}
        src={
          compareString(getTokenIconUrl(item), TOKEN_ICON_DEFAULT)
            ? getTokenIconUrl(tokenExtra)
            : getTokenIconUrl(item)
        }
      />
      <Text fontSize={"14px"} fontWeight={"500"}>
        {formatName(
          parseSymbolName(item)?.symbol as string,
          isFormatName ? 6 : 99
        )}
      </Text>
    </Flex>
  );
};

const BuySellTokens = ({ tokenExtra }: any) => {
  const formik = useFormikContext();

  const values = formik.values as IFormValues;
  const current_token = values.current_token;

  if (!current_token) {
    return;
  }

  return (
    <ItemBuySellToken
      isFormatName={true}
      item={current_token}
      tokenExtra={tokenExtra}
    />
  );
};

export default BuySellTokens;

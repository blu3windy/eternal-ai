import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { AgentContext } from "@pages/home/provider";
import { formatAddressCenter } from "@utils/format";
import { getExplorerByChain } from "@utils/helpers";
import { useContext } from "react";
import s from "./styles.module.scss";

const AgentOnChainInfo = () => {
  const { selectedAgent } = useContext(AgentContext);
  return (
    <Box>
      <Text>Agent onchain data</Text>
      <Flex className={s.row}>
        <Text className={s.label}>Owner</Text>
        <Text
          className={s.value}
          as={"a"}
          onClick={() => {
            window.electron.openExternal(
              `${getExplorerByChain({
                chainId: selectedAgent?.token_network_id as any,
                type: "address",
                address: selectedAgent?.creator,
              })}`
            );
          }}
        >
          {formatAddressCenter(selectedAgent?.creator)}
          <Image src="/icons/ic-arrow-top-right.svg" />
        </Text>
      </Flex>
    </Box>
  );
};

export default AgentOnChainInfo;

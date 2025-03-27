import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { formatAddressCenter } from "@utils/format";
import { getExplorerByChain } from "@utils/helpers";
import { useContext } from "react";
import s from "./styles.module.scss";

const AgentOnChainInfo = () => {
   const { selectedAgent } = useContext(AgentContext);

   return (
      <Box>
         <Text fontSize={"16px"} fontWeight={500}>Agent onchain data</Text>
         <Flex className={s.rowData}>
            <Text className={s.left}>Owner</Text>
            <Text
               className={s.right}
               as={"a"}
               onClick={() => {
                  globalThis.electronAPI.openExternal(
                     `${getExplorerByChain({
                        chainId: selectedAgent?.token_network_id as any,
                        type: "address",
                        address: selectedAgent?.creator || "",
                     })}`
                  );
               }}
            >
               {formatAddressCenter(selectedAgent?.creator)}
               <Image src="icons/ic-arrow-top-right.svg" />
            </Text>
         </Flex>

         <Flex className={s.rowData}>
            <Text className={s.left}>Contract</Text>
            <Text
               target="_blank"
               href={`${getExplorerByChain({
                  chainId: selectedAgent?.network_id as any,
                  type: "address",
                  address: selectedAgent?.agent_contract_address || "",
               })}`}
               className={s.right}
               as={"a"}
            >
               {formatAddressCenter(selectedAgent?.agent_contract_address)}
            </Text>
         </Flex>
         <Flex className={s.rowData}>
            <Text className={s.left}>ID</Text>
            <Text className={s.right}>{selectedAgent?.id}</Text>
         </Flex>
         <Flex className={s.rowData}>
            <Text className={s.left}>Standard</Text>
            <Text
               className={s.right}
               target="_blank"
               as="a"
               href="https://github.com/eternalai-org/eternal-ai/blob/master/decentralized-agents/contracts/standards/AI721.sol"
            >
               {"AI-721"}
            </Text>
         </Flex>
         <Flex className={s.rowData}>
            <Text className={s.left}>Token Contract Address</Text>
            <Text
               target="_blank"
               href={`${getExplorerByChain({
                  chainId: selectedAgent?.token_network_id as any,
                  type: "address",
                  address: selectedAgent?.token_address || "",
               })}`}
               className={s.right}
               as={"a"}
            >
               {formatAddressCenter(selectedAgent?.token_address!)}
            </Text>
         </Flex>
         <Flex className={s.rowData}>
            <Text className={s.left}>Chain</Text>
            <Text className={s.right}>{selectedAgent?.token_network_name}</Text>
         </Flex>
      </Box>
   );
};

export default AgentOnChainInfo;

import { Flex, Image, Text } from "@chakra-ui/react";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { getExplorerByChain } from "@utils/helpers";
import { useContext, useEffect, useState } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Avatar from '@components/Avatar';
import Jazzicon from "react-jazzicon";
import { addressFormater } from "@utils/string";
import CAgentTokenAPI from "@services/api/agents-token";

const AgentHeaderInfo = () => {
   const { selectedAgent } = useContext(AgentContext);
   const [isLiked, setIsLiked] = useState(false);
   const cAgentTokenAPI = new CAgentTokenAPI();

   const handleClickCreator = () => {
      globalThis.electronAPI.openExternal(
         `${getExplorerByChain({
            chainId: selectedAgent?.network_id as any,
            type: "address",
            address: selectedAgent?.creator || "",
         })}`
      );
   };

   const handleLikeAgent = async () => {
      if (isLiked || !selectedAgent?.id) return;

      await cAgentTokenAPI.likeAgent(selectedAgent.id);
      setIsLiked(true);
   };

   const checkIsLiked = async () => {
      if (!selectedAgent?.id) return;
      const res = await cAgentTokenAPI.checkAgentIsLiked(selectedAgent?.id);
      setIsLiked(res);
   };

   useEffect(() => {
      checkIsLiked();
   }, [selectedAgent]);

   return (
      <Flex direction={'column'} gap={'8px'}>
         <Flex
            alignItems={'center'}
            gap={'8px'}
            justifyContent={'space-between'}
         >
            <Flex direction={'column'} gap={'8px'}>
               <Text fontSize={'16px'} fontWeight={500}>
                  {selectedAgent?.display_name || selectedAgent?.agent_name}
               </Text>
               <Flex
                  alignItems="center"
                  gap="4px"
                  onClick={handleClickCreator}
               >
                  <Text
                     color="#000000"
                     fontSize="12px"
                     fontWeight="400"
                     opacity={0.7}
                  >
                     by
                  </Text>
                  {selectedAgent?.tmp_twitter_info?.twitter_avatar ? (
                     <Avatar
                        url={
                           selectedAgent?.tmp_twitter_info?.twitter_avatar || ""
                        }
                        width={16}
                     />
                  ) : (
                     <Jazzicon
                        diameter={16}
                        seed={jsNumberForAddress(
                           selectedAgent?.creator || ''
                        )}
                     />
                  )}
                  <Text
                     color="#000000"
                     fontSize="12px"
                     fontWeight="400"
                     opacity={0.7}
                  >
                     {selectedAgent?.tmp_twitter_info?.twitter_username
                        ? `@${selectedAgent?.tmp_twitter_info?.twitter_username}`
                        : addressFormater(selectedAgent?.creator)}
                  </Text>
               </Flex>
            </Flex>
            <Image
               src={`icons/${isLiked ? 'ic-liked.svg' : 'ic-like.svg'}`}
               width={'28px'}
               height={'28px'}
               onClick={handleLikeAgent}
               cursor={isLiked ? 'not-allowed' : 'pointer'}
            />
         </Flex>
      </Flex>
   );
};

export default AgentHeaderInfo;
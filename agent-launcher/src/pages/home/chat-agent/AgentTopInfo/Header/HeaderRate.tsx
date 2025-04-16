import { Flex, Image, Text } from "@chakra-ui/react";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { getExplorerByChain } from "@utils/helpers";
import { useContext, useEffect, useState } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Avatar from '@components/Avatar';
import Jazzicon from "react-jazzicon";
import { addressFormater } from "@utils/string";
import CAgentTokenAPI from "@services/api/agents-token";

const Star = (params: { isChecked: boolean }) => {
   const { isChecked } = params;
   if (isChecked) {
      return (
         <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
            <g clip-path="url(#clip0_55209_5325)">
               <path d="M11.9982 4.99914H7.40033L6.00008 0.525391L4.59983 4.99914H0.00195312L3.66533 7.75202L2.22045 12.1995L6.00008 9.45339L9.7797 12.1995L8.33483 7.75202L11.9982 4.99914Z" fill="black"/>
            </g>
            <defs>
               <clipPath id="clip0_55209_5325">
                  <rect width="12" height="12" fill="white" transform="translate(0 0.5)"/>
               </clipPath>
            </defs>
         </svg>
      )
   }

   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
         <g clip-path="url(#clip0_55209_5334)">
            <path d="M6.92315 5.14849L7.03291 5.49914H7.40033H10.5005L8.03445 7.3523L7.74895 7.56684L7.85929 7.9065L8.82873 10.8905L6.29397 9.04889L6.00008 8.83535L5.70618 9.04889L3.17143 10.8905L4.14086 7.9065L4.25121 7.56684L3.9657 7.3523L1.49962 5.49914H4.59983H4.96725L5.077 5.14849L6.00008 2.19929L6.92315 5.14849Z" stroke="black"/>
         </g>
         <defs>
            <clipPath id="clip0_55209_5334">
               <rect width="12" height="12" fill="white" transform="translate(0 0.5)"/>
            </clipPath>
         </defs>
      </svg>
   )
}

const AgentHeaderRate = () => {
   const { selectedAgent } = useContext(AgentContext);
   const [isLiked, setIsLiked] = useState(false);
   const cAgentTokenAPI = new CAgentTokenAPI();

   const renderStars = (rating: number) => {
      return Array.from({ length: 5 }, (_, index) => (
         <Star isChecked={index < rating} key={index} />
      ));
   }

   return (
      <Flex direction="column" gap="4px">
         <Flex 
            w="100%" 
            justifyContent="space-between" 
            fontSize="16px" 
            fontWeight={500} 
            color="black"
         >
            <Text as="span">
               {selectedAgent?.display_name || selectedAgent?.agent_name}
            </Text>
            <Text as="span">
               {selectedAgent?.rating}
            </Text>
         </Flex>
         <Flex
            w="100%"
            justifyContent="space-between"
            alignItems="center"
         >
            <Text
               color="black"
               fontSize="12px"
               fontWeight="400"
               opacity={0.7}
            >
               by {" "}
               <Text as="span">
                  {selectedAgent?.tmp_twitter_info?.twitter_username
                     ? `@${selectedAgent?.tmp_twitter_info?.twitter_username}`
                     : addressFormater(selectedAgent?.creator)}
               </Text>
            </Text>
            <Flex gap="4px">
               {renderStars(selectedAgent?.rating)}
            </Flex>
         </Flex>
         <Flex
            alignItems="center"
            justifyContent="space-between"
            marginTop="4px"
         >
            <Text
               color="#5400FB"
               fontSize="14px"
               fontWeight="400"
               cursor="pointer"
               textDecoration="underline"
               transition="opacity 0.3s ease"
               _hover={{
                  opacity: 0.9
               }}
            >
               View description
            </Text>
            <Text
               color="#5400FB"
               fontSize="14px"
               fontWeight="400"
               cursor="pointer"
               textDecoration="underline"
               transition="opacity 0.3s ease"
               _hover={{
                  opacity: 0.9
               }}
            >
               Rate
            </Text>
         </Flex>
      </Flex>
   );
};

export default AgentHeaderRate;
import { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import eaiCrypto from "@utils/crypto";
import { safeCopy } from "@utils/copy.ts";

interface IProps {
    onNext: (_: string) => void;
}

const Backup = (props: IProps) => {
   const { onNext } = props;
   const [prvKey, setPrvKey] = useState("");
   const [backedUp, setBackedUp] = useState(false);
   const [showKey, setShowKey] = useState(false);

   console.log("prvKey", prvKey);

   const generatePrvKey = () => {
      const prvKey = eaiCrypto.generatePrivateKey();
      setPrvKey(prvKey);
   }

   useEffect(() => {
      generatePrvKey();
   }, []);

   return (
      <Flex
         flexDirection="column"
         alignItems="center"
         gap="80px"
      >
         <Flex
            flexDirection="column"
            alignItems="center"
            gap="24px"
         >
            <Text
               fontSize="48px"
               fontWeight="500"
               lineHeight="58px"
            >
               Backup private key
            </Text>
            <Text
               fontSize="24px"
               fontWeight="400"
               lineHeight="34px"
            >
               Your private key makes it easy to back up and restore your account.
            </Text>
         </Flex>
         <Flex
            flexDirection="column"
            gap="6px"
            alignItems="start"
            width="100%"
         >
            <Text
               fontSize="12px"
               fontWeight="500"
               lineHeight="20px"
               color="#5B5B5B"
            >
                YOUR PRIVATE KEY
            </Text>
            <Box
               padding="48px"
               borderRadius="8px"
               backgroundColor="#EFEFEF"
               minW="800px"
               position="relative"
               overflow="hidden"
               cursor="pointer"
            >
               <Text
                  fontSize="16px"
                  fontWeight="400"
                  lineHeight="20px"
                  color="#000000"
                  textAlign="center"
                  onClick={() => {
                     alert("Copied to clipboard");
                  }}
               >
                  {prvKey}
               </Text>
               {!showKey && (
                  <Flex
                     position="absolute"
                     top="0"
                     right="0"
                     left="0"
                     bottom="0"
                     cursor="pointer"
                     justifyContent="center"
                     alignItems="center"
                     backgroundColor="#EFEFEF"
                     transition="all 0.4s ease-in-out"
                     onClick={() => {
                        safeCopy(prvKey).then(() => {
                           alert("Copied to clipboard");
                        });
                     }}
                  >
                     <Text
                        color="#5B5B5B"
                        fontSize="18px"
                        fontWeight="500"
                        opacity="0.8"
                     >
                         Show private key
                     </Text>
                  </Flex>
               )}
            </Box>
         </Flex>

      </Flex>
   )
}

export default Backup;
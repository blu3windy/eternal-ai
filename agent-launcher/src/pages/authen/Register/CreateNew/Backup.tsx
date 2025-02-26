import { useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import eaiCrypto from "@utils/crypto";
import { safeCopy } from "@utils/copy.ts";
import BaseButton from "@components/BaseButton";

interface IProps {
   onNext: (_: string) => void;
   prvKey: string;
}

const Backup = (props: IProps) => {
   const [prvKey, setPrvKey] = useState(props.prvKey);
   const [backedUp, setBackedUp] = useState(false);
   const [showKey, setShowKey] = useState(false);

   const _onNext = () => {
      props.onNext(prvKey);
   }
   const generatePrvKey = () => {
      const prvKey = eaiCrypto.generatePrivateKey();
      setPrvKey(prvKey);
   }

   const onCopy = () => {
      safeCopy(prvKey).then(() => {
         const message = "Private key copied! For security, it will be cleared from your clipboard in 5 seconds.";
         alert(message);
         setBackedUp(true);
      });
   }

   useEffect(() => {
      if (!prvKey) {
         generatePrvKey();
      }
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
               color="#2E2E2E"
            >
               Your private key makes it easy to back up and restore your account.
            </Text>
         </Flex>
         <Flex
            flexDirection="column"
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
            <Flex
               padding="48px"
               borderRadius="8px"
               backgroundColor="#EFEFEF"
               minW="800px"
               position="relative"
               overflow="hidden"
               marginTop="6px"
               justifyContent="center"
               alignItems="center"
            >
               <Text
                  fontSize="16px"
                  fontWeight="400"
                  lineHeight="20px"
                  color="#000000"
                  textAlign="center"
                  userSelect="none"
               >
                  {prvKey}
               </Text>
               <Image
                  width="24px"
                  height="24px"
                  marginLeft="8px"
                  cursor="pointer"
                  onClick={() => {
                     onCopy();
                  }}
                  _hover={{
                     opacity: 0.8,
                     transform: "scale(1.1)",
                     transition: "all 0.4s ease-in-out"
                  }}
                  src="/icons/ic_copy.svg"
               />
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
                        setShowKey(true);
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
            </Flex>
            <Box
               padding="6px 16px"
               alignSelf="center"
               borderRadius="8px"
               border="1px solid #FF7E21"
               marginTop="24px"
            >
               <Text
                  color="#FF7E21"
                  fontSize="14px"
                  fontWeight="500"
               >
                  Never share this key with anyone; if they have it, your account is compromised.
               </Text>
            </Box>
         </Flex>
         <BaseButton
            width="400px !important"
            isDisabled={!backedUp}
            onClick={_onNext}
         >
            {backedUp ? "Continue" : "Please backup your key first"}
         </BaseButton>
      </Flex>
   )
}

export default Backup;
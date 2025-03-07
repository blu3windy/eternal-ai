import { useEffect, useState } from "react";
import { Box, Button, Flex, Image, Text, useToast } from "@chakra-ui/react";
import eaiCrypto from "@utils/crypto";
import { safeCopy } from "@utils/copy.ts";
import BaseButton from "@components/BaseButton";
import HeaderBox from "@pages/authen/components/HeaderBox";

interface IProps {
   onNext: (_: string) => void;
   onBack: () => void;
   prvKey: string;
}

const Backup = (props: IProps) => {
   const [prvKey, setPrvKey] = useState(props.prvKey);
   const [backedUp, setBackedUp] = useState(false);
   const [showKey, setShowKey] = useState(false);
   const toast = useToast()

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
         toast({
            title: message,
            status: "success",
            duration: 2000,
            isClosable: true,
         })
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
         gap="32px"
      >
         <HeaderBox
            title="Create a new account"
            description={["Your private key makes it easy to back up and restore your account."]}
            maxWidth="380px"
         />
         <Flex
            flexDirection="column"
            alignItems="start"
            width="100%"
         >
            <Flex
               padding="48px"
               borderRadius="28px"
               backgroundColor="rgba(255, 255, 255, 1)"
               width="600px"
               position="relative"
               overflow="hidden"
               marginTop="6px"
               justifyContent="center"
               alignItems="center"
               border="1px dashed #E1DDDD"
               flexDirection="column"
               gap="20px"
            >
               <Text
                  fontSize="16px"
                  fontWeight="400"
                  lineHeight="20px"
                  color="rgba(0, 0, 0, 0.6)"
                  textAlign="center"
                  userSelect="none"
                  style={{
                     lineBreak: "anywhere"
                  }}
               >
                  {prvKey}
               </Text>
               <Button
                  gap="8px"
                  alignItems="center"
                  padding="10px 12px"
                  bg="#F3F0F0"
                  height="28px"
                  onClick={() => {
                     onCopy();
                  }}
               >
                  <Text fontSize="14px" fontWeight="400">
                     Copy
                  </Text>
                  <Image
                     width="16px"
                     height="16px"
                     _hover={{
                        opacity: 0.8,
                        transform: "scale(1.1)",
                        transition: "all 0.4s ease-in-out"
                     }}
                     src="/icons/ic_copy.svg"
                  />
               </Button>
               {!showKey && (
                  <Flex
                     position="absolute"
                     top="0"
                     right="0"
                     left="0"
                     bottom="0"
                     justifyContent="center"
                     alignItems="center"
                     backgroundColor="rgba(255, 255, 255, 1)"
                     transition="all 0.4s ease-in-out"
                  >
                     <BaseButton
                        maxW="fit-content"
                        cursor="pointer"
                        gap="8px"
                        onClick={() => {
                           setShowKey(true);
                        }}
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                           <path
                              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                              fill="white"/>
                           <path
                              d="M18.5072 6.61781C16.4578 5.2125 14.2645 4.5 11.9887 4.5C9.94078 4.5 7.94438 5.10937 6.05484 6.30375C4.14937 7.51078 2.28141 9.70312 0.75 12C1.98844 14.0625 3.6825 16.1831 5.44687 17.3991C7.47094 18.7931 9.67172 19.5 11.9887 19.5C14.2856 19.5 16.4817 18.7936 18.5184 17.4005C20.3114 16.1719 22.0177 14.0541 23.25 12C22.0134 9.96422 20.3016 7.84875 18.5072 6.61781ZM12 16.5C11.11 16.5 10.24 16.2361 9.49993 15.7416C8.75991 15.2471 8.18314 14.5443 7.84254 13.7221C7.50195 12.8998 7.41283 11.995 7.58647 11.1221C7.7601 10.2492 8.18868 9.44736 8.81802 8.81802C9.44736 8.18868 10.2492 7.7601 11.1221 7.58647C11.995 7.41283 12.8998 7.50195 13.7221 7.84254C14.5443 8.18314 15.2471 8.75991 15.7416 9.49993C16.2361 10.24 16.5 11.11 16.5 12C16.4986 13.1931 16.0241 14.3369 15.1805 15.1805C14.3369 16.0241 13.1931 16.4986 12 16.5Z"
                              fill="white"/>
                        </svg>
                        <Text
                           color="white"
                           fontSize="16px"
                           fontWeight="500"
                        >
                           Show private key
                        </Text>
                     </BaseButton>
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
         <Flex
            flexDirection="column"
            alignItems="center"
            gap="16px"
         >
            {backedUp && (
               <BaseButton
                  width="400px !important"
                  isDisabled={!backedUp}
                  onClick={_onNext}
               >
                  {backedUp ? "Continue" : "Please backup your key first"}
               </BaseButton>
            )}
            <Text
               fontSize="14px"
               fontWeight="400"
               color="rgba(0, 0, 0, 0.7)"
               cursor="pointer"
               onClick={() => {
                  props.onBack();
               }}
            >
               Cancel
            </Text>
         </Flex>
      </Flex>
   )
}

export default Backup;
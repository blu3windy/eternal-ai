import { Flex, Image, Text } from "@chakra-ui/react";
import BaseButton from "@components/BaseButton";
import { RegisterType } from "@pages/authen/Register/types.ts";

interface IProps {
   setRegisterType: (_: RegisterType) => void;
}

const Introduce = ({ setRegisterType }: IProps) => {
   return (
      <Flex
         display="flex"
         flexDirection="column"
         alignItems="center"
         gap="32px"
      >
         <Flex
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="16px"
         >
            <Text
               fontSize="28px"
               fontWeight="500"
               lineHeight="160%"
               color="rgba(0, 0, 0, 1)"
            >
               Create a new account
            </Text>
            <Text
               fontSize="18px"
               fontWeight="400"
               lineHeight="160%"
               color="rgba(0, 0, 0, 0.7)"
            >
               Experience AI in a decentralized, trustless, unstoppable way.
            </Text>
         </Flex>
         <Flex
            width="100%"
            maxW="228px"
            flexDirection="column"
            alignItems="center"
            gap="16px"
         >
            <BaseButton
               onClick={() => setRegisterType(RegisterType.create)}
            >
               Create
            </BaseButton>
            <Flex
               alignItems="center"
               gap="6px"
               cursor="pointer"
            >
               <Image
                  src="icons/ic-import.svg"
                  alt="ic-import"
                  width="20px"
                  height="20px"
               />
               <Text
                  as="a"
                  fontSize="14px"
                  fontWeight="400"
                  color="rgba(0, 0, 0, 0.6)"
                  onClick={() => setRegisterType(RegisterType.import)}
               >
                  Import an existing account
               </Text>
            </Flex>
         </Flex>
      </Flex>
   );
};

export default Introduce;
import { FC } from "react";
import { Flex, Text } from "@chakra-ui/react";
import BaseButton from "@components/BaseButton";
import { RegisterType } from "@pages/authen/Register/types.ts";

interface IProps {
   setRegisterType: (_: RegisterType) => void;
}

const Introduce = ({ setRegisterType, ...rest }: IProps) => {
   console.log("setRegisterType", rest)
   return (
      <Flex
         display="flex"
         flexDirection="column"
         alignItems="center"
         gap="60px"
      >
         <Flex
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="16px"
         >
            <Text
               fontSize="48px"
               fontWeight="600"
               lineHeight="58px"
            >
            Create a new account
            </Text>
            <Text
               fontSize="24px"
               fontWeight="400"
               lineHeight="34px"
            >
            Experience AI in a decentralized, trustless, unstoppable way.
            </Text>
         </Flex>
         <Flex
            width="100%"
            maxW="400px"
            flexDirection="column"
            alignItems="center"
            gap="24px"
         >
            <BaseButton
               onClick={() => setRegisterType(RegisterType.create)}
            >
               Create
            </BaseButton>
            <Text
               as="a"
               textDecoration="underline"
               fontSize="16px"
               fontStyle="italic"
               fontWeight="400"
               cursor="pointer"
               onClick={() => setRegisterType(RegisterType.import)}
            >
               Import an existing account
            </Text>
         </Flex>
      </Flex>
   );
};

export default Introduce;
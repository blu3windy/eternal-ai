import { Flex, Image, Text } from "@chakra-ui/react";
import BaseButton from "@components/BaseButton";
import { RegisterType } from "@pages/authen/Register/types.ts";
import HeaderBox from "@pages/authen/components/HeaderBox";

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
         <HeaderBox
            title="Create a new account"
            description={[
               "Experience AI in a decentralized, trustless, unstoppable way."
            ]}
         />
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
import { Flex, Input, Text, InputProps, Image } from '@chakra-ui/react';
import { ReactNode, useState } from "react";

export interface IProps extends InputProps{
    header: {
        label: string | ReactNode | undefined;
        value?: string | ReactNode | undefined;
    }
}

const InputPassword = (props: IProps) => {
   const { header, ...rest } = props;

   const [showPassword, setShowPassword] = useState(false);

   return (
      <Flex
         flexDirection="column"
         gap="6px"
         width="100%"
      >
         <Text
            as="label"
            fontSize="12px"
            fontWeight="500"
            color="#2E2E2E"
         >
            {header.label}
         </Text>
         <Flex flex="1" width="100%" position="relative">
            <Input
               borderRadius="8px"
               border="1px solid #B6B6B6"
               type={showPassword ? "text" : "password"}
               padding="12px 14px"
               fontSize="16px"
               lineHeight="160%"
               {...rest}
            />
            <Image
               src={showPassword ? "icons/ic_eye_hide.svg" : "icons/ic_eye_open.svg"}
               width="20px"
               height="20px"
               position="absolute"
               right="12px"
               top="50%"
               transform="translateY(-50%)"
               cursor="pointer"
               zIndex="2"
               onClick={() => setShowPassword(!showPassword)}
               transition="opacity 0.4s ease-in-out"
               _hover={{
                  opacity: 0.8
               }}
            />
         </Flex>
      </Flex>
   )
};

export default InputPassword;
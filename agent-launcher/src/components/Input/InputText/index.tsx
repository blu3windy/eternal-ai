import { Flex, Input, Text, InputProps } from '@chakra-ui/react';
import { ReactNode } from "react";

export interface IProps extends InputProps{
    header: {
        label: string | ReactNode | undefined;
        value?: string | ReactNode | undefined;
        fontSize?: string | undefined;
    }
}

const InputText = (props: IProps) => {
   const { header, ...rest } = props;

   return (
      <Flex
         flexDirection="column"
         gap="6px"
         width="100%"
      >
         <Text
            as="label"
            fontSize={header.fontSize || "12px"}
            fontWeight="500"
            color="#2E2E2E"
         >
            {header.label}
         </Text>
         <Flex flex="1" width="100%" position="relative">
            <Input
               borderRadius="8px"
               border="1px solid #B6B6B6"
               type="text"
               padding="12px 14px"
               fontSize="16px"
               lineHeight="160%"
               {...rest}
            />
         </Flex>
      </Flex>
   )
};

export default InputText;
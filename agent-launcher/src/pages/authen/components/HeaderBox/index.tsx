import { Flex, Text, FlexProps } from "@chakra-ui/react";
import AppLogo from "@pages/authen/components/AppLogo";


interface IProps extends FlexProps {
    title: string;
    description?: string[];
}

const HeaderBox = (props: IProps) => {
   const { title, description, ...rest } = props;
   return (
      <Flex
         display="flex"
         flexDirection="column"
         alignItems="center"
         gap="16px"
         alignSelf="center"
         {...rest}
      >
         <AppLogo />
         <Text
            fontSize="28px"
            fontWeight="500"
            lineHeight="160%"
            color="rgba(0, 0, 0, 1)"
            marginTop="8px"
         >
            {title}
         </Text>
         {!!description && description.map((desc, index) => (
            <Text
               key={index}
               fontSize="18px"
               fontWeight="400"
               lineHeight="160%"
               color="rgba(0, 0, 0, 0.7)"
               whiteSpace="pre-wrap"
               textAlign="center"
            >
               {desc}
            </Text>
         ))}
      </Flex>
   );
};

export default HeaderBox;
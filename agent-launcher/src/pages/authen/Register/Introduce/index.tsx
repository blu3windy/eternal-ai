import { FC } from "react";
import { Flex, Text } from "@chakra-ui/react";
import BaseButton from "@components/BaseButton";

interface IProps {}

const RegisterIntroduce: FC<IProps> = (props: IProps) => {
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
            <BaseButton>
                Create
            </BaseButton>
        </Flex>
    );
};

export default RegisterIntroduce;
import { Flex, Text } from "@chakra-ui/react";
import HeaderMenu from "./menu";
import HeaderWallet from "./wallet";
import s from "./styles.module.scss";

type Props = {};

const Header = (_props: Props) => {
  return (
    <Flex className={s.headerContainer}>
      <Text>EternalAI</Text>
      <HeaderMenu />
      <HeaderWallet />
    </Flex>
  );
};

export default Header;

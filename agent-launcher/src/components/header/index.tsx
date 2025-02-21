import {Flex, Link} from "@chakra-ui/react";
import HeaderMenu from "./menu";
import HeaderWallet from "./wallet";
import s from "./styles.module.scss";
import ROUTERS from "../../constants/route-path.ts";

type Props = {};

const Header = (_props: Props) => {
  return (
    <Flex className={s.headerContainer}>
      <Link href={ROUTERS.HOME} fontSize={"18px"} fontWeight={500} textDecoration={"unset !important"}>Eternal AI</Link>
      <HeaderMenu primaryColor={'black'}/>
      <HeaderWallet />
    </Flex>
  );
};

export default Header;

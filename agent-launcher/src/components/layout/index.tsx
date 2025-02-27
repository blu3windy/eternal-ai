import { Box, Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import Header from "../header";
import s from "./styles.module.scss";
import ToastOverlay from "@components/ToastOverlay";
import cs from "clsx";

type Props = {
  className?: string;
  bodyClassName?: string;
};

const MainLayout = (props: Props & PropsWithChildren) => {
   const { children, className, bodyClassName } = props;
   return (
      <Flex className={cs(s.container, className)}>
         <Header />
         <Box className={cs(s.content, bodyClassName)}>{children}</Box>
        <ToastOverlay />
      </Flex>
   );
};

export default MainLayout;

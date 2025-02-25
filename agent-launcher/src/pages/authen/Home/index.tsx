import { FC, PropsWithChildren } from "react";
import { Flex } from "@chakra-ui/react";
import styles from "./styles.module.scss";
import Register from "@pages/authen/Register";

interface IProps extends PropsWithChildren {

}

const HomeAuthen: FC = (props: IProps) => {
   return (
      <Flex
         className={styles.container}
         display="flex"
         flexDirection="column"
         alignItems="center"
         justifyContent="center"
      >
         <Register />
      </Flex>
   );
};

export default HomeAuthen;
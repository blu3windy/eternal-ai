import { FC } from "react";
import { Flex } from "@chakra-ui/react";
import styles from "./styles.module.scss";
import Register from "@pages/authen/Register";
import { useAuth } from "@pages/authen/provider.tsx";
import Login from "@pages/authen/Login";

const HomeAuthen: FC = () => {

   const { hasUser } = useAuth()

   return (
      <Flex
         className={styles.container}
         display="flex"
         flexDirection="column"
         alignItems="center"
         justifyContent="center"
      >
         {
            hasUser ? <Login /> : <Register />
         }
      </Flex>
   );
};

export default HomeAuthen;
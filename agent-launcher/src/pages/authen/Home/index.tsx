import { FC } from "react";
import { Flex } from "@chakra-ui/react";
import styles from "./styles.module.scss";
import Register from "@pages/authen/Register";
import { useAuth } from "@pages/authen/provider.tsx";
import Login from "@pages/authen/Login";
import { motion } from "framer-motion";

const HomeAuthen: FC = () => {

   const { hasUser } = useAuth()

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.7, ease: "easeInOut" }}
      >
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
      </motion.div>
   )
};

export default HomeAuthen;
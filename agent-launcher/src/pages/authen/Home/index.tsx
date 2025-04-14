import { FC, useMemo } from "react";
import { Flex } from "@chakra-ui/react";
import styles from "./styles.module.scss";
import Register from "@pages/authen/Register";
import { useAuth } from "@pages/authen/provider.tsx";
import Login from "@pages/authen/Login";
import { motion } from "framer-motion";
import BackgroundWrapper from "@components/BackgroundWrapper";
import useStarter from "@pages/authen/hooks/useStarter";
import StarterContainer from "@pages/authen/Starter";
import InviteCodePage from "@pages/authen/InviteCode";

const HomeAuthen: FC = () => {

   const { dockerIsFinished, hasUser, inviteCode } = useStarter();
   const { signer } = useAuth();



   const isShowStarter = useMemo(() => {
      return !dockerIsFinished && hasUser && inviteCode;
   }, [dockerIsFinished, hasUser, inviteCode]);

   const renderContent = () => {
      if (!hasUser) {
         return <Register />
      }

      if (!inviteCode && signer) {
         return <InviteCodePage />
      }

      return <Login />

   }


   if (isShowStarter) {
      return <StarterContainer />
   }

   return (
      <BackgroundWrapper>
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
         >
            <Flex
               className={styles.container}
               display="flex"
               flexDirection="column"
               alignItems="center"
               justifyContent="center"
            >
               {renderContent()}
            </Flex>
         </motion.div>
      </BackgroundWrapper>
   )
};

export default HomeAuthen;
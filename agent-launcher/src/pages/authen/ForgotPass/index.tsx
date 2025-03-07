'use client';

import styles from "./styles.module.scss";
import FormForgotPass from "@pages/authen/ForgotPass/ForgotPass.form.tsx";
import { motion } from "framer-motion";
import useForgotPass from "@pages/authen/hooks/useForgotPass.ts";
import BackgroundWrapper from "@components/BackgroundWrapper";
import { Box, Center } from "@chakra-ui/react";

const ForgotPass = () => {
   const { isOpen: isOpenForgot } = useForgotPass();
   if (!isOpenForgot) return null;
   return (
      <BackgroundWrapper className={styles.container}>
         <Center
            width="100%"
            height="100%"
         >
            <FormForgotPass/>
         </Center>
      </BackgroundWrapper>
   );
}

export default ForgotPass;

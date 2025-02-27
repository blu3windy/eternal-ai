'use client';

import styles from "./styles.module.scss";
import FormForgotPass from "@pages/authen/ForgotPass/ForgotPass.form.tsx";
import { motion } from "framer-motion";
import useForgotPass from "@pages/authen/hooks/useForgotPass.ts";

const ForgotPass = () => {
   const { isOpen: isOpenForgot } = useForgotPass();
   if (!isOpenForgot) return null;
   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.25, ease: "easeIn" }}
         className={styles.container}
      >
         <FormForgotPass />
      </motion.div>
   );
}

export default ForgotPass;

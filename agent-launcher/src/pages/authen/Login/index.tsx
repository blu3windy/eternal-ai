import { Box, Button, Flex, Text } from "@chakra-ui/react";
import BaseButton from "@components/BaseButton";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputPassword from "@components/Input/InputPassword";
import { useEffect, useState } from "react";
import EaiSigner from "@helpers/signer";
import eaiCrypto from "@utils/crypto";
import { useAuth } from "@pages/authen/provider.tsx";
import useForgotPass from "@pages/authen/hooks/useForgotPass.ts";
import HeaderBox from "@pages/authen/components/HeaderBox";

const Login = () => {
   const { onLogin } = useAuth();
   const [cipherText, setCipherText] = useState<string | undefined>(undefined);
   const [loading, setLoading] = useState<boolean>(true);
   const { onOpen } = useForgotPass();

   const onSubmit = async (values: { password: string }) => {
      try {
         await onLogin(values.password);
      } catch (error) {
         console.error(error);
      }
   }

   const validationSchema = Yup.object().shape({
      password: Yup.string()
         .min(8, "Password must be at least 8 characters")
         .test("is-valid-password", "Incorrect password", (password) => {
            if (!password) return false; // Required field check
            try {
               eaiCrypto.decryptAES({
                  cipherText: cipherText || "", // Make sure this is defined
                  pass: password,
               });
               return true; // Valid password
            } catch (error) {
               return false; // Incorrect password
            }
         })
         .required("Password is required"),
   });


   const init = async () => {
      try {
         setLoading(true);
         const cipherText = await EaiSigner.getCipherText();
         setCipherText(cipherText)
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      init().then().catch();
   }, []);

   return (
      <Flex
         flexDirection="column"
         alignItems="center"
         justifyContent="center"
      >
         <HeaderBox title="Welcome back!" description={["The decentralized AI awaits."]} />
         <Formik
            initialValues={{ password: '' }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
         >
            {({ dirty, setFieldValue, isSubmitting }) => (
               <Form>
                  <Flex flexDirection="column" width="400px" marginTop="32px">
                     <InputPassword
                        name="password"
                        placeholder="Enter password"
                        autoFocus={true}
                        header={{ label: "" }}
                        onChange={(e) =>
                           setFieldValue('password', e.target.value)
                        }
                     />
                     <Box height="6px"/>
                     <ErrorMessage
                        name="password"
                        render={(msg) => (
                           <Text
                              fontSize="12px"
                              color="red"
                              textAlign="left"
                           >
                              {msg}
                           </Text>
                        )}
                     />
                     <BaseButton
                        type="submit"
                        width="100% !important"
                        marginTop="32px"
                        disabled={!dirty || isSubmitting || loading || !cipherText}
                        isLoading={!cipherText || loading || isSubmitting}
                     >
                         Unlock
                     </BaseButton>
                     <Text
                        textAlign="center"
                        fontSize="14px"
                        fontWeight="400"
                        marginTop="16px"
                        cursor="pointer"
                        color="rgba(0, 0, 0, 0.7)"
                        onClick={onOpen}
                     >
                        Forgot password?
                     </Text>
                  </Flex>
               </Form>
            )}
         </Formik>
      </Flex>
   );
}

export default Login;
import { Box, Flex, Text } from "@chakra-ui/react";
import InputText from "@components/Input/InputText";
import { ErrorMessage, Form, Formik } from "formik";
import InputPassword from "@components/Input/InputPassword";
import BaseButton from "@components/BaseButton";
import * as Yup from "yup";
import { Wallet } from "ethers";
import EaiSigner from "@helpers/signer";
import { compareString } from "@utils/string.ts";
import { useAuth } from "@pages/authen/provider.tsx";
import HeaderBox from "@pages/authen/components/HeaderBox";

interface IProps {
   onBack: () => void;
}

const ImportKey = (props: IProps) => {
   const { onBack } = props;

   const { onLogin } = useAuth();


   const onSubmit = async (values: { privateKey: string, password: string }) => {
      console.log(values);
      try {
         await EaiSigner.storageNewKey({
            prvKey: values.privateKey,
            pass: values.password
         });

         const _prvKey = await EaiSigner.getStorageKey({ pass: values.password });

         if (!compareString(values.privateKey, _prvKey)) {
            throw new Error("Private key not match");
         }

         await onLogin(values.password);
      } catch (error) {
         console.error(error);
      }
   }

   const validationSchema = Yup.object().shape({
      privateKey: Yup.string()
         .test("is-valid-private-key", "Invalid private key", (privateKey) => {
            if (!privateKey) return false; // Required field check
            try {
               const signer = new Wallet(privateKey);
               return !!signer?.address;
            } catch (error) {
               return false; // Invalid private key
            }
         })
         .required("Private key is required"),
      password: Yup.string()
         .min(8, "Password must be at least 8 characters")
         .required("Password is required"),
   });

   return (
      <Flex
         flexDirection="column"
         alignItems="center"
         justifyContent="center"
      >
         <HeaderBox title="Import an existing account" />
         <Formik
            initialValues={{ privateKey: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
         >
            {({ dirty, setFieldValue, isSubmitting }) => (
               <Form>
                  <Flex flexDirection="column" width="400px" marginTop="32px">
                     <InputText
                        name="privateKey"
                        autoFocus={true}
                        header={{
                           label: "Enter your Private key String here:"?.toUpperCase()
                        }}
                        placeholder="Enter your private key"
                        onChange={(e) =>
                           setFieldValue('privateKey', e.target.value)
                        }
                     />
                     <ErrorMessage
                        name="privateKey"
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
                     <Box height="24px"/>
                     <InputPassword
                        name="password"
                        placeholder="Enter password"
                        header={{ label: "Password"?.toUpperCase() }}
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
                        disabled={!dirty || isSubmitting}
                        isLoading={isSubmitting}
                     >
                         Import
                     </BaseButton>
                     <Text
                        textAlign="center"
                        fontSize="14px"
                        fontWeight="400"
                        marginTop="16px"
                        cursor="pointer"
                        color="rgba(0, 0, 0, 0.6)"
                        onClick={onBack}
                     >
                         Cancel
                     </Text>
                  </Flex>
               </Form>
            )}
         </Formik>
      </Flex>
   );
}

export default ImportKey;
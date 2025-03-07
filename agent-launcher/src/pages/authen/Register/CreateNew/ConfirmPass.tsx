import { Box, Flex, Text } from "@chakra-ui/react";
import BaseButton from "@components/BaseButton";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputPassword from "@components/Input/InputPassword";
import HeaderBox from "@pages/authen/components/HeaderBox";

interface IProps {
   onNext: (_: string) => void;
   loading?: boolean;
}

const ConfirmPass = (props: IProps) => {
   const { onNext, loading } = props;

   const validationSchema = Yup.object().shape({
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
         <HeaderBox
            title="Create a new account"
            description={["Your password encrypts your wallet on this device. If you forget it, you’ll need your private key to regain access."]}
            maxWidth="500px"
         />
         <Formik
            initialValues={{ password: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
               onNext(values.password);
            }}
         >
            {({ dirty, setFieldValue }) => (
               <Form>
                  <Flex flexDirection="column" width="500px" marginTop="32px">
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
                        marginTop="48px"
                        disabled={!dirty}
                        isLoading={!!loading}
                     >
                        Create account
                     </BaseButton>
                  </Flex>
               </Form>
            )}
         </Formik>
      </Flex>
   );
}

export default ConfirmPass;
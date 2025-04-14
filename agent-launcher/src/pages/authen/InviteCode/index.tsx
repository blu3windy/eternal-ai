import { FC, useMemo, useRef, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import HeaderBox from "@pages/authen/components/HeaderBox";
import BaseButton from "@components/BaseButton";
import styles from "./styles.module.scss";
import OTPInput from 'react-otp-input';
import CAgentTokenAPI from "@services/api/agents-token";
import { useAuth } from "@pages/authen/provider";
import useStarter from "@pages/authen/hooks/useStarter";
const MAX_LENGTH = 6;

const InviteCodePage: FC = () => {
   const [code, setCode] = useState<string>("");
   const [edited, setEdited] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [submitError, setSubmitError] = useState<string>("");
   const { signer } = useAuth();
   const api = new CAgentTokenAPI();

   const { setInviteCode } = useStarter();

   const errorMessage = useMemo(() => {
      if (!edited) {
         return "";
      }
 
      if (!code) {
         return "Code is required.";
      }

      if (!signer?.address) {
         return "Please create an account.";
      }

   }, [code, edited, signer?.address]);

   const isDisabled = useMemo(() => {
      return !!errorMessage || !edited || code.length < MAX_LENGTH || isLoading || !signer?.address;
   }, [errorMessage, edited, code, isLoading, signer?.address]);

   const onSubmit = async () => {
      try {
         setIsLoading(true);
         setSubmitError("");

         await api.submitInviteCode({
            code,
            address: signer?.address || "",
         });

         setInviteCode(code);

      } catch (error: any) {

         console.log("error", error);
         setSubmitError(error?.response?.data?.error?.message || error?.message || "This code is invalid.");
      } finally {
         setIsLoading(false);
      }
   }

   return (
      <Flex
         flexDirection="column"
         alignItems="center"
         justifyContent="center"
      >
         <HeaderBox
            title="Invite Code"
            description={[
               "Enter the invite code"
            ]}
            showLogo={true}
         />
         <Flex
            className={styles.passCode}
         >
            <OTPInput
               value={code}
               onChange={(v) => {
                  setCode(v);
                  setSubmitError("");
                  setEdited(true);
               }}
               numInputs={MAX_LENGTH}
               renderSeparator={<></>}
               renderInput={(props) => <input {...props} />}
               placeholder={Array.from({ length: MAX_LENGTH }, () => "-").join("")}
               inputType="text"
               containerStyle={styles.codeWrapper}
            />
            {(!!errorMessage || !!submitError) && (
               <Text
                  color="#ff0000"
                  fontSize="14px"
                  mt="6px"
                  fontWeight="400"
               >
                  {errorMessage || submitError}
               </Text>
            )}
         </Flex>
         <BaseButton
            width="200px !important"
            marginTop="60px"
            disabled={isDisabled}
            onClick={onSubmit}
            isLoading={isLoading}
            loadingText="Verifying..."
         >
            Submit
         </BaseButton>
      </Flex>
   );
};

export default InviteCodePage;

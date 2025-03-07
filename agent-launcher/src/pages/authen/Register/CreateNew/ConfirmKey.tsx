import { Flex, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import OTPInput from 'react-otp-input';
import styles from "./styles.module.scss";
import BaseButton from "@components/BaseButton";
import HeaderBox from "@pages/authen/components/HeaderBox";

interface IProps {
    onNext: () => void;
    prvKey: string;
}

const ConfirmKey = (props: IProps) => {
   const { prvKey, onNext } = props;

   const [confirmKey, setConfirmKey] = useState<string>("");
   const [edited, setEdited] = useState<boolean>(false);

   const errorMessage = useMemo(() => {
      if (!edited) {
         return "";
      }

      if (!confirmKey) {
         return "Code is required.";
      }

      if (
         confirmKey.length === 4
         && confirmKey.toLowerCase()
         !== prvKey.substring(prvKey.length - 4)?.toLowerCase()
      ) {
         return "Incorrect. Please check and try again.";
      }
   }, [confirmKey, edited, prvKey]);

   return (
      <Flex
         flexDirection="column"
         alignItems="center"
         justifyContent="center"
      >
         <HeaderBox
            title="Confirm your private key"
            description={[
               "Enter the last 4 characters of your private key"
            ]}
         />
         <Flex
            className={styles.passCode}
         >
            <OTPInput
               value={confirmKey}
               onChange={(v) => {
                  setConfirmKey(v);
                  setEdited(true);
               }}
               numInputs={4}
               renderSeparator={<></>}
               renderInput={(props) => <input {...props} />}
               placeholder="----"
               inputType="text"
               containerStyle={styles.codeWrapper}
            />
            {(!!errorMessage) && (
               <Text
                  color="#ff0000"
                  fontSize="14px"
                  mt="6px"
                  fontWeight="400"
               >
                  {errorMessage}
               </Text>
            )}
         </Flex>
         <BaseButton
            width="200px !important"
            marginTop="60px"
            onClick={onNext}
            disabled={!!errorMessage || !edited || confirmKey.length < 4}
         >
              Continue
         </BaseButton>
      </Flex>
   );
}

export default ConfirmKey;
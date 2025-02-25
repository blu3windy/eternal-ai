import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import ReactCodeInput from "react-code-input";

interface IProps {
    onNext: () => void;
    prvKey: string;
}

const ConfirmKey = (props: IProps) => {
   const { prvKey, onNext } = props;

   const [confirmKey, setConfirmKey] = useState<string>("");
   const [error, setError] = useState<string>("");


   return (
      <Flex
         flexDirection="column"
         alignItems="center"
         justifyContent="center"
      >
         <Flex
            flexDirection="column"
            alignItems="center"
            gap="24px"
         >
            <Text fontSize="48px" fontWeight="500">
              Confirm your private key
            </Text>
            <Text fontSize="24px" fontWeight="400" color="#2E2E2E">
              Enter the last 4 characters of your private key.
            </Text>
         </Flex>
         <Flex>
            <ReactCodeInput
               type='text'
               fields={4}
               inputMode="latin"
               name="confirm-key"
               value={confirmKey}
               onChange={(value) => setConfirmKey(value)}
               style={{
                  display: "flex",
                  gap: "24px",
               }}

               inputStyle={{
                  width: "80px",
                  height: "80px",
                  fontSize: "16px",
                  fontWeight: "500",
                  textAlign: "center",
                  border: "1px solid #B6B6B6",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
               }}
            />
         </Flex>
      </Flex>
   );
}

export default ConfirmKey;
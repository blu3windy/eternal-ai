import { Flex, Text, useDisclosure } from "@chakra-ui/react";
import BaseButton from "@components/BaseButton";
import useForgotPass from "@pages/authen/hooks/useForgotPass.ts";
import EaiSigner from "@helpers/signer";
import { useState } from "react";
import Checkbox from "@components/Checkbox";

const FormForgotPass = () => {
   const { onClose } = useForgotPass();
   const [loading, setLoading] = useState<boolean>(false);
   const { isOpen: isChecked, onToggle } = useDisclosure();


   const onSubmit = async () => {
      try {
         setLoading(true);
         await EaiSigner.reset();
         location.reload()
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   }

   return (
      <Flex
         flexDirection="column"
         alignItems="center"
         justifyContent="center"
         maxWidth="700px"
         minWidth="500px"
      >
         <Flex
            flexDirection="column"
            alignItems="center"
            gap="16px"
         >
            <Text fontSize="28px" fontWeight="500" color="black">
                Reset your account access
            </Text>
            <Text
               fontSize="18px"
               fontWeight="400"
               color="rgba(0, 0, 0, 0.7)"
               textAlign="center"
               gap="8px"
               display="flex"
               flexDirection="column"
            >
               <Text>
                  Agent Launcher does not store your password.
                  If you're unable to unlock your account,
                  you will need to reset your wallet by providing the Private Key used during account setup.
               </Text>
               <Text>
                  Resetting your wallet will remove your current account from this device.
               </Text>
               <Text>
                  Ensure you are using the correct Private Key before proceeding. This action cannot be undone.
               </Text>
            </Text>
         </Flex>
         <Flex
            flexDirection="column"
            width="400px"
            marginTop="60px"
            gap="16px"
            alignItems="center"
         >
            <Checkbox
               ticked={isChecked}
               onToggle={onToggle}
               label="I understand the consequences of resetting my wallet"
            />
            <BaseButton
               type="submit"
               width="100% !important"
               maxW="400px"
               onClick={onSubmit}
               isDisabled={loading || !isChecked}
               isLoading={loading}
            >
               Reset
            </BaseButton>
            <Text
               textAlign="center"
               fontSize="14px"
               fontWeight="400"
               color="rgba(0, 0, 0, 0.6)"
               cursor="pointer"
               onClick={onClose}
            >
                Cancel
            </Text>
         </Flex>
      </Flex>
   );
}

export default FormForgotPass;
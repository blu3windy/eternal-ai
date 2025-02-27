import { Flex, Text } from "@chakra-ui/react";
import BaseButton from "@components/BaseButton";
import useForgotPass from "@pages/authen/hooks/useForgotPass.ts";
import EaiSigner from "@helpers/signer";
import { useState } from "react";

const FormForgotPass = () => {
   const { onClose } = useForgotPass();
   const [loading, setLoading] = useState<boolean>(false);


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
         width="50%"
         minWidth="700px"
      >
         <Flex
            flexDirection="column"
            alignItems="center"
            gap="24px"
         >
            <Text fontSize="48px" fontWeight="500" color="black">
                Reset your account access
            </Text>
            <Text fontSize="16px" fontWeight="400" color="#2E2E2E" textAlign="center">
               <Text>
                   Agent Launcher does not keep a copy of your password.
                   If you’re having trouble unlocking your account, you will need to reset your wallet.
                   You can do this by providing the Secret Private Key you used when you set up your wallet.
               </Text>
               <Text>
                   This action will delete your current wallet from this device.
               </Text>
               <Text>
                   Make sure you’re using the correct Secret Private Key before proceeding.
                   You will not be able to undo this.
               </Text>
            </Text>
         </Flex>
         <Flex
            flexDirection="column"
            width="400px"
            marginTop="60px"
            gap="24px"
         >
            <BaseButton
               type="submit"
               width="100% !important"
               onClick={onSubmit}
               isDisabled={loading}
               isLoading={loading}
            >
                Reset & Unlock
            </BaseButton>
            <Text
               textAlign="center"
               fontSize="16px"
               fontWeight="400"
               color="black"
               fontStyle="italic"
               cursor="pointer"
               textDecoration="underline"
               onClick={onClose}
            >
                Cancel
            </Text>
         </Flex>
      </Flex>
   );
}

export default FormForgotPass;
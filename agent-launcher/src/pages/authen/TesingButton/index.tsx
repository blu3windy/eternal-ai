import { Button, Flex } from "@chakra-ui/react";
import EaiSigner from "@helpers/signer";
import { useState } from "react";

const NUMBER = 10;
const TestingButton = () => {

   const [count, setCount] = useState(0);

   const onClick = () => {
      if (count > NUMBER) {
         return;
      }
      setCount(count + 1);
   }

   return (
      <>
         <Flex
            width="20px"
            height="20px"
            position="absolute"
            zIndex="1"
            bottom="0"
            right="0"
            onClick={onClick}
         >
         </Flex>
         {
            (count > NUMBER) && (
               <Flex
                  position="absolute"
                  zIndex="2"
                  bottom="0"
                  right="0"
                  width="300px"
                  height="350px"
                  backgroundColor="rgba(6, 8, 7, 0.8)"
               >
                  <Button
                     onClick={() => {
                        EaiSigner.removeStorageKey();
                     }}
                  >
                       DELETE CIPHERTEXT
                  </Button>

               </Flex>
            )
         }
      </>
   );
}

export default TestingButton;
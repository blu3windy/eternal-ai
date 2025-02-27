import { FC } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface CheckboxProps {
    ticked: boolean;
    onToggle: () => void;
    label?: string;
}

const Checkbox: FC<CheckboxProps> = ({ ticked, onToggle, label }) => {
   return (
      <Flex
         display="flex"
         alignItems="center"
         gap="12px"
      >
         <Box
            as={motion.div}
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={onToggle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            width="24px"
            height="24px"
         >
            {
               ticked ? (
                  <Image
                     src="icons/checked.svg"
                     alt="Checkbox image" width="100%" height="100%" />
               ) : (
                  <Box
                     backgroundColor="transparent"
                     border="2px solid #00AA6C"
                     borderRadius="3px"
                     width="18px"
                     height="18px"
                  />
               )
            }
         </Box>
         {
            label && (
               <Text fontSize="16px" color="black">
                  {label}
               </Text>
            )
         }
      </Flex>
   );
};

export default Checkbox;
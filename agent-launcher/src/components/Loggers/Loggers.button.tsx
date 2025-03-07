import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useLoggersStore } from "@components/Loggers/useLogs.ts";

const NUMBER = 10;

interface IProps {
   clearLogs?: () => void;
}

const LoggersButton = (props: IProps) => {

   const [count, setCount] = useState(0);

   const { toggleLogs, showLogs } = useLoggersStore()

   const onClick = () => {
      if (count > NUMBER || showLogs) {
         return toggleLogs();
      }
      setCount(count + 1);
   }

   return (
      <Flex
         flexDirection="row"
         alignItems="center"
         gap="4px"
         position="absolute"
         zIndex="3"
         bottom="10px"
         right="10px"
      >
         {showLogs && (
            <Flex
               backgroundColor={"red.500" }
               onClick={props?.clearLogs}
               cursor="pointer"
               padding={"12px"}
               fontSize="12px"
               color="white"
               borderRadius="md"
            >
               Clear
            </Flex>
         )}
         <Flex
            backgroundColor={showLogs ? "green" : "transparent"}
            onClick={onClick}
            cursor="pointer"
            padding={showLogs ? "12px" : "8px"}
            fontSize="12px"
            color="white"
            borderRadius="md"
         >
            {showLogs ? "Hide" : ""}
         </Flex>
      </Flex>
   );
}

export default LoggersButton;
import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useLoggersStore } from "@components/Loggers/useLogs.ts";

const NUMBER = 10;
const LoggersButton = () => {

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
         position="absolute"
         zIndex="1"
         bottom="10px"
         right="10px"
         backgroundColor={showLogs ? "green" : "transparent"}
         onClick={onClick}
         cursor="pointer"
         padding="4px"
         fontSize="12px"
         color="white"
         borderRadius="md"
      >
         {showLogs ? "Hide" : ""}
      </Flex>
   );
}

export default LoggersButton;
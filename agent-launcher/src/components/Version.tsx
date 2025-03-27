import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const Version = () => {
   const [version, setVersion] = useState<string>("");

   useEffect(() => {
      // Get version from package.json
      window.electronAPI.getVersion().then((v) => {
         setVersion(v);
      });
   }, []);

   return (
      <Box position="fixed" bottom={2} right={2}>
         <Text fontSize="xs" color="gray.500">
        v{version}
         </Text>
      </Box>
   );
}; 
import { Box, Text } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import s from "./styles.module.scss";
import { motion } from "framer-motion";

const UpdateBanner = () => {
 
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {

    if (globalThis.electronAPI) {
       globalThis.electronAPI.onCheckForUpdate();
       globalThis.electronAPI.onUpdateDownloaded(() => {
          setUpdateAvailable(true);
       });
    }


    // 1 min = ? milisecond
    const oneMinute = 60000;
    setInterval(() => {
       globalThis.electronAPI.onCheckForUpdate();
    }, oneMinute);


 }, []);

 const handleUpdateDownloaded = () => {
  globalThis.electronAPI.installUpdate();
}

if (!updateAvailable) {
  return null;
}


  return  (
    <motion.div
       initial={{ y: 0, opacity: 0 }}
       animate={{ y: 0, opacity: 1 }}
       exit={{ y: 0, opacity: 0 }}
       transition={{ duration: 0.3, ease: "easeOut" }}
       className={`${s.snackbar}`}
       onClick={handleUpdateDownloaded}
       style={{
          cursor:  "pointer"
       }}
    >

       <Flex alignItems={"center"} gap={4}>
        
                🎉
                <Box>
                   <Text fontWeight={700} fontSize={"16px"}>Update completed!</Text>
                   <Text fontSize={"12px"} opacity={0.7}>Click to restart and apply the latest changes.</Text>
                </Box>
           

       </Flex>
       {
          // add button close
          // svg icon close 
          <Box onClick={() => setUpdateAvailable(false)}>
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </Box>
       }
    </motion.div>
 )
};

export default UpdateBanner;

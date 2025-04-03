import { useEffect, useMemo, useRef, useState } from 'react';
import {
   Box,
   Text,
   VStack,
} from "@chakra-ui/react";
import useParseLogs from "@hooks/useParseLogs";
import { motion } from "framer-motion";

const StarterLogs = () => {
   const scrollRef = useRef<HTMLDivElement>(null);
   const [userScrolled, setUserScrolled] = useState(false);
   const [showAllLogs, setShowAllLogs] = useState(false);
   
   const { parsedLogs } = useParseLogs({
      functionNames: ["INITIALIZE", "MODEL_INSTALL", "DOCKER_BUILD", "MODEL_INSTALL_LLAMA", "DOCKER_ACTION"],
      keys: ["name", "message", "error", "step"]
   });

   // Deduplicate logs using useMemo
   const uniqueLogs = useMemo(() => {
      const seen = new Set();
      return parsedLogs.filter(log => {
         const logKey = `${log.values.message}${log.values.error}${log.values.step}`;
         if (seen.has(logKey)) return false;
         seen.add(logKey);
         return true;
      });
   }, [parsedLogs]);

   // Filter logs based on showAllLogs state
   const displayedLogs = useMemo(() => {
      return showAllLogs ? uniqueLogs : uniqueLogs.slice(-1);
   }, [uniqueLogs, showAllLogs]);

   useEffect(() => {
      if (scrollRef.current && !userScrolled) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
   }, [
      JSON.stringify(displayedLogs)
   ]);

   const handleScroll = (e: any) => {
      const element = e.currentTarget;
      const isScrolledToBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
      setUserScrolled(!isScrolledToBottom);
   };

   const renderMessage = (message: string, step: string) => {
      let _message = message;
      if (step) {
         console.log(step)
         const parser = step.split("-");
         const current = Number(parser[0]) + 1;
         const total = Number(parser[1]) + 2;
         const percentage = Math.round((current / total) * 100);
         _message = `⚡ Downloading model... | ${percentage}%`;
      }

      return (
         <Text
            color="gray.600"
            fontSize="13px"
            fontWeight="400"
            lineHeight="1.4"
            width="100%"
         >
            {_message}
         </Text>
      );
   };

   return (
      <Box 
         position="relative" 
         height="256px"
         width="100%"
         maxWidth="500px"
         overflow="hidden"
         alignSelf="center"
         borderRadius="2xl"
      >
         {/* Top gradient */}
         {displayedLogs?.length > 1 && (
            <Box
               position="absolute"
               top={0}
               left={0}
               right={0}
               height="32px"
               zIndex={2}
               pointerEvents="none"
               background="linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 100%)"
            />
         )}

         {/* Logs container */}
         <VStack
            ref={scrollRef}
            spacing={2.5}
            align="stretch"
            height="100%"
            overflowY="auto"
            position="absolute"
            top={0}
            right={0}
            left={0}
            padding="16px"
            sx={{
               '&::-webkit-scrollbar': {
                  width: '0px',
               },
               '&::-webkit-scrollbar-track': {
                  background: 'transparent',
               },
               '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: 'full',
               },
            }}
            onScroll={handleScroll}
         >
            {displayedLogs.map((log, index) => (
               <motion.div
                  key={`${log.values.message}${log.values.error}${log.values.step}-${index}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
               >
                  <Box
                     py={1.5}
                     px={3}
                     bg={log.values.error ? "red.50" : "gray.50"}
                     borderRadius="lg"
                     borderLeft="3px solid"
                     borderLeftColor={log.values.error ? "red.500" : "blue.500"}
                  >
                     {log.values.error ? (
                        <Text
                           color="red.600"
                           fontSize="13px"
                           fontWeight="500"
                           width="100%"
                        >
                           {log.values.error}
                        </Text>
                     ) : renderMessage(log.values.message, log.values.step)}
                  </Box>
               </motion.div>
            ))}

            {/* Show More Button */}
            {uniqueLogs.length > 1 && (
               <Box
                  position="sticky"
                  bottom="0"
                  left="0"
                  right="0"
                  color="#5400FB"
                  opacity="0.8"
                  backgroundColor="transparent"
                  _hover={{ opacity: "0.5" }}
                  onClick={() => setShowAllLogs(!showAllLogs)}
                  fontSize="13px"
                  fontWeight="400"
                  cursor="pointer"
                  textAlign="center"
                  py={2}
                  mt={2}
               >
                  {showAllLogs ? "Show Less" : `Show More (${uniqueLogs.length - 1})`}
               </Box>
            )}
         </VStack>
      </Box>
   );
};

export default StarterLogs;
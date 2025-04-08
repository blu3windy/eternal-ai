import { useEffect, useMemo, useRef, useState } from 'react';
import {
   Box,
   Flex,
   Text,
   VStack,
} from "@chakra-ui/react";
import useParseLogs from "@hooks/useParseLogs";
import { motion } from "framer-motion";
import LoadingText from '@components/LoadingText';
import BaseButton from "@components/BaseButton";


const TOTAL_STEP = 30;

interface IProps {
   isShowWarning?: boolean;
   hasError?: boolean;
   onRetry?: () => void;
}

const StarterLogs = ({ isShowWarning = false, hasError = false, onRetry }: IProps) => {
   const scrollRef = useRef<HTMLDivElement>(null);
   const [userScrolled, setUserScrolled] = useState(false);
   const [showAllLogs, setShowAllLogs] = useState(false);
   
   const { parsedLogs, clearLogs } = useParseLogs({
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
   
   const percentage = useMemo(() => {
      if (uniqueLogs?.length === TOTAL_STEP) {
         return 99;
      }
      return Math.round(((uniqueLogs?.length || 1) / TOTAL_STEP) * 100) + 5;
   }, [uniqueLogs?.length]);

   return (
      <>
         <LoadingText 
            dataText={`Initializing ${percentage}%`}
         />

         {isShowWarning && (
            <Flex 
               position="relative" 
               alignItems="center"
               gap="8px"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <path d="M19.5446 6.0835L14.4196 0.958496C14.3421 0.879329 14.2358 0.834329 14.125 0.833496H6.875C6.76459 0.833496 6.65834 0.877246 6.58042 0.955579L1.45542 6.0835C1.37792 6.161 1.33417 6.26558 1.33334 6.37516V13.6252C1.33334 13.7356 1.37709 13.8418 1.45542 13.9197L6.58042 19.0447C6.65834 19.1231 6.76459 19.1668 6.875 19.1668H14.125C14.2354 19.1668 14.3417 19.1231 14.4196 19.0447L19.5446 13.9197C19.6229 13.8418 19.6667 13.7356 19.6667 13.6252V6.37516C19.6658 6.26558 19.6221 6.161 19.5446 6.0835Z" fill="url(#paint0_linear_54848_4945)"/>
                  <path d="M10.5 15.8337C10.9603 15.8337 11.3333 15.4606 11.3333 15.0003C11.3333 14.5401 10.9603 14.167 10.5 14.167C10.0398 14.167 9.66667 14.5401 9.66667 15.0003C9.66667 15.4606 10.0398 15.8337 10.5 15.8337Z" fill="#393A46"/>
                  <path d="M10.7188 12.5003H10.2817C10.0554 12.5003 9.87083 12.3199 9.865 12.0941L9.6775 4.59408C9.67167 4.35991 9.86 4.16699 10.0942 4.16699H10.9063C11.1404 4.16699 11.3288 4.35991 11.3229 4.59408L11.1354 12.0941C11.1296 12.3199 10.945 12.5003 10.7188 12.5003Z" fill="#393A46"/>
                  <defs>
                     <linearGradient id="paint0_linear_54848_4945" x1="10.5" y1="0.833496" x2="10.5" y2="19.1668" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFD36E"/>
                        <stop offset="1" stop-color="#F6B828"/>
                     </linearGradient>
                  </defs>
               </svg>
               <Text
                  color="rgba(0, 0, 0, 0.7)"
                  fontSize="13px"
                  fontWeight="400"
                  lineHeight="1.4"
                  width="100%"
               >
               Your app is installing low, you may need to restart the app or reboot your device.
               </Text>
            </Flex>
         )}
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
                     {showAllLogs ? "Hide Details" : `Show Details`}
                  </Box>
               )}
            </VStack>
         </Box>
         {hasError && (
            <BaseButton 
               maxWidth="120px"
               onClick={() => {
                  clearLogs();
                  onRetry?.();
               }}
            >
                     Try again
            </BaseButton>
         )}
      </>
   );
};

export default StarterLogs;
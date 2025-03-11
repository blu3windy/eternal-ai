import { useEffect, useRef, useState } from 'react';
import {
   Box,
   Text,
   VStack,
   Progress,
} from "@chakra-ui/react";
import useParseLogs from "@hooks/useParseLogs";
import { motion } from "framer-motion";

const StarterLogs = () => {
   const scrollRef = useRef<HTMLDivElement>(null);
   const [userScrolled, setUserScrolled] = useState(false);
   
   const { parsedLogs } = useParseLogs({
      functionNames: ["INITIALIZE", "MODEL_INSTALL"],
      keys: ["name", "message", "error"]
   });

   useEffect(() => {
      if (scrollRef.current && !userScrolled) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
   }, [parsedLogs]);

   const handleScroll = (e: any) => {
      const element = e.currentTarget;
      const isScrolledToBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
      setUserScrolled(!isScrolledToBottom);
   };

   const renderMessage = (message: string) => {
      // Check if it's a download progress message
      const downloadMatch = message.match(/Downloading (\d+)%/);
      if (downloadMatch) {
         const percentage = parseInt(downloadMatch[1]);
         return (
            <Box width="100%" position="relative">
               <Progress
                  value={percentage}
                  size="xs"
                  colorScheme="blue"
                  borderRadius="full"
                  hasStripe
                  isAnimated
                  bg="gray.100"
               />
               <Text
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  color="gray.700"
                  fontSize="13px"
                  fontWeight="500"
                  textAlign="center"
                  zIndex={1}
               >
                  Downloading Model • {percentage}%
               </Text>
            </Box>
         );
      }

      // Default message rendering
      return (
         <Text
            color="gray.600"
            fontSize="13px"
            fontWeight="400"
            lineHeight="1.4"
            width="100%"
         >
            {message}
         </Text>
      );
   };

   return (
      <Box 
         position="relative" 
         height="192px"
         width="100%"
         maxWidth="500px"
         overflow="hidden"
         alignSelf="center"
         borderRadius="2xl"
         bg="white"
         boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      >
         {/* Top gradient */}
         {parsedLogs?.length > 1 && (
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
                  width: '3px',
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
            {parsedLogs.map((log, index) => (
               <motion.div
                  key={index}
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
                     ) : renderMessage(log.values.message)}
                  </Box>
               </motion.div>
            ))}
         </VStack>
      </Box>
   );
};

export default StarterLogs;
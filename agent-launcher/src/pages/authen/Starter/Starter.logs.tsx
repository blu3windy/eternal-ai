// Starter.logs.tsx
import { useEffect, useRef, useState } from 'react';
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
      const isScrolledToBottom 
         = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
      setUserScrolled(!isScrolledToBottom);
   };

   return (
      <Box 
         position="relative" 
         height="192px"  // Increased from 144px to accommodate 6 lines * 32px per line
         width="100%"
         maxWidth="500px"
         overflow="hidden"
         alignSelf="center"
      >
         {/* Top gradient */}
         {parsedLogs?.length > 1 && (
            <Box
               position="absolute"
               top={0}
               left={0}
               right={0}
               height="42px"
               zIndex={2}
               pointerEvents="none"
               background="linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.85) 46.81%, rgba(255, 255, 255, 0.00) 100%)"
            />
         )}

         {/* Logs container */}
         <VStack
            ref={scrollRef}
            spacing={0}
            align="stretch"
            height="192px"  // Changed from 200px to match parent height
            overflowY="auto"
            bg="white"
            position="absolute"
            top={0}
            right={0}
            padding="12px 16px"
            sx={{
               '&::-webkit-scrollbar': {
                  display: 'none'
               },
               scrollbarWidth: 'none',
               msOverflowStyle: 'none',
            }}
            onScroll={handleScroll}
         >
            {parsedLogs.map((log, index) => (
               <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
               >
                  <Box
                     height="32px"  // Each log entry is 32px high
                     display="flex"
                     alignItems="center"
                     minHeight="32px"  // Added to ensure minimum height
                  >
                     {/* Name section */}
                     {/*{log.values.name && (*/}
                     {/*   <Text*/}
                     {/*      color="gray.500"*/}
                     {/*      fontSize="14px"*/}
                     {/*      lineHeight="32px"*/}
                     {/*      width="150px"*/}
                     {/*      flexShrink={0}*/}
                     {/*      fontWeight="500"*/}
                     {/*   >*/}
                     {/*      {log.values.name}:*/}
                     {/*   </Text>*/}
                     {/*)}*/}

                     {/* Message/Error section */}
                     {log.values.error ? (
                        <Text
                           color="red.500"
                           fontSize="14px"
                           lineHeight="32px"  // Changed to match box height
                           noOfLines={1}
                           width="100%"
                        >
                           {log.values.error}
                        </Text>
                     ) : (
                        <Text
                           color="black"
                           fontSize="14px"
                           lineHeight="32px"  // Changed to match box height
                           noOfLines={1}
                           width="100%"
                        >
                           {log.values.message}
                        </Text>
                     )}
                  </Box>
               </motion.div>
            ))}
         </VStack>
      </Box>
   );
};

export default StarterLogs;
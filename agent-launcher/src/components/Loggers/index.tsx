import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Box, Text, useColorModeValue, Code, Input, Button, useToast, Flex } from "@chakra-ui/react";
import { useLoggersStore } from "@components/Loggers/useLogs.ts";
import LoggersButton from "@components/Loggers/Loggers.button.tsx";
import ActionButtons from "@components/Loggers/action.button.tsx"; // Zustand store

interface LogEntry {
    type: "output" | "error";
    cmd?: string;
    message: string;
}

const Loggers = () => {
   const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});
   const [searchQuery, setSearchQuery] = useState("");
   const logRef = useRef<HTMLDivElement>(null);
   const { showLogs } = useLoggersStore();
   const initialized = useRef(false);
   const toast = useToast();

   // Optimized event listener setup
   const handleNewLog = useCallback((data: LogEntry) => {
      setLogs((prev) => {
         const cmdKey = data.cmd || "No Command";
         return {
            ...prev,
            [cmdKey]: [...(prev[cmdKey] || []), data],
         };
      });
   }, []);

   useEffect(() => {
      if (!initialized.current) {
         initialized.current = true;
         globalThis.electronAPI.onCommandEvent(handleNewLog);
      }
   }, [handleNewLog]);

   // Optimized scrolling using requestAnimationFrame
   useEffect(() => {
      if (logRef.current) {
         requestAnimationFrame(() => {
                logRef.current!.scrollTop = logRef.current!.scrollHeight;
         });
      }
   }, [logs]);

   // Optimized filtering with useMemo
   const filteredLogs = useMemo(
      () =>
         Object.entries(logs).filter(([cmd]) =>
            cmd.toLowerCase().includes(searchQuery.toLowerCase())
         ),
      [logs, searchQuery]
   );

   // Copy logs as JSON
   const copyLogsToClipboard = () => {
      const jsonLogs = JSON.stringify(logs, null, 2);
      navigator.clipboard.writeText(jsonLogs).then(() => {
         toast({
            title: "Logs Copied",
            description: "All logs have been copied to the clipboard!",
            status: "success",
            duration: 2000,
            isClosable: true,
         });
      });
   };

   return (
      <>
         <Box
            display={showLogs ? "block" : "none"}
            w="full"
            h="calc(100dvh - 50px)"
            overflowY="hidden"
            bg={useColorModeValue("white", "gray.800")}
            p={4}
            borderRadius="lg"
            borderWidth="1px"
            shadow="lg"
            position="absolute"
            bottom="30px"
            right="0"
            zIndex="2"
         >
            {/* Sticky Search Input & Copy Button */}
            <Box position="sticky" top="0" bg="gray.900" p={2} zIndex="10" display="flex" flexDirection="column" gap="16px">
               <Flex width="100%" gap="2" alignItems="center">
                  <Input
                     placeholder="Filter logs by command..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     bg="gray.800"
                     color="white"
                     borderRadius="md"
                     flex="1"
                  />
                  <Button colorScheme="blue" onClick={copyLogsToClipboard}>
                     Copy Logs
                  </Button>
               </Flex>
               <ActionButtons/>
            </Box>

            {/* Log Display */}
            <Box ref={logRef} overflowY="auto" width="100%" height="calc(100% - 120px)">
               {filteredLogs.length === 0 ? (
                  <Text textAlign="center" color="gray.500">
                            No matching logs found.
                  </Text>
               ) : (
                  filteredLogs.map(([cmd, entries]) => (
                     <Box key={cmd} p={3} borderRadius="md" mb={4} bg="gray.700" color="white">
                        <Text fontWeight="bold" fontSize="md" mb={2}>
                           Command: <Code>{cmd}</Code>
                        </Text>
                        {entries.map((log, index) => (
                           <Box
                              key={index}
                              p={2}
                              borderRadius="md"
                              mb={1}
                              bg={log.type === "error" ? "red.400" : "gray.600"}
                           >
                              <Code whiteSpace="pre-wrap" fontSize="12px">
                                 {log.message.trim()}
                              </Code>
                           </Box>
                        ))}
                     </Box>
                  ))
               )}
            </Box>
         </Box>

         <LoggersButton clearLogs={() => setLogs({})} />
      </>
   );
};

export default Loggers;

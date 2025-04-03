import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Box, Text, useColorModeValue, Code, Input, Button, useToast, Flex } from "@chakra-ui/react";
import { useLoggersStore } from "@components/Loggers/useLogs.ts";
import LoggersButton from "@components/Loggers/Loggers.button.tsx";
import ActionButtons from "@components/Loggers/action.button.tsx"; // Zustand store
import s from "./styles.module.scss";
import { LogEntry } from "@stores/states/logger/types.ts";

const MAX_LOGS_PER_KEY = 10;
const MAX_COMMAND_KEYS = 10;

const Loggers = () => {
   const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});
   const [searchQuery, setSearchQuery] = useState("");
   const logRef = useRef<HTMLDivElement>(null);
   const { showLogs } = useLoggersStore();
   const initialized = useRef(false);
   const toast = useToast();

   const handleNewLog = useCallback((data: LogEntry) => {
      setLogs((prev) => {
         const cmdKey = data.cmd || "No Command";
         
         // Get current logs for this command key
         const currentLogs = prev[cmdKey] || [];
         
         // Add new log and keep only the latest MAX_LOGS_PER_KEY items
         const updatedLogs = [...currentLogs, data].slice(-MAX_LOGS_PER_KEY);
         
         // Create new logs object with the updated command key
         const newLogs = {
            ...prev,
            [cmdKey]: updatedLogs,
         };
         
         // Get all command keys and sort by most recent log timestamp
         const sortedKeys = Object.keys(newLogs).sort((a, b) => {
            const lastLogA = newLogs[a][newLogs[a].length - 1]?.timestamp || 0;
            const lastLogB = newLogs[b][newLogs[b].length - 1]?.timestamp || 0;
            return lastLogB - lastLogA;
         });
         
         // Keep only the latest MAX_COMMAND_KEYS command keys
         const latestKeys = sortedKeys.slice(0, MAX_COMMAND_KEYS);
         
         // Create final logs object with only the latest command keys
         const finalLogs: Record<string, LogEntry[]> = {};
         latestKeys.forEach(key => {
            finalLogs[key] = newLogs[key];
         });
         
         return finalLogs;
      });
   }, []);

   useEffect(() => {
      if (!initialized.current) {
         initialized.current = true;
         globalThis.electronAPI.onCommandEvent(handleNewLog);
      }
   }, [handleNewLog]);

   // Optimized scrolling using requestAnimationFrame
   // useEffect(() => {
   //    if (logRef.current) {
   //       requestAnimationFrame(() => {
   //              logRef.current!.scrollTop = logRef.current!.scrollHeight;
   //       });
   //    }
   // }, [logs]);

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
                     <Box key={cmd} className={s.logGroup}>
                        <Text className={s.command}>{cmd}</Text>
                        {entries.map((entry, index) => (
                           <Text key={index} className={s.logEntry}>
                              {entry.message}
                           </Text>
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

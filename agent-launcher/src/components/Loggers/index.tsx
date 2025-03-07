import { useEffect, useRef, useState } from "react";
import { Box, Text, useColorModeValue, Code, Input } from "@chakra-ui/react";
import { useLoggersStore } from "@components/Loggers/useLogs.ts";
import LoggersButton from "@components/Loggers/Loggers.button.tsx"; // Zustand store

interface LogEntry {
   type: "output" | "error";
   cmd?: string;
   message: string;
}

const Loggers = () => {
   const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});
   const [searchQuery, setSearchQuery] = useState(""); // State for input
   const logRef = useRef<HTMLDivElement>(null);
   const { showLogs } = useLoggersStore();
   const initRef = useRef(false);

   useEffect(() => {
      if (!initRef.current) {
         initRef.current = true;
         window.electronAPI.onCommandEvent((data: LogEntry) => {
            setLogs((prev) => {
               const cmdKey = data.cmd || "No Command";
               return {
                  ...prev,
                  [cmdKey]: [...(prev[cmdKey] || []), data],
               };
            });
         });
      }
   }, []);

   useEffect(() => {
      if (logRef.current) {
         logRef.current.scrollTop = logRef.current.scrollHeight;
      }
   }, [logs]);

   // Filter logs based on search query
   const filteredLogs = Object.entries(logs).filter(([cmd]) =>
      cmd.toLowerCase().includes(searchQuery.toLowerCase())
   );

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
            {/* Input Field (Fixed at Top) */}
            <Box position="sticky" top="0" bg="gray.900" p={2} zIndex="10">
               <Input
                  placeholder="Filter logs by command..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg="gray.800"
                  color="white"
                  borderRadius="md"
               />
            </Box>

            <Box ref={logRef} overflowY="auto" width="100%" height="calc(100% - 40px)">
               {filteredLogs.length === 0 ? (
                  <Text textAlign="center" color="gray.500">
                       No matching logs found.
                  </Text>
               ) : (
                  filteredLogs.map(([cmd, entries], index) => (
                     <Box key={index} p={3} borderRadius="md" mb={4} bg="gray.700" color="white">
                        <Text fontWeight="bold" fontSize="md" mb={2}>
                              Command: <Code>{cmd}</Code>
                        </Text>
                        {entries.map((log, logIndex) => (
                           <Box
                              key={logIndex}
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

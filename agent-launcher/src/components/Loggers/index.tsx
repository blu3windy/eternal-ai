import { useEffect, useRef, useState } from "react";
import { Box, Text, useColorModeValue, Code } from "@chakra-ui/react";
import { useLoggersStore } from "@components/Loggers/useLogs.ts"; // Zustand store

interface LogEntry {
   type: "output" | "error";
   cmd?: string;
   message: string;
}

const Loggers = () => {
   const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});
   const logRef = useRef<HTMLDivElement>(null);
   const { showLogs, toggleLogs } = useLoggersStore(); // Zustand store
   const initRef = useRef(false);

   useEffect(() => {
      if (!initRef.current) {
         initRef.current = true;
         window.electronAPI.onCommandEvent((data: LogEntry) => {
            setLogs((prev) => {
               const cmdKey = data.cmd || "No Command"; // Default key if cmd is missing
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

   return (
      <Box
         ref={logRef}
         display={showLogs ? "block" : "none"}
         w="full"
         maxW="3xl"
         h="600px"
         overflowY="auto"
         bg={useColorModeValue("white", "gray.800")}
         p={4}
         borderRadius="lg"
         borderWidth="1px"
         shadow="lg"
         position="absolute"
         bottom="30px"
         right="0"
      >
         {Object.keys(logs).length === 0 ? (
            <Text textAlign="center" color="gray.500">
                 No logs yet. Click the button to run a command.
            </Text>
         ) : (
            Object.entries(logs).map(([cmd, entries], index) => (
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
                        bg={log.type === "error" ? "red.500" : "gray.600"}
                     >
                        <Text fontWeight="bold">{log.type.toUpperCase()}:</Text>
                        <Code whiteSpace="pre-wrap" fontSize="sm">
                           {log.message.trim()}
                        </Code>
                     </Box>
                  ))}
               </Box>
            ))
         )}
      </Box>
   );
};

export default Loggers;

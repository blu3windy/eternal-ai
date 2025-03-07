import { useEffect, useRef, useState } from "react";
import { Box, Text, useColorModeValue, Code } from "@chakra-ui/react";
import { useLoggersStore } from "@components/Loggers/useLogs.ts";
import LoggersButton from "@components/Loggers/Loggers.button.tsx"; // Zustand store

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
         console.log("Scrolling to bottom");
         logRef.current.scrollTop = logRef.current.scrollHeight;
      }
   }, [logs]);

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
            {/*<Flex gap="12px" flexWrap="wrap" maxWidth="600px" justifyContent="center" alignItems="center">*/}
            {/*   <Button*/}
            {/*      onClick={() => {*/}
            {/*         console.log('Test Run Docker 1-leon');*/}
            {/*         window.electronAPI.dockerRunAgent('leon', '1');*/}
            {/*      }}*/}
            {/*   >*/}
            {/*      Run Docker*/}
            {/*   </Button>*/}
            {/*   <Button*/}
            {/*      onClick={() => {*/}
            {/*         window.electronAPI.modelInstall("bafkreiecx5ojce2tceibd74e2koniii3iweavknfnjdfqs6ows2ikoow6m");*/}
            {/*      }}*/}
            {/*   >*/}
            {/*      INSTALL MODEL*/}
            {/*   </Button>*/}
            {/*   <Button*/}
            {/*      onClick={() => {*/}
            {/*         window.electronAPI.modelRun("bafkreiecx5ojce2tceibd74e2koniii3iweavknfnjdfqs6ows2ikoow6m");*/}
            {/*      }}*/}
            {/*   >*/}
            {/*      RUN MODEL*/}
            {/*   </Button>*/}
            {/*   <Button*/}
            {/*      onClick={() => {*/}
            {/*         window.electronAPI.modelCheckInstall(["bafkreiecx5ojce2tceibd74e2koniii3iweavknfnjdfqs6ows2ikoow6m"]);*/}
            {/*      }}*/}
            {/*   >*/}
            {/*      MODEL CHECK INSTALL*/}
            {/*   </Button>*/}
            {/*   <Button*/}
            {/*      onClick={() => {*/}
            {/*         window.electronAPI.modelCheckRunning().then((hash?: string) => {*/}
            {/*            alert(hash ? `Model is running with hash: ${hash}` : "Model is not running");*/}
            {/*         });*/}
            {/*      }}*/}
            {/*   >*/}
            {/*      MODEL CHECK RUNNING*/}
            {/*   </Button>*/}
            {/*</Flex>*/}
            <Box
               ref={logRef}
               overflowY="auto"
               width="100%"
               height="100%"
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
                              bg={log.type === "error" ? "red.400" : "gray.600"}
                           >
                              {/*<Text fontWeight="bold">{log.type.toUpperCase()}:</Text>*/}
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

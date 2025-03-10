import { useCallback, useEffect, useRef, useState } from "react";

export type LOG_FUNCTION_NAME = "MODEL_INSTALL" | "INITIALIZE"

type LogEntry = {
    type: "output" | "error";
    cmd?: string;
    message: string;
}

type LoggersProps = {
    prefix?: string;
    functionName: LOG_FUNCTION_NAME;
    keys: string[];
}

interface IParsedLog {
    prefix: string;
    functionName: LOG_FUNCTION_NAME;
    logEntry: LogEntry;
    values: { [key: string]: string };
}

const useParseLogs = (props: LoggersProps) => {
   const { prefix = "LAUNCHER_LOGGER", functionName, keys } = props;

   const init = useRef(false);
   const [parsedLogs, setParsedLogs] = useState<IParsedLog[]>([]);
   const [parsedLog, setParsedLog] = useState<IParsedLog | undefined>(undefined);

   const onParseLog = useCallback((data: LogEntry) => {
      const message = data.message;
      if (!message) return;

      // First, check if the message contains the basic format [prefix] [functionName]
      const basePattern = `\\[${prefix}\\]\\s*\\[${functionName}\\]`;
      const baseRegex = new RegExp(basePattern);
        
      if (!baseRegex.test(message)) {
         return; // Exit if basic format doesn't match
      }

      // If we have keys, try to extract their values
      const values: { [key: string]: string } = {};
        
      if (keys.length > 0) {
         keys.forEach(key => {
            // Look for each key individually
            const keyPattern = `--${key}\\s+([^\\s"]+|"[^"]*")`;
            const keyRegex = new RegExp(keyPattern);
            const keyMatch = message.match(keyRegex);
                
            if (keyMatch) {
               // Remove quotes if present
               let value = keyMatch[1];
               if (value.startsWith('"') && value.endsWith('"')) {
                  value = value.slice(1, -1);
               }
               values[key] = value;
            }
         });
      }

      // Create parsed log entry
      const parsed: IParsedLog = {
         prefix,
         functionName,
         logEntry: data,
         values
      };

      setParsedLog(parsed);
      setParsedLogs(prev => [...prev, parsed]);
        
   }, [prefix, functionName, keys]);

   // Clear logs on unmount
   const clearLogs = useCallback(() => {
      setParsedLogs([]);
      setParsedLog(undefined);
   }, []);

   useEffect(() => {
      if (!init.current) {
         init.current = true;
         window.electronAPI.onCommandEvent(onParseLog);
      }
   }, [onParseLog]);

   return {
      parsedLog,
      parsedLogs,
      clearLogs,
   };
};

export default useParseLogs;

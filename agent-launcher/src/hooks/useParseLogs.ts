import { useCallback, useEffect, useRef, useState } from "react";

export type LOG_FUNCTION_NAME = "MODEL_INSTALL" | "INITIALIZE" | "DOCKER_INSTALL"

type LogEntry = {
    type: "output" | "error";
    cmd?: string;
    message: string;
}

type LoggersProps = {
    prefix?: string;
    functionNames: LOG_FUNCTION_NAME[];  // Changed to array
    keys: string[];
}

interface IParsedLog {
    prefix: string;
    functionName: LOG_FUNCTION_NAME;
    logEntry: LogEntry;
    values: { [key: string]: string };
}

const useParseLogs = (props: LoggersProps) => {
   const { prefix = "LAUNCHER_LOGGER", functionNames, keys } = props;  // Changed to functionNames

   const init = useRef(false);
   const [parsedLogs, setParsedLogs] = useState<IParsedLog[]>([]);
   const [parsedLog, setParsedLog] = useState<IParsedLog | undefined>(undefined);

   const onParseLog = useCallback((data: LogEntry) => {
      const message = data.message;
      if (!message) return;

      // Create pattern to match any of the function names
      const functionNamesPattern = functionNames.join('|');
      const basePattern = `\\[${prefix}\\]\\s*\\[(${functionNamesPattern})\\]`;
      const baseRegex = new RegExp(basePattern);
      
      // Try to match and extract the function name
      const baseMatch = message.match(baseRegex);
      if (!baseMatch) return;

      // Get the matched function name
      const matchedFunctionName = baseMatch[1] as LOG_FUNCTION_NAME;
        
      // If we have keys, try to extract their values
      const values: { [key: string]: string } = {};
        
      if (keys.length > 0) {
         keys.forEach(key => {
            const keyPattern = `--${key}\\s+([^\\s"]+|"[^"]*")`;
            const keyRegex = new RegExp(keyPattern);
            const keyMatch = message.match(keyRegex);
                
            if (keyMatch) {
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
         functionName: matchedFunctionName,  // Use the matched function name
         logEntry: data,
         values
      };

      setParsedLog(parsed);
      setParsedLogs(prev => [...prev, parsed]);
        
   }, [prefix, functionNames, keys]);  // Updated dependencies

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
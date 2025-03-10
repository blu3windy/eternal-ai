import { useCallback, useEffect, useRef, useState } from "react";

export type LOG_FUNCTION_NAME = "MODEL_INSTALL"

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
      // Create key pattern if keys exist, otherwise match only prefix + functionName
      const keysPattern = keys.length
         ? keys.map(key => `--${key}\\s+([\\w-]+)`).join("\\s+")
         : "";

      // Final regex pattern
      const regexPattern = `\\[${prefix}\\]\\s*\\[${functionName}\\]${keysPattern ? `\\s+${keysPattern}` : ""}`;

      console.log("Regex Pattern:", regexPattern);

      const regex = new RegExp(regexPattern);
      const match = message.match(regex);

      console.log("Match:", match);
      if (match) {
         const parsed: IParsedLog = {
            prefix,
            functionName,
            logEntry: data,
            values: {} // Store extracted key-value pairs
         };

         keys.forEach((key, index) => {
            parsed.values[key] = match[index + 1] || ""; // Store extracted values
         });

         setParsedLog(parsed);
         setParsedLogs(prev => [...prev, parsed]);
      }
   }, [prefix, functionName, keys]);

   useEffect(() => {
      if (!init.current) {
         init.current = true;
         window.electronAPI.onCommandEvent(onParseLog);
      }
   }, []);

   return {
      parsedLog,
      parsedLogs,
   };
}

export default useParseLogs;

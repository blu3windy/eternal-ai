import path from "path";
import { app } from "electron";

export const PUBLIC_SCRIPT = 'public/scripts';

const SCRIPTS_NAME = {
   DOCKER_INSTALL_SCRIPT: "docker-install.sh",
   DOCKER_FILE : "Dockerfile",
   PACKAGE_JSON: "package.json",
   SERVER_JS: "server.js",
   MODEL_STARTER: "mac.sh",
}

const USER_DATA_FOLDER_NAME = {
   AGENT_DATA: "agent-data",
   AGENT_ROUTER: "agent-router",
   AGENT_JS: "agent-js",
   MODEL: "model",
   DOCKER: "docker"
}

const getScriptPath = (fileName: string, home_path = PUBLIC_SCRIPT) => {
   const isDev = process.env.NODE_ENV === "development";
   return isDev
      ? path.join(app.getAppPath(), home_path, fileName)
      : path.join(process.resourcesPath, home_path, fileName);
}

const getDNSHost = (params: { chainId: string, agentName: string }) => {
   return `${params.chainId}-${params.agentName}`;
}

const executeWithIgnoreError = async (fn: () => Promise<void>) => {
   try {
      await fn();
   } catch (error: any) {
      console.error("executeWithIgnoreError", {
         error: error.message,
         functionName: fn.name
      });
   }
}

const executeCatchError = async (fn: () => Promise<void>) => {
   try {
      await fn();
   } catch (error: any) {
      console.error("executeCatchError", {
         error: error.message,
         functionName: fn.name
      });
      throw error;
   }
}

export {
   getScriptPath,
   SCRIPTS_NAME,
   USER_DATA_FOLDER_NAME,
   getDNSHost,
   executeWithIgnoreError,
   executeCatchError,
}
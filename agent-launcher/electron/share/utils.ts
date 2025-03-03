import path from "path";
import { app } from "electron";

export const PUBLIC_SCRIPT = 'public/scripts';

const SCRIPTS_NAME = {
   NIX_INSTALL_SCRIPT: "install-nix.sh",
   DOCKER_INSTALL_SCRIPT: "install-colima-docker.sh",
   DOCKER_FILE : "Dockerfile",
   PACKAGE_JSON: "package.json",
   SERVER_JS: "server.js",
}

const USER_DATA_FOLDER_NAME = {
   AGENT_DATA: "agent-data",
   AGENT_ROUTER: "agent-router",
   AGENT_JS: "agent-js"
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

export {
   getScriptPath,
   SCRIPTS_NAME,
   USER_DATA_FOLDER_NAME,
   getDNSHost
}
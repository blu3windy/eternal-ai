import path from "path";
import { app } from "electron";

const PUBLIC_SCRIPT = 'public/scripts';

const SCRIPTS_NAME = {
   DOCKER_INSTALL: "install-colima-osascript.sh",
   DOCKER_FILE : "Dockerfile",
   PACKAGE_JSON: "package.json",
   SERVER_JS: "server.js",
}

const USER_DATA_FOLDER_NAME = {
   AGENT_DATA: "agent-data",
}

const getScriptPath = (fileName: string) => {
   const isDev = process.env.NODE_ENV === "development";
   return isDev
      ? path.join(app.getAppPath(), PUBLIC_SCRIPT, fileName)
      : path.join(process.resourcesPath, PUBLIC_SCRIPT, fileName);
}

export {
   getScriptPath,
   SCRIPTS_NAME,
   USER_DATA_FOLDER_NAME
}
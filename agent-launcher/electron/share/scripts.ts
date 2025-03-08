import { app } from "electron";
import path from "path";
import fs from "fs";
import { getScriptPath, PUBLIC_SCRIPT, SCRIPTS_NAME, USER_DATA_FOLDER_NAME } from "./utils.ts";

const copyFiles = async () => {
   const userDataPath = app.getPath("userData");

   console.log(userDataPath)

   const filesToCopy = {
      [USER_DATA_FOLDER_NAME.AGENT_JS]: [
         SCRIPTS_NAME.DOCKER_FILE,
         SCRIPTS_NAME.PACKAGE_JSON,
         SCRIPTS_NAME.SERVER_JS
      ],
      [USER_DATA_FOLDER_NAME.AGENT_ROUTER]: [
         SCRIPTS_NAME.DOCKER_FILE,
         SCRIPTS_NAME.PACKAGE_JSON,
         SCRIPTS_NAME.SERVER_JS
      ],
      [USER_DATA_FOLDER_NAME.MODEL]: [SCRIPTS_NAME.MODEL_STARTER],
      [USER_DATA_FOLDER_NAME.DOCKER]: [SCRIPTS_NAME.DOCKER_INSTALL_SCRIPT]
   };


   const convertToUpperCase = (str: string) => {
      return str.toUpperCase().replace(/-/g, "_");
   }

   const folderPaths = Object.fromEntries(
      Object.keys(filesToCopy).map(key => [
         key,
         path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA, USER_DATA_FOLDER_NAME[convertToUpperCase(key)])
      ])
   );


   for (const folderPath of Object.values(folderPaths)) {
      if (!fs.existsSync(folderPath)) {
         fs.mkdirSync(folderPath, { recursive: true });
      }
   }

   for (const [key, files] of Object.entries(filesToCopy)) {
      for (const file of files) {
         console.log("dockerCopyBuild", Object.values(folderPaths));
         const source = getScriptPath(file, `${PUBLIC_SCRIPT}/${USER_DATA_FOLDER_NAME[convertToUpperCase(key)]}`);
         const destination = path.join(folderPaths[key], file);
         fs.copyFileSync(source, destination);
      }
   }
}

export {
   copyFiles
}
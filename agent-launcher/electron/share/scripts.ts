import { app } from "electron";
import path from "path";
import fs from "fs";
import { getScriptPath, PUBLIC_SCRIPT, SCRIPTS_NAME, USER_DATA_FOLDER_NAME } from "./utils.ts";

const FILES_TO_COPY = {
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
}

const copyFiles = async () => {
   const userDataPath = app.getPath("userData");
   console.log(userDataPath);

   const convertToUpperCase = (str: string) => str.toUpperCase().replace(/-/g, "_");

   const createFolderPaths = (basePath: string, folders: Record<string, string[]>) => {
      return Object.fromEntries(
         Object.keys(folders).map(key => [
            key,
            path.join(basePath, USER_DATA_FOLDER_NAME.AGENT_DATA, USER_DATA_FOLDER_NAME[convertToUpperCase(key)])
         ])
      );
   };

   const ensureFoldersExist = (folders: Record<string, string>) => {
      for (const folderPath of Object.values(folders)) {
         if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
         }
      }
   };

   const copyFilesToFolders = (folders: Record<string, string>, files: Record<string, string[]>) => {
      for (const [key, fileList] of Object.entries(files)) {
         for (const file of fileList) {
            const source = getScriptPath(file, `${PUBLIC_SCRIPT}/${USER_DATA_FOLDER_NAME[convertToUpperCase(key)]}`);
            const destination = path.join(folders[key], file);
            fs.copyFileSync(source, destination);
         }
      }
   };

   const folderPaths = createFolderPaths(userDataPath, FILES_TO_COPY);
   ensureFoldersExist(folderPaths);
   copyFilesToFolders(folderPaths, FILES_TO_COPY);
};

export {
   copyFiles
}
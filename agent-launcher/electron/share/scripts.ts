import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { getScriptPath, PUBLIC_SCRIPT, SCRIPTS_NAME, USER_DATA_FOLDER_NAME } from './utils.ts';

const FILES_TO_COPY = {
   [USER_DATA_FOLDER_NAME.AGENT_JS]: [
      SCRIPTS_NAME.DOCKER_FILE,
      SCRIPTS_NAME.PACKAGE_JSON,
      SCRIPTS_NAME.SERVER_JS,
   ],
   [USER_DATA_FOLDER_NAME.AGENT_ROUTER]: [
      SCRIPTS_NAME.DOCKER_FILE,
      SCRIPTS_NAME.PACKAGE_JSON,
      SCRIPTS_NAME.SERVER_JS,
   ],
   [USER_DATA_FOLDER_NAME.MODEL]: [SCRIPTS_NAME.MODEL_STARTER, SCRIPTS_NAME.MODEL_DOWNLOAD_BASE],
   [USER_DATA_FOLDER_NAME.DOCKER]: [
      SCRIPTS_NAME.DOCKER_INSTALL_SCRIPT,
      SCRIPTS_NAME.DOCKER_BUILD_SCRIPT,
      SCRIPTS_NAME.DOCKER_ACTION_SCRIPT,
      SCRIPTS_NAME.DOCKER_INFO_SCRIPT,
   ],
};

const copyFiles = async () => {
   const userDataPath = app.getPath('userData');
   console.log(userDataPath);

   const convertToUpperCase = (str: string) => str.toUpperCase().replace(/-/g, '_');

   const createFolderPaths = (basePath: string, folders: Record<string, string[]>) => {
      return Object.fromEntries(
         Object.keys(folders).map((key) => [
            key,
            path.join(
               basePath,
               USER_DATA_FOLDER_NAME.AGENT_DATA,
               USER_DATA_FOLDER_NAME[convertToUpperCase(key)]
            ),
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

   const copyFilesToFolders = (
      folders: Record<string, string>,
      files: Record<string, string[]>
   ) => {
      for (const [key, fileList] of Object.entries(files)) {
         for (const file of fileList) {
            const source = getScriptPath(
               file,
               `${PUBLIC_SCRIPT}/${USER_DATA_FOLDER_NAME[convertToUpperCase(key)]}`
            );
            const destination = path.join(folders[key], file);
            fs.copyFileSync(source, destination);
         }
      }
   };

   const folderPaths = createFolderPaths(userDataPath, FILES_TO_COPY);
   ensureFoldersExist(folderPaths);
   copyFilesToFolders(folderPaths, FILES_TO_COPY);

   ensureFoldersExist({
      'agent-router-data-mount': `${folderPaths[USER_DATA_FOLDER_NAME.AGENT_ROUTER]}/data`,
   });
};

const copyPublicToUserData = async (param: {
   names: string[];
   destination: string[];
   source: string[];
}) => {
   const userDataPath = app.getPath('userData');
   for (const name of param.names) {
      const destinationFolder = path.join(userDataPath, ...param.destination);
      const destination = path.join(destinationFolder, name);
      const source = getScriptPath(name, `${[PUBLIC_SCRIPT, ...param.source].join('/')}`);

      // destination: '/Users/macbookpro/Library/Application Support/agent-launcher/agent-data/agent-js/package.json',
      //    source: '/Users/macbookpro/trustless-computer/eternal-ai/agent-launcher/public/scripts/agent-js/package.json'

      if (!fs.existsSync(destinationFolder)) {
         fs.mkdirSync(destinationFolder, { recursive: true });
      }

      fs.copyFileSync(source, destination);
   }
};

export { copyFiles, copyPublicToUserData };

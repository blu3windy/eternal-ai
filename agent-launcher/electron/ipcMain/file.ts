import { app, ipcMain } from "electron";
import { promises as fs } from "fs";
import AdmZip from "adm-zip";
import * as path from "path";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import { copyPublicToUserData } from "electron/share/scripts.ts";
import { USER_DATA_FOLDER_NAME } from "electron/share/utils.ts";
/**
 * ├─┬ agent-data
 * │ ├─┬ agents
 * │ │ ├── agent_1.js
 * │ │ └── agent_2.js
 * │
 */
const APP_DIR = path.join(app.getPath('userData'), 'agent-data', 'agents');

const checkAndCreateFolder = async (folderPath: string) => {
   try {
      await fs.access(folderPath);
   } catch (error) {
      await fs.mkdir(folderPath, { recursive: true });
   }
}

const getFilePath = (fileName: string, folderName: string): string => {
   const folderPath = path.join(APP_DIR, folderName.toLowerCase());
   return path.join(folderPath, fileName);
};

async function getFolders(folderPath: string) {
   try {
      const items = await fs.readdir(folderPath);
      const folderPromises = items.map(async item => {
         try {
            const stats = await fs.stat(path.join(folderPath, item));
            return stats.isDirectory() ? item : null;
         } catch (error) {
            return null;
         }
      });
      const folders = (await Promise.all(folderPromises)).filter(Boolean);
      return folders;
   } catch (error) {
      throw error;
   }
}

const ipcMainSafeFile = () => {
   ipcMain.handle(EMIT_EVENT_NAME.READ_FILE, async (_, fileName, folderName) => {
      const filePath = getFilePath(fileName, folderName);
      await checkAndCreateFolder(path.dirname(filePath));
      return await fs.readFile(filePath, 'utf-8');
   });
   ipcMain.handle(EMIT_EVENT_NAME.GET_FILE_PATH, async (_, fileName, folderName) => {
      const filePath = getFilePath(fileName, folderName);
      await checkAndCreateFolder(path.dirname(filePath));
      return filePath;
   });
   ipcMain.handle(EMIT_EVENT_NAME.WRITE_FILE, async (_, fileName, folderName, content) => {
      const filePath = getFilePath(fileName, folderName);
      await checkAndCreateFolder(path.dirname(filePath));
      await fs.writeFile(filePath, content, "utf8");
      try {
         const stat = await fs.stat(filePath);
         if (stat.isDirectory()) {
            console.error('Error: prompt.js is a directory. Removing...');
            await fs.rmdir(filePath, { recursive: true });
            await fs.writeFile(filePath, content, "utf8");
         }
      } catch (error) {
      }
      return filePath;
   });
   ipcMain.handle(EMIT_EVENT_NAME.ACCESS_FILE, async (_, fileName, folderName) => {
      try {
         const filePath = getFilePath(fileName, folderName.toLowerCase());
         await fs.stat(filePath);
         return true;
      } catch (error) {
         return false;
      }
   });
   ipcMain.handle(EMIT_EVENT_NAME.GET_EXIST_FOLDERS, async (_) => {
      try {
         const folders = await getFolders(APP_DIR);
         return folders;
      } catch (error: any) {
         return { error: error.message };
      }
   });
   ipcMain.handle(EMIT_EVENT_NAME.REMOVE_FOLDERS, async (_, folderName) => {
      try {
         const folderPath = path.join(APP_DIR, folderName.toLowerCase());
         await fs.rm(folderPath, { recursive: true, force: true });
         return true;
      } catch (error: any) {
         return false;
      }
   });
   ipcMain.handle(EMIT_EVENT_NAME.UNZIP_FILE, (_, zipPath, extractTo) => {
      try {
         console.log('zipPath', zipPath)
         console.log('extractTo', extractTo)

        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractTo, true); // true = overwrite
        console.log("Unzip successful!");
      } catch (err) {
         console.error("Error unzipping file:", err);
      }
   });
   ipcMain.handle(EMIT_EVENT_NAME.SAVE_ZIPFILE, async (_, fileName, folderName, content) => {
      const filePath = getFilePath(fileName, folderName);
      await checkAndCreateFolder(path.dirname(filePath));
      // Convert the string (base64 or binary) into a Buffer
      const zipBuffer = Buffer.from(content, "base64"); // Change to "utf-8" if it's plain binary

      // Write buffer to a ZIP file
      await fs.writeFile(filePath, zipBuffer);
      console.log("ZIP file saved:", filePath);
      return filePath;
   });
    ipcMain.handle(EMIT_EVENT_NAME.COPY_REQUIRE_RUN_PYTHON, async (_, folderName) => {
      await copyPublicToUserData({
         names: ["Dockerfile", "requirements.txt", "server.py"],
         destination: [USER_DATA_FOLDER_NAME.AGENT_DATA, USER_DATA_FOLDER_NAME.AGENTS, folderName],
         source: [USER_DATA_FOLDER_NAME.AGENT_PY]
      })
   });

};

export default ipcMainSafeFile;
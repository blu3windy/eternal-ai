import { app, ipcMain } from "electron";
import { promises as fs } from "fs";
import AdmZip from "adm-zip";
import * as path from "path";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";

/**
 * ├─┬ agent-data
 * │ ├─┬ agents
 * │ │ ├── agent_1.js
 * │ │ └── agent_2.js
 * │
 */
const appDir = path.join(app.getPath('userData'), 'agent-data', 'agents');

const checkAndCreateFolder = async (folderPath: string) => {
   try {
      await fs.access(folderPath);
   } catch (error) {
      await fs.mkdir(folderPath, { recursive: true });
   }
}

const ipcMainSafeFile = () => {
   ipcMain.handle(EMIT_EVENT_NAME.READ_FILE, async (_, fileName, folderName) => {
      const _appDir = path.join(appDir, folderName);
      await checkAndCreateFolder(_appDir);
      const filePath = path.join(_appDir, fileName);
      return await fs.readFile(filePath, 'utf-8');
   });
   ipcMain.handle(EMIT_EVENT_NAME.GET_FILE_PATH, async (_, fileName, folderName) => {
      const _appDir = path.join(appDir, folderName);
      await checkAndCreateFolder(_appDir);
      const filePath = path.join(_appDir, fileName);
      return filePath;
   });
   ipcMain.handle(EMIT_EVENT_NAME.WRITE_FILE, async (_, fileName, folderName, content) => {
      const _appDir = path.join(appDir, folderName);
      await checkAndCreateFolder(_appDir);
      const filePath = path.join(_appDir, fileName);
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
         const _appDir = path.join(appDir, folderName);
         const filePath = path.join(_appDir, fileName);
         await fs.stat(filePath);
         return true;
      } catch (error) {
         return false;
      }
   });
   ipcMain.handle(EMIT_EVENT_NAME.GET_EXIST_FOLDERS, async (_) => {
      try {
         const folders = await getFolders(appDir);
         return folders;
      } catch (error: any) {
         return { error: error.message };
      }
   });
   ipcMain.handle(EMIT_EVENT_NAME.REMOVE_FOLDERS, async (_, folderName) => {
      try {
         const _appDir = path.join(appDir, folderName);
         await fs.rm(_appDir, { recursive: true, force: true });
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
      const _appDir = path.join(appDir, folderName);
      await checkAndCreateFolder(_appDir);
      const filePath = path.join(_appDir, fileName);
      // Convert the string (base64 or binary) into a Buffer
      const zipBuffer = Buffer.from(content, "base64"); // Change to "utf-8" if it's plain binary

      // Write buffer to a ZIP file
      await fs.writeFile(filePath, zipBuffer);
      console.log("ZIP file saved:", filePath);
      return filePath;
   });
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

export default ipcMainSafeFile;
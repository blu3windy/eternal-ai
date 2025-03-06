import { app, ipcMain } from "electron";
import { promises as fs } from "fs";
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
         await checkAndCreateFolder(_appDir);
         const filePath = path.join(_appDir, fileName);
         await fs.access(filePath);
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
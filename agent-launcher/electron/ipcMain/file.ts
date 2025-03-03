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
};

export default ipcMainSafeFile;
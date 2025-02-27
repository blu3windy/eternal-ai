import { ipcMain } from "electron";
import { promises as fs } from "fs";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import * as path from "path";

const ipcMainSafeFile = () => {
   ipcMain.handle(EMIT_EVENT_NAME.READ_FILE, async (_, fileName) => {
      const filePath = path.join(process.cwd(), fileName);
      return fs.readFile(filePath, 'utf-8');
   });
   ipcMain.handle(EMIT_EVENT_NAME.WRITE_FILE, async (_, fileName, content) => {
      const filePath = path.join(process.cwd(), fileName);
      await fs.writeFile(filePath, content, "utf8");
      return filePath;
   });
   ipcMain.handle(EMIT_EVENT_NAME.ACCESS_FILE, async (_, fileName) => {
      try {
         const filePath = path.join(process.cwd(), fileName);
         await fs.access(filePath);
         return true;
      } catch (error) {
         return false
      }
   });
};

export default ipcMainSafeFile;
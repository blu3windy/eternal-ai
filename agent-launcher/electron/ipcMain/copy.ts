import { ipcMain, clipboard } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";

const ipcMainSafeCopy = () => {
   ipcMain.handle(EMIT_EVENT_NAME.SAFE_COPY, async (_event, text: string) => {
      clipboard.writeText(text); // Copy the private key to clipboard

      // Auto-clear clipboard after 5 seconds
      setTimeout(() => {
         clipboard.clear();
      }, 10000);
   });
};

export default ipcMainSafeCopy;
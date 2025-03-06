import { ipcMain, shell } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";

const ipcMainOpenExtraLink = () => {
   ipcMain.handle(EMIT_EVENT_NAME.OPEN_EXTRA_LINK, (_event, url: string) => {
      console.log(url)
      shell.openExternal(url);
   });
};

export default ipcMainOpenExtraLink;

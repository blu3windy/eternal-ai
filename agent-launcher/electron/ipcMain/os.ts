import { ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import electronStore from "../share/storage.ts";
import { getOsContext } from "../share/os.ts";

const ipcOs = () => {
   ipcMain.handle(EMIT_EVENT_NAME.OS_CONTEXT, async (_event) => {
      const context = await getOsContext();
      return context;
   });
}

export default ipcOs
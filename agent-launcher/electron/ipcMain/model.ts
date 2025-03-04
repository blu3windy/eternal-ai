import { app, ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import command from "../share/command-tool.ts";
import path from "path";
import { USER_DATA_FOLDER_NAME } from "../share/utils.ts";

const ipcMainModel = () => {
   ipcMain.handle(EMIT_EVENT_NAME.MODEL_STARTER, async (_event) => {
      const userDataPath = app.getPath("userData");

      const _path = path.join(`${userDataPath}/${USER_DATA_FOLDER_NAME.AGENT_DATA}`, USER_DATA_FOLDER_NAME.MODEL);

      await command.execAsyncStream("cd '/Users/macbookpro/Library/Application Support/agent-launcher/agent-data/model' && bash '/Users/macbookpro/Library/Application Support/agent-launcher/agent-data/model/mac.sh'")
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_INSTALL, async (_event) => {

   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_RUN, async (_event) => {

   });
}

export default ipcMainModel;
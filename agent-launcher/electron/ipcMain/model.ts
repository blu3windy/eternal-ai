import { app, ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import command from "../share/command-tool.ts";
import { SCRIPTS_NAME } from "../share/utils.ts";
import { getFolderPath, ACTIVE_PATH, downloadedModels } from "../share/model.ts";


const ipcMainModel = () => {
   ipcMain.handle(EMIT_EVENT_NAME.MODEL_STARTER, async (_event) => {
      const path = getFolderPath();
      await command.execAsyncStream(`cd "${path}" && bash ${SCRIPTS_NAME.MODEL_STARTER}`);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_INSTALL, async (_event, hash: string) => {
      const path = getFolderPath();
      await command.execAsyncStream( `cd "${path}" && source "${path}/${ACTIVE_PATH}" && local-llms download --hash ${hash}`)
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_RUN, async (_event, hash: string) => {
      try {
         const path = getFolderPath();
         console.log("MODEL_RUN 0000");

         const data = await command.execAsyncStream( `cd "${path}" && source "${path}/local_llms/bin/activate" && local-llms start --hash ${hash}`, false);
         console.log("MODEL_RUN 1111", data);
         // return stdout?.trim()?.toLowerCase() === "true";
      } catch (error) {
         console.log("MODEL_RUN", error);
         return false;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_DOWNLOADED_LIST, async (_event, hashs: string[]) => {
      return await downloadedModels()
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_CHECK_RUNNING, async (_event) => {
      const path = getFolderPath();
      try {
         const { stdout } = await command.execAsync( `cd "${path}" && source "${path}/local_llms/bin/activate" && local-llms status`);
         return !!stdout
      } catch (error) {
         console.log("MODEL_CHECK_RUNNING", error);
         return undefined;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_INSTALL_BASE_MODEL, async (_event, hash: string) => {
      const path = getFolderPath();
      try {
         const models = await downloadedModels();
         if (models.some((model) => model.hash === hash)) {
            return true;
         }
         await command.execAsyncStream(`cd "${path}" && bash ${SCRIPTS_NAME.MODEL_DOWNLOAD_BASE} --folder-path "${path}" --hash "${hash}"`);
      } catch (error) {
         throw error;
      }
   });
}

export default ipcMainModel;
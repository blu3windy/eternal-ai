import { app, ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import command from "../share/command-tool.ts";
import path from "path";
import { SCRIPTS_NAME, USER_DATA_FOLDER_NAME } from "../share/utils.ts";

const getModelPath = () => {
   const userDataPath = app.getPath("userData");
   return path.join(`${userDataPath}/${USER_DATA_FOLDER_NAME.AGENT_DATA}`, USER_DATA_FOLDER_NAME.MODEL);
}

const ACTIVE_PATH = 'local_llms/bin/activate'

const checkModelInstall = async (hashs: string[]) => {
   const path = getModelPath();
   const status: { [key: string]: boolean } = {};
   for (const hash of hashs) {
      try {
         const cmd = `cd "${path}" && source "${path}/local_llms/bin/activate" && local-llms check --hash ${hash}`;
         const { stdout, stderr } = await command.execAsync( `${cmd}`);
         console.log("MODEL_CHECK_INSTALL", stdout, stderr);
         if (stderr) {
            status[hash] = false;
         }
         status[hash] = stdout?.trim()?.toLowerCase() === "true";
      } catch (error) {
         console.log("MODEL_CHECK_INSTALL", error);
         status[hash] = false;
      }
   }
   return status;
}

const ipcMainModel = () => {
   ipcMain.handle(EMIT_EVENT_NAME.MODEL_STARTER, async (_event) => {
      const path = getModelPath();
      await command.execAsyncStream(`cd "${path}" && bash ${SCRIPTS_NAME.MODEL_STARTER}`);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_INSTALL, async (_event, hash: string) => {
      const path = getModelPath();
      await command.execAsyncStream( `cd "${path}" && source "${path}/${ACTIVE_PATH}" && local-llms download --hash ${hash}`)
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_RUN, async (_event, hash: string) => {
      try {
         const path = getModelPath();
         console.log("MODEL_RUN 0000");

         const data = await command.execAsyncStream( `cd "${path}" && source "${path}/local_llms/bin/activate" && local-llms start --hash ${hash}`, false);
         console.log("MODEL_RUN 1111", data);
         // return stdout?.trim()?.toLowerCase() === "true";
      } catch (error) {
         console.log("MODEL_RUN", error);
         return false;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_CHECK_INSTALL, async (_event, hashs: string[]) => {

      return await checkModelInstall(hashs);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_CHECK_RUNNING, async (_event) => {
      const path = getModelPath();
      try {
         const { stdout } = await command.execAsync( `cd "${path}" && source "${path}/local_llms/bin/activate" && local-llms status`);
         return !!stdout
      } catch (error) {
         console.log("MODEL_CHECK_RUNNING", error);
         return undefined;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_INSTALL_BASE_MODEL, async (_event, hash: string) => {
      const path = getModelPath();
      try {
         const status = await checkModelInstall([hash]);
         if (status[hash]) {
            return true;
         }
         await command.execAsyncStream(`cd "${path}" && bash ${SCRIPTS_NAME.MODEL_DOWNLOAD_BASE} --folder-path "${path}" --hash "${hash}"`);
      } catch (error) {
         throw error;
      }
   });
}

export default ipcMainModel;
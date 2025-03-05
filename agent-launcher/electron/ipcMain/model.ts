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

const ipcMainModel = () => {
   ipcMain.handle(EMIT_EVENT_NAME.MODEL_STARTER, async (_event) => {
      const path = getModelPath();
      await command.execAsyncStream(`cd '${path}' && bash ${SCRIPTS_NAME.MODEL_STARTER}`);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_INSTALL, async (_event, hash: string) => {
      const path = getModelPath();
      const cmd = `cd '${path}' && source '${path}/local_llms/bin/activate' && local-llms install --hash ${hash}`;
      await command.execAsyncStream( `cd '${path}' && source '${path}/${ACTIVE_PATH}' && local-llms download --max-workers 2 --hash ${hash}`)
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_RUN, async (_event, hash: string) => {
      try {
         const path = getModelPath();
         const { stdout } = await command.execAsync( `cd '${path}' && source '${path}/local_llms/bin/activate' && local-llms start --model unsloth_DeepSeek-R1-Distill-Qwen-1.5B-GGU_Q8_0`);
         return stdout?.trim()?.toLowerCase() === "true";
      } catch (error) {
         console.log("MODEL_RUN", error);
         return false;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_CHECK_INSTALL, async (_event, name: string) => {
      const path = getModelPath();
      try {
         const { stdout, stderr } = await command.execAsync( `cd '${path}' && source '${path}/local_llms/bin/activate' && local-llms check --model ${name}`);
         console.log("MODEL_CHECK_INSTALL", stdout, stderr);
      } catch (error) {
         console.log("MODEL_CHECK_INSTALL", error);
         return false;
      }
   });
}

export default ipcMainModel;
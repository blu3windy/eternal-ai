import { ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import command from "../share/command-tool.ts";
import { SCRIPTS_NAME } from "../share/utils.ts";
import { ACTIVE_PATH, deleteModel, downloadedModels, getFolderPath } from "../share/model.ts";
import { dialogCheckDist } from "../share/file-size.ts";

const ipcMainModel = () => {
   const path = getFolderPath();

   const _sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

   const _onRunModel = async (hash: string) => {
      await command.execAsyncStream( `cd "${path}" && source "${path}/local_llms/bin/activate" && local-llms start --hash ${hash}`, false);
   };

   const _compareString = (str1: string, str2: string) => {
      if (!str1 || !str2) return false;
      return str1?.trim()?.toLowerCase() === str2?.trim()?.toLowerCase();
   }

   const _isDownloaded = async (hash: string) => {
      const models = await downloadedModels();
      return models.some((model) => _compareString(model.hash, hash));
   }

   const _getRunningHash = async () => {
      const stdout = await command.execAsync( `cd "${path}" && source "${path}/local_llms/bin/activate" && local-llms status`);
      return stdout?.trim() || undefined;
   }

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_STARTER, async (_event) => {
      await command.execAsyncStream(`cd "${path}" && bash ${SCRIPTS_NAME.MODEL_STARTER}`);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_INSTALL, async (_event, hash: string) => {
      // Check if disk space is sufficient
      await dialogCheckDist(hash);

      // Proceed with installation if disk space is sufficient
      const cmd = `cd "${path}" && source "${path}/${ACTIVE_PATH}" && local-llms download --hash ${hash}`;
      await command.execAsyncStream(cmd);
      // await _loopCheckDownloaded(hash);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_RUN, async (_event, hash: string) => {
      await _onRunModel(hash);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_DOWNLOADED_LIST, async (_event) => {
      return await downloadedModels();
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_CHECK_RUNNING, async (_event) => {
      const hash = await _getRunningHash();
      return hash;
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_DELETE, async (_event, hash: string) => {
      await deleteModel(hash);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_STOP, async (_event, hash: string) => {
      const cmd =`cd "${path}" && source "${path}/local_llms/bin/activate" && local-llms stop --hash ${hash}`
      await command.execAsyncStream( cmd, false);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_INSTALL_BASE_MODEL, async (_event, hash: string) => {
      const isDownloaded = await _isDownloaded(hash);
      if (isDownloaded) {
         const _runningHash = await _getRunningHash();
         if (!_runningHash) {
            await _onRunModel(hash);
         }
         return;
      }

      await dialogCheckDist(hash);

      let count = 0;
      await command.execAsyncStream(`cd "${path}" && bash ${SCRIPTS_NAME.MODEL_STARTER}`);
      while (count < 3) {
         try {
            const cmd = `cd "${path}" && source "${path}/${ACTIVE_PATH}" && local-llms download --hash ${hash}`;
            await command.execAsyncStream( cmd, false);
            await _sleep(1000 * 5);
            // await command.execAsyncStream(`cd "${path}" && bash ${SCRIPTS_NAME.MODEL_DOWNLOAD_BASE} --folder-path "${path}" --hash "${hash}"`);
            const isDownloaded = await _isDownloaded(hash);
            if (!isDownloaded) {
               throw new Error("Model not downloaded");
            }
            break;
         } catch (error) {
            if (count === 2) {
               throw error
            }
            count++;
            await _sleep(1000 * 30);
         }
      }
   });
}

export default ipcMainModel;
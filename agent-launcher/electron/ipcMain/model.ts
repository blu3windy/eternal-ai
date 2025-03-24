import { ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import command from "../share/command-tool.ts";
import { SCRIPTS_NAME } from "../share/utils.ts";
import { deleteModel, downloadedModels, getFolderPath } from "../share/model.ts";
import { dialogCheckDist } from "../share/file-size.ts";

const ipcMainModel = () => {
   const path = getFolderPath();
   const cd = `cd "${path}"`;
   const llms = `python3 "${path}/local_llms/bin/local-llms"`;
   const source = `source "${path}/local_llms/bin/activate"`;

   const _sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

   const _onRunModel = async (hash: string) => {
      // await command.killProcessUsingPort(8080);
      await command.execAsyncStream( `${cd} && ${source} && ${llms} start --hash ${hash}`);
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
      const stdout = await command.execAsync( `${cd} && ${source} && ${llms} status`);
      return stdout?.trim() || undefined;
   }

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_STARTER, async (_event) => {
      await command.execAsyncStream(`cd "${path}" && bash ${SCRIPTS_NAME.MODEL_STARTER}`);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_INSTALL, async (_event, hash: string) => {
      // Check if disk space is sufficient
      await dialogCheckDist(hash);
      // Proceed with installation if disk space is sufficient
      const cmd = `${cd} && ${source} && ${llms} download --hash ${hash}`;
      await command.execAsyncStream(cmd);
      await _onRunModel(hash);
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
      const cmd =`${cd} && ${source} && ${llms} stop`
      await command.execAsyncStream(cmd);
      // await command.killProcessUsingPort(8080);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_INSTALL_BASE_MODEL, async (_event, hash: string) => {
      const isDownloaded = await _isDownloaded(hash);

      if (isDownloaded) {
         // await command.killProcessUsingPort(8080);
         const _runningHash = await _getRunningHash();
         if (!_runningHash) {
            await _onRunModel(hash);
         }
         return;
      }

      await dialogCheckDist(hash);
      // await command.killProcessUsingPort(8080);
      await command.execAsyncStream(`cd "${path}" && bash ${SCRIPTS_NAME.MODEL_STARTER}`);

      let count = 0;
      const maxRetries = 3;
      const retryDelay = 30000; // 30 seconds
      const sleepDuration = 3000; // 3 seconds

      while (count < maxRetries) {
         try {
            const cmd = `${cd} && ${source} && ${llms} download --hash ${hash}`;
        
            // Execute the command
            await command.execAsyncStream(cmd);
        
            // Wait for a short duration before checking if the model is downloaded
            await _sleep(sleepDuration);
        
            // Check if the model is downloaded
            const isDownloaded = await _isDownloaded(hash);
            if (!isDownloaded) {
               throw new Error("Model not downloaded");
            }
        
            // Run the model if downloaded
            await _onRunModel(hash);
            break; // Exit the loop if successful
         } catch (error) {
            count++;
            if (count === maxRetries) {
               throw error; // Rethrow the error after max retries
            }
            await _sleep(retryDelay); // Wait before retrying
         }
      }
   });
}

export default ipcMainModel;
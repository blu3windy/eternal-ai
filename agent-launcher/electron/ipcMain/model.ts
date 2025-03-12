import { app, ipcMain, dialog } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import command from "../share/command-tool.ts";
import { SCRIPTS_NAME } from "../share/utils.ts";
import { getFolderPath, ACTIVE_PATH, downloadedModels, deleteModel } from "../share/model.ts";
import { validateDiskSpace } from "../share/utils.ts";

// Constants for size calculations
const MB_TO_GB = 1024; // 1 GB = 1024 MB
const MODEL_CHUNK_SIZE_MB = 430; // Size per chunk in MB

const ipcMainModel = () => {
   ipcMain.handle(EMIT_EVENT_NAME.MODEL_STARTER, async (_event) => {
      const path = getFolderPath();
      await command.execAsyncStream(`cd "${path}" && bash ${SCRIPTS_NAME.MODEL_STARTER}`);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_INSTALL, async (_event, hash: string) => {
      try {
         // Get number of files from IPFS
         const files = await fetch("https://gateway.mesh3.network/ipfs/bafkreic5e3lsc3bg4pnb3qpiqz2732pjqkbn2wv5ar3ilpxykd45nzb6za")
            .then((res) => res.json())
            .then((res) => res.num_of_file);

         // Calculate total size in GB
         const totalSizeGB = (files * MODEL_CHUNK_SIZE_MB) / MB_TO_GB;
         
         // Check disk space before proceeding
         const requiredGB = Math.ceil(totalSizeGB); // Round up to ensure we have enough space
         const path = getFolderPath();
         
         const { isValid, availableSpace, requiredSpace } = await validateDiskSpace(requiredGB, path);

         console.log("MODEL_INSTALL Space Check:", {
            files,
            totalSizeGB,
            isValid,
            availableSpace,
            requiredSpace
         });
         
         if (!isValid) {
            const response = await dialog.showMessageBox({
               type: 'warning',
               title: 'Insufficient Disk Space',
               message: 'Not enough disk space to install the model',
               detail: `Model Size: ${(Number(totalSizeGB.toFixed(2)) / 2).toFixed(2)}GB\nAvailable space: ${availableSpace}GB\nRequired space (with buffer): ${requiredSpace}GB\n\nPlease free up some disk space and try again.`,
               buttons: ['OK'],
               defaultId: 0
            });
            throw new Error('Insufficient disk space');
         }

         // Proceed with installation if disk space is sufficient
         await command.execAsyncStream(
            `cd "${path}" && source "${path}/${ACTIVE_PATH}" && local-llms download --hash ${hash}`
         );
      } catch (error) {
         console.error('Model installation error:', error);
         throw error;
      }
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

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_DELETE, async (_event, hash: string) => {
      await deleteModel(hash);
   });

   ipcMain.handle(EMIT_EVENT_NAME.MODEL_STOP, async (_event, hash: string) => {
      const path = getFolderPath();
      try {
         const data = await command.execAsyncStream( `cd "${path}" && source "${path}/local_llms/bin/activate" && local-llms stop --hash ${hash}`, false);
         return data;
      } catch (error) {
         console.log("MODEL_STOP", error);
         return false;
      }
   });
}

export default ipcMainModel;
import keytar from "keytar";
import { ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";

const SERVICE_NAME = "ETERNAL_AI_LAUNCHER_ELECTRON_APP";

/**
 * Sets up IPC handlers for keychain operations using keytar.
 * Handles saving, retrieving, and deleting passwords.
 */
const ipcMainKeyChain = () => {
   /**
     * Handles the event to save a password.
     * @param {Electron.IpcMainInvokeEvent} _event - The event object.
     * @param {string} key - The key associated with the password.
     * @param {string} value - The value to save.
     * @returns {Promise<{success: boolean, error?: string}>} - The result of the operation.
     */
   ipcMain.handle(EMIT_EVENT_NAME.KEYTAR_SAVE, async (_event, key: string, value: string) => {
      try {
         await keytar.setPassword(SERVICE_NAME, key, value);
         return { success: true };
      } catch (error: any) {
         return { success: false, error: error.message };
      }
   });

   /**
     * Handles the event to retrieve a password.
     * @param {Electron.IpcMainInvokeEvent} _event - The event object.
     * @param {string} key - The key associated with the password.
     * @returns {Promise<string>} - The result of the operation.
     */
   ipcMain.handle(EMIT_EVENT_NAME.KEYTAR_GET, async (_event, key: string) => {
      try {
         const text = await keytar.getPassword(SERVICE_NAME, key);
         return text;
      } catch (error: any) {
         throw error;
      }
   });

   /**
     * Handles the event to delete a password.
     * @param {Electron.IpcMainInvokeEvent} _event - The event object.
     * @param {string} key - The key associated with the password.
     * @returns {Promise<{success: boolean, error?: string}>} - The result of the operation.
     */
   ipcMain.handle(EMIT_EVENT_NAME.KEYTAR_REMOVE, async (_event, key: string) => {
      try {
         await keytar.deletePassword(SERVICE_NAME, key);
         return { success: true };
      } catch (error: any) {
         return { success: false, error: error.message };
      }
   });
};

export default ipcMainKeyChain;
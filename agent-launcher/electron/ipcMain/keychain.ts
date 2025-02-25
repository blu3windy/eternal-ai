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
        console.log(`[Main Process] Saving password for: ${key}`);
        try {
            await keytar.setPassword(SERVICE_NAME, key, value);
            return { success: true };
        } catch (error: any) {
            console.error(`[Main Process] Error saving password: ${error.message}`);
            return { success: false, error: error.message };
        }
    });

    /**
     * Handles the event to retrieve a password.
     * @param {Electron.IpcMainInvokeEvent} _event - The event object.
     * @param {string} key - The key associated with the password.
     * @returns {Promise<{success: boolean, value?: string, error?: string}>} - The result of the operation.
     */
    ipcMain.handle(EMIT_EVENT_NAME.KEYTAR_GET, async (_event, key: string) => {
        console.log(`[Main Process] Retrieving password for: ${key}`);
        try {
            const value = await keytar.getPassword(SERVICE_NAME, key);
            return { success: true, value };
        } catch (error: any) {
            console.error(`[Main Process] Error retrieving password: ${error.message}`);
            return { success: false, error: error.message };
        }
    });

    /**
     * Handles the event to delete a password.
     * @param {Electron.IpcMainInvokeEvent} _event - The event object.
     * @param {string} key - The key associated with the password.
     * @returns {Promise<{success: boolean, error?: string}>} - The result of the operation.
     */
    ipcMain.handle(EMIT_EVENT_NAME.KEYTAR_REMOVE, async (_event, key: string) => {
        console.log(`[Main Process] Deleting password for: ${key}`);
        try {
            await keytar.deletePassword(SERVICE_NAME, key);
            return { success: true };
        } catch (error: any) {
            console.error(`[Main Process] Error deleting password: ${error.message}`);
            return { success: false, error: error.message };
        }
    });
};

export default ipcMainKeyChain;
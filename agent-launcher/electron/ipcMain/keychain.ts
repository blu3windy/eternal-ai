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
     * @param {string} name - The name associated with the password.
     * @param {string} password - The password to save.
     * @returns {Promise<{success: boolean, error?: string}>} - The result of the operation.
     */
    ipcMain.handle(EMIT_EVENT_NAME.SAVE_PASSWORD, async (_event, name: string, password: string) => {
        console.log(`[Main Process] Saving password for: ${name}`);
        try {
            await keytar.setPassword(SERVICE_NAME, name, password);
            return { success: true };
        } catch (error: any) {
            console.error(`[Main Process] Error saving password: ${error.message}`);
            return { success: false, error: error.message };
        }
    });

    /**
     * Handles the event to retrieve a password.
     * @param {Electron.IpcMainInvokeEvent} _event - The event object.
     * @param {string} name - The name associated with the password.
     * @returns {Promise<{success: boolean, password?: string, error?: string}>} - The result of the operation.
     */
    ipcMain.handle(EMIT_EVENT_NAME.GET_PASSWORD, async (_event, name: string) => {
        console.log(`[Main Process] Retrieving password for: ${name}`);
        try {
            const password = await keytar.getPassword(SERVICE_NAME, name);
            return { success: true, password };
        } catch (error: any) {
            console.error(`[Main Process] Error retrieving password: ${error.message}`);
            return { success: false, error: error.message };
        }
    });

    /**
     * Handles the event to delete a password.
     * @param {Electron.IpcMainInvokeEvent} _event - The event object.
     * @param {string} name - The name associated with the password.
     * @returns {Promise<{success: boolean, error?: string}>} - The result of the operation.
     */
    ipcMain.handle(EMIT_EVENT_NAME.DELETE_PASSWORD, async (_event, name: string) => {
        console.log(`[Main Process] Deleting password for: ${name}`);
        try {
            await keytar.deletePassword(SERVICE_NAME, name);
            return { success: true };
        } catch (error: any) {
            console.error(`[Main Process] Error deleting password: ${error.message}`);
            return { success: false, error: error.message };
        }
    });
};

export default ipcMainKeyChain;
import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";

const ipcCheckAndUpdateApp = () => {
   ipcMain.handle(EMIT_EVENT_NAME.CHECK_FOR_UPDATE, () => {
      autoUpdater.checkForUpdates();
   });

   ipcMain.handle("apply-update", () => {
      autoUpdater.quitAndInstall();
   });

   ipcMain.handle(EMIT_EVENT_NAME.GET_VERSION, () => {
      return app.getVersion();
   });
};

export default ipcCheckAndUpdateApp;

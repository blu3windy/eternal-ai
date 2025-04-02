import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";

const ipcCheckAndUpdateApp = () => {
  ipcMain.handle(EMIT_EVENT_NAME.CHECK_FOR_UPDATE, () => {
    console.log("check-for-update");
    autoUpdater.checkForUpdates();
  });

  ipcMain.handle("quit-and-install", () => {
    console.log("quit-and-install");
    // autoUpdater.quitAndInstall(true, true);
    // app.relaunch();
    // app.exit(0);
  });

  ipcMain.handle("download-and-restart", () => {
    console.log("download-and-restart");
    autoUpdater.downloadUpdate().then(() => {
      autoUpdater.quitAndInstall();
    });
    // autoUpdater.quitAndInstall(true, true);
    // app.relaunch();
    // app.exit(0);
  });
};

export default ipcCheckAndUpdateApp;

import { app, ipcMain } from "electron";
import ipcMainKeyChain from "./keychain.ts";
import ipcMainSafeCopy from "./copy.ts";
import ipcMainSafeFile from "./file.ts";
import ipcMainDocker from "./docker.ts";
import ipcMainModel from "./model.ts";
import ipcMainOpenExtraLink from "./openExtraLink.ts";
import checkAndUpdateApps from "./checkAndUpdateApps.ts";
import ipcStore from "./store.ts";
import ipcOs from "./os.ts";
import { EMIT_EVENT_NAME } from "../constants";

const runIpcMain = () => {
   ipcMainDocker();
   ipcMainKeyChain();
   ipcMainSafeCopy();
   ipcMainOpenExtraLink();
   ipcMainSafeFile();
   ipcMainModel();
   ipcStore();
   checkAndUpdateApps();
   ipcOs();

   ipcMain.handle(EMIT_EVENT_NAME.GET_VERSION, () => {
      return app.getVersion();
   });
}

export default runIpcMain;
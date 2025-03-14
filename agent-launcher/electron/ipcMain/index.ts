import ipcMainKeyChain from "./keychain.ts";
import ipcMainSafeCopy from "./copy.ts";
import ipcMainSafeFile from "./file.ts";
import ipcMainDocker from "./docker.ts";
import ipcMainModel from "./model.ts";
import ipcMainOpenExtraLink from "./openExtraLink.ts";
import checkAndUpdateApps from "./checkAndUpdateApps.ts";
import ipcStore from "./store.ts";

const runIpcMain = () => {
   ipcMainDocker();
   ipcMainKeyChain();
   ipcMainSafeCopy();
   ipcMainOpenExtraLink();
   ipcMainSafeFile();
   ipcMainModel();
   ipcStore();
   checkAndUpdateApps();
}

export default runIpcMain;
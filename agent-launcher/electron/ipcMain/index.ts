import ipcMainKeyChain from "./keychain.ts";
import ipcMainSafeCopy from "./copy.ts";
import ipcMainSafeFile from "./file.ts";
import ipcMainDocker from "./docker.ts";
import ipcMainModel from "./model.ts";

const runIpcMain = () => {
   ipcMainDocker();
   ipcMainKeyChain();
   ipcMainSafeCopy();
   ipcMainSafeFile();
   ipcMainModel();
}

export default runIpcMain;
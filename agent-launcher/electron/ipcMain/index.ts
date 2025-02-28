import ipcMainKeyChain from "./keychain.ts";
import ipcMainSafeCopy from "./copy.ts";
import ipcMainSafeFile from "./file.ts";
import ipcMainDocker from "./docker.ts";

const runIpcMain = () => {
   ipcMainDocker();
   ipcMainKeyChain();
   ipcMainSafeCopy();
   ipcMainSafeFile();
}

export default runIpcMain;
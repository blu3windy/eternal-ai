import ipcMainKeyChain from "./keychain.ts";
import ipcMainSafeCopy from "./copy.ts";
import ipcMainSafeFile from "./file.ts";

const runIpcMain = () => {
   ipcMainKeyChain();
   ipcMainSafeCopy();
   ipcMainSafeFile();
}

export default runIpcMain;
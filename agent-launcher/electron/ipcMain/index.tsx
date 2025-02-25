import ipcMainKeyChain from "./keychain.ts";
import ipcMainSafeCopy from "./copy.ts";

const runIpcMain = () => {
   ipcMainKeyChain();
   ipcMainSafeCopy();
}

export default runIpcMain;
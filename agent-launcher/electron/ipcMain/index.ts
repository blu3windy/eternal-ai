import ipcMainKeyChain from "./keychain.ts";
import ipcMainSafeCopy from "./copy.ts";
import ipcMainSafeFile from "./file.ts";
import ipcMainDocker from "./docker.ts";
import ipcMainModel from "./model.ts";


function updatePath() {
   const additionalPaths = ['/usr/local/bin', '/opt/homebrew/bin'];
   const currentPath = process.env.PATH || '';

   additionalPaths.forEach((path) => {
      if (!currentPath.includes(path)) {
         process.env.PATH += `:${path}`;
      }
   });

   console.log(`Updated PATH: ${process.env.PATH}`);
}

const runIpcMain = () => {
   updatePath();
   ipcMainDocker();
   ipcMainKeyChain();
   ipcMainSafeCopy();
   ipcMainSafeFile();
   ipcMainModel();
}

export default runIpcMain;
import { app, ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";

import { exec } from "child_process";
import { promisify } from "util";
import path from 'path';

const execAsync = promisify(exec);

const PUBLIC_SCRIPT = 'public/scripts';

const FILE_NAME = {
   DOCKER_INSTALL: "install-colima-osascript.sh",
}

const getScriptPath = (fileName: string) => {
   const isDev = process.env.NODE_ENV === "development";
   return isDev
      ? path.join(app.getAppPath(), PUBLIC_SCRIPT, fileName)
      : path.join(process.resourcesPath, PUBLIC_SCRIPT, fileName);
}

const ipcMainDocker = () => {
   ipcMain.handle(EMIT_EVENT_NAME.CHECK_DOCKER, async (_event) => {
      try {
         // check docker version
         const { stderr } = await execAsync("docker -v");
         return !stderr;
      } catch (error) {
         return false;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.INSTALL_DOCKER, async (_event) => {
      const scriptPath = getScriptPath(FILE_NAME.DOCKER_INSTALL);
      await execAsync(`chmod +x "${scriptPath}"`);
      const { stdout, stderr } = await execAsync(`sh ${scriptPath}`);

      if (stderr) {
         console.error(`stderr: ${stderr}`);
         return;
      }

      console.log(`stdout: ${stdout}`);
   });
}

export default ipcMainDocker;
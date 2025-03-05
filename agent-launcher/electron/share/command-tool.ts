import { exec, spawn } from "child_process";
import { promisify } from "util";
import fs from "fs";
import { BrowserWindow } from "electron";

const execAsync = async (cmd: string) => {
   return promisify(exec)(cmd); // Execute with updated PATH
};

const execAsyncDockerDir = async (cmd: string) => {
   const possiblePaths = [
      "/opt/homebrew/bin/docker", // Apple Silicon macOS (Homebrew)
      "/usr/bin/docker",        // Standard system install
      "/usr/local/bin/docker",  // Intel macOS (Homebrew)
   ];

   let dockerDir = '';
   for (const dockerPath of possiblePaths) {
      if (fs.existsSync(dockerPath)) {
         dockerDir = dockerPath.substring(0, dockerPath.lastIndexOf("/"));
         break;
      }
   }

   console.log(`dockerDir: ${dockerDir}`);

   const env = dockerDir ? { ...process.env, PATH: `${dockerDir}:${process.env.PATH}` } : process.env;

   return promisify(exec)(cmd, { env }); // Execute with updated PATH
};

const execAsyncStream = (cmd: string) => {
   return new Promise<void>((resolve, reject) => {
      const win = BrowserWindow.getAllWindows()[0]; // Get main window
      if (!win) {
         console.error("No active Electron window found.");
         return reject(new Error("No active Electron window found."));
      }

      const process = exec(cmd);

      process.stdout?.on("data", (data) => {
         console.log(data.toString());
         win.webContents.send("command-event", { type: "output", message: data.toString() });
      });

      process.stderr?.on("data", (data) => {
         console.error(data.toString());
         win.webContents.send("command-event", { type: "error", message: data.toString() });
      });

      process.on("close", (code) => {
         if (code === 0) {
            win.webContents.send("command-event", { type: "done", message: "Process completed successfully" });
            resolve();
         } else {
            win.webContents.send("command-event", { type: "error", message: `Process exited with code ${code}` });
            reject(new Error(`Exited with code ${code}`));
         }
      });
   });
};

const command = {
   execAsync,
   execAsyncStream,
   execAsyncDockerDir,
}

export default command;
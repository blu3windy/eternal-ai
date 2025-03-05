import { exec, spawn } from "child_process";
import { promisify } from "util";
import fs from "fs";
import { BrowserWindow } from "electron";

const execAsync = async (cmd: string) => {
   return promisify(exec)(cmd); // Execute with updated PATH
};

let dockerDir = '';

const sendEvent = (params: { type: string, data: string, cmd: string, win: BrowserWindow }) => {
   const {
      type,
      message,
      cmd,
      win
   } = params;
   win.webContents.send("command-event", { type, message, cmd });
}

const execAsyncDockerDir = async (cmd: string) => {
   const win = BrowserWindow.getAllWindows()[0]; // Get main window
   if (!win) {
      console.error("No active Electron window found.");
      return;
   }

   try {
      // Check and set Docker directory only once
      if (!dockerDir) {
         const possiblePaths = [
            "/opt/homebrew/bin/docker", // Apple Silicon macOS (Homebrew)
            "/usr/bin/docker",          // Standard system install
            "/usr/local/bin/docker",    // Intel macOS (Homebrew)
         ];

         for (const dockerPath of possiblePaths) {
            if (fs.existsSync(dockerPath)) {
               dockerDir = dockerPath.substring(0, dockerPath.lastIndexOf("/"));
               break;
            }
         }

         sendEvent({ type: "output", message: `Docker Dir: ${dockerDir || "Not Found"}`, cmd, win });
      }

      const env = dockerDir ? { ...process.env, PATH: `${dockerDir}:${process.env.PATH}` } : process.env;

      // Execute command with updated PATH
      const { stdout, stderr } = await promisify(exec)(cmd, { env });

      if (stderr) {
         sendEvent({ type: "error", message: stderr, cmd, win });
      } else {
         sendEvent({ type: "output", message: stdout, cmd, win });
      }

      return { stdout, stderr };
   } catch (error: any) {
      sendEvent({ type: "error", message: error.message || "Unknown error", cmd, win });
      throw error; // Re-throw the error after posting it to UI
   }
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
         sendEvent({ type: "output", message: data.toString(), cmd, win });
      });

      process.stderr?.on("data", (data) => {
         sendEvent({ type: "error", message: data.toString(), cmd, win });
      });

      process.on("close", (code) => {
         if (code === 0) {
            sendEvent({ type: "done", message: "Process completed successfully", cmd, win });
            resolve();
         } else {
            sendEvent({ type: "error", message: `Process exited with code ${code}`, cmd, win });
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
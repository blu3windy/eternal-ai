import { exec, execSync } from "child_process";
import { promisify } from "util";
import fs from "fs";
import { app, BrowserWindow } from "electron";
import path from "path";

const execAsync = async (cmd: string) => {
   return promisify(exec)(cmd); // Execute with updated PATH
};

const dockerDir = '';

const sendEvent = (params: { type: string, message: string, cmd: string, win: BrowserWindow }) => {
   const {
      type,
      message,
      cmd,
      win
   } = params;
   win.webContents.send("command-event", { type, message, cmd });
}

const getBrowser = () => {
   const win = BrowserWindow.getAllWindows()[0]; // Get main window
   if (!win) {
      console.error("No active Electron window found.");
      throw new Error("No active Electron window found.");
   }
   return win;
}

const execAsyncDockerDir = async (cmd: string) => {
   const win = getBrowser();
   try {
      // Check and set Docker directory only once
      if (!dockerDir) {
         const possiblePaths = [
            "/opt/homebrew/bin/docker", // Apple Silicon (Homebrew)
            "/usr/local/bin/docker",    // Intel macOS (Homebrew)
            "/usr/bin/docker",          // Standard system install
            "/opt/local/bin/docker",    // MacPorts installation
            "/Applications/Docker.app/Contents/Resources/bin/docker",
            "/Library/Application Support/Docker Desktop/bin/docker"
         ];

         // Check for dynamically set Homebrew path
         try {
            const brewPath = execSync("brew --prefix", { encoding: "utf-8" }).trim();
            if (brewPath) {
               possiblePaths.unshift(`${brewPath}/bin/docker`);
            }
         } catch (err) {
            // Homebrew not installed or not found
         }

         const scriptsPath = app.isPackaged
            ? path.join(process.resourcesPath, 'public', 'scripts')
            : path.join(__dirname, '../public/scripts');

         console.log('Scripts Path:', scriptsPath);

         // Check which files exist
         fs.readdir(scriptsPath, (err, files) => {
            if (err) {
               sendEvent({ type: "error", message: err.message, cmd, win });
            } else {
               sendEvent({ type: "output", message: `files: ${JSON.stringify(files)}`, cmd, win });
            }
         });

         sendEvent({ type: "output", message: `Docker Dir: ${dockerDir || "Not Found"}`, cmd, win });
      }

      const env = dockerDir ? { ...process.env, PATH: `${dockerDir}:${process.env.PATH}` } : process.env;

      // Execute command with updated PATH
      const { stdout, stderr } = await promisify(exec)(cmd, { env });

      if (stderr) {
         console.log(stderr);
         sendEvent({ type: "error", message: stderr, cmd, win });
      } else {
         console.log(stdout)
         sendEvent({ type: "output", message: stdout, cmd, win });
      }
      return { stdout, stderr };
   } catch (error: any) {
      sendEvent({ type: "error", message: error.message || "Unknown error", cmd, win });
      throw error; // Re-throw the error after posting it to UI
   }
};

const execAsyncStream = (_cmd: string, isZSH = true) => {
   return new Promise<void>((resolve, reject) => {
      const win = getBrowser();
      const cmd = isZSH ? `zsh -l -c '${_cmd}'` : _cmd;
      const process = exec(cmd);

      process.stdout?.on("data", (data) => {
         console.log(data.toString());
         sendEvent({ type: "output", message: data.toString(), cmd, win });
      });

      process.stderr?.on("data", (data) => {
         console.error(data.toString());
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
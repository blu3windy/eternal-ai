import { exec, execSync } from "child_process";
import { promisify } from "util";
import fs from "fs";
import { app, BrowserWindow } from "electron";
import path from "path";

const execAsync = async (cmd: string) => {
   return promisify(exec)(cmd); // Execute with updated PATH
};

let dockerDir = '';
let window: BrowserWindow | null = null;


const getBrowser = () => {
   return window;
}

const setWindow = (win: BrowserWindow) => {
   window = win;
}

const sendEvent = (params: { type: string, message: string, cmd: string }) => {
   const win = getBrowser();
   const {
      type,
      message,
      cmd,
   } = params;
   if (win && !win.isDestroyed()) {
      win.webContents.send("command-event", { type, message, cmd });
   }
}

const execAsyncDockerDir = async (cmd: string) => {
   try {
      // Check and set Docker directory only once
      if (!dockerDir) {
         const possiblePaths = [
            "/opt/homebrew/bin/docker", // Apple Silicon (Homebrew)
            "/usr/local/bin/docker",    // Intel macOS (Homebrew)
            "/usr/bin/docker",          // Standard system install
            "/opt/local/bin/docker",    // MacPorts installation
            "/Applications/Docker.app/Contents/Resources/bin/docker",
            "/Library/Application Support/Docker Desktop/bin/docker",
         ];

         // Check for dynamically set Homebrew path
         try {
            const brewPath = execSync("brew --prefix", { encoding: "utf-8" }).trim();
            console.log("brewPath: ", brewPath)
            if (brewPath) {
               possiblePaths.unshift(`${brewPath}/bin/docker`);
            }
         } catch (err) {
            // Homebrew not installed or not found
         }


         // Check if /var/lib/docker exists (indicates Docker is installed)
         if (fs.existsSync("/var/lib/docker")) {
            console.log("Docker data directory found at /var/lib/docker");
         }

         // Use `which docker` first
         try {
            const whichDocker = execSync("which docker", { encoding: "utf-8" }).trim();
            if (whichDocker) {
               console.log("Found Docker binary at:", whichDocker);
               dockerDir = path.dirname(whichDocker);
            }
         } catch (err) {
            console.log("`which docker` failed, falling back to predefined paths...");
         }

         if (!dockerDir) {
            for (const dockerPath of possiblePaths) {
               if (fs.existsSync(dockerPath)) {
                  dockerDir = dockerPath.substring(0, dockerPath.lastIndexOf("/"));
                  break;
               }
            }
         }

         const scriptsPath = app.isPackaged
            ? path.join(process.resourcesPath, 'public', 'scripts')
            : path.join(__dirname, '../public/scripts');

         console.log('Scripts Path:', scriptsPath);
         console.log('Possible Paths:', possiblePaths);

         // Check which files exist
         fs.readdir(scriptsPath, (err, files) => {
            if (err) {
               sendEvent({ type: "error", message: err.message, cmd });
            } else {
               sendEvent({ type: "output", message: `files: ${JSON.stringify(files)}`, cmd });
            }
         });

         sendEvent({ type: "output", message: `Docker Dir: ${dockerDir || "Not Found"}`, cmd });
      }

      const env = dockerDir ? { ...process.env, PATH: `${dockerDir}:${process.env.PATH}` } : process.env;

      // Execute command with updated PATH
      const { stdout, stderr } = await promisify(exec)(cmd, { env });

      if (stderr) {
         console.log(stderr);
         sendEvent({ type: "error", message: stderr, cmd });
      } else {
         console.log(stdout)
         sendEvent({ type: "output", message: stdout, cmd });
      }
      return { stdout, stderr };
   } catch (error: any) {
      sendEvent({ type: "error", message: error.message || "Unknown error", cmd });
      throw error; // Re-throw the error after posting it to UI
   }
};

const execAsyncStream = (_cmd: string, isZSH = true) => {
   return new Promise<void>((resolve, reject) => {
      const cmd = isZSH ? `zsh -l -c '${_cmd}'` : _cmd;
      const process = exec(cmd);

      process.stdout?.on("data", (data) => {
         console.log(data.toString());
         sendEvent({ type: "output", message: data.toString(), cmd });
      });

      process.stderr?.on("data", (data) => {
         console.error(data.toString());
         sendEvent({ type: "error", message: data.toString(), cmd });
      });

      process.on("close", (code) => {
         if (code === 0) {
            sendEvent({ type: "done", message: "Process completed successfully", cmd });
            resolve();
         } else {
            sendEvent({ type: "error", message: `Process exited with code ${code}`, cmd });
            reject(new Error(`Exited with code ${code}`));
         }
      });
   });
};

const command = {
   execAsync,
   execAsyncStream,
   execAsyncDockerDir,
   sendEvent,
   getBrowser,
   setWindow,
}

export default command;
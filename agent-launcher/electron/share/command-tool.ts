import { exec, execSync, spawn } from "child_process";
import { promisify } from "util";
import fs from "fs";
import { app, BrowserWindow, dialog } from "electron";
import path from "path";

// Increase the buffer size for large outputs
const MAX_BUFFER = 1024 * 1024 * 100; // 100MB buffer

const customEnv = {
   ...process.env,
   PATH: `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin:/bin:/usr/bin`,
}

// Track all running processes
const runningProcesses: Set<{ process: any, cmd: string }> = new Set();

// Function to get friendly process name
const getFriendlyProcessName = (cmd: string): string => {
   // Extract meaningful information from the command
   if (cmd.includes('model')) {
      return 'Model Download';
   } else if (cmd.includes('docker')) {
      return 'Docker Container';
   } else if (cmd.toLowerCase().includes('download')) {
      return 'File Download';
   } else if (cmd.includes('install')) {
      return 'Installation';
   } else {
      // Get the most meaningful part of the command
      const parts = cmd.split(' ').filter(part => 
         !['cd', 'bash', 'zsh', '-c', '-l', '&&', '||', ';'].includes(part.toLowerCase())
      );
      return parts[0] || 'Process';
   }
}

// Function to format model name
const formatModelName = (cmd: string): string => {
   const match = cmd.match(/model[/\\]([^/\\]+)/);
   if (!match) return 'Unknown model';
   
   const fullName = match[1];
   // If it's a hash (long string of hex characters), truncate to 6 chars
   if (/^[a-f0-9]{32,}$/i.test(fullName)) {
      return `${fullName.substring(0, 6)}...`;
   }
   return fullName;
};

// Function to format process information
const formatProcessInfo = (processes: Set<{ process: any, cmd: string }>) => {
   const processGroups: { [key: string]: { count: number, commands: string[] } } = {};
   
   // Group processes by their friendly names
   Array.from(processes).forEach(({ cmd }) => {
      const friendlyName = getFriendlyProcessName(cmd);
      if (!processGroups[friendlyName]) {
         processGroups[friendlyName] = { count: 0, commands: [] };
      }
      processGroups[friendlyName].count++;
      processGroups[friendlyName].commands.push(cmd);
   });

   // Format the process list with details
   return Object.entries(processGroups)
      .map(([name, { count, commands }]) => {
         const basicInfo = `${name}${count > 1 ? ` (${count})` : ''}`;
         
         // Add details for specific types of processes
         if (name === 'Model Download') {
            const modelNames = commands.map(cmd => formatModelName(cmd));
            const uniqueModels = [...new Set(modelNames)]; // Remove duplicates
            return `${basicInfo}\n    ↳ ${uniqueModels.join(', ')}`;
         }
         
         if (name === 'Docker Container') {
            return `${basicInfo}\n    ↳ Managing container services`;
         }
         
         if (name === 'File Download') {
            return `${basicInfo}\n    ↳ Downloading required files`;
         }
         
         if (name === 'Installation') {
            return `${basicInfo}\n    ↳ Setting up components`;
         }
         
         return basicInfo;
      })
      .join('\n\n');
};

// Function to show confirmation dialog
const showCloseConfirmation = async (win: BrowserWindow): Promise<boolean> => {
   if (runningProcesses.size === 0) {
      return true;
   }

   const processCount = runningProcesses.size;
   const formattedProcesses = formatProcessInfo(runningProcesses);
   
   const { response } = await dialog.showMessageBox(win, {
      type: 'question',
      title: 'Active Tasks Found',
      message: `${processCount} active task${processCount > 1 ? 's' : ''} in progress.`,
      detail: [
         'The following tasks are still running:',
         '',
         formattedProcesses,
         '',
         'What would you like to do?',
         '',
         '• Cancel - Return to the application',
         '• Minimize - Keep tasks running in background',
         '• Terminate - Stop all tasks and quit'
      ].join('\n'),
      buttons: ['Cancel', 'Minimize', 'Terminate and Quit'],
      defaultId: 0,
      cancelId: 0,
      noLink: true,
   });

   if (response === 1) { // Minimize
      win.minimize();
      return false;
   }

   return response === 2; // true if "Terminate and Quit" was selected
};

// Cleanup function for all processes
const cleanupAllProcesses = () => {
   const totalProcesses = runningProcesses.size;
   let successCount = 0;
   let failCount = 0;

   for (const { process, cmd } of runningProcesses) {
      try {
         process.kill();
         console.log(`Terminated process for command: ${cmd}`);
         successCount++;
      } catch (error) {
         console.error(`Failed to terminate process for command: ${cmd}`, error);
         failCount++;
      }
   }

   // Show termination results if there were any failures
   if (failCount > 0 && window) {
      dialog.showMessageBox(window, {
         type: 'warning',
         title: 'Process Termination Results',
         message: `Terminated ${successCount} of ${totalProcesses} processes`,
         detail: `Successfully terminated: ${successCount}\nFailed to terminate: ${failCount}\n\nCheck the console for more details.`,
         buttons: ['OK']
      });
   }
   execAsync("docker system prune -f").then(() => {
      console.log("Docker system prune completed");
   }).catch(error => {
      console.error("Error during Docker system prune:", error);
   })
   runningProcesses.clear();
};

// Register cleanup on app quit
app.on('before-quit', (event) => {
   if (window && runningProcesses.size > 0) {
      event.preventDefault();
      showCloseConfirmation(window).then(shouldQuit => {
         if (shouldQuit) {
            cleanupAllProcesses();
            app.quit(); // Use app.quit() to ensure all processes are cleaned up
         }
      });
   }
});

const execAsync = async (cmd: string) => {
   try {
      const { stdout, stderr } = await promisify(exec)(cmd, {
         maxBuffer: MAX_BUFFER,
         env: customEnv
      });
      if (stderr) {
         sendEvent({ type: "error", message: stderr, cmd });
      }
      sendEvent({ type: "output", message: stdout, cmd });
      return stdout; // Return the standard output if successful
   } catch (error: any) {
      sendEvent({ type: "error", message: error.message || "Unknown error", cmd });
      throw new Error(`Command "${cmd}" failed: ${error.message}`);
   }
};

let dockerDir = '';
let window: BrowserWindow | null = null;

const getBrowser = () => {
   return window;
}

const setWindow = (win: BrowserWindow) => {
   window = win;
   
   // Add window close handler for cleanup
   win.on('close', (event) => {
      if (runningProcesses.size > 0) {
         event.preventDefault();
         showCloseConfirmation(win).then(shouldClose => {
            if (shouldClose) {
               cleanupAllProcesses();
               win.destroy(); // Use destroy() to force close without triggering 'close' again
            }
         });
      }
   });
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

         try {
            const brewPath = execSync("brew --prefix", { encoding: "utf-8" }).trim();
            console.log("brewPath: ", brewPath)
            if (brewPath) {
               possiblePaths.unshift(`${brewPath}/bin/docker`);
            }
         } catch (err) {
            console.log("Homebrew not found:", err);
         }

         if (fs.existsSync("/var/lib/docker")) {
            console.log("Docker data directory found at /var/lib/docker");
         }

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

      const { stdout, stderr } = await promisify(exec)(cmd, { 
         env,
         maxBuffer: MAX_BUFFER
      });

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
      throw error;
   }
};

const execAsyncStream = (_cmd: string, isZSH = true) => {
   return new Promise<void>((resolve, reject) => {
      let killed = false;
      const cmd = isZSH ? `zsh -l -c '${_cmd}'` : _cmd;
      
      console.log(`Starting process for command: ${_cmd}`);
      
      // Use spawn instead of exec for better stream handling
      const shell = isZSH ? 'zsh' : 'bash';
      const args = isZSH ? ['-l', '-c', _cmd] : ['-c', _cmd];
      
      const childProcess = spawn(shell, args, {
         stdio: ['pipe', 'pipe', 'pipe'],
         env: {
            ...customEnv,
            FORCE_COLOR: '1', // Enable colored output
         },
      });

      // Track this process
      runningProcesses.add({ process: childProcess, cmd: _cmd });
      console.log(`Currently running processes: ${runningProcesses.size}`);

      // Log process ID for debugging
      console.log(`Process started with PID: ${childProcess.pid}`);

      // Handle process errors
      childProcess.on('error', (error) => {
         runningProcesses.delete({ process: childProcess, cmd: _cmd });
         console.error('Process error:', error);
         sendEvent({ 
            type: "error", 
            message: `Process error: ${error.message}`, 
            cmd 
         });
         reject(error);
      });

      // Handle stdout
      childProcess.stdout?.on("data", (data) => {
         const message = data.toString();
         console.log(message);
         sendEvent({ type: "output", message, cmd });
      });

      // Handle stderr
      childProcess.stderr?.on("data", (data) => {
         const message = data.toString();
         console.error(message);
         sendEvent({ type: "error", message, cmd });
      });

      // Handle process exit
      childProcess.on("exit", (code, signal) => {
         console.log(`Process exiting - PID: ${childProcess.pid}, Code: ${code}, Signal: ${signal}`);
         runningProcesses.delete({ process: childProcess, cmd: _cmd });
         console.log(`Remaining running processes: ${runningProcesses.size}`);
         
         if (killed) {
            sendEvent({ type: "error", message: "Process was killed", cmd });
            reject(new Error("Process was killed"));
            return;
         }

         if (code === 0) {
            sendEvent({ type: "done", message: "Process completed successfully", cmd });
            resolve();
         } else {
            const errorMessage = `Process exited with code ${code}${signal ? ` (signal: ${signal})` : ''}`;
            sendEvent({ type: "error", message: errorMessage, cmd });
            reject(new Error(errorMessage));
         }
      });

      // Handle process close
      childProcess.on("close", (code, signal) => {
         runningProcesses.delete({ process: childProcess, cmd: _cmd });
         
         if (code !== 0 && !killed) {
            const errorMessage = `Process closed with code ${code}${signal ? ` (signal: ${signal})` : ''}`;
            sendEvent({ type: "error", message: errorMessage, cmd });
            reject(new Error(errorMessage));
         }
      });

      // Set up cleanup on parent process exit
      childProcess.on('SIGTERM', () => {
         killed = true;
         childProcess.kill();
         runningProcesses.delete({ process: childProcess, cmd: _cmd });
      });

      childProcess.on('SIGINT', () => {
         killed = true;
         childProcess.kill();
         runningProcesses.delete({ process: childProcess, cmd: _cmd });
      });
   });
};

const killProcessUsingPort = async (port: number) => {
   try {
      // Execute the command to find processes using the specified port
      const lsofOutput = await execAsync(`lsof -i :${port}`);

      // Parse the output to find the PID
      const lines = lsofOutput.split("\n");
      for (const line of lines) {
         const parts = line.trim().split(/\s+/); // Split by whitespace
         if (parts.length > 1 && parts[0] !== "COMMAND") {
            // Skip the header line
            const pid = parts[1]; // Assuming the PID is in the second column
            console.log(`Killing process with PID: ${pid}`);

            try {
               await execAsync(`kill ${pid}`);
               console.log(`Process ${pid} killed successfully.`);
            } catch (error: any) {
               console.error(`Failed to kill process ${pid}: ${error.message}`);
            }
            // Kill the process
         }
      }
   } catch (error: any) {
      console.error(`Error: ${error.message}`);
   }
};

const command = {
   execAsync,
   execAsyncStream,
   execAsyncDockerDir,
   sendEvent,
   getBrowser,
   setWindow,
   killProcessUsingPort
}

export default command;
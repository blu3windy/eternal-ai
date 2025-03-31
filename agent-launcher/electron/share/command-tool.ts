import { exec, execSync, spawn } from "child_process";
import { promisify } from "util";
import { app, BrowserWindow, dialog } from "electron";

let window: BrowserWindow | null = null;

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

   console.log("processes: ", processes);
   
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
         '• Terminate - Stop all tasks and quit'
      ].join('\n'),
      buttons: ['Cancel', 'Terminate and Quit'],
      defaultId: 0,
      cancelId: 0,
      noLink: true,
   });

   return response === 1; // true if "Terminate and Quit" was selected
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

const execAsyncStream = (_cmd: string, isZSH = true) => {
   return new Promise<void>((resolve, reject) => {
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
      // Create the process object once and store it
      const processObj = { process: childProcess, cmd: _cmd };
      runningProcesses.add(processObj);
      console.log(`Currently running processes: ${runningProcesses.size}`);

      // Log process ID for debugging
      console.log(`Process started with PID: ${childProcess.pid}`);

      // Cleanup function to ensure consistent process removal
      const cleanup = () => {
         runningProcesses.delete(processObj);
         console.log(`Process cleaned up - PID: ${childProcess.pid}`);
      };

      // Handle process errors
      childProcess.on('error', (error) => {
         cleanup();
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
         cleanup();
         console.log(`Process exiting - PID: ${childProcess.pid}, Code: ${code}, Signal: ${signal}`);
         console.log(`Remaining running processes: ${runningProcesses.size}`);
         
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
         cleanup();
         
         if (code !== 0) {
            const errorMessage = `Process closed with code ${code}${signal ? ` (signal: ${signal})` : ''}`;
            sendEvent({ type: "error", message: errorMessage, cmd });
            reject(new Error(errorMessage));
         }
      });

      // Handle process signals
      const handleSignal = (signal: string) => {
         cleanup();
         childProcess.kill();
      };

      // Set up cleanup on parent process exit
      childProcess.on('SIGTERM', () => handleSignal('SIGTERM'));
      childProcess.on('SIGINT', () => handleSignal('SIGINT'));
   });
};

const execAsyncDockerDir = async (cmd: string) => {
   const execAsync = promisify(exec);
   try {
      const { stdout, stderr } = await execAsync(cmd, {
         maxBuffer: MAX_BUFFER,
         env: customEnv,
      });
      return { stdout, stderr };
   } catch (error) {
      console.error(`Error executing command: ${cmd}`, error);
      throw error;
   }
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
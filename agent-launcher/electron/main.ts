import { app, BrowserWindow, screen, dialog } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import runIpcMain from "./ipcMain";
import { autoUpdater } from "electron-updater";
import command from "./share/command-tool.ts";
import log from 'electron-log';

// Configure logging
log.transports.file.level = 'debug';
autoUpdater.logger = log;

// Add version checking event
autoUpdater.on("checking-for-update", () => {
   log.info("Checking for update...");
   log.info("Current version:", app.getVersion());
});

if (process.env.NODE_ENV === "development") {
   autoUpdater.autoDownload = false;
   autoUpdater.allowDowngrade = true;  // Allow downgrade in dev mode
   autoUpdater.forceDevUpdateConfig = true;
}

// Configure autoUpdater with more options
autoUpdater.setFeedURL({
   provider: "generic",
   url: "https://composed-rarely-feline.ngrok-free.app/updates",
   channel: 'latest',
   updaterCacheDirName: 'agent-launcher-updater'
});

// Configure update behavior
autoUpdater.autoDownload = false;
autoUpdater.allowDowngrade = true;
autoUpdater.allowPrerelease = true;
autoUpdater.fullChangelog = true;

// Add more detailed error logging
autoUpdater.on("error", (err) => {
   log.error("Update error:", err);
   log.error("Error details:", {
      message: err.message,
      stack: err.stack,
   });
   dialog.showMessageBox({
      type: "error",
      title: "Update Error",
      message: `Update error: ${err.message}`,
      detail: err.stack
   });
});

// Allow version overwrite
autoUpdater.allowPrerelease = true;  // Allow pre-release versions
autoUpdater.allowDowngrade = true;   // Allow downgrade to handle version overwrites
autoUpdater.fullChangelog = true;    // Get full changelog

// Add version comparison logic
autoUpdater.on("update-available", (info) => {
   log.log("Current version:", app.getVersion());
   log.log("Available version:", info.version);

   dialog
      .showMessageBox({
         type: "info",
         title: "Update Available",
         message: `A new version (v${info.version}) is available. Current version: v${app.getVersion()}. Download now?`,
         buttons: ["Update", "Later"],
         detail: `Release Date: ${new Date(info.releaseDate).toLocaleString()}`
      })
      .then(({ response }) => {
         if (response === 0) {
            autoUpdater.downloadUpdate().catch((err) => {
               console.error("Download failed:", err);
               dialog.showMessageBox({
                  type: "error",
                  title: "Update Failed",
                  message: `Download failed: ${err.message}`,
               });
            });
         }
      });
});

autoUpdater.on("update-not-available", () => {
   log.info("No update available.");
   dialog.showMessageBox({
      message: "No update available.",
   });
});

// Improve error handling
autoUpdater.on("error", (err) => {
   log.error("Update error:", err);
   dialog.showMessageBox({
      type: "error",
      title: "Update Error",
      message: `Update error: ${err.message}`,
      detail: err.stack
   });
});

// Improve update installation
autoUpdater.on("update-downloaded", (info) => {
   log.log(`Update downloaded: v${info.version}`);
   dialog
      .showMessageBox({
         type: "info",
         title: "Update Ready",
         message: `Version ${info.version} is ready to install. Restart now?`,
         detail: `Release Date: ${new Date(info.releaseDate).toLocaleString()}`,
         buttons: ["Restart", "Later"],
      })
      .then(({ response }) => {
         if (response === 0) {
            // Set a flag to prevent multiple restarts
            const restartPending = true;
            setTimeout(() => {
               autoUpdater.quitAndInstall(false, true); // Silent restart
            }, 1000);
         }
      });
});

// Update the download progress dialog
autoUpdater.on("download-progress", (progress) => {
   const percentage = Math.round(progress.percent);
   win?.webContents.send("download-progress", {
      percent: percentage,
      transferred: progress.transferred,
      total: progress.total
   });
});

// const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
   ? path.join(process.env.APP_ROOT, "public")
   : RENDERER_DIST;

let win: BrowserWindow | null;

runIpcMain();

function createWindow() {
   const { width, height } = screen.getPrimaryDisplay().workAreaSize;


   win = new BrowserWindow({
      icon: path.join(process.env.VITE_PUBLIC as any, "app-logo.png"),
      // icon: path.join(__dirname, "../public/icon.png"), // Use icon from public
      webPreferences: {
         preload: path.join(app.getAppPath(), "dist-electron", "preload.mjs"),
         webSecurity: true,
         nodeIntegration: false,
         contextIsolation: true,
         webviewTag: true,
         sandbox: true
      },
      width: width,
      height: height,
      minWidth: 800,
   });

   win.loadURL("http://localhost:5173");

   win.once("ready-to-show", () => {
      win?.show();
      win?.focus(); // Ensure the app is focused before running AppleScript
   });

   // Test active push message to Renderer-process.
   win.webContents.on("did-finish-load", () => {
      win?.webContents.send("main-process-message", new Date().toLocaleString());
   });

   // Add more detailed logging for update checks
   setTimeout(() => {
      log.info('Checking for updates...');
      log.info('Current app version:', app.getVersion());
      log.info('Current platform:', process.platform);
      log.info('Current arch:', process.arch);
   
      autoUpdater.checkForUpdates().catch((err) => {
         log.error('Update check failed:', err);
         log.error('Error details:', {
            message: err.message,
            stack: err.stack
         });
      
         if (process.env.NODE_ENV === "development") {
            dialog.showMessageBox({
               type: "error",
               title: "Update Check Failed",
               message: `Failed to check for updates: ${err.message}`,
               detail: err.stack
            });
         }
      });
   }, 5000);

   // autoUpdater.on("update-available", (info) => {
   //    console.log("Update available:", info);
   //    win?.webContents.send("update-available", info);
   // });

   // autoUpdater.on("download-progress", (info) => {
   //    console.log("Update available:", info);
   //    win?.webContents.send("download-progress", info);
   // });

   // autoUpdater.on("update-downloaded", (info) => {
   //    console.log("update-downloaded:", info);
   //    win?.webContents.send("update-downloaded", info);
   // });

   if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL);
   } else {
      // win.loadFile('dist/index.html')
      win.loadFile(path.join(RENDERER_DIST, "index.html"));
   }
   win.on("closed", () => {
      win = null;
   });

   // In your renderer process (e.g., in a React component or main.js)
   // Just accept on production mode
   if (process.env.NODE_ENV === "production") {
      win.webContents.on('before-input-event', (event, input) => {
         if ((input.control || input.meta) && input.key === 'r') {
            event.preventDefault(); // Prevent the refresh action
            console.log("Refresh command ignored");
         }
      });
   }

   command.setWindow(win);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
   if (process.platform !== "darwin") {
      app.quit();
      win = null;
   }
});

app.on("activate", () => {
   // On OS X it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
   }
});

app.whenReady().then(createWindow);

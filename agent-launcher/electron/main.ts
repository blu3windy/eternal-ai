import { app, BrowserWindow, screen, dialog, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import runIpcMain from "./ipcMain";
import { autoUpdater } from "electron-updater";
import command from "./share/command-tool.ts";
import log from 'electron-log';

// Configure logging
log.transports.file.level = 'debug';
log.info('******************** APP STARTING ********************');
log.info('App version:', app.getVersion());
log.info('App path:', app.getPath('exe'));
log.info('App directory:', app.getAppPath());
log.info('User data:', app.getPath('userData'));
log.info('Platform:', process.platform);
log.info('Arch:', process.arch);
log.info('Node version:', process.versions.node);
log.info('Electron version:', process.versions.electron);
log.info('Chrome version:', process.versions.chrome);

// Set up logging for autoUpdater
autoUpdater.logger = log;
(autoUpdater.logger as any).transports.file.level = 'debug';

// Disable code signing verification
process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
process.env.ELECTRON_DISABLE_CODE_SIGNING = 'true';

// Check if running from DMG/Volume
const isRunningFromVolume = app.getAppPath().includes('/Volumes/');
log.info('Running from volume:', isRunningFromVolume);

if (isRunningFromVolume) {
   log.info('App is running from a volume - showing move to applications dialog');
   dialog.showMessageBox({
      type: 'info',
      title: 'Move to Applications',
      message: 'Please drag the app to your Applications folder before running.',
      detail: 'This ensures proper functionality including automatic updates.',
      buttons: ['OK'],
      defaultId: 0
   }).then(() => {
      app.quit();
   });
}

if (process.platform === 'darwin') {
   app.commandLine.appendSwitch('ignore-certificate-errors');
}

// Configure autoUpdater with more options
const server = 'https://github.com/0x0603/electron-update-server/releases/download/0.0.5';
const url = `${server}/`;

log.info('Setting up autoUpdater with URL:', url);

const updateConfig = {
   provider: 'generic' as const,
   url: url,
   requestHeaders: { 'Cache-Control': 'no-cache' },
   verifyUpdateCodeSignature: false
};

try {
   autoUpdater.setFeedURL(updateConfig);
   log.info('Feed URL set successfully');
} catch (err) {
   log.error('Error setting feed URL:', err);
}

// Configure update behavior
autoUpdater.forceDevUpdateConfig = true;
autoUpdater.autoDownload = false;
autoUpdater.allowDowngrade = true;
autoUpdater.allowPrerelease = true;
autoUpdater.fullChangelog = true;
autoUpdater.disableWebInstaller = true;
autoUpdater.autoInstallOnAppQuit = false;

// Debug request headers
autoUpdater.requestHeaders = {
   'Cache-Control': 'no-cache',
   'User-Agent': 'Vibe-Updater'
};

// Add version checking event with detailed logging
autoUpdater.on("checking-for-update", () => {
   log.info("************* CHECKING FOR UPDATE *************");
   log.info("Current version:", app.getVersion());
   log.info("Update feed URL:", url);
   log.info("App location:", app.getAppPath());
   log.info("Update config:", {
      allowDowngrade: autoUpdater.allowDowngrade,
      allowPrerelease: autoUpdater.allowPrerelease,
      autoDownload: autoUpdater.autoDownload,
      channel: autoUpdater.channel,
      platform: process.platform,
      arch: process.arch,
      codeSigningDisabled: process.env.ELECTRON_DISABLE_CODE_SIGNING === 'true',
      isRunningFromVolume: isRunningFromVolume
   });

   // Log environment variables related to code signing
   log.info('Code signing environment:', {
      CSC_IDENTITY_AUTO_DISCOVERY: process.env.CSC_IDENTITY_AUTO_DISCOVERY,
      ELECTRON_DISABLE_CODE_SIGNING: process.env.ELECTRON_DISABLE_CODE_SIGNING,
      NODE_ENV: process.env.NODE_ENV
   });
});

// Add more detailed error logging
autoUpdater.on("error", (err) => {
   log.error("************* UPDATE ERROR *************");
   log.error("Error object:", err);
   log.error("Error message:", err.message);
   log.error("Error stack:", err.stack);
   log.error("Context:", {
      currentVersion: app.getVersion(),
      feedURL: url,
      appPath: app.getAppPath(),
      appName: app.getName(),
      platform: process.platform,
      arch: process.arch,
      tempDirectory: app.getPath('temp'),
      userDataPath: app.getPath('userData')
   });

   // Show error dialog with detailed information
   let errorDetail = `Error Details:\n`;
   errorDetail += `Message: ${err.message}\n\n`;
   errorDetail += `App Version: ${app.getVersion()}\n`;
   errorDetail += `Update URL: ${url}\n`;
   errorDetail += `Platform: ${process.platform}\n`;
   errorDetail += `Architecture: ${process.arch}\n`;
   errorDetail += `App Path: ${app.getAppPath()}\n`;
   errorDetail += `User Data: ${app.getPath('userData')}\n`;
   errorDetail += `Temp Dir: ${app.getPath('temp')}`;

   dialog.showMessageBox({
      type: "error",
      title: "Update Error",
      message: "There was a problem checking for updates.",
      detail: errorDetail,
      buttons: ["Try Again", "Show Logs", "Close"],
      defaultId: 0
   }).then(({ response }) => {
      if (response === 0) {
         // Try again
         log.info("Retrying update check...");
         autoUpdater.checkForUpdates().catch(e => {
            log.error("Retry failed:", e);
         });
      } else if (response === 1) {
         // Show logs directory
         const logsPath = (log.transports.file as any).getFile().path;
         log.info('Opening logs directory:', logsPath);
         // Use imported shell instead of require
         shell.showItemInFolder(logsPath);
      }
   });
});

if (process.env.NODE_ENV === "development") {
   autoUpdater.autoDownload = false;
   autoUpdater.allowDowngrade = true;  // Allow downgrade in dev mode
   autoUpdater.forceDevUpdateConfig = true;
}

// Allow version overwrite
autoUpdater.allowPrerelease = true;  // Allow pre-release versions
autoUpdater.allowDowngrade = true;   // Allow downgrade to handle version overwrites
autoUpdater.fullChangelog = true;    // Get full changelog

// Add version comparison logic with metadata logging
autoUpdater.on("update-available", (info) => {
   log.info("Update metadata received:", {
      version: info.version,
      files: info.files,
      releaseDate: info.releaseDate,
   });

   dialog
      .showMessageBox({
         type: "info",
         title: "Update Available",
         message: `A new version (v${info.version}) is available. Current version: v${app.getVersion()}. Download now?`,
         buttons: ["Download", "Later"],
         detail: `Release Date: ${new Date(info.releaseDate).toLocaleString()}`
      })
      .then(({ response }) => {
         if (response === 0) {
            log.info("Starting download of update...");
            autoUpdater.downloadUpdate().catch((err) => {
               log.error("Download failed:", err);
               dialog.showMessageBox({
                  type: "error",
                  title: "Update Failed",
                  message: `Download failed: ${err.message}`,
                  detail: `Please check your internet connection and try again.\nError: ${err.stack}`
               });
            });
         }
      });
});

autoUpdater.on("update-not-available", (info) => {
   log.info("No update available. Current version:", app.getVersion());
   log.info("Server response:", info);
   dialog.showMessageBox({
      type: "info",
      title: "No Update Available",
      message: "You are running the latest version.",
      detail: `Current version: v${app.getVersion()}`
   });
});

// Improve update installation
autoUpdater.on("update-downloaded", (info) => {
   log.info(`Update downloaded: v${info.version}`);
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
            autoUpdater.quitAndInstall(false, true);
         }
      });
});

// Update the download progress dialog with more detailed logging
autoUpdater.on("download-progress", (progress) => {
   log.info("Download progress:", {
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total,
      bytesPerSecond: progress.bytesPerSecond
   });
   
   const percentage = Math.round(progress.percent);
   win?.webContents.send("download-progress", {
      percent: percentage,
      transferred: progress.transferred,
      total: progress.total,
      bytesPerSecond: progress.bytesPerSecond
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

   if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL);
   } else {
      // win.loadFile('dist/index.html')
      win.loadFile(path.join(RENDERER_DIST, "index.html"));
   }

   win.once("ready-to-show", () => {
      win?.show();
      win?.focus();
      
      // Check for updates after window is ready
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
      });
   });

   win.on("closed", () => {
      win = null;
   });

   if (process.env.NODE_ENV === "production") {
      win.webContents.on('before-input-event', (event, input) => {
         if ((input.control || input.meta) && input.key === 'r') {
            event.preventDefault();
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

import { app, BrowserWindow, screen, dialog } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import runIpcMain from "./ipcMain";
import { autoUpdater } from "electron-updater";
import command from "./share/command-tool.ts";
import axios from "axios";

// Disable code signing
process.env.CSC_IDENTITY_AUTO_DISCOVERY = "false";
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
process.env.ELECTRON_SKIP_BINARY_DOWNLOAD = "true";

// Configure auto updater
autoUpdater.autoDownload = false;
autoUpdater.logger = console;

// GitHub repository information
const GITHUB_OWNER = "0x0603";
const GITHUB_REPO = "electron-update-server";

// Function to get latest release from GitHub
async function getLatestRelease() {
   try {
      const response = await axios.get(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`);
      return response.data;
   } catch (error) {
      console.error("Failed to fetch latest release:", error);
      throw error;
   }
}

async function setupUpdateURL() {
   try {
      const latestRelease = await getLatestRelease();

      // Get direct links to `latest-mac.yml`
      const latestMacYml = latestRelease.assets.find((asset) =>
         asset.name === "latest-mac.yml"
      );

      if (!latestMacYml) throw new Error("latest-mac.yml not found in release");

      const updateUrl = latestMacYml.browser_download_url; // Direct URL to `latest-mac.yml`

      console.log("Latest version:", latestRelease.tag_name);
      console.log("Update URL:", updateUrl);

      autoUpdater.setFeedURL({ url: updateUrl });
      return updateUrl;
   } catch (error) {
      console.error("Failed to setup update URL:", error);
      throw error;
   }
}

// Initialize update URL and check for updates
setupUpdateURL().then(updateUrl => {
   // Force update check on startup
   autoUpdater.checkForUpdates().catch((err) => {
      console.error("Update check failed:", err);
      dialog.showMessageBox({
         type: "error",
         title: "Update Error",
         message: `Error: ${err.message || err}`,
         detail: `Current version: ${app.getVersion()}\nUpdate URL: ${updateUrl}`
      });
   });
}).catch(error => {
   console.error("Failed to initialize update URL:", error);
   dialog.showMessageBox({
      type: "error",
      title: "Update Error",
      message: "Failed to initialize update URL",
      detail: error.message
   });
});

// Handle update events
autoUpdater.on("error", (error) => {
   console.error("Auto Updater Error:", error);
   dialog.showMessageBox({
      type: "error",
      title: "Update Error",
      message: `Error: ${error.message || error}`,
      detail: `Current version: ${app.getVersion()}\nError details: ${error.stack || "No stack trace available"}\nConfig Path: ${autoUpdater.updateConfigPath}\nDevelopment Mode: ${process.env.NODE_ENV === "development"}`
   });
});

autoUpdater.on("checking-for-update", () => {
   console.log("Checking for updates...");
   dialog.showMessageBox({
      type: "info",
      title: "Checking Updates",
      message: "Checking for updates...",
      detail: `Current version: ${app.getVersion()}`
   });
});

autoUpdater.on("update-available", (info) => {
   console.log("Update available:", info);
   dialog.showMessageBox({
      type: "info",
      title: "Update Available",
      message: `Version ${info.version} is available. Would you like to download it?`,
      detail: `Release Date: ${info.releaseDate}\nCurrent Version: ${app.getVersion()}\nNew Version: ${info.version}`,
      buttons: ["Download", "Later"]
   }).then((result) => {
      if (result.response === 0) {
         autoUpdater.downloadUpdate().catch((err) => {
            dialog.showMessageBox({
               type: "error",
               title: "Download Error",
               message: `Failed to start download: ${err.message || err}`
            });
         });
      }
   });
});

autoUpdater.on("update-not-available", (info) => {
   console.log("No updates available");
   dialog.showMessageBox({
      type: "info",
      title: "No Updates",
      message: "You are running the latest version.",
      detail: `Current Version: ${app.getVersion()}\nLatest Version: ${info ? info.version : 'unknown'}`
   });
});

autoUpdater.on("download-progress", (progress) => {
   const percentage = Math.round(progress.percent);
   console.log(`Download progress: ${percentage}%`);
   
   // Show progress every 20%
   if (percentage % 20 === 0) {
      dialog.showMessageBox({
         type: "info",
         title: "Downloading Update",
         message: `Downloading: ${percentage}%`,
         detail: `Speed: ${(progress.bytesPerSecond / 1024 / 1024).toFixed(2)} MB/s\nDownloaded: ${(progress.transferred / 1024 / 1024).toFixed(2)} MB\nTotal: ${(progress.total / 1024 / 1024).toFixed(2)} MB`
      });
   }
});

autoUpdater.on("update-downloaded", (info) => {
   console.log("update-downloaded:", info);
   dialog.showMessageBox({
      type: "info",
      title: "Update Ready",
      message: `Version ${info.version} has been downloaded. Would you like to install it now?`,
      detail: `Release Date: ${info.releaseDate}\nCurrent Version: ${app.getVersion()}\nNew Version: ${info.version}`,
      buttons: ["Install and Restart", "Later"]
   }).then((result) => {
      if (result.response === 0) {
         autoUpdater.quitAndInstall(false);
      }
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

   // Check for updates immediately
   console.log("Starting update check...");
   console.log("Current version:", app.getVersion());
   
   // Force update check in development
   if (process.env.NODE_ENV === "development") {
      console.log("Development mode: Forcing update check");
      autoUpdater.checkForUpdates().catch((err) => {
         console.error("Update check failed:", err);
         dialog.showMessageBox({
            type: "error",
            title: "Update Error",
            message: `Error: ${err.message || err}`,
            detail: `Current version: ${app.getVersion()}`
         });
      });
   }

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

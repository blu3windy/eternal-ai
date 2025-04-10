import { app, BrowserWindow, ipcMain, screen } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import runIpcMain from "./ipcMain";
import { autoUpdater } from "electron-updater";
import command from "./share/command-tool.ts";
import log from 'electron-log';

// import listenToDockerEvents from "./ipcMain/docker-listener.ts";

autoUpdater.allowPrerelease = true;
autoUpdater.autoDownload = true;


log.transports.file.level = 'info';
autoUpdater.logger = log;

if (process.env.NODE_ENV === "development") {
   // autoUpdater.allowDowngrade = true;
   autoUpdater.forceDevUpdateConfig = true; // Force update check in dev mode
}

autoUpdater.setFeedURL({
   provider: "generic",
   url: "https://electron-update-server-production.up.railway.app/updates/",
});

// autoUpdater.setFeedURL({
//    provider: "github",
//    owner: "eternalai-org",
//    repo: "eternal-ai",
//    releaseType: 'release' // optional, default is "release"
//  })

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

   autoUpdater.checkForUpdatesAndNotify();

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

   // Events to notify the Renderer process (UI)
   autoUpdater.on("update-available", (info) => {
      console.log("update-available");
      log.info('Update available', info);
      win?.webContents.send("update-available");
   });

   autoUpdater.on("update-downloaded", () => {
      win?.webContents.send("update-downloaded");
      log.info('Update downloaded');
      console.log("update-downloaded");
      // autoUpdater.downloadUpdate();
      // autoUpdater.quitAndInstall();
   });

   ipcMain.on("install-update", () => {
      autoUpdater.quitAndInstall();
    })

   autoUpdater.on("download-progress", (progress) => {
      log.info('Download progress', progress);
      win?.webContents.send("download-progress", progress);
   });

   if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL);
   } else {
      // win.loadFile('dist/index.html')
      win.loadFile(path.join(RENDERER_DIST, "index.html"));
   }
   // listenToDockerEvents(win);

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

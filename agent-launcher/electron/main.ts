import { app, BrowserWindow, screen, dialog } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import runIpcMain from "./ipcMain";
import { autoUpdater } from "electron-updater";
import command from "./share/command-tool.ts";

autoUpdater.setFeedURL({
   provider: "generic",
   url: "https://electron-update-server-production.up.railway.app/updates/",
});
autoUpdater.on("update-available", (info) => {
   dialog
      .showMessageBox({
         type: "info",
         title: "Update Available",
         message: `A new version (v${info.version}) is available. Download now?`,
         buttons: ["Update", "Later"],
      })
      .then(({ response }) => {
         if (response === 0) {
            // User clicked "Update"
            autoUpdater.downloadUpdate().catch((err) => {
               console.error("Download failed:", err);
               dialog.showMessageBox({
                  type: "info",
                  title: "Update Ready",
                  message: `Download failed: ${JSON.stringify(err)}`,
               });
            });
         }
      });
});

autoUpdater.on("update-not-available", () => {
   dialog.showMessageBox({
      message: "No update available.",
   });
});

autoUpdater.on("error", (err) => {
   console.error("Update error:", err);
});

// 🔹 Event: When update is downloaded
autoUpdater.on("update-downloaded", (info) => {
   console.log(`Update downloaded: v${info.version}`);
   dialog
      .showMessageBox({
         type: "info",
         title: "Update Ready",
         message: `Version ${info.version} is downloaded. Restart to apply?`,
         buttons: ["Restart", "Later"],
      })
      .then(({ response }) => {
         if (response === 0) {
            // User clicked "Restart"
            // Delay to ensure update applies correctly
            setTimeout(() => {
               autoUpdater.quitAndInstall();
            }, 3000);
         }
      });
});

// 🔹 Track download progress
autoUpdater.on("download-progress", (progress) => {
//   let percentage = Math.round(progress.percent);
   //   dialog.showMessageBox({
   //     type: "info",
   //     title: "Processing",
   //     message: `Downloading... ${percentage}% (${(
   //       progress.transferred /
   //       1024 /
   //       1024
   //     ).toFixed(2)} MB / ${(progress.total / 1024 / 1024).toFixed(2)} MB)`,
   //   });
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

   setTimeout(() => {
      autoUpdater.checkForUpdates().catch((err) => {
         console.error("Update check failed:", err);
      });
   }, 5000);

   win = new BrowserWindow({
      icon: path.join(process.env.VITE_PUBLIC!, "app-logo.png"),
      // icon: path.join(__dirname, "../public/icon.png"), // Use icon from public
      webPreferences: {
         preload: path.join(app.getAppPath(), "dist-electron", "preload.mjs"),
         webSecurity: false,
         nodeIntegration: false,
         contextIsolation: true,
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

   win.on("closed", () => {
      win = null;
   });

   if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL);
   } else {
      // win.loadFile('dist/index.html')
      win.loadFile(path.join(RENDERER_DIST, "index.html"));
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

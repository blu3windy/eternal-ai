import { app, BrowserWindow, screen, dialog, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import runIpcMain from "./ipcMain";
import { autoUpdater } from "electron-updater";
import command from "./share/command-tool.ts";

// Configure code signing for macOS
if (process.platform === 'darwin') {
   process.env.CSC_IDENTITY_AUTO_DISCOVERY = process.env.APPLE_DEVELOPER_IDENTITY || 'false';
}

// Disable code signing verification in development
if (process.env.NODE_ENV === "development") {
   process.env.CSC_IDENTITY_AUTO_DISCOVERY = "false";
   process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
   process.env.ELECTRON_SKIP_BINARY_DOWNLOAD = "true";
   autoUpdater.autoDownload = false;
   autoUpdater.allowDowngrade = true;
   autoUpdater.forceDevUpdateConfig = true;
   autoUpdater.logger = console;
   autoUpdater.updateConfigPath = path.join(process.cwd(), "dev-app-update.yml");
   console.log("🔧 Development mode: Auto-update settings configured");
}

// Configure update URL
autoUpdater.setFeedURL({
   provider: "github",
   owner: "0x0603",
   repo: "electron-update-server",
   releaseType: "release",
   private: false,
   vPrefixedTagName: true,
});
console.log("📡 Update URL configured");

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

// Add IPC handler for accepting updates
ipcMain.on('apply-update', () => {
   autoUpdater.downloadUpdate();
});

runIpcMain();

function createWindow() {
   const { width, height } = screen.getPrimaryDisplay().workAreaSize;

   // Check for updates after 5 seconds
   setTimeout(() => {
      console.log("🔄 Initiating update check...");
      autoUpdater.checkForUpdates().catch((err) => {
         console.error("❌ Update check failed:", err);
         win?.webContents.send("update-error", `Failed to check for updates: ${err.message}`);
      });
   }, 5000);
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

   autoUpdater.on("update-available", (info) => {
      console.log("Update available:", info);
      win?.webContents.send("update-available", {
         version: info.version,
         releaseNotes: info.releaseNotes,
      });
   });

   autoUpdater.on("download-progress", (progress) => {
      const percentage = Math.round(progress.percent);
      console.log(`📊 Download progress: ${percentage}%`);
      win?.webContents.send("download-progress", {
         percent: percentage,
         transferred: progress.transferred,
         total: progress.total,
         bytesPerSecond: progress.bytesPerSecond,
      });
   });

   autoUpdater.on("update-downloaded", (info) => {
      console.log("update-downloaded:", info);
      win?.webContents.send("update-downloaded", {
         version: info.version,
      });
      // Automatically restart after 3 seconds
      setTimeout(() => {
         autoUpdater.quitAndInstall();
      }, 3000);
   });

   autoUpdater.on("error", (err) => {
      console.error("❌ Update error:", err);
      win?.webContents.send("update-error", err.message);
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

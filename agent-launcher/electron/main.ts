import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import keytar from "keytar";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, "public")
    : RENDERER_DIST;

let win: BrowserWindow | null;
const SERVICE_NAME = "MyElectronApp";

// ✅ Register IPC handlers BEFORE creating the window
ipcMain.handle("save-password", async (_event, account: string, password: string) => {
  console.log(`[Main Process] Saving password for: ${account}`);
  try {
    await keytar.setPassword(SERVICE_NAME, account, password);
    return { success: true };
  } catch (error) {
    console.error(`[Main Process] Error saving password: ${error.message}`);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("get-password", async (_event, account: string) => {
  console.log(`[Main Process] Retrieving password for: ${account}`);
  try {
    const password = await keytar.getPassword(SERVICE_NAME, account);
    return { success: true, password };
  } catch (error) {
    console.error(`[Main Process] Error retrieving password: ${error.message}`);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("delete-password", async (_event, account: string) => {
  console.log(`[Main Process] Deleting password for: ${account}`);
  try {
    await keytar.deletePassword(SERVICE_NAME, account);
    return { success: true };
  } catch (error) {
    console.error(`[Main Process] Error deleting password: ${error.message}`);
    return { success: false, error: error.message };
  }
});

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "icon.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    width: 1000,
    height: 700,
  });

  win.webContents.on("did-finish-load", () => {
    console.log("[Main Process] Renderer finished loading");
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// 🛠 Ensure IPC is registered before the window is created
app.whenReady().then(() => {
  console.log("[Main Process] App ready, creating window...");
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "vm";
import * as electron from "electron"; // Import Electron safely
import fs from "fs";

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
let sandbox: BrowserWindow | null;

ipcMain.handle("execute-bundled-code", async (_, code: string) => {
  try {
    const context = vm.createContext({ console, require }); // ✅ Enable require inside VM
    const script = new vm.Script(`(function() { ${code} })()`);
    return script.runInContext(context);
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
});

ipcMain.handle("copy-bundle", async (event) => {
  const sourcePath = "/Users/macbookpro/trustless-computer/eternal-ai/agent-launcher/src/pages/home/chat-agent/bundle.js";
  const destinationPath = "/Users/macbookpro/trustless-computer/eternal-ai/agent-launcher/src/pages/home/chat-agent/bundle_2.js";

  try {
    const userDataPath = app.getPath("userData"); // This is ~/Library/Application Support/YourApp
    const filePath = path.join(userDataPath, "demo.txt");

    // Ensure the directory exists
    if (!fs.existsSync(userDataPath)) {
      console.log("Creating directory:", userDataPath);
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    //
    // const data = await fs.promises.readFile("/Users/macbookpro/trustless-computer/eternal-ai/agent-launcher/src/pages/home/chat-agent/main.js", "utf8");
    //
    // await fs.promises.writeFile(filePath, "hshshshshhs", "utf8");
    // return { success: true, userDataPath };

    // await fs.promises.writeFile(destinationPath, "HELLO ", "utf8");

    const win = BrowserWindow.fromWebContents(event.sender);
    const url = win?.webContents.getURL() || "";

    // Allow only internal Electron pages, block external ones
    if (!url.startsWith("file://") && !url.startsWith("app://")) {
      console.warn("🚨 Unauthorized attempt to call copyBundle from:", url);
      return "❌ Access Denied!";
    }

    // fs.promises.writeFile()
    // await fs.promises.copyFile(sourcePath, destinationPath);
    return { success: true, message: app.getPath("userData") };
  } catch (err) {
    console.error("Error copying file:", err);
    return { success: false, error: err.message };
  }
});

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "icon.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false, // ✅ More secure
      sandbox: true, // ✅ Blocks direct Node.js access
    },
    width: 1440,
    height: 1080,
  });

  win.loadURL("http://localhost:5173");

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

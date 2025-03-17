import { ipcRenderer, contextBridge, shell } from "electron";
import { EMIT_EVENT_NAME } from "./share/event-name.ts";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
   on(...args: Parameters<typeof ipcRenderer.on>) {
      const [channel, listener] = args;
      return ipcRenderer.on(channel, (event, ...args) =>
         listener(event, ...args)
      );
   },
   off(...args: Parameters<typeof ipcRenderer.off>) {
      const [channel, ...omit] = args;
      return ipcRenderer.off(channel, ...omit);
   },
   send(...args: Parameters<typeof ipcRenderer.send>) {
      const [channel, ...omit] = args;
      return ipcRenderer.send(channel, ...omit);
   },
   invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
      const [channel, ...omit] = args;
      return ipcRenderer.invoke(channel, ...omit);
   },

   // You can expose other APTs you need here.
   // ...
});

contextBridge.exposeInMainWorld("electronAPI", {
   keytarSave: (key: string, value: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.KEYTAR_SAVE, key, value),
   keytarGet: (key: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.KEYTAR_GET, key),
   keytarRemove: (key: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.KEYTAR_REMOVE, key),

   safeCopy: (text: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.SAFE_COPY, text),

   readFile: (fileName: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.READ_FILE, fileName),
   accessFile: (fileName: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.ACCESS_FILE, fileName),
   writeFile: (fileName: string, folderName: string, data: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.WRITE_FILE, fileName, folderName, data),
   getExistAgentFolders: () => ipcRenderer.invoke(EMIT_EVENT_NAME.GET_EXIST_FOLDERS),
   removeFolder: (folderName: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.REMOVE_FOLDERS, folderName),
   writezipFile: (fileName: string, folderName: string, data: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.SAVE_ZIPFILE, fileName, folderName, data),
   unzipFile: (zipPath: string, extractTo: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.UNZIP_FILE, zipPath, extractTo),

   dockerCopyBuild: () => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_COPY_BUILD),
   dockerCheckInstall: () => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_CHECK_INSTALL),
   dockerInstall: () => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_INSTALL),
   dockerBuild: () => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_BUILD),

   // options: language, privateKey, port
   dockerRunAgent: (agentName: string, chainId: string, options: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_RUN_AGENT, agentName, chainId, options),
   dockerStopAgent: (agentName: string, chainId: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_STOP_AGENT, agentName, chainId),
   dockerCheckRunning: (agentName: string, chainId: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_CHECK_RUNNING, agentName, chainId),

   modelStarter: () => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_STARTER),
   modelInstall: (hash: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_INSTALL, hash),
   modelRun: (hash: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_RUN, hash),
   modelDownloadedList: () => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_DOWNLOADED_LIST),
   modelCheckRunning: () => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_CHECK_RUNNING),
   modelInstallBaseModel: (hash: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_INSTALL_BASE_MODEL, hash),
   modelDelete: (hash: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_DELETE, hash),
   modelStop: (hash: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_STOP, hash),

   openExternal: (url: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.OPEN_EXTRA_LINK, url),

   sendCommand: (cmd: string) => ipcRenderer.send("run-command", cmd),
   onCommandEvent: (callback: any) => ipcRenderer.on("command-event", (_, data) => callback(data)),

   checkForUpdates: () => ipcRenderer.send(EMIT_EVENT_NAME.CHECK_FOR_UPDATE),
   onUpdateAvailable: (callback) => ipcRenderer.on(EMIT_EVENT_NAME.UPDATE_AVAILABLE, (_, info) => callback(info)),
   onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', () => callback()),
   applyUpdate: () => ipcRenderer.send('apply-update'),
});
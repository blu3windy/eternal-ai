import { ipcRenderer, contextBridge, shell } from "electron";
import { EMIT_EVENT_NAME } from "./share/event-name.ts";
import { CodeLanguage, DockerInfoAction } from "./types.ts";
// import Store from 'electron-store';
// const store = new Store();

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

console.log('Preload script loaded'); // Add this line to check if the preload script is executed

contextBridge.exposeInMainWorld("electronAPI", {
   keytarSave: (key: string, value: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.KEYTAR_SAVE, key, value),
   keytarGet: (key: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.KEYTAR_GET, key),
   keytarRemove: (key: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.KEYTAR_REMOVE, key),

   safeCopy: (text: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.SAFE_COPY, text),

   readFile: (fileName: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.READ_FILE, fileName),
   accessFile: (fileName: string, folderName) => ipcRenderer.invoke(EMIT_EVENT_NAME.ACCESS_FILE, fileName, folderName),
   writeFile: (fileName: string, folderName: string, data: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.WRITE_FILE, fileName, folderName, data),
   getExistAgentFolders: () => ipcRenderer.invoke(EMIT_EVENT_NAME.GET_EXIST_FOLDERS),
   removeFolder: (folderName: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.REMOVE_FOLDERS, folderName),
   writezipFile: (fileName: string, folderName: string, data: string, subFolderName?: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.SAVE_ZIPFILE, fileName, folderName, data, subFolderName),
   unzipFile: (zipPath: string, extractTo: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.UNZIP_FILE, zipPath, extractTo),
   copyRequireRunPython: (folderName: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.COPY_REQUIRE_RUN_PYTHON, folderName),

   dockerCopyBuild: () => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_COPY_BUILD),
   dockerCheckInstall: () => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_CHECK_INSTALL),
   dockerInstall: () => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_INSTALL),
   dockerBuild: () => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_BUILD),
   dockerRunningPort: (agentName: string, chainId: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_RUNNING_PORT, agentName, chainId),

   // options: language, privateKey, port
   dockerRunAgent: (agentName: string, chainId: string, options: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_RUN_AGENT, agentName, chainId, options),
   dockerStopAgent: (agentName: string, chainId: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_STOP_AGENT, agentName, chainId),
   dockerInfo: (action: DockerInfoAction) => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_INFO, action),
   dockerSetReadyPort: () => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKET_SET_READY_PORT),
   dockerStopContainer: (containerId: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_STOP_CONTAINER, containerId),
   dockerStartContainer: (containerId: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_START_CONTAINER, containerId),
   dockerDeleteContainer: (containerId: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_DELETE_CONTAINER, containerId),
   dockerDeleteImage: (agentName: string, chainId: string, type: CodeLanguage) => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_DELETE_IMAGE, agentName, chainId, type),
   dockerDeleteImageID: (imageId: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.DOCKER_DELETE_IMAGE_ID, imageId),

   modelStarter: () => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_STARTER),
   modelInstall: (hash: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_INSTALL, hash),
   modelRun: (hash: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_RUN, hash),
   modelDownloadedList: () => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_DOWNLOADED_LIST),
   modelCheckRunning: () => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_CHECK_RUNNING),
   modelInstallBaseModel: (hash: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_INSTALL_BASE_MODEL, hash),
   modelDelete: (hash: string, agent_name: string, chain_id: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_DELETE, hash, agent_name, chain_id),
   modelStop: (hash: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.MODEL_STOP, hash),

   openExternal: (url: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.OPEN_EXTRA_LINK, url),

   sendCommand: (cmd: string) => ipcRenderer.send("run-command", cmd),
   onCommandEvent: (callback: any) => ipcRenderer.on("command-event", (_, data) => callback(data)),

   onUpdateDownloaded: (cb: () => void) => ipcRenderer.on("update-downloaded", cb),
   onUpdateAvailable: (callback) => ipcRenderer.on("update-available", callback),
   onCheckForUpdate: () => ipcRenderer.invoke(EMIT_EVENT_NAME.CHECK_FOR_UPDATE),
   onUpdateDownloadProcessing: (callback) => ipcRenderer.on("download-progress", (_, progress) => callback(progress)),
   restartApp: () => ipcRenderer.invoke("quit-and-install"),
   installUpdate: () => ipcRenderer.send("install-update"),


   storeSetItem: (key: string, value: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.STORE_SET_ITEM, key, value),
   storeGetItem: (key: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.STORE_GET_ITEM, key),
   storeRemoveItem: (key: string) => ipcRenderer.invoke(EMIT_EVENT_NAME.STORE_REMOVE_ITEM, key),
   storeClear: () => ipcRenderer.invoke(EMIT_EVENT_NAME.STORE_CLEAR),

   osContext: () => ipcRenderer.invoke(EMIT_EVENT_NAME.OS_CONTEXT),


   getInitialDockerData: () => ipcRenderer.invoke('get-initial-docker-data'),
   onContainersUpdate: (callback) =>
      ipcRenderer.on('docker-containers-update', (event, data) => callback(data)),
   onImagesUpdate: (callback) =>
      ipcRenderer.on('docker-images-update', (event, data) => callback(data))
});
/// <reference types="vite-plugin-electron/electron-env" />

import { ModelInfo } from "./share/model.ts";

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

export interface IElectronAPI {
  keytarSave: (key: string, value: string) => Promise<{ success: boolean, error?: string }>
  keytarGet: (key: string) => Promise<string>
  keytarRemove: (key: string) => Promise<{ success: boolean, error?: string }>

  // Copy text to clipboard
  safeCopy: (text: string) => Promise<void>
  // File
  readFile: (fileName: string, folderName: string) => Promise<string>
  getFilePath: (fileName: string, folderName: string) => Promise<string>
  accessFile: (fileName: string, folderName: string) => Promise<boolean>
  writeFile: (fileName: string, folderName: string, data: string) => Promise<string>
  removeFolder: (folderName: string) => Promise<boolean>
  getExistAgentFolders: () => Promise<string[]>

  dockerCopyBuild: () => Promise<void>
  dockerBuild: () => Promise<void>
  dockerCheckInstall: () => Promise<boolean>
  dockerInstall: () => Promise<void>
  dockerRunAgent: (agentName: string, chainId: string) => Promise<void>
  dockerStopAgent: (agentName: string, chainId: string) => Promise<void>
  dockerCheckRunning: (agentName: string, chainId: string) => Promise<string>

  modelStarter: () => Promise<void>
  modelInstall: (hash: string) => Promise<void>
  modelRun: (hash: string) => Promise<void>
  modelDownloadedList: () => Promise<ModelInfo[]>
  modelCheckRunning: () => Promise<string | undefined>
  modelInstallBaseModel: (hash: string) => Promise<void>
  modelDelete: (hash: string) => Promise<void>
  modelStop: (hash: string) => Promise<void>

  sendCommand: (cmd: string) => void
  onCommandEvent: (callback: (data: any) => void) => void

  // Open extra link
  openExternal: (url: string) => Promise<void>

  // Store
  storeSetItem: (key: string, value: string) => Promise<void>
  storeGetItem: (key: string) => Promise<string | null>
  storeRemoveItem: (key: string) => Promise<void>
  storeClear: () => Promise<void>
}

declare global {
  interface Window {
    ipcRenderer: import('electron').IpcRenderer
    electronAPI: IElectronAPI
  }
}

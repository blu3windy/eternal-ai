/// <reference types="vite-plugin-electron/electron-env" />

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

interface IElectronAPI {
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
  getExistAgentFolders: () => Promise<string[]>

  dockerCopyBuild: () => Promise<void>
  dockerBuild: () => Promise<void>
  dockerCheckInstall: () => Promise<boolean>
  dockerInstall: () => Promise<void>
  dockerRunAgent: (agentName: string, chainId: string) => Promise<void>
  dockerStopAgent: (agentName: string, chainId: string) => Promise<void>
  dockerCheckRunning: (agentName: string, chainId: string) => Promise<string>

  modelStarter: () => Promise<void>
  modelInstall: () => Promise<void>
  modelRun: () => Promise<void>

  sendCommand: (cmd: string) => void
  onCommandEvent: (callback: (data: any) => void) => void

  // Open extra link
  openExternal: (url: string) => Promise<void>
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  electronAPI: IElectronAPI
}

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
  readFile: (fileName: string) => Promise<string>
  accessFile: (fileName: string) => Promise<boolean>
  writeFile: (fileName: string, data: string) => Promise<string>

  checkDocker: () => Promise<boolean>
  installDocker: () => Promise<void>
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  electronAPI: IElectronAPI
}

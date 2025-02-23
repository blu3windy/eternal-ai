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

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer,
}


declare global {
  interface Window {
    keytar: {
      getPassword: (service: string, account: string) => Promise<string | null>;
      setPassword: (service: string, account: string, password: string) => Promise<void>;
      deletePassword: (service: string, account: string) => Promise<boolean>;
    };
  }
}
import { IElectronAPI } from '../../electron/electron-env';

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

export {}; 
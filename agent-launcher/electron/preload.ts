import { ipcRenderer, contextBridge } from "electron";
import {EMIT_EVENT_NAME} from "./share/event-name.ts";

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
});
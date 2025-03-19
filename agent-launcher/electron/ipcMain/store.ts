import Store from "electron-store"
import { ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";

const ipcStore = () => {

   const store = new Store()

   ipcMain.handle(EMIT_EVENT_NAME.STORE_SET_ITEM, (_event, key, value) => {
      store.set(key, value)
   });

   ipcMain.handle(EMIT_EVENT_NAME.STORE_GET_ITEM, (_event, key) => {
      return store.get(key);
   });

   ipcMain.handle(EMIT_EVENT_NAME.STORE_REMOVE_ITEM, (_event, key) => {
      store.delete(key)
   });

   ipcMain.handle(EMIT_EVENT_NAME.STORE_CLEAR, (_event) => {
      store.clear()
   });
}

export default ipcStore;
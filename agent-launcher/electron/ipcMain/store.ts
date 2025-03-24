import { ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import electronStore from "../share/storage.ts";

const ipcStore = () => {
   ipcMain.handle(EMIT_EVENT_NAME.STORE_SET_ITEM, async (_event, key, value) => {
      // store.set(key, value)
      await electronStore.setStoreItem(key, value)
   });

   ipcMain.handle(EMIT_EVENT_NAME.STORE_GET_ITEM, async (_event, key) => {
      // return store.get(key);
      return await electronStore.getStoreItem(key)
   });

   ipcMain.handle(EMIT_EVENT_NAME.STORE_REMOVE_ITEM, async(_event, key) => {
      // store.delete(key)
      await electronStore.removeStoreItem(key)
   });

   ipcMain.handle(EMIT_EVENT_NAME.STORE_CLEAR, async (_event) => {
      // store.clear()
      await electronStore.clearStore()
   });
}

export default ipcStore;
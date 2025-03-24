import Store from "electron-store"

const store = new Store()

const getStore = () => {
   return store
}

const getStoreItem = async (key: string) => {
   return store.get(key)
}

const setStoreItem = async (key: string, value: any) => {
   store.set(key, value)
}

const removeStoreItem = async (key: string) => {
   store.delete(key)
}

const clearStore = async () => {
   store.clear()
}

const electronStore = {
   getStore,
   getStoreItem,
   setStoreItem,
   removeStoreItem,
   clearStore
}

export default electronStore;
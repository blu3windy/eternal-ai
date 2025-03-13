const safeCopy = async (text?: string) => {
   if (text) {
      await globalThis.electronAPI.safeCopy(text);
   }
}

export {
   safeCopy
}
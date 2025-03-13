const safeCopy = async (text?: string): Promise<void> => {
   if (text) {
      await globalThis.electronAPI.safeCopy(text);
   }
}

export {
   safeCopy
}
const safeCopy = async (text?: string): Promise<void> => {
   if (text) {
      await window.electronAPI.safeCopy(text);
   }
}

export {
   safeCopy
}
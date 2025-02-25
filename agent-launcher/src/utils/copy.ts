const safeCopy = async (text?: string) => {
   if (text) {
      await window.electronAPI.safeCopy(text);
   }
}

export {
   safeCopy
}
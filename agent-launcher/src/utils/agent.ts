const setReadyPort = async () => {
   const electronAPI = window.electronAPI;
   try {
      await electronAPI.dockerSetReadyPort();
   } catch (error) {
      console.error("Error dockerSetReadyPort:", error);
   }

   try {
      await electronAPI.modelStop();
   } catch (error) {
      console.error("Error dockerSetReadyPort:", error);
   }
}

export {
   setReadyPort
}
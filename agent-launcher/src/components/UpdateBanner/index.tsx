import { useEffect, useState } from "react";

const UpdateBanner = () => {
   const [updateAvailable, setUpdateAvailable] = useState(false);
   const [updateInfo, setUpdateInfo] = useState<any>(null);
   const [downloaded, setDownloaded] = useState(false);
   const [downloadProgress, setDownloadProgress] = useState(0);
   const [isDownloading, setIsDownloading] = useState(false);

   useEffect(() => {
      globalThis.electronAPI.onUpdateAvailable((info) => {
         console.log("onUpdateAvailable", info);

         setUpdateAvailable(true);
         setUpdateInfo(info);
      });

      globalThis.electronAPI.onUpdateDownloaded(() => {
         setDownloaded(true);
         setIsDownloading(false);
      });

      globalThis.electronAPI.onDownloadProgress((progressObj) => {
         setDownloadProgress(progressObj.percent || 0);
         setIsDownloading(true);
      });
   }, []);

   const handleUpdate = () => {
      if (downloaded) {
         globalThis.electronAPI.applyUpdate();
      } else {
         globalThis.electronAPI.checkForUpdates();
      }
   };

   if (!updateAvailable) {
      return null;
   }

   return (
      <div className="fixed bottom-0 left-0 w-full bg-blue-600 text-white p-4">
         <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-2">
               <div>
                  {downloaded
                     ? "Update downloaded. Restart to apply."
                     : `New update available: v${updateInfo?.version}`}
               </div>
               <button
                  onClick={handleUpdate}
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
               >
                  {downloaded ? "Restart Now" : "Download Update"}
               </button>
            </div>
            
            {isDownloading && (
               <div className="w-full">
                  <div className="w-full bg-blue-800 rounded-full h-2">
                     <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                     />
                  </div>
                  <div className="text-sm mt-1 text-center">
                     Downloading: {Math.round(downloadProgress)}%
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default UpdateBanner;

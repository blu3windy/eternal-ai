import { useEffect, useState } from "react";

interface UpdateInfo {
  version: string;
  releaseNotes?: string;
}

interface DownloadProgress {
  percent: number;
  transferred: number;
  total: number;
  bytesPerSecond: number;
}

const UpdateBanner = () => {
   const [showBanner, setShowBanner] = useState(false);
   const [showDialog, setShowDialog] = useState(false);
   const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
   const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
   const [isDownloading, setIsDownloading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      globalThis.electronAPI.onUpdateAvailable((info: UpdateInfo) => {
         setUpdateInfo(info);
         setShowBanner(true);
      });

      globalThis.electronAPI.onUpdateDownloaded(() => {
         setIsDownloading(false);
         setShowDialog(false);
         setShowBanner(false);
      });

      globalThis.electronAPI.onUpdateError((error: string) => {
         setError(error);
         setIsDownloading(false);
         setShowDialog(false);
      });

      globalThis.electronAPI.onDownloadProgress((progress: DownloadProgress) => {
         setDownloadProgress(progress);
      });
   }, []);

   const handleUpdateClick = () => {
      setShowDialog(true);
      setShowBanner(false);
   };

   const handleAcceptUpdate = () => {
      setIsDownloading(true);
      setError(null);
      globalThis.electronAPI.applyUpdate();
   };

   const handleCancelUpdate = () => {
      setShowDialog(false);
      setIsDownloading(false);
      setDownloadProgress(null);
      setError(null);
   };

   if (!showBanner && !showDialog) return null;

   return (
      <div className="fixed bottom-0 left-0 right-0 z-50">
         {showBanner && (
            <div className="bg-blue-600 text-white p-4">
               <div className="flex justify-between items-center">
                  <div>
              New version {updateInfo?.version} is available
                  </div>
                  <button
                     onClick={handleUpdateClick}
                     className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
                  >
              Update Now
                  </button>
               </div>
            </div>
         )}

         {showDialog && (
            <div className="bg-white p-6 shadow-lg border-t border-gray-200">
               <div className="space-y-4">
                  <div>
                     <h3 className="text-lg font-semibold">Update Available</h3>
                     <p>Version {updateInfo?.version} is ready to download</p>
                  </div>

                  {updateInfo?.releaseNotes && (
                     <div>
                        <h4 className="font-medium mb-2">Release Notes:</h4>
                        <div className="whitespace-pre-wrap text-sm text-gray-600">
                           {updateInfo.releaseNotes}
                        </div>
                     </div>
                  )}

                  {isDownloading && downloadProgress && (
                     <div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                           <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${downloadProgress.percent}%` }}
                           />
                        </div>
                        <div className="text-sm text-gray-600">
                  Downloading: {Math.round(downloadProgress.percent)}% ({Math.round(downloadProgress.transferred / 1024 / 1024)}MB / {Math.round(downloadProgress.total / 1024 / 1024)}MB)
                        </div>
                     </div>
                  )}

                  {error && (
                     <div className="text-red-600 text-sm">
                Error: {error}
                     </div>
                  )}

                  <div className="flex justify-end gap-2">
                     <button
                        onClick={handleCancelUpdate}
                        disabled={isDownloading}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                     >
                Cancel
                     </button>
                     <button
                        onClick={handleAcceptUpdate}
                        disabled={isDownloading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                     >
                        {isDownloading ? 'Downloading...' : 'Download & Install'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default UpdateBanner;

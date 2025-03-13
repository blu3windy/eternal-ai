import React, { useEffect, useState } from "react";

const UpdateBanner = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    globalThis.electronAPI.onUpdateAvailable((info) => {
      console.log("onUpdateAvailable", info);

      setUpdateAvailable(true);
      setUpdateInfo(info);
    });

    globalThis.electronAPI.onUpdateDownloaded(() => {
      setDownloaded(true);
    });
  }, []);

  return updateAvailable ? (
    <div className="fixed bottom-0 left-0 w-full bg-blue-600 text-white p-4 flex justify-between items-center">
      <div>
        {downloaded
          ? "Update downloaded. Restart to apply."
          : `New update available: v${updateInfo?.version}. Downloading...`}
      </div>
      <button
        onClick={() => globalThis.electronAPI.applyUpdate()}
        className="bg-white text-blue-600 px-4 py-2 rounded"
      >
        Restart Now
      </button>
    </div>
  ) : (
    <button onClick={() => globalThis.electronAPI.checkForUpdates()}>
      Check for update
    </button>
  );
};

export default UpdateBanner;

import { useEffect, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Progress, Box, Text } from "@chakra-ui/react";

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
   const [updateApplied, setUpdateApplied] = useState(false);

   useEffect(() => {
      globalThis.electronAPI.onUpdateAvailable((info: UpdateInfo) => {
         setUpdateInfo(info);
         setShowBanner(true);
      });

      globalThis.electronAPI.onUpdateDownloaded(() => {
         setIsDownloading(false);
         setShowDialog(false);
         setShowBanner(false);
         setUpdateApplied(true);
         console.log("Update downloaded successfully.");
      });

      globalThis.electronAPI.onUpdateError((error: string) => {
         console.error("Update error:", error);
         if (!updateApplied) {
            setError("An error occurred while updating. Please try again.");
            setIsDownloading(false);
            setShowDialog(true);
            setShowBanner(false);
         }
      });

      globalThis.electronAPI.onDownloadProgress((progress: DownloadProgress) => {
         setDownloadProgress(progress);
      });
   }, [updateApplied]);

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

   useEffect(() => {
      if (updateApplied) {
         console.log("Update has been successfully applied.");
      }
   }, [updateApplied]);

   if (!showBanner && !showDialog) return null;

   return (
      <Box position="fixed" bottom={0} left={0} right={0} zIndex={1000} bgGradient="linear(to-r, blue.500, blue.700)" p={4}>
         {showBanner && (
            <Box display="flex" justifyContent="space-between" alignItems="center">
               <Text color="white">New version {updateInfo?.version} is available!</Text>
               <Button colorScheme="whiteAlpha" onClick={handleUpdateClick}>
                  Update Now
               </Button>
            </Box>
         )}

         <Modal isOpen={showDialog} onClose={handleCancelUpdate}>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Update Available</ModalHeader>
               <ModalBody>
                  {error ? (
                     <Text color="red.500">Error: {error}</Text>
                  ) : (
                     <>
                        <Text>Version {updateInfo?.version} is ready to download.</Text>
                        {updateInfo?.releaseNotes && (
                           <Box mt={2}>
                              <Text fontWeight="bold">Release Notes:</Text>
                              <Text whiteSpace="pre-wrap">{updateInfo.releaseNotes}</Text>
                           </Box>
                        )}
                        {isDownloading && downloadProgress && (
                           <Box mt={4}>
                              <Progress value={downloadProgress.percent} />
                              <Text mt={2}>
                                 Downloading: {Math.round(downloadProgress.percent)}% ({Math.round(downloadProgress.transferred / 1024 / 1024)}MB / {Math.round(downloadProgress.total / 1024 / 1024)}MB)
                              </Text>
                           </Box>
                        )}
                     </>
                  )}
               </ModalBody>
               <ModalFooter>
                  <Button variant="ghost" onClick={handleCancelUpdate} isDisabled={isDownloading}>
                     Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleAcceptUpdate} isDisabled={isDownloading} ml={3}>
                     {isDownloading ? 'Downloading...' : 'Download & Install'}
                  </Button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      </Box>
   );
};

export default UpdateBanner;

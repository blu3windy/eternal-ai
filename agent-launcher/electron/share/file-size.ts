import { getFolderPath } from "./model.ts";
import { validateDiskSpace } from "./utils.ts";
import { dialog } from "electron";


// Constants for size calculations
const MB_TO_GB = 1024; // 1 GB = 1024 MB
const MODEL_CHUNK_SIZE_MB = 430; // Size per chunk in MB

const distSpace = async (hash: string) => {
   const files = await fetch(`https://gateway.mesh3.network/ipfs/${hash}`)
      .then((res) => res.json())
      .then((res) => res.num_of_file);

   // Calculate total size in GB
   const totalSizeGB = (files * MODEL_CHUNK_SIZE_MB) / MB_TO_GB;

   // Check disk space before proceeding
   const requiredGB = Math.ceil(totalSizeGB); // Round up to ensure we have enough space
   const path = getFolderPath();

   const { isValid, availableSpace, requiredSpace } = await validateDiskSpace(requiredGB, path);


   return {
      isValid,
      availableSpace,
      requiredSpace,
      totalSizeGB,
   }

}
const dialogCheckDist = async (hash: string) => {
   const {
      isValid,
      availableSpace,
      requiredSpace,
      totalSizeGB
   } = await distSpace(hash);
   if (!isValid) {
      await dialog.showMessageBox({
         type: 'warning',
         title: 'Insufficient Disk Space',
         message: 'Not enough disk space to install the model',
         detail: `Model Size: ${(Number(totalSizeGB.toFixed(2)) / 2).toFixed(2)}GB\nAvailable space: ${availableSpace}GB\nRequired space (with buffer): ${requiredSpace}GB\n\nPlease free up some disk space and try again.`,
         buttons: ['OK'],
         defaultId: 0
      });
      throw new Error('Insufficient disk space');
   }
}

export {
   distSpace,
   dialogCheckDist
}
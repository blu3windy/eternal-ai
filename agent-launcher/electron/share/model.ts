import { app } from "electron";
import path from "path";
import { USER_DATA_FOLDER_NAME } from "./utils.ts";
import fs from "fs";

const ACTIVE_PATH = 'local_llms/bin/activate';

export interface ModelInfo {
    hash: string;
    type: string;
}

const getFolderPath = () => {
   const userDataPath = app.getPath("userData");
   return path.join(`${userDataPath}/${USER_DATA_FOLDER_NAME.AGENT_DATA}`, USER_DATA_FOLDER_NAME.MODEL);
}


const downloadedModels = async () => {
   try {
      const folderPath = getFolderPath();
      // Construct path to llms-storage
      const storagePath = path.join(folderPath, "llms-storage");

      // Check if directory exists
      if (!fs.existsSync(storagePath)) {
         console.log("llms-storage directory not found");
         return [];
      }

      // Read directory contents
      const files = fs.readdirSync(storagePath);

      // Process each file
      const models: ModelInfo[] = files
         .filter((file) => {
            // Only process files (not directories)
            const filePath = path.join(storagePath, file);
            return fs.statSync(filePath).isFile();
         })
         .map((file) => {
            // Split filename into hash and type
            const [hash, type] = file.split(".");
            return { hash, type };
         })
         .filter((model) => model.hash && model.type); // Filter out invalid entries

      return models;
   } catch (error) {
      console.error("Error reading models:", error);
      return [];
   }
};

const deleteModel = async (hash: string) => {
   try {
      const folderPath = getFolderPath();
      const storagePath = path.join(folderPath, 'llms-storage');
      const files = fs.readdirSync(storagePath);

      // Find file that starts with the hash
      const modelFile = files.find(file => file.startsWith(hash));
      if (!modelFile) {
         console.error('Model file not found');
         return false;
      }

      // Delete the file
      const filePath = path.join(storagePath, modelFile);
      fs.unlinkSync(filePath);
      return true;
   } catch (error) {
      console.error('Error deleting model:', error);
      return false;
   }
}

export {
   getFolderPath,
   ACTIVE_PATH,
   downloadedModels,
   deleteModel
}
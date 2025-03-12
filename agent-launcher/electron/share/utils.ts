import path from "path";
import { app } from "electron";
import { exec } from "child_process";

export const PUBLIC_SCRIPT = 'public/scripts';

const SCRIPTS_NAME = {
   DOCKER_INSTALL_SCRIPT: "docker-install.sh",
   DOCKER_BUILD_SCRIPT: "docker-build.sh",
   DOCKER_FILE : "Dockerfile",
   PACKAGE_JSON: "package.json",
   SERVER_JS: "server.js",
   MODEL_STARTER: "mac.sh",
   MODEL_DOWNLOAD_BASE: "download-base-model.sh",
}

const USER_DATA_FOLDER_NAME = {
   AGENT_DATA: "agent-data",
   AGENT_ROUTER: "agent-router",
   AGENT_JS: "agent-js",
   MODEL: "model",
   DOCKER: "docker"
}

const getScriptPath = (fileName: string, home_path = PUBLIC_SCRIPT) => {
   const isDev = process.env.NODE_ENV === "development";
   return isDev
      ? path.join(app.getAppPath(), home_path, fileName)
      : path.join(process.resourcesPath, home_path, fileName);
}

const getDNSHost = (params: { chainId: string, agentName: string }) => {
   return `${params.chainId}-${params.agentName}`;
}

const executeWithIgnoreError = async (fn: () => Promise<void>) => {
   try {
      await fn();
   } catch (error: any) {
      console.error("executeWithIgnoreError", {
         error: error.message,
         functionName: fn.name
      });
   }
}

const executeCatchError = async (fn: () => Promise<void>) => {
   try {
      await fn();
   } catch (error: any) {
      console.error("executeCatchError", {
         error: error.message,
         functionName: fn.name
      });
      throw error;
   }
}

/**
 * Get available disk space in GB
 * @param directory Directory to check
 * @returns Available space in GB
 */
const getAvailableDiskSpace = async (directory: string): Promise<number> => {
   return new Promise((resolve, reject) => {
      if (process.platform === 'darwin' || process.platform === 'linux') {
         exec(`df -k "${directory}"`, (error, stdout) => {
            if (error) {
               reject(error);
               return;
            }
        
            const lines = stdout.trim().split('\n');
            if (lines.length < 2) {
               reject(new Error('Unable to parse disk space information'));
               return;
            }
        
            const values = lines[1].split(/\s+/);
            // Get available space in KB and convert to GB
            const availableGB = parseInt(values[3], 10) / (1024 * 1024);
            resolve(availableGB);
         });
      } else if (process.platform === 'win32') {
         exec(`wmic logicaldisk get size,freespace,caption`, (error, stdout) => {
            if (error) {
               reject(error);
               return;
            }
        
            const driveLetter = path.parse(directory).root.split(':')[0];
            const lines = stdout.trim().split('\n');
        
            for (const line of lines) {
               const values = line.trim().split(/\s+/);
               if (values[0] === driveLetter + ':') {
                  const freeSpace = parseInt(values[1], 10);
                  const availableGB = freeSpace / (1024 * 1024 * 1024);
                  resolve(availableGB);
                  return;
               }
            }
        
            reject(new Error('Unable to find drive information'));
         });
      } else {
         reject(new Error('Unsupported platform'));
      }
   });
};

/**
 * Check if there's enough disk space available
 * @param requiredGB Required space in GB
 * @param directory Directory to check
 * @returns Object containing validation result and available space
 */
const validateDiskSpace = async (requiredGB: number, directory?: string): Promise<{
  isValid: boolean; 
  availableSpace: number;
  requiredSpace: number;
}> => {
   try {
      const checkDir = directory || app.getPath('userData');
      const availableGB = await getAvailableDiskSpace(checkDir);
    
      // Add 1GB buffer for safety
      const isValid = availableGB >= (requiredGB + 1);
    
      return {
         isValid,
         availableSpace: Math.floor(availableGB),
         requiredSpace: requiredGB
      };
   } catch (error) {
      console.error('Error checking disk space:', error);
      throw error;
   }
};

export {
   getScriptPath,
   SCRIPTS_NAME,
   USER_DATA_FOLDER_NAME,
   getDNSHost,
   executeWithIgnoreError,
   executeCatchError,
   getAvailableDiskSpace,
   validateDiskSpace,
}
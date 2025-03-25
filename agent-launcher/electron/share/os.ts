import fs from "fs/promises";
import * as os from "os";

const getOsContext = async () => {
   // Get OS information

   // Memory information
   const totalRam = os.totalmem(); // Total memory in bytes
   const freeRam = os.freemem();   // Free memory in bytes
   const usedRam = totalRam - freeRam; // Used memory in bytes

   // Disk information
   const stats = await fs.statfs('/'); // Check root directory (adjust path as needed)
   const totalDisk = stats.blocks * stats.bsize; // Total blocks * block size = total bytes
   const freeDisk = stats.bfree * stats.bsize; // Free blocks * block size = free bytes

   return {
      memory: {
         total: totalRam,
         free: freeRam,
         used: usedRam,
      },
      disk: {
         total: totalDisk,
         free: freeDisk,
         used: totalDisk - freeDisk,
      },
      cpu: {
         cores: os.cpus().length,
         model: os.cpus()[0].model,
         speed: os.cpus()[0].speed,
      },
      os: {
         platform: os.platform(),
         release: os.release(),
         arch: os.arch(),
         hostname: os.hostname(),
         uptime: os.uptime(),
      }
   };
}

export {
   getOsContext,
}
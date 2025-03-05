import { exec, spawn } from "child_process";
import { promisify } from "util";
import fs from "fs";

const execAsync = async (cmd: string) => {
   const possiblePaths = [
      "/opt/homebrew/bin/docker", // Apple Silicon macOS (Homebrew)
      "/usr/bin/docker",        // Standard system install
      "/usr/local/bin/docker",  // Intel macOS (Homebrew)
   ];

   let dockerDir = '';
   for (const dockerPath of possiblePaths) {
      if (fs.existsSync(dockerPath)) {
         dockerDir = dockerPath.substring(0, dockerPath.lastIndexOf("/"));
         break;
      }
   }

   const env = dockerDir ? { ...process.env, PATH: `${dockerDir}:${process.env.PATH}` } : process.env;

   return promisify(exec)(cmd, { env }); // Execute with updated PATH
};

const execAsyncStream = (cmd: string) => {
   return new Promise<void>((resolve, reject) => {
      const process = exec(cmd);

      process.stdout?.on("data", (data) => console.log(data.toString()));
      process.stderr?.on("data", (data) => console.error(data.toString()));

      process.on("close", (code, data) => (code === 0 ? resolve() : reject(new Error(`Exited with code ${code}`))));
   });
};

const command = {
   execAsync,
   execAsyncStream
}

export default command;
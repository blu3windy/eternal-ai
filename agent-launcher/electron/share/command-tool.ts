import { exec, spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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
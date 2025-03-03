import { app, ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import fs from "fs";
import path from "path";
import net from "net";

import { exec } from "child_process";
import { promisify } from "util";
import { getScriptPath, SCRIPTS_NAME, USER_DATA_FOLDER_NAME } from "../share/utils.ts";

const execAsync = promisify(exec);
const DOCKER_NAME = 'launcher-agent';

const checkPort = (port: number): Promise<boolean> => {
   return new Promise((resolve) => {
      const server = net.createServer();

      server.once('error', (err: any) => {
         if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
            resolve(false);
         } else {
            resolve(false);
         }
      });

      server.once('listening', () => {
         server.close();
         resolve(true);
      });

      console.log('Checking port:', port);
      server.listen(port);
   });
};

const isPortInUse = (port: number): Promise<boolean> => {
   return new Promise((resolve) => {
      exec(process.platform === 'win32'
         ? `netstat -ano | findstr :${port}`
         : `lsof -i :${port}`,
      (error, stdout) => {
         resolve(!!stdout);
      }
      );
   });
};

const findAvailablePort = async (startPort: number, maxPort = 65535): Promise<number> => {
   let port = startPort;
   while (await isPortInUse(port) || !(await checkPort(port))) {
      port++;
      if (port > maxPort) {
         throw new Error('No available ports found');
      }
   }
   return port;
};

const dockerCopyBuild = async () => {
   const userDataPath = app.getPath("userData");

   const REQUIRE_COPY_FILES = [
      SCRIPTS_NAME.DOCKER_FILE,
      SCRIPTS_NAME.PACKAGE_JSON,
      SCRIPTS_NAME.SERVER_JS
   ];

   const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);

   // Ensure the folder exists
   if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
   }

   for (const file of REQUIRE_COPY_FILES) {
      const source = getScriptPath(file);
      const destination = path.join(folderPath, file);
      fs.copyFileSync(source, destination);
      console.log("File copied:", source, destination);
   }
}


const ipcMainDocker = () => {
   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_BUILD, async (_event) => {
      try {
         const userDataPath = app.getPath("userData");
         const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);
         console.log(EMIT_EVENT_NAME.DOCKER_BUILD, {
            folderPath
         });

         await execAsync(
            `cd "${folderPath}" && docker build -t ${DOCKER_NAME} .`
         );
         console.log('LEON docker build done');
      } catch (error) {
         console.log('LEON error', error);
      }
   })

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_COPY_BUILD, async (_event) => {
      try {
         await dockerCopyBuild();
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   })

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_CHECK_INSTALL, async (_event) => {
      try {
         // await copySource();
         // check docker version
         // docker build
         // const { stdout } = await execAsync(
         //    'cd "/Users/macbookpro/Library/Application Support/agent-launcher/agent-data" && docker build -t agent .'
         // );

         // docker run


         // random port


         // const { stdout } = await execAsync(
         //    'cd "/Users/macbookpro/Library/Application Support/agent-launcher/agent-data" && docker run -d -p 3001:3000 -v ./agents/agent_1/prompt.js:/app/src/prompt.js --name agent1 agent'
         // )
         // console.log(stdout);
         const { stderr } = await execAsync("docker -v");
         return !stderr;
      } catch (error) {
         console.log(error);
         return false;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_INSTALL, async (_event) => {
      const scriptPath = getScriptPath(SCRIPTS_NAME.DOCKER_INSTALL);
      const cmd = `/usr/bin/osascript -e 'do shell script "sh ${scriptPath}" with administrator privileges'`;
      // const cmd = '/usr/bin/osascript -e \'do shell script "echo some_command" with administrator privileges\''
      const { stdout, stderr } = await execAsync(cmd)
      // const { stdout, stderr } = await execAsync(`sh ${scriptPath}`);

      if (stderr) {
         console.error(`stderr: ${stderr}`);
         return;
      }

      console.log(`stdout: ${stdout}`);
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_RUN_AGENT, async (_event, agentID: string, agentName: string) => {
      try {
         const userDataPath = app.getPath("userData");
         const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);

         // Start checking from port 3000
         const startPort = 3000;
         const port = await findAvailablePort(startPort);

         const { stdout } = await execAsync(
            `cd "${folderPath}" && docker run -d -p ${port}:3000 -v ./agents/${agentID}/prompt.js:/app/src/prompt.js --name ${agentID} ${DOCKER_NAME}`
         );
         console.log(stdout);
      } catch (error) {
         console.log(error);
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_STOP_AGENT, async (_event, agentID: string) => {
      try {
         const userDataPath = app.getPath("userData");
         const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);
         const { stdout } = await execAsync(`cd "${folderPath}" &&  docker stop ${agentID}`);
         console.log(stdout);
      } catch (error) {
         console.log(error);
      }
   });
}

export default ipcMainDocker;
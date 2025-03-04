import { app, ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import fs from "fs";
import path from "path";
import net from "net";

import { exec } from "child_process";
import { promisify } from "util";
import { getScriptPath, PUBLIC_SCRIPT, SCRIPTS_NAME, USER_DATA_FOLDER_NAME } from "../share/utils.ts";
import command from "../share/command-tool.ts";

const execAsync = promisify(exec);


const option = {
   timeout: 0, // Set to 0 for no timeout, or increase it (e.g., 10 * 1000 for 10s)
   maxBuffer: 1024 * 1024 * 10, // Increase buffer to 10MB (default is 1MB)
}

const DOCKER_NAME = 'launcher-agent';
const DOCKER_ROUTER_NAME = `${DOCKER_NAME}-router`;

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

   const REQUIRE_COPY_AGENT_JS_FILES = [
      SCRIPTS_NAME.DOCKER_FILE,
      SCRIPTS_NAME.PACKAGE_JSON,
      SCRIPTS_NAME.SERVER_JS
   ];

   const REQUIRE_COPY_AGENT_ROUTER_FILES = [...REQUIRE_COPY_AGENT_JS_FILES];

   const REQUIRE_COPY_MODEL_FILES = [SCRIPTS_NAME.MODEL_STARTER];


   const folderPathAgentJS = path.join(`${userDataPath}/${USER_DATA_FOLDER_NAME.AGENT_DATA}`, USER_DATA_FOLDER_NAME.AGENT_JS);
   const folderPathAgentRouter = path.join(`${userDataPath}/${USER_DATA_FOLDER_NAME.AGENT_DATA}`, USER_DATA_FOLDER_NAME.AGENT_ROUTER);
   const folderPathModel = path.join(`${userDataPath}/${USER_DATA_FOLDER_NAME.AGENT_DATA}`, USER_DATA_FOLDER_NAME.MODEL);

   const paths = [
      folderPathAgentJS,
      folderPathAgentRouter,
      folderPathModel
   ];


   console.log("dockerCopyBuild", paths);

   for (const folderPath of paths) {
      if (!fs.existsSync(folderPath)) {
         fs.mkdirSync(folderPath, { recursive: true });
      }
   }


   for (const file of REQUIRE_COPY_AGENT_JS_FILES) {
      const source = getScriptPath(file, `${PUBLIC_SCRIPT}/${USER_DATA_FOLDER_NAME.AGENT_JS}`);
      const destination = path.join(folderPathAgentJS, file);
      fs.copyFileSync(source, destination);
   }

   for (const file of REQUIRE_COPY_AGENT_ROUTER_FILES) {
      const source = getScriptPath(file, `${PUBLIC_SCRIPT}/${USER_DATA_FOLDER_NAME.AGENT_ROUTER}`);
      const destination = path.join(folderPathAgentRouter, file);
      fs.copyFileSync(source, destination);
   }

   for (const file of REQUIRE_COPY_MODEL_FILES) {
      const source = getScriptPath(file, `${PUBLIC_SCRIPT}/${USER_DATA_FOLDER_NAME.MODEL}`);
      const destination = path.join(folderPathModel, file);
      console.log("File copied:", { source, destination });
      fs.copyFileSync(source, destination);
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
            `cd "${folderPath}" && docker build -t ${DOCKER_NAME} ./${USER_DATA_FOLDER_NAME.AGENT_JS}`
         );

         await execAsync(
            `cd "${folderPath}" && docker build -t ${DOCKER_ROUTER_NAME} ./${USER_DATA_FOLDER_NAME.AGENT_ROUTER}`
         );

         try {
            // `cd "${folderPath}" && docker network create --internal network-agent-internal && docker network create network-agent-external && docker run -d -p 33033:80 --network=network-agent-internal --network=network-agent-external --name ${USER_DATA_FOLDER_NAME.AGENT_ROUTER} ${USER_DATA_FOLDER_NAME.AGENT_ROUTER}`
            await execAsync(
               `cd "${folderPath}" && docker network create --internal network-agent-internal`
            );
         } catch (error) {
            console.log('error', error);
         }

         try {
            await execAsync(
               `cd "${folderPath}" && docker network create network-agent-external`
            );
         } catch (error) {
            console.log('error', error);
         }

         try {
            await execAsync(
               `docker stop ${DOCKER_ROUTER_NAME}`
            );
         } catch (error) {
            console.log('error', error);
         }

         try {
            await execAsync(
               `docker rm ${DOCKER_ROUTER_NAME}`
            );
         } catch (error) {
            console.log('error', error);
         }

         try {
            await execAsync(
               `docker run -d -p 33033:80 --network=network-agent-internal --network=network-agent-external --name ${DOCKER_ROUTER_NAME} ${DOCKER_ROUTER_NAME}`
            );
         } catch (error) {
            console.log('error', error);
         }


         // docker network create --internal network-agent-internal
         // docker network create network-agent-external
         //
         // docker run -d -p 33033:80 --network=network-agent-internal --network=network-agent-external --name agentrouter agentrouter

         console.log('docker build done');
      } catch (error) {
         console.log('error', error);
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
      let { stdout: userName } = await execAsync("whoami");
      userName = userName.trim();
      const nixPath = getScriptPath(SCRIPTS_NAME.BOOTSTRAP);
      const dockerScriptPath = getScriptPath(SCRIPTS_NAME.DOCKER_INSTALL_SCRIPT);
      const cmdDocker = `sh ${dockerScriptPath}`;
      // await execAsync(cmdNix, { ...option })
      // await execAsync(cmdDocker, { ...option })
      const cmd = `/usr/bin/osascript -e 'do shell script "sh ${nixPath} ${userName} ${dockerScriptPath}" with administrator privileges'`;

      console.log(cmd)
      const data = await command.execAsyncStream(cmd)

      // const { stdout, stderr } = await execAsync("docker -v");

      // const { stdout, stderr } = await execAsync(`sh ${scriptPath}`);

      // if (stderr) {
      //    console.error(`stderr: ${stderr}`);
      //    return;
      // }
      //
      // console.log(`stdout: ${stdout}`);
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_RUN_AGENT, async (_event, agentName: string, chainId: string) => {
      try {
         const userDataPath = app.getPath("userData");
         const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);


         // docker run -d -v /Users/nqhieu84/Work/testjs/abc/agents/app/1/prompt.js:/app/src/prompt.js --network network-agent-internal --name 1-agent1 agent
         // docker run -d -v /Users/nqhieu84/Work/testjs/abc/agents/app/2/prompt.js:/app/src/prompt.js --network network-agent-external --network network-agent-internal --name 1-agent2 agent

         // Start checking from port 3000
         const startPort = 3000;
         const port = await findAvailablePort(startPort);

         const dnsHost = `${chainId}-${agentName}`;

         try {
            await execAsync(
               `cd "${folderPath}" && docker stop ${dnsHost}`
            );
         } catch (error) {
            console.log(error);
         }

         try {
            await execAsync(
               `cd "${folderPath}" && docker rm ${dnsHost}`
            );
         } catch (error) {
            console.log(error);
         }

         const { stdout } = await execAsync(
            `cd "${folderPath}" && docker run -d -v ./agents/${dnsHost}/prompt.js:/app/src/prompt.js --network network-agent-internal --name ${dnsHost} ${DOCKER_NAME}`
         );
         console.log(stdout);
      } catch (error) {
         console.log(error);
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_STOP_AGENT, async (_event, agentName: string, chainId: string) => {
      try {
         const userDataPath = app.getPath("userData");
         const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);
         const dnsHost = `${chainId}-${agentName}`;

         try {
            await execAsync(
               `docker stop ${dnsHost}`
            );
         } catch (error) {
            console.log(error);
         }

         try {
            await execAsync(
               `docker rm ${dnsHost}`
            );
         } catch (error) {
            console.log(error);
         }
      } catch (error) {
         console.log(error);
      }
   });
}

export default ipcMainDocker;
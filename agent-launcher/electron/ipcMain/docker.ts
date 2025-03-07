import { app, ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import fs from "fs";
import path from "path";
import {
   executeWithIgnoreError,
   getScriptPath,
   PUBLIC_SCRIPT,
   SCRIPTS_NAME,
   USER_DATA_FOLDER_NAME
} from "../share/utils.ts";
import command from "../share/command-tool.ts";

const getDocker = async () => {
   return 'docker'
}

const DOCKER_NAME = 'launcher-agent';
const DOCKER_SERVER_JS = `${DOCKER_NAME}-js`
const DOCKER_ROUTER_NAME = `${DOCKER_NAME}-router`;

const dockerCopyBuild = async () => {
   const userDataPath = app.getPath("userData");

   const REQUIRE_COPY_AGENT_JS_FILES = [
      SCRIPTS_NAME.DOCKER_FILE,
      SCRIPTS_NAME.PACKAGE_JSON,
      SCRIPTS_NAME.SERVER_JS
   ];

   const REQUIRE_COPY_AGENT_ROUTER_FILES = [...REQUIRE_COPY_AGENT_JS_FILES];

   const REQUIRE_COPY_MODEL_FILES = [SCRIPTS_NAME.MODEL_STARTER];
   const REQUIRE_COPY_DOCKER_FILES = [SCRIPTS_NAME.DOCKER_INSTALL_SCRIPT];

   const folderPathAgentJS = path.join(`${userDataPath}/${USER_DATA_FOLDER_NAME.AGENT_DATA}`, USER_DATA_FOLDER_NAME.AGENT_JS);
   const folderPathAgentRouter = path.join(`${userDataPath}/${USER_DATA_FOLDER_NAME.AGENT_DATA}`, USER_DATA_FOLDER_NAME.AGENT_ROUTER);
   const folderPathModel = path.join(`${userDataPath}/${USER_DATA_FOLDER_NAME.AGENT_DATA}`, USER_DATA_FOLDER_NAME.MODEL);
   const folderPathDocker = path.join(`${userDataPath}/${USER_DATA_FOLDER_NAME.AGENT_DATA}`, USER_DATA_FOLDER_NAME.DOCKER);

   const paths = [
      folderPathAgentJS,
      folderPathAgentRouter,
      folderPathModel,
      folderPathDocker
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
      fs.copyFileSync(source, destination);
   }

   for (const file of REQUIRE_COPY_DOCKER_FILES) {
      const source = getScriptPath(file, `${PUBLIC_SCRIPT}/${USER_DATA_FOLDER_NAME.DOCKER}`);
      const destination = path.join(folderPathDocker, file);
      fs.copyFileSync(source, destination);
   }
}


const ipcMainDocker = () => {
   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_BUILD, async (_event) => {
      try {
         const userDataPath = app.getPath("userData");
         const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);

         const docker = await getDocker();
         console.log(EMIT_EVENT_NAME.DOCKER_BUILD, {
            folderPath
         });

         await command.execAsyncDockerDir(
            `cd "${folderPath}" && ${docker} build -t ${DOCKER_SERVER_JS} ./${USER_DATA_FOLDER_NAME.AGENT_JS}`
         );

         await command.execAsyncDockerDir(
            `cd "${folderPath}" && ${docker} build -t ${DOCKER_ROUTER_NAME} ./${USER_DATA_FOLDER_NAME.AGENT_ROUTER}`
         );

         try {
            await command.execAsyncDockerDir(
               `cd "${folderPath}" && ${docker} network create network-agent-external`
            );
         } catch (error) {
            console.log('error', error);
         }

         try {
            await command.execAsyncDockerDir(
               `${docker} stop ${DOCKER_ROUTER_NAME}`
            );
         } catch (error) {
            console.log('error', error);
         }

         try {
            await command.execAsyncDockerDir(
               `${docker} rm ${DOCKER_ROUTER_NAME}`
            );
         } catch (error) {
            console.log('error', error);
         }

         try {
            await command.execAsyncDockerDir(
               `${docker} run -d -p 33030:80 --network=network-agent-external --add-host=localmodel:host-gateway --name ${DOCKER_ROUTER_NAME} ${DOCKER_ROUTER_NAME}`
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
         const docker = await getDocker();
         const { stderr } = await command.execAsyncDockerDir(`${docker} info`);
         return !stderr;
      } catch (error) {
         console.log(error);
         return false;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_INSTALL, async (_event) => {
      try {
         const userDataPath = app.getPath("userData");
         const scriptPath = path.join(`${userDataPath}/${USER_DATA_FOLDER_NAME.AGENT_DATA}`, USER_DATA_FOLDER_NAME.DOCKER);
         const cmd = `cd "${scriptPath}" && bash ${SCRIPTS_NAME.DOCKER_INSTALL_SCRIPT}`;
         await command.execAsyncStream(cmd);

         // eslint-disable-next-line no-constant-condition
         while (true) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const { stdout } = await command.execAsyncDockerDir("docker info");
            if (stdout) {
               break;
            }
         }
      } catch (error) {
         console.log("LEON error", error)
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_RUN_AGENT, async (_event, agentName: string, chainId: string) => {
      try {
         const userDataPath = app.getPath("userData");
         const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);
         const dnsHost = `${chainId}-${agentName}`;
         const docker = await getDocker();


         const cmds: string[] = [
            `cd "${folderPath}" && ${docker} stop ${dnsHost}`,
            `cd "${folderPath}" && ${docker} rm ${dnsHost}`,
         ];

         for (const cmd of cmds) {
            await executeWithIgnoreError(
               async () => {
                  await command.execAsyncDockerDir(cmd);
               }
            )
         }
         const { stdout } = await command.execAsyncDockerDir(
            `cd "${folderPath}" && ${docker} run -d -v "${folderPath}/agents/${dnsHost}/prompt.js":/app/src/prompt.js --network network-agent-external --add-host=localmodel:host-gateway --name ${dnsHost} ${DOCKER_SERVER_JS}`
         );
         console.log(stdout);
      } catch (error) {
         console.log(error);
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_STOP_AGENT, async (_event, agentName: string, chainId: string) => {
      try {
         const dnsHost = `${chainId}-${agentName}`;
         const docker = await getDocker();
         const cmds: string[] = [
            `${docker} stop ${dnsHost}`,
            `${docker} rm ${dnsHost}`,
         ];

         for (const cmd of cmds) {
            await executeWithIgnoreError(
               async () => {
                  await command.execAsyncDockerDir(cmd);
               }
            )
         }
      } catch (error) {
         console.log(error);
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_CHECK_RUNNING, async (_event, agentName: string, chainId: string) => {
      try {
         const dnsHost = `${chainId}-${agentName}`;
         const docker = await getDocker();

         const { stdout } = await command.execAsyncDockerDir(`${docker} inspect -f '{{.State.Status}}' ${dnsHost}`);
         return stdout;
      } catch (error) {
         console.log(error);
         return false;
      }
   });
}

export default ipcMainDocker;
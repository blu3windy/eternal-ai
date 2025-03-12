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
import { copyFiles } from "../share/scripts.ts";

const DOCKER_NAME = 'launcher-agent';
const DOCKER_SERVER_JS = `${DOCKER_NAME}-js`
const DOCKER_ROUTER_NAME = `${DOCKER_NAME}-router`;

const ipcMainDocker = () => {
   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_BUILD, async (_event) => {
      try {
         const userDataPath = app.getPath("userData");
         const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);
         const folderPathDocker = path.join(folderPath, USER_DATA_FOLDER_NAME.DOCKER);

         const containers = [
            `agent-js:${DOCKER_SERVER_JS}:`,
            `agent-router:${DOCKER_ROUTER_NAME}:33030`,
         ];
         const containerArgs = containers.map(c => `--container "${c}"`).join(' ');

         await command.execAsyncStream(
            `bash "${folderPathDocker}/${SCRIPTS_NAME.DOCKER_BUILD_SCRIPT}" --folder-path "${folderPath}" ${containerArgs}`
         );

         //
         // const docker = await getDocker();
         // console.log(EMIT_EVENT_NAME.DOCKER_BUILD, {
         //    folderPath
         // });
         //
         // await command.execAsyncDockerDir(
         //    `cd "${folderPath}" && ${docker} build -t ${DOCKER_SERVER_JS} ./${USER_DATA_FOLDER_NAME.AGENT_JS}`
         // );
         //
         // await command.execAsyncDockerDir(
         //    `cd "${folderPath}" && ${docker} build -t ${DOCKER_ROUTER_NAME} ./${USER_DATA_FOLDER_NAME.AGENT_ROUTER}`
         // );
         //
         // try {
         //    await command.execAsyncDockerDir(
         //       `${docker} network create network-agent-external`
         //    );
         // } catch (error) {
         //    console.log('error', error);
         // }
         //
         // try {
         //    await command.execAsyncDockerDir(
         //       `${docker} stop ${DOCKER_ROUTER_NAME}`
         //    );
         // } catch (error) {
         //    console.log('error', error);
         // }
         //
         // try {
         //    await command.execAsyncDockerDir(
         //       `${docker} rm ${DOCKER_ROUTER_NAME}`
         //    );
         // } catch (error) {
         //    console.log('error', error);
         // }
         //
         // try {
         //    await command.execAsyncDockerDir(
         //       `${docker} run -d -p 33030:80 --network=network-agent-external --add-host=localmodel:host-gateway --name ${DOCKER_ROUTER_NAME} ${DOCKER_ROUTER_NAME}`
         //    );
         // } catch (error) {
         //    console.log('error', error);
         // }


         // docker network create --internal network-agent-internal
         // docker network create network-agent-external
         //
         // docker run -d -p 33033:80 --network=network-agent-internal --network=network-agent-external --name agentrouter agentrouter

         console.log('docker build done');
      } catch (error) {
         console.log('error', error);
         throw error;
      }
   })

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_COPY_BUILD, async (_event) => {
      try {
         await copyFiles();
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   })

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_CHECK_INSTALL, async (_event) => {

      try {
         const { stdout, stderr } = await command.execAsyncDockerDir("docker info");
         console.log(stdout, stderr);
         if (!stdout) {
            command.sendEvent({
               message: '[LAUNCHER_LOGGER] [INITIALIZE] --name [DOCKER_CHECK] --error "Docker is not installed or not running"',
               cmd: 'docker info',
               type: 'error',
            });
         }
      } catch (error) {
         command.sendEvent({
            type: 'error',
            message: '[LAUNCHER_LOGGER] [INITIALIZE] --name [DOCKER_CHECK] --error "Docker is not installed or not running"',
            cmd: 'docker info',
         });
         throw error;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_INSTALL, async (_event) => {
      try {
         const userDataPath = app.getPath("userData");
         const scriptPath = path.join(`${userDataPath}/${USER_DATA_FOLDER_NAME.AGENT_DATA}`, USER_DATA_FOLDER_NAME.DOCKER);
         const cmd = `cd "${scriptPath}" && bash ${SCRIPTS_NAME.DOCKER_INSTALL_SCRIPT}`;
         await command.execAsyncStream(cmd);
      } catch (error) {
         console.log(`${EMIT_EVENT_NAME.DOCKER_INSTALL} error`, error);
         throw error;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_RUN_AGENT, async (_event, agentName: string, chainId: string) => {
      try {
         const userDataPath = app.getPath("userData");
         const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);
         const dnsHost = `${chainId}-${agentName}`;
         const scriptPath = path.join(folderPath, USER_DATA_FOLDER_NAME.DOCKER, SCRIPTS_NAME.DOCKER_ACTION_SCRIPT);

         const params = [
            `--folder-path "${folderPath}"`,
            `--container-name "${dnsHost}"`,
            `--image-name "${DOCKER_SERVER_JS}"`,
            `--code-language-snippet "js"`,
         ]
         const paramsStr = params.join(' ');
         await command.execAsyncStream(`bash "${scriptPath}" run ${paramsStr}`);

         // const cmds: string[] = [
         //    `cd "${folderPath}" && ${docker} stop ${dnsHost}`,
         //    `cd "${folderPath}" && ${docker} rm ${dnsHost}`,
         // ];
         //
         // for (const cmd of cmds) {
         //    await executeWithIgnoreError(
         //       async () => {
         //          await command.execAsyncDockerDir(cmd);
         //       }
         //    )
         // }
         //
         // console.log("LEON TEST", {
         //    cmds,
         //    test: `cd "${folderPath}" && ${docker} run -d -v "${folderPath}/agents/${dnsHost}/prompt.js":/app/src/prompt.js --network network-agent-external --add-host=localmodel:host-gateway --name ${dnsHost} ${DOCKER_SERVER_JS}`
         // })
         //
         // const { stdout } = await command.execAsyncDockerDir(
         //    `cd "${folderPath}" && ${docker} run -d -v "${folderPath}/agents/${dnsHost}/prompt.js":/app/src/prompt.js --network network-agent-external --add-host=localmodel:host-gateway --name ${dnsHost} ${DOCKER_SERVER_JS}`
         // );
         // console.log(stdout);
      } catch (error) {
         throw error;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_STOP_AGENT, async (_event, agentName: string, chainId: string) => {
      try {
         const userDataPath = app.getPath("userData");
         const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);
         const dnsHost = `${chainId}-${agentName}`;
         const scriptPath = path.join(folderPath, USER_DATA_FOLDER_NAME.DOCKER, SCRIPTS_NAME.DOCKER_ACTION_SCRIPT);

         const params = [
            `--container-name "${dnsHost}"`,
         ]
         const paramsStr = params.join(' ');
         await command.execAsyncStream(`bash "${scriptPath}" stop ${paramsStr}`);
      } catch (error) {
         console.log(error);
      }
   });
}

export default ipcMainDocker;
import { app, ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import path from "path";
import {
   SCRIPTS_NAME,
   USER_DATA_FOLDER_NAME
} from "../share/utils.ts";
import command from "../share/command-tool.ts";
import { CodeLanguage, DockerInfoAction } from "../types.ts";
import { copyFiles, copyPublicToUserData } from "../share/scripts.ts";

const DOCKER_NAME = 'agent';
const DOCKER_SERVER_JS = `${DOCKER_NAME}-js`
const DOCKER_ROUTER_NAME = `${DOCKER_NAME}-router`;

const userDataPath = app.getPath("userData");
const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);
const infoScriptPath = path.join(folderPath, USER_DATA_FOLDER_NAME.DOCKER, SCRIPTS_NAME.DOCKER_INFO_SCRIPT);
const actionScriptPath = path.join(folderPath, USER_DATA_FOLDER_NAME.DOCKER, SCRIPTS_NAME.DOCKER_ACTION_SCRIPT);

export const getDnsHost = (chainId: string, agentName: string) => {
   return `${chainId}-${agentName}`.toLowerCase();
}

export const deleteContainer = async (containerId: string) => {
   const params = [
      `--container-id "${containerId}"`,
   ]
   const paramsStr = params.join(' ');
   await command.execAsyncStream(`bash "${actionScriptPath}" remove_container_id ${paramsStr}`);
}

export const dockerInfoAction = async (action: string) => {
   const stdout = await command.execAsync(`bash "${infoScriptPath}" ${action}`);
   return stdout;
}

const ipcMainDocker = () => {
   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_COPY_BUILD, async (_event) => {
      try {
         await copyFiles();
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   })

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_BUILD, async (_event) => {
      try {
         const folderPathDocker = path.join(folderPath, USER_DATA_FOLDER_NAME.DOCKER);

         const containers = [
            // `agent-js:${DOCKER_SERVER_JS}:`,
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

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_RUN_AGENT, async (_event, agentName: string, chainId: string, options) => {
      try {
         const dnsHost = getDnsHost(chainId, agentName);
         const _options = typeof options === 'string' ? JSON.parse(options) : options;
         const type = (_options?.type || 'custom-prompt') as CodeLanguage;
         const network = (_options?.network || 'external') as 'internal' | 'external';

         let imageName = "";
         let port = "";

         switch (type) {
         case 'custom-prompt':
            imageName = `${DOCKER_NAME}-cp-${dnsHost}`;
            if (_options?.port) {
               port = _options.port.split(',').map(p => {
                  if (p.includes(':')) {
                     const [host, port] = p.split(':');
                     return `-p ${host}:${port}`;
                  }
                  return `-p ${p}:${p}`;
               }).join(' ');
            }
            break;
         case 'custom-ui':
            imageName = `${DOCKER_NAME}-cu-${dnsHost}`;
            break;
         case 'open-ai':
            imageName = `${DOCKER_NAME}-oai-${dnsHost}`;
            break;
         default:
            imageName = DOCKER_SERVER_JS;
         }

         const convertJsonToDockerEnv = (jsonObject: Record<string, string>) => {
            return Object.entries(jsonObject)
               .map(([key, value]) => {
                  // Trim the key and value to avoid leading/trailing spaces
                  const trimmedKey = key.trim();
                  const trimmedValue = encodeURIComponent(value || "").trim(); // Ensure value is encoded and trimmed
                  return `${trimmedKey}=${trimmedValue}`; // Construct the key=value pair
               })
               .filter(entry => entry !== '=' && entry !== undefined) // Filter out any empty entries
               .join(' '); // Join with space for multiple environment variables
         };

         const params = [
            `--folder-path "${folderPath}"`,
            `--container-name "${dnsHost}"`,
            `--image-name "${imageName}"`,
            `--type "${type}"`,
            `--private-key "${_options?.privateKey || ""}"`,
            `--wallet-address "${_options?.address || ""}"`,
            `--port "${port || ""}"`,
            `--environment "${_options?.environment ? convertJsonToDockerEnv(_options?.environment) : ""}"`,
            `--network "${network}"`,
         ]

         const paramsStr = params.join(' ');
         await command.execAsyncStream(`bash "${actionScriptPath}" run ${paramsStr}`);
      } catch (error) {
         throw error;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_STOP_AGENT, async (_event, agentName: string, chainId: string) => {
      try {
         const dnsHost = getDnsHost(chainId, agentName);
         const params = [
            `--container-name "${dnsHost}"`,
         ]
         const paramsStr = params.join(' ');
         await command.execAsyncStream(`bash "${actionScriptPath}" stop ${paramsStr}`);
      } catch (error) {
         console.log(error);
         throw error;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_STOP_CONTAINER, async (_event, containerId: string) => {
      try {
         const params = [
            `--container-id "${containerId}"`,
         ]
         const paramsStr = params.join(' ');
         await command.execAsyncStream(`bash "${actionScriptPath}" stop-container-id ${paramsStr}`);
      } catch (error) {
         console.log(error);
         throw error;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_START_CONTAINER, async (_event, containerId: string) => {
      try {
         const params = [
            `--container-id "${containerId}"`,
         ]
         const paramsStr = params.join(' ');
         await command.execAsyncStream(`bash "${actionScriptPath}" start-container-id ${paramsStr}`);
      } catch (error) {
         console.log(error);
         throw error;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_DELETE_CONTAINER, async (_event, containerId: string) => {
      try {
         const params = [
            `--container-id "${containerId}"`,
         ]
         const paramsStr = params.join(' ');
         await command.execAsyncStream(`bash "${actionScriptPath}" remove_container_id ${paramsStr}`);
      } catch (error) {
         console.log(error);
         throw error;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_DELETE_IMAGE, async (_event, agentName: string, chainId: string, type: CodeLanguage) => {
      try {
         const dnsHost = getDnsHost(chainId, agentName);
         let imageName = '';
         switch (type) {
         case 'custom-prompt':
            imageName = `${DOCKER_NAME}-cp-${dnsHost}`;
            break;
         case 'custom-ui':
            imageName = `${DOCKER_NAME}-cu-${dnsHost}`;
            break;
         case 'open-ai':
            imageName = `${DOCKER_NAME}-oai-${dnsHost}`;
            break;
         default:
            imageName = DOCKER_SERVER_JS;
         }
         
         const params = [
            `--container-id "${imageName}"`,
         ]
         const paramsStr = params.join(' ');
         await command.execAsyncStream(`bash "${actionScriptPath}" remove_image_name ${paramsStr}`);
      } catch (error) {
         return undefined;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_DELETE_IMAGE_ID, async (_event, imageId: string) => {
      try {
         const params = [
            `--container-id "${imageId}"`,
         ]
         const paramsStr = params.join(' ');
         await command.execAsyncStream(`bash "${actionScriptPath}" remove_image_name ${paramsStr}`);
      } catch (error) {
         return undefined;
      }
   });

   ipcMain.handle(EMIT_EVENT_NAME.COPY_REQUIRE_RUN_PYTHON, async (_, folderName) => {
      await copyPublicToUserData({
         names: ["Dockerfile", "requirements.txt", "server.py"],
         destination: [USER_DATA_FOLDER_NAME.AGENT_DATA, USER_DATA_FOLDER_NAME.AGENTS, folderName],
         source: [USER_DATA_FOLDER_NAME.AGENT_PY]
      })
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_RUNNING_PORT, async (_event, agentName: string, chainId: string, ) => {
      const dnsHost = getDnsHost(chainId, agentName);
      const params = [
         `--container-name "${dnsHost}"`,
      ]
      const paramsStr = params.join(' ');
      const stdout = await command.execAsync(`bash "${actionScriptPath}" get-port ${paramsStr}`);
      const messages = stdout.split('\n');
      const port = messages[messages.length - 2].trim();
      if (Number.isNaN(Number(port))) {
         throw new Error(`Port is not a number: ${port}`);
      }
      return port;
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_INFO, async (_event, action: DockerInfoAction) => {
      const infoScriptPath = path.join(folderPath, USER_DATA_FOLDER_NAME.DOCKER, SCRIPTS_NAME.DOCKER_INFO_SCRIPT);

      const stdout = await command.execAsync(`bash "${infoScriptPath}" ${action}`);
      return stdout;
   });

   ipcMain.handle(EMIT_EVENT_NAME.DOCKET_SET_READY_PORT, async () => {
      await command.execAsync(`bash "${actionScriptPath}" set-ready-port`);
   })
}

export default ipcMainDocker;
import { app, ipcMain } from "electron";
import { EMIT_EVENT_NAME } from "../share/event-name.ts";
import fs from "fs";
import path from "path";

import { exec } from "child_process";
import { promisify } from "util";
import { getScriptPath, SCRIPTS_NAME, USER_DATA_FOLDER_NAME } from "../share/utils.ts";

const execAsync = promisify(exec);
const DOCKER_NAME = 'launcher-agent';


const copyDockerSource = async () => {
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

   // const { stdout } = await execAsync(
   //    'cd "/Users/macbookpro/Library/Application Support/agent-launcher/agent-data" && docker build -t agent .'
   // );

   // console.log(stdout);
}


const ipcMainDocker = () => {
   ipcMain.handle(EMIT_EVENT_NAME.DOCKER_BUILD, async (_event) => {
      try {
         const userDataPath = app.getPath("userData");
         // await execAsync(
         //    'cd "/Users/macbookpro/Library/Application Support/agent-launcher/agent-data" && docker build -t agent .'
         // );

         // cd "/Users/macbookpro/Library/Application Support/agent-launcher/agent-data" && docker run -d -p 3001:3000 -v ./agents/agent_1/prompt.js:/app/src/prompt.js --name agent1 launcher-agent

         const folderPath = path.join(userDataPath, USER_DATA_FOLDER_NAME.AGENT_DATA);
         console.log('LEON folderPath', `cd "${folderPath}" && docker build -t ${DOCKER_NAME} .`);

         await execAsync(
            `cd "${folderPath}" && docker build -t ${DOCKER_NAME} .`
         );
         console.log('LEON docker build done');
      } catch (error) {
         console.log('LEON error', error);
      }
   })

   ipcMain.handle(EMIT_EVENT_NAME.COPY_DOCKER_SOURCE, async (_event) => {
      try {
         await copyDockerSource();
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   })

   ipcMain.handle(EMIT_EVENT_NAME.CHECK_DOCKER, async (_event) => {
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

   ipcMain.handle(EMIT_EVENT_NAME.INSTALL_DOCKER, async (_event) => {
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
}

export default ipcMainDocker;
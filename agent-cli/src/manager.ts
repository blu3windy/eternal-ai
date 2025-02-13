import * as fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { logError, logInfo } from './log';

enum AgentStatus {
    RUNNING = "Running",
    STOPPED = "Stopped",

}

interface Agent {
    AgentID: string
    Name: string
    Framework: string
    Network: string
    ChainID: string
    Model: string
    Status: string
    CreateAt: string
}

const FilePath = "./agents/list.json";


const insertAgent = async (agent: Agent) => {
    try {
        logInfo(`FilePath: ${FilePath}`);

        if (!fs.existsSync(FilePath)) {
            fs.writeFileSync(FilePath, JSON.stringify([agent], null, 2))

        } else {
            const data = fs.readFileSync(FilePath, 'utf8');
            const currentAgents: Agent[] = JSON.parse(data);
            currentAgents.push(agent);
            fs.writeFileSync(FilePath, JSON.stringify(currentAgents, null, 2))
        }
    } catch (e) {
        logError(`Save agent info ${e}`);
    }
}

const getAgents = async (): Promise<Agent[]> => {
    const data = fs.readFileSync(FilePath, 'utf8');
    const currentAgents: Agent[] = JSON.parse(data);
    // console.log("currentAgents: ", currentAgents);

    const containers = await listRunningContainers();
    console.log("containers: ", containers);

    for (let i = 0; i < currentAgents.length; i++) {
        let agent = currentAgents[i];
        const containerName = agent.Network + "_" + agent.AgentID;
        const containerInfo = containers[containerName];
        if (containerInfo) {
            if (containerInfo.State === "running") {
                agent.Status = AgentStatus.RUNNING;
            } else if (containerInfo.State === "exited") {
                agent.Status = AgentStatus.STOPPED;
            }

            // TODO: check more state

            agent.CreateAt = containerInfo.CreatedAt
        }
        currentAgents[i] = agent;
    }

    return currentAgents;
}

interface DockerContainer {
    Command: string
    CreatedAt: string
    ID: string
    Image: string
    Labels: string
    LocalVolumes: string
    Mounts: string
    Names: string
    Networks: string
    Ports: string
    RunningFor: string
    Size: string
    State: string   // running
    Status: string  // time
}


// Running Containers: [
//     {
//         Command: '"docker-entrypoint.s…"',
//         CreatedAt: '2025-02-13 16:18:33 +0700 +07',
//         ID: '2a04d8ee6843',
//         Image: 'eliza',
//         Labels: 'desktop.docker.io/binds/0/Source=/Users/macbookpro/go/src/eternalai-org/eternal-ai/agent-cli/agents/base_4/config.json,desktop.docker.io/binds/0/SourceKind=hostFile,desktop.docker.io/binds/0/Target=/app/eliza/agents/config.json',
//         LocalVolumes: '0',
//         Mounts: '/host_mnt/User…',
//         Names: 'base_4',
//         Networks: 'bridge',
//         Ports: '',
//         RunningFor: '31 seconds ago',
//         Size: '2.54MB (virtual 11.7GB)',
//         State: 'running',
//         Status: 'Up 30 seconds'
//     }
// ]


const listRunningContainers = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
        exec('docker ps -a --format "{{json .}}"', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
                // return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                reject(stderr);
                // return;
            }
            console.log('Running Containers stdout:', stdout);

            if (stdout.length == 0) {
                resolve([]);
            }

            // Split the output into JSON objects (one per line)
            const containers = stdout
                .trim()
                .split('\n')
                .map(line => JSON.parse(line));


            const m = Object.fromEntries(containers.map(c => [c.Names, c]));

            console.log('Running Containers:', containers);
            resolve(m);

        });
    })
}

// const getAgentStatus = () => {

// }


export {
    Agent,
    insertAgent,
    getAgents,
    listRunningContainers,
    AgentStatus,
}
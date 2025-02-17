import { exec } from 'child_process';
import { ChainIDMap, Framework, Network, NetworkConfig, ETERNALAI_URL } from "./const";

// for dev
import dotenv from 'dotenv';
import { execCmd, getSupportedModels } from "./utils";
import { mintAgent } from "./mintv1";
import { Agent, AgentStatus, getAgentByName, getAgents, insertAgent, updateAgentByName } from "./manager";
import { logError, logInfo, logSuccess, logTable } from "./log";
dotenv.config();

const validateParams = async ({
    chain,
    framework,
    model,
    path,
    name,

}: {
    chain: Network,
    framework: string,
    model: string,
    path: string,
    name: string,
}): Promise<{
    model: string
}> => {
    const chainID = ChainIDMap[chain];
    const supportedModels = await getSupportedModels(chainID);
    if (model) {
        if (!supportedModels[model]) {
            throw new Error(`model ${model} is not supported in chain ${chain}`);
        }
    } else {
        const models = Object.keys(supportedModels);
        if (models.length == 0) {
            throw new Error(`no models supported in chain ${chain}`);
        }
        model = models[0];
    }

    return { model };
}

const createAgent = async ({
    chain,
    framework,
    model,
    path,
    name,

}: {
    chain: Network,
    framework: string,
    model: string,
    path: string,
    name: string,
}) => {
    // console.log("options: ", options);

    const agentInfo = await getAgentByName(name);
    if (agentInfo && agentInfo.AgentID) {
        logInfo(`Agent ${name} was created. Use 'eai agent ls' to see your agents.`);
        return;
    }

    const newParam = await validateParams({
        chain,
        framework,
        model,
        path,
        name,
    });
    model = newParam.model;

    // console.log("newParam: ", newParam);

    // get info from chain network
    // const chainRPC = "";
    const chainID = ChainIDMap[chain];
    const networkInfo = NetworkConfig[chainID];
    if (!networkInfo || !networkInfo.agentContractAddress || !networkInfo.url) {
        throw new Error("invalid chain argument")
    }

    const ETERNALAI_RPC_URL = networkInfo.url;
    const ETERNALAI_AGENT_CONTRACT_ADDRESS = networkInfo.agentContractAddress;


    // call contract to mint agent id
    const agentID = await mintAgent({
        rpcURL: ETERNALAI_RPC_URL,
        privKey: process.env.PRIVATE_KEY || "",
        agentSystemPrompPath: path,
        agentContractAddress: ETERNALAI_AGENT_CONTRACT_ADDRESS,
        modelID: model,
        // promptSchedulerAddress: networkInfo.promptSchedulerAddress,
        // gpuManagerAddress: networkInfo.gpuManagerAddress
    });

    if (!agentID) {
        console.error("Mint agent failed! Please retry.");
        return;
    }

    console.log("Mint agent successfully: Agent ID: ", agentID);

    const ETERNALAI_API_KEY = process.env.ETERNALAI_API_KEY;
    const TWITTER_USERNAME = process.env.TWITTER_USERNAME;
    const TWITTER_PASSWORD = process.env.TWITTER_PASSWORD;
    const TWITTER_EMAIL = process.env.TWITTER_EMAIL;
    const TWITTER_TARGET_USERS = process.env.TWITTER_TARGET_USERS;


    // const randomId = randomID();
    const AGENT_UID = getAgentUID(chain, agentID.toString());
    const agentName = name || AGENT_UID;

    // let scriptPath = "";
    // switch (framework) {
    //     case Framework.Eliza: {
    //         // Path to your Bash script
    //         scriptPath = `sh src/eliza/start.sh ${AGENT_UID} ${ETERNALAI_URL} ${ETERNALAI_API_KEY} ${chainID} ${ETERNALAI_RPC_URL} ${ETERNALAI_AGENT_CONTRACT_ADDRESS} ${agentID} ${model} ${TWITTER_USERNAME} ${TWITTER_PASSWORD} ${TWITTER_EMAIL} ${TWITTER_TARGET_USERS} ${agentName}`;

    //         // Run the Bash script

    //         // exec(scriptPath, (error: any, stdout: any, stderr: any) => {
    //         //     if (error) {
    //         //         console.error(`Error executing script: ${error.message}`);
    //         //         // throw error;
    //         //     }
    //         //     if (stderr) {
    //         //         console.error(`stderr: ${stderr}`);
    //         //     }
    //         //     console.log(`stdout: ${stdout}`);
    //         // });
    //         break;

    //     }
    //     case Framework.Rig: {
    //         // Path to your Bash script
    //         scriptPath = `sh src/rig/start.sh ${AGENT_UID} ${ETERNALAI_URL} ${ETERNALAI_API_KEY} ${chainID} ${ETERNALAI_RPC_URL} ${ETERNALAI_AGENT_CONTRACT_ADDRESS} ${agentID} ${model} ${TWITTER_USERNAME} ${TWITTER_PASSWORD} ${TWITTER_EMAIL} ${TWITTER_TARGET_USERS} ${agentName}`;

    //         // Run the Bash script
    //         // exec(scriptPath, (error: any, stdout: any, stderr: any) => {
    //         //     if (error) {
    //         //         console.error(`Error executing script: ${error.message}`);
    //         //         // throw error;
    //         //     }
    //         //     if (stderr) {
    //         //         console.error(`stderr: ${stderr}`);
    //         //     }
    //         //     console.log(`stdout: ${stdout}`);
    //         // });
    //         break;
    //     }
    //     case Framework.EternalAI: {
    //         // Path to your Bash script
    //         scriptPath = `sh src/eternalai/start.sh ${AGENT_UID} ${ETERNALAI_URL} ${ETERNALAI_API_KEY} ${chainID} ${ETERNALAI_RPC_URL} ${ETERNALAI_AGENT_CONTRACT_ADDRESS} ${agentID} ${model} ${TWITTER_USERNAME} ${TWITTER_PASSWORD} ${TWITTER_EMAIL} ${TWITTER_TARGET_USERS} ${agentName}`;

    //         // Run the Bash script
    //         // exec(scriptPath, (error: any, stdout: any, stderr: any) => {
    //         //     if (error) {
    //         //         console.error(`Error executing script: ${error.message}`);
    //         //         // throw error;
    //         //     }
    //         //     if (stderr) {
    //         //         console.error(`stderr: ${stderr}`);
    //         //     }
    //         //     console.log(`stdout: ${stdout}`);
    //         // });
    //         break;
    //     }
    // }

    // try {
    //     const stdout = await execCmd(scriptPath);
    // } catch (e) {
    //     logError(`Start agent error ${e}`);
    // }


    const newAgent: Agent = {
        AgentID: agentID.toString(),
        Name: agentName,
        Framework: framework,
        Network: chain,
        ChainID: chainID,
        Model: model,
        Status: AgentStatus.CREATED,
        CreateAt: "",
        ContainerID: "",
    }

    // insert into the file to manage agents
    await insertAgent(newAgent);
}


const startAgent = async ({
    name,
}: {
    name: string,
}) => {
    // console.log("options: ", options);

    const agentInfo = await getAgentByName(name);
    if (!agentInfo) {
        logError(`Agent ${name} was not created. Use 'eai agent create' to create your agent first.`);
        return;
    }

    if (agentInfo.Status == AgentStatus.RUNNING) {
        logInfo(`Agent ${name} is running currently.`);
        return;
    }

    // const framework = agentInfo.Framework;
    // const chain = agentInfo.Network;
    // const agentID = agentInfo.AgentID;
    // const model = agentInfo.AgentID

    const { Framework: framework, Network: chain, AgentID: agentID, Model: model } = agentInfo;





    // const newParam = await validateParams({
    //     chain,
    //     framework,
    //     model,
    //     path,
    //     name,
    // });
    // model = newParam.model;

    // console.log("newParam: ", newParam);

    // get info from chain network
    // const chainRPC = "";
    const chainID = agentInfo.ChainID;
    const networkInfo = NetworkConfig[chainID];
    if (!networkInfo || !networkInfo.agentContractAddress || !networkInfo.url) {
        throw new Error("invalid chain argument")
    }

    const ETERNALAI_RPC_URL = networkInfo.url;
    const ETERNALAI_AGENT_CONTRACT_ADDRESS = networkInfo.agentContractAddress;


    // // call contract to mint agent id
    // const agentID = await mintAgent({
    //     rpcURL: ETERNALAI_RPC_URL,
    //     privKey: process.env.PRIVATE_KEY || "",
    //     agentSystemPrompPath: path,
    //     agentContractAddress: ETERNALAI_AGENT_CONTRACT_ADDRESS,
    //     modelID: model,
    //     // promptSchedulerAddress: networkInfo.promptSchedulerAddress,
    //     // gpuManagerAddress: networkInfo.gpuManagerAddress
    // });

    // if (!agentID) {
    //     console.error("Mint agent failed! Please retry.");
    //     return;
    // }

    // console.log("Mint agent successfully: Agent ID: ", agentID);

    const ETERNALAI_API_KEY = process.env.ETERNALAI_API_KEY;
    const TWITTER_USERNAME = process.env.TWITTER_USERNAME;
    const TWITTER_PASSWORD = process.env.TWITTER_PASSWORD;
    const TWITTER_EMAIL = process.env.TWITTER_EMAIL;
    const TWITTER_TARGET_USERS = process.env.TWITTER_TARGET_USERS;


    // const randomId = randomID();
    const AGENT_UID = getAgentUID(chain, agentID.toString());
    const agentName = name || AGENT_UID;

    let scriptPath = "";
    switch (framework) {
        case Framework.Eliza: {
            // Path to your Bash script
            scriptPath = `sh src/eliza/start.sh ${AGENT_UID} ${ETERNALAI_URL} ${ETERNALAI_API_KEY} ${chainID} ${ETERNALAI_RPC_URL} ${ETERNALAI_AGENT_CONTRACT_ADDRESS} ${agentID} ${model} ${TWITTER_USERNAME} ${TWITTER_PASSWORD} ${TWITTER_EMAIL} ${TWITTER_TARGET_USERS} ${agentName}`;

            // Run the Bash script

            // exec(scriptPath, (error: any, stdout: any, stderr: any) => {
            //     if (error) {
            //         console.error(`Error executing script: ${error.message}`);
            //         // throw error;
            //     }
            //     if (stderr) {
            //         console.error(`stderr: ${stderr}`);
            //     }
            //     console.log(`stdout: ${stdout}`);
            // });
            break;

        }
        case Framework.Rig: {
            // Path to your Bash script
            scriptPath = `sh src/rig/start.sh ${AGENT_UID} ${ETERNALAI_URL} ${ETERNALAI_API_KEY} ${chainID} ${ETERNALAI_RPC_URL} ${ETERNALAI_AGENT_CONTRACT_ADDRESS} ${agentID} ${model} ${TWITTER_USERNAME} ${TWITTER_PASSWORD} ${TWITTER_EMAIL} ${TWITTER_TARGET_USERS} ${agentName}`;

            // Run the Bash script
            // exec(scriptPath, (error: any, stdout: any, stderr: any) => {
            //     if (error) {
            //         console.error(`Error executing script: ${error.message}`);
            //         // throw error;
            //     }
            //     if (stderr) {
            //         console.error(`stderr: ${stderr}`);
            //     }
            //     console.log(`stdout: ${stdout}`);
            // });
            break;
        }
        case Framework.EternalAI: {
            // Path to your Bash script
            scriptPath = `sh src/eternalai/start.sh ${AGENT_UID} ${ETERNALAI_URL} ${ETERNALAI_API_KEY} ${chainID} ${ETERNALAI_RPC_URL} ${ETERNALAI_AGENT_CONTRACT_ADDRESS} ${agentID} ${model} ${TWITTER_USERNAME} ${TWITTER_PASSWORD} ${TWITTER_EMAIL} ${TWITTER_TARGET_USERS} ${agentName}`;

            // Run the Bash script
            // exec(scriptPath, (error: any, stdout: any, stderr: any) => {
            //     if (error) {
            //         console.error(`Error executing script: ${error.message}`);
            //         // throw error;
            //     }
            //     if (stderr) {
            //         console.error(`stderr: ${stderr}`);
            //     }
            //     console.log(`stdout: ${stdout}`);
            // });
            break;
        }
    }

    try {
        const stdout = await execCmd(scriptPath);
    } catch (e) {
        logError(`Start agent error ${e}`);
    }

    // update status agent
    agentInfo.Status = AgentStatus.RUNNING;
    await updateAgentByName(agentName, agentInfo);




    // const newAgent: Agent = {
    //     AgentID: agentID.toString(),
    //     Name: agentName,
    //     Framework: framework,
    //     Network: chain,
    //     ChainID: chainID,
    //     Model: model,
    //     Status: AgentStatus.CREATED,
    //     CreateAt: "",
    //     ContainerID: "",
    // }

    // insert into the file to manage agents
    // await insertAgent(newAgent);
}

const listAgents = async () => {
    const agents = await getAgents();
    logTable(agents);
}


const stopAgent = async ({
    name,
}: {
    name: string,
}) => {
    const agents = await getAgents();
    const agentMap = Object.fromEntries(agents.map((a: Agent) => [a.Name, a]));
    const agentInfo = agentMap[name];
    if (!agentInfo) {
        logError(`Agent name ${name} is not found.`);
        return;
    }
    if (agentInfo.Status == AgentStatus.STOPPED) {
        logInfo(`Agent name ${name} was stopped.`);
        return;
    }
    if (agentInfo.Status == AgentStatus.CREATED) {
        logInfo(`Agent name ${name} is not running.`);
        return;
    }

    const agentUID = getAgentUID(agentInfo.Network, agentInfo.AgentID);

    try {
        const stdout = await exec(`docker stop ${agentUID}`);
        // console.log(stdout);
        logSuccess(`Agent ${name} is stopped successfully.`);
    } catch (e) {
        logError(`Stop agent ${name} error ${e}`);
    }
}

const startAgentV2 = async ({
    name,
}: {
    name: string,
}) => {
    const agents = await getAgents();
    const agentMap = Object.fromEntries(agents.map((a: Agent) => [a.Name, a]));
    const agentInfo = agentMap[name];
    if (!agentInfo) {
        logError(`Agent ${name} is not found.`);
        return;
    }
    if (agentInfo.Status == AgentStatus.RUNNING) {
        logInfo(`Agent ${name} is running.`);
        return;
    }
    if (!agentInfo.ContainerID) {
        logInfo(`No docker container for agent ${name}.`);
        // TODO: create and start docker container for agent.
    }

    // console.log("ContainerID: ", agentInfo.ContainerID);

    try {
        const stdout = await exec(`docker start ${agentInfo.ContainerID}`);
        // console.log(stdout);
        logSuccess(`Agent ${name} is started successfully.`);
    } catch (e) {
        logError(`Start agent ${name} error ${e}`);
    }
}





// agentUID is a unique key to identify the agent
// it is also used as the agent's docker container name
const getAgentUID = (chain: string, agentID: string): string => {
    return `${chain}_${agentID}`;

}
export {
    createAgent,
    listAgents,
    stopAgent,
    startAgent,
}
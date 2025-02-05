import {dagentLogger, IENV, IGetAccessTokenParams} from "@eternal-ai/core";
import dotenv from "dotenv";
import { dagentCharacter } from "./dagentCharacter";
import { getEnvironment } from "./utils/environment";
import { DagentFarcaster } from "@eternal-ai/client-dagent";

class AgentFarcaster {
  protected environment: IENV;
  protected dagent: DagentFarcaster;
  protected paramsToken?: IGetAccessTokenParams;

  constructor(params?: IGetAccessTokenParams) {
    dagentLogger.info("Code run started...");
    this.environment = getEnvironment();
    this.dagent = new DagentFarcaster({
      dagentCharacter: dagentCharacter,
      environment: this.environment,
    });
    this.paramsToken = params || undefined;
  }

  createDagent = async () => {
    return await this.dagent.createAgent();
  };

  getCreatedAgents = async () => {
    const agents = (await this.dagent.yourAgents({
      limit: 30,
      page: 1,
    }))?.filter(agent => !!agent?.agent_info?.eth_address);
    console.table((agents || []).map(agent => {
      return {
        agent_name: `${agent.agent_name}`,
        id: agent.id,
        topup_evm_address: agent.agent_info.eth_address,
        topup_sol_address: agent.agent_info.sol_address,
      };
    }));
    return agents;
  };

  setupMissions = async (agentId: string) => {
    await this.dagent.setupMissions(agentId);
  };

  runDagent = async () => {
    const privateKey = this.environment.PRIVATE_KEY;
    if (!privateKey && !this.paramsToken) {
      dagentLogger.error("Please provide private key or params token.");
    }
    await this.dagent.init(this.paramsToken);
    await this.createDagent();
    await this.getCreatedAgents();
    // await this.dagent.setupMissions("6763d7524ee1600e1122b6f6");
  };
}

dotenv.config();
const agentFarcaster = new AgentFarcaster();
agentFarcaster.runDagent();
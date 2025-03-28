import CApiClient from "./apiClient";
import { IAgentToken, IChainConnected } from "./interface";

class CAgentTokenAPI extends CApiClient {
   private prefix = (url: string) => `/meme/${url}`;
   public getChainList = async (): Promise<IChainConnected[] | null> => {
      try {
         const res: IChainConnected[] = await this.api.get(
            `https://api-dojo2.eternalai.org/api/chain-config/list`
         );

         return res;
      } catch (error) {
         console.log("[API][getChainList] ERROR", error);
         throw error;
      }
   };

   public getModelDescription = async () => {
      const res = await this.api.get(
         `https://api-dojo2.eternalai.org/api/v1/models/description`
      );
      return res;
   };

   public getAgentTokenList = async (
      params: any
   ): Promise<{ agents: IAgentToken[] }> => {
      const response = (await this.api.get("/agent/dashboard", {
         params,
      })) as any;

      const agents = (response?.rows || []).map((agent: any) => {
         if (agent?.required_info && typeof agent?.required_info === "string") {
            agent.required_info = JSON.parse(agent?.required_info);
         }
         return agent;
      });

      return { agents };
   };

   public getAgentTokenDetail = async (
      token_address: any
   ): Promise<{ agents: IAgentToken }> => {
      const response = (await this.api.get(
         `/agent/dashboard/${token_address}`
      )) as any;

      return response;
   };

   public getAgentTradeChart = async ({
      token_address,
      params,
   }: {
    token_address: string;
    params: {};
  }): Promise<any[]> => {
      const response = (await this.api.get(
         `${this.prefix(`chart/${token_address}`)}`,
         {
            params,
         }
      )) as any;
      return response;
   };

   public getCoinPrices = async (): Promise<any[]> => {
      const response = (await this.api.get(
         `https://api.nakachain.xyz/api/coin-prices`
      )) as any;
      return response;
   };

   public saveAgentInstalled = async (
      params: any
   ): Promise<any> => {
      const response = (await this.api.post("/agent/install", params)) as any;
      return response;
   };

   public checkAgentServiceRunning = async ({
      agent,
   }: {
    agent: IAgentToken;
  }): Promise<any> => {
      try {
         const res: any = await this.api.post(
            `http://localhost:33030/${agent?.network_id}-${agent?.agent_name?.toLowerCase()}/prompt`,
            {
               ping: true,
            }
         );
         return res;
      } catch (e) {
         throw e;
      }
   };

   public checkAgentModelServiceRunning = async (): Promise<any> => {
      try {
         const res: any = await this.api.get(
            `http://localhost:65534/health`,
         );
         return res;
      } catch (e) {
         throw e;
      }
   };

   public saveAgentPromptCount = async (
      id: number
   ): Promise<any> => {
      try {
         const res = (await this.api.post(`/agent/prompt/${id}`)) as any;
         return res;
      } catch (e) {
         throw e;
      }
   };

   public saveRecentAgents = async (
      params: any
   ): Promise<any> => {
      const res = (await this.api.post("/agent/recent-chat", params)) as any;
      return res;
   };

   public checkAgentIsLiked = async (
      id: number
   ): Promise<boolean> => {
      const res = (await this.api.get(
         `/agent/like/${id}`
      )) as any;

      return typeof res === 'boolean' ? res : false;
   };

   public likeAgent = async (
      id: number
   ): Promise<any> => {
      try {
         const res = (await this.api.post(`/agent/like/${id}`)) as any;
         return res;
      } catch (e) {
         throw e;
      }
   };
}

export default CAgentTokenAPI;

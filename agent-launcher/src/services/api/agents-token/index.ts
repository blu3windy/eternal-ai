import CApiClient from "./apiClient";
import { IAgentToken, IChainConnected } from "./interface";

// Convert string to JSON
const envToJson = (str) => {
   const obj = {};
   const lines = str.trim().split('\n');
   
   lines.forEach(line => {
      const [key, value] = line.split('=');
      // Remove quotes from value if they exist and handle empty values
      obj[key] = value ? value.replace(/^"|"$/g, '') : '';
   });
   
   return JSON.stringify(obj, null, 2);
};

class CAgentTokenAPI extends CApiClient {
   private prefix = (url: string) => `/meme/${url}`;
   private agentTokenListCache = new Map<string, { agents: IAgentToken[] }>();

   private getCacheKey(params: any): string {
      const _params = {
         ...params,
         exlude_ids: ""
      }
      return JSON.stringify(_params);
   }

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
      params: any,
      callback?: (data: { agents: IAgentToken[] }) => void
   ): Promise<{ agents: IAgentToken[] }> => {
      const cacheKey = this.getCacheKey(params);
      const cachedData = this.agentTokenListCache.get(cacheKey);

      // Return cached data via callback if available
      if (cachedData && callback) {
         callback(cachedData);
      }

      try {
         const response = (await this.api.get("/agent/dashboard", {
            params,
         })) as any;

         const agents = (response?.rows || []).map((agent: any) => {
            if (agent?.required_info && typeof agent?.required_info === "string") {
               agent.required_info = JSON.parse(agent?.required_info);
            }

            if (agent?.env_example && typeof agent?.env_example === "string") {
               agent.env_example = envToJson(agent?.env_example);

               if (agent.env_example && Object.keys(agent.env_example).length === 0) {
                  agent.env_example = undefined;
               }

            }
            return agent;
         });

         const result = { agents };
         
         // Update cache with new data
         this.agentTokenListCache.set(cacheKey, result);

         return result;
      } catch (error) {
         // If there's cached data, return it on error
         if (cachedData) {
            return cachedData;
         }
         throw error;
      }
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

   public getAgentCategories = async (): Promise<any> => {
      try {
         const res: any = await this.api.get(`agent/categories`,);
         return res;
      } catch (e) {
         throw e;
      }
   };

   public submitInviteCode = async (params: { code: string, address: string }): Promise<any> => {
      const res = (await this.api.post("vibe/validate-ref-code", {
         ref_code: params.code,
         user_address: params.address,
      })) as any;
      return res;
   };
}

export default CAgentTokenAPI;

import CApiClient from './apiClient';
import { IAgentToken, IChainConnected } from './interface';

class CAgentTokenAPI extends CApiClient {
   public getChainList = async (): Promise<IChainConnected[] | null> => {
      try {
         const res: IChainConnected[] = await this.api.get(
            `https://api-dojo2.eternalai.org/api/chain-config/list`,
         );

         return res;
      } catch (error) {
         console.log('[API][getChainList] ERROR', error);
         throw error;
      }
   };

   public getModelDescription = async () => {
      const res = await this.api.get(`https://api-dojo2.eternalai.org/api/v1/models/description`);
      return res;
   };


   public getAgentTokenList = async (
      params: any,
   ): Promise<{ agents: IAgentToken[] }> => {
      const response = (await this.api.get('/agent/dashboard', {
         params,
      })) as any;
      return { agents: response?.rows };
   };

   public getAgentTokenDetail = async (
      token_address: any,
   ): Promise<{ agents: IAgentToken }> => {
      const response = (await this.api.get(
         `/agent/dashboard/${token_address}`,
      )) as any;
      return response;
   };
}

export default CAgentTokenAPI;

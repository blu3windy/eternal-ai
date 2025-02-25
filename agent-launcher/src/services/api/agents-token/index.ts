import CApiClient from './apiClient';
import { IAgentToken } from './interface';

class CAgentTokenAPI extends CApiClient {
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

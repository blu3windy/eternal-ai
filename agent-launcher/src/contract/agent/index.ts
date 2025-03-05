import { CHAIN_CONFIG, CHAIN_CONFIG_TYPE } from "@constants/chains";
import AgentAbi from "./abi/AgentUpgradeable.json";
import { ethers } from "ethers";

class CAgentContract {
   private contract: any;

   constructor({ chainId, contractAddress }: { chainId: number, contractAddress: string }){
      const rpc = CHAIN_CONFIG[chainId as CHAIN_CONFIG_TYPE]?.rpcUrls?.default?.http[0];
      const provider = new ethers.providers.JsonRpcProvider(rpc);
      this.contract = new ethers.Contract(
         contractAddress,
         AgentAbi,
         provider
      );
      return this.contract;
   };

   public getCodeLanguage = async () => {
      const codeLanguage = await this.contract.getCodeLanguage();
      return codeLanguage;
   };

   public getCurrentVersion = async () => {
      const codeVersion = await this.contract.getCurrentVersion();
      return codeVersion;
   };

   public getAgentCode = async (codeVersion: number) => {
      const code = await this.contract.getAgentCode(codeVersion);
      return code;
   };
};

export default CAgentContract;

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
      switch (codeLanguage) {
         case 'javascript':
            return 'js';
         case 'python':
            return 'py';
         default:
            return codeLanguage;
      }
   };

   public getCurrentVersion = async () => {
      const codeVersion = await this.contract.getCurrentVersion();
      return codeVersion;
   };
  

   public getAgentCode = async (codeVersion: number) => {
      const codeBase64 = await this.contract.getAgentCode(codeVersion);
      return codeBase64;
   };

   public getDepsAgents = async (codeVersion: number) => {
      const depsAgents: string[] = await this.contract.getDepsAgents(codeVersion);
      return depsAgents;
   };

   public getAgentName = async () => {
      const name = await this.contract.getAgentName();
      return name;
   };
};

export default CAgentContract;


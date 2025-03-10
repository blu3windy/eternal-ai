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

   public splitBase64 = (content: string) => {
      return content
         .split(/\n+/)
         .map(line => line.trim())
         .filter(line => line.length > 0);
   };

   public isBase64 = (str: string) => {
      if (!str || typeof str !== 'string') return false;
      if (str.length % 4 !== 0) return false;
      const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
      return base64Regex.test(str);
   };

   public getAgentCode = async (codeVersion: number) => {
      const codeBase64 = await this.contract.getAgentCode(codeVersion);
      const base64Array = this.splitBase64(codeBase64);
      return base64Array.map(item => this.isBase64(item) ? atob(item) : item).join('\n');
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

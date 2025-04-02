import { IAgentToken } from "@services/api/agents-token/interface";

export interface DockerContainer {
   Command: string;
   CreatedAt: string;
   ID: string;
   Image: string;
   Labels: string;
   LocalVolumes: string;
   Mounts: string;
   Names: string;
   Networks: string;
   Ports: string;
   RunningFor: string;
   Size: string;
   State: string;
   Status: string;
}

export interface DockerImage {
   ID: string;
   Repository: string;
   Size: string;
}

export interface DockerMemory {
   BlockIO: string;
   CPUPerc: string;
   Container: string;
   ID: string;
   MemPerc: string;
   MemUsage: string;
   Name: string;
   NetIO: string;
   PIDs: string;
}

export interface ContainerData {
   name: string;
   containerId?: string;
   imageId: string;
   image: string;
   ports: string;
   cpu: string;
   lastStarted: string;
   memoryUsage?: string;
   memoryPercentage?: string;
   state?: string;
   agent?: IAgentToken;
   agentType?: string;
   imageSize?: string;
}

export interface IMonitorContext {
  containers: ContainerData[];
  totalMemory: any;
  totalCPU: any;
  installedAgents: IAgentToken[];
}

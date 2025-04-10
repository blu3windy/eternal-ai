import { AgentType } from "@pages/home/list-agent/constants.ts";
import CAgentTokenAPI from "@services/api/agents-token/index.ts";
import { compareString } from "@utils/string.ts";
import React, { PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ContainerData, DockerContainer, DockerImage, DockerMemory } from "./interface.ts";
import { MonitorContext } from "./MonitorContext.tsx";
import installAgentStorage from "@storage/InstallAgentStorage.ts";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import { commonSelector } from "@stores/states/common/selector.ts";
import { useSelector } from "react-redux";
import uniqBy from "lodash.uniqby";
// import useDockerMonitorState from "@providers/DockerMonitor/useDockerMonitorState.ts";

const MonitorProvider: React.FC<
    PropsWithChildren
> = ({
   children,
}: PropsWithChildren): React.ReactElement => {
   const { needReloadList, needReloadMonitor } = useSelector(commonSelector);

   const [containers, setContainers] = useState<ContainerData[]>([]);
   const [totalMemory, setTotalMemory] = useState({ used: '0MB', total: '0GB' });
   const [totalCPU, setTotalCPU] = useState({ used: '0%', total: '800%' });

   const intervalRef = useRef<NodeJS.Timeout>();
   const intervalAgentRef = useRef<NodeJS.Timeout>();

   const cPumpAPI = new CAgentTokenAPI();
   const agentsRef = useRef<IAgentToken[]>([]);
   const cpuCoresRef = useRef<number>(8);

   const extractImageName = (repository: string): string => {
      const match = repository.match(/^agent-\w+-(.+)$/);
      return match ? match[1] : "";
   };

   const onGetDataAgents = async () => {
      try {
         const installIds = await installAgentStorage.getAgentIds();
         const agent_types = [
            AgentType.CustomUI, 
            AgentType.CustomPrompt,
            AgentType.ModelOnline,
            AgentType.Model
         ].join(',');
         const [{ agents }, { agents: agentsAll }] = await Promise.all([
            cPumpAPI.getAgentTokenList({ page: 1, limit: installIds?.length || 200, ids: installIds.length > 0 ? installIds.join(',') : '', agent_types }),
            cPumpAPI.getAgentTokenList({ page: 1, limit: 100, agent_types }),
         ]);
         agentsRef.current = uniqBy([...agents, ...agentsAll], 'id');
      } catch {
      }
   }

   const convertMemoryToGB = (memoryValue: string) => {
      const numericValue = parseFloat(memoryValue);
      if (numericValue >= 1024) {
         return `${(numericValue / 1024).toFixed(2)}GB`;
      }
      return `${numericValue.toFixed(2)}MB`;
   };

   const onGetCpuData = async () => {
      try {
         // Fetch both container and memory data concurrently
         const [cpuCores] = await Promise.all([
            globalThis.electronAPI.dockerInfo("cpus").then(data => parseInt(data)),
         ]);
         cpuCoresRef.current = cpuCores;
      } catch (error) {
      }
   }

   const onGetData = async () => {
      try {
         // Fetch both container and memory data concurrently
         const [imageData, containerData, memoryData] = await Promise.all([
            globalThis.electronAPI.dockerInfo("images").then(data => JSON.parse(data)),
            globalThis.electronAPI.dockerInfo("containers").then(data => JSON.parse(data)),
            globalThis.electronAPI.dockerInfo("memory").then(data => JSON.parse(data)),
         ]);

         console.log('LEON HIHI 111', { imageData, containerData, memoryData });

         // Calculate total memory and CPU usage
         let totalMemUsed = 0;
         let totalMemMax = 0;
         let totalCPUUsed = 0;
         const totalCPUMax = cpuCoresRef.current * 100; // Each core can use 100% CPU

         // Create a map of memory data for quick lookup
         const memoryMap = new Map(
            memoryData.map((mem: DockerMemory) => [mem.ID, mem])
         );

         // Transform and combine the data
         const transformedData: ContainerData[] = imageData.map((image: DockerImage) => {

            const container: DockerContainer = containerData.find((_container: DockerContainer) => compareString(_container.Image, image.Repository));

            // Find matching agent by container name
            const matchingAgent = agentsRef.current?.find(agent => 
               (container?.Names || extractImageName(image.Repository)).toLowerCase() === (`${agent?.network_id}-${agent.agent_name?.toLowerCase()}` || '')
            );

            let agentType = '-';
            switch (matchingAgent?.agent_type) {
            case AgentType.Model:
            case AgentType.ModelOnline:
               agentType = 'Model'
               break;
            case AgentType.CustomPrompt:
            case AgentType.CustomUI:
               agentType = 'Utility'
               break;
            case AgentType.Infra:
               agentType = 'Infra'
               break;
            default:
               break;
            }

            if (!container) {
               return {
                  name: extractImageName(image.Repository),
                  image: image.Repository,
                  imageId: image.ID,
                  ports: '-',
                  cpu: '0.00%',
                  lastStarted: '',
                  memoryUsage: '',
                  memoryPercentage: '',
                  state: '',
                  agent: matchingAgent,
                  agentType,
                  imageSize: image.Size,
               }
            }

            const memInfo: any = memoryMap.get(container.ID);
            if (memInfo && matchingAgent) {
               // Parse memory values for totals
               const memUsage = memInfo.MemUsage.split('/');
               const memUsed = parseFloat(memUsage[0]);
               const memTotal = parseFloat(memUsage[1]);
               totalMemUsed += memUsed || 0;
               totalMemMax = Math.max(totalMemMax, memTotal || 0);

               // Parse CPU percentage
               const cpuPerc = parseFloat(memInfo.CPUPerc) || 0;
               totalCPUUsed += cpuPerc;

               return {
                  name: container.Names,
                  containerId: container.ID,
                  image: container.Image,
                  imageId: image.ID,
                  ports: container.Ports || '-',
                  cpu: memInfo.CPUPerc,
                  lastStarted: container.RunningFor,
                  memoryUsage: convertMemoryToGB(memUsage[0]),
                  memoryPercentage: memInfo.MemPerc,
                  state: container.State,
                  agent: matchingAgent,
                  agentType,
                  imageSize: image.Size,
                  createdAt: container.CreatedAt,
               };
            }

            return {
               name: container.Names,
               containerId: container.ID,
               image: container.Image,
               imageId: image.ID,
               ports: container.Ports || '-',
               cpu: '0%',
               lastStarted: container.RunningFor,
               state: container.State,
               agent: matchingAgent,
               agentType,
               imageSize: image.Size,
               createdAt: container.CreatedAt,
            };
         });

         // Filter based on showRunningOnly and searchTerm
         const filteredData = transformedData
            .filter(container => {
               return (container?.agent || container.name === 'agent-router');
            });

         // Update states
         setContainers(filteredData);
         setTotalMemory({
            used: convertMemoryToGB(totalMemUsed.toString()),
            total: `${(totalMemMax).toFixed(2)}GB`
         });
         setTotalCPU({
            used: `${totalCPUUsed.toFixed(2)}%`,
            total: `${totalCPUMax}%`
         });

      } catch (error) {
         console.error('Error fetching docker info:', error);
         setContainers([]);
      }
   };

   useEffect(() => {
      // Initial fetch
      onGetData();
      // Set up the interval
      intervalRef.current = setInterval(onGetData, 2 * 60000);
      // Cleanup function
      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
         }
      };
   }, [needReloadMonitor]); // Empty dependency array means this effect runs once on mount

   useEffect(() => {
      // Initial fetch
      onGetDataAgents();
      // Set up the interval
      intervalAgentRef.current = setInterval(onGetDataAgents, 5 * 60000);
      // Cleanup function
      return () => {
         if (intervalAgentRef.current) {
            clearInterval(intervalAgentRef.current);
         }
      };
   }, [needReloadList]);

   useEffect(() => {
      onGetCpuData();
   }, []);
   
   const contextValues: any = useMemo(() => {
      return {
         containers,
         totalMemory,
         totalCPU,
         installedAgents: agentsRef.current,
      };
   }, [
      containers,
      totalMemory,
      totalCPU,
      agentsRef.current
   ]);

   return (
      <MonitorContext.Provider value={contextValues}>
         {children}
      </MonitorContext.Provider>
   );
};

export default MonitorProvider;

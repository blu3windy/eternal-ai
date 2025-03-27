import {
   Flex,
   Image,
   Popover,
   PopoverBody,
   PopoverContent,
   PopoverTrigger,
   useDisclosure,
   Text,
   Box,
   Input,
   Switch,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td,
   IconButton,
   Tooltip,
} from '@chakra-ui/react';
import React, { useState, useEffect, useRef, useContext } from 'react';
import s from './styles.module.scss';
import { compareString } from '@utils/string';
import CAgentTokenAPI from '@services/api/agents-token';
import { AgentType } from '../constants';
import { AgentContext } from '@pages/home/provider';
import { IAgentToken } from '@services/api/agents-token/interface';
import storageModel from '@storage/StorageModel';
import { BASE_CHAIN_ID } from '@constants/chains';
import CAgentContract from '@contract/agent';
import DeleteAgentModal from './DeleteAgentModal';

interface DockerContainer {
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

interface DockerMemory {
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

interface ContainerData {
   name: string;
   containerId: string;
   image: string;
   ports: string;
   cpu: string;
   lastStarted: string;
   memoryUsage?: string;
   memoryPercentage?: string;
   state?: string;
   agent?: IAgentToken;
   agentType?: string;
}

const AgentMonitor: React.FC = () => {
   const { isOpen, onToggle, onClose } = useDisclosure();
   const [searchTerm, setSearchTerm] = useState('');
   const [showRunningOnly, setShowRunningOnly] = useState(false);
   const [deleteAgent, setDeleteAgent] = useState<IAgentToken | undefined>();

   const [currentActiveModel, setCurrentActiveModel] = useState<{
      agent: IAgentToken | undefined,
      dependAgents: string[];
   }>();
   const [containers, setContainers] = useState<ContainerData[]>([]);
   const [totalMemory, setTotalMemory] = useState({ used: '0MB', total: '0GB' });
   const [totalCPU, setTotalCPU] = useState({ used: '0%', total: '800%' });
   const intervalRef = useRef<NodeJS.Timeout>();
   const cPumpAPI = new CAgentTokenAPI();
   const [agents, setAgents] = useState<any[]>([]);
   const { agentStates, startAgent, stopAgent, unInstallAgent  } = useContext(AgentContext);
   
   const onGetCurrentModel = async () => {
      try {
         const model = await storageModel.getActiveModel();
         if (model?.agent_type === AgentType.ModelOnline) {
            setCurrentActiveModel({
               agent: model,
               dependAgents: [],
            });
            const chainId = model?.network_id || BASE_CHAIN_ID;
            const cAgent = new CAgentContract({ contractAddress: model.agent_contract_address, chainId: chainId });
            const codeVersion = await cAgent.getCurrentVersion();
            const depsAgentStrs = await cAgent.getDepsAgents(codeVersion);

            setCurrentActiveModel({
               agent: model,
               dependAgents: depsAgentStrs,
            });
         }
      } catch (error) {
      }
   }

   const onGetDataAgents = async () => {
      try {
         const [{ agents }, { agents: agentsAll }] = await Promise.all([
            cPumpAPI.getAgentTokenList({ page: 1, limit: 100, installed: true, agent_types: '5,12,10,11,8' }),
            cPumpAPI.getAgentTokenList({ page: 1, limit: 100, agent_types: '5,12,10,11,8' }),
         ]);
         setAgents([...agents, ...agentsAll]);
      }  catch {
      }
   }

   const convertMemoryToGB = (memoryValue: string) => {
      const numericValue = parseFloat(memoryValue);
      if (numericValue >= 1024) {
         return `${(numericValue / 1024).toFixed(2)}GB`;
      }
      return `${numericValue.toFixed(2)}MB`;
   };

   const onGetData = async () => {
      try {
         // Fetch both container and memory data concurrently
         const [containerData, memoryData, cpuCores] = await Promise.all([
            globalThis.electronAPI.dockerInfo("containers").then(data => JSON.parse(data)),
            globalThis.electronAPI.dockerInfo("memory").then(data => JSON.parse(data)),
            globalThis.electronAPI.dockerInfo("cpus").then(data => parseInt(data)),
         ]);

         // Calculate total memory and CPU usage
         let totalMemUsed = 0;
         let totalMemMax = 0;
         let totalCPUUsed = 0;
         let totalCPUMax = cpuCores * 100; // Each core can use 100% CPU

         // Create a map of memory data for quick lookup
         const memoryMap = new Map(
            memoryData.map((mem: DockerMemory) => [mem.ID, mem])
         );

         // Transform and combine the data
         const transformedData: ContainerData[] = containerData.map((container: DockerContainer) => {
            const memInfo: any = memoryMap.get(container.ID);
            
            // Find matching agent by container name
            const matchingAgent = agents?.find(agent => 
               container.Names.toLowerCase().includes(agent.agent_name?.toLowerCase() || '')
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
            
            if (memInfo) {
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
                  ports: container.Ports || '-',
                  cpu: memInfo.CPUPerc,
                  lastStarted: container.RunningFor,
                  memoryUsage: convertMemoryToGB(memUsage[0]),
                  memoryPercentage: memInfo.MemPerc,
                  state: container.State,
                  agent: matchingAgent,
                  agentType,
               };
            }

            return {
               name: container.Names,
               containerId: container.ID,
               image: container.Image,
               ports: container.Ports || '-',
               cpu: '0%',
               lastStarted: container.RunningFor,
               state: container.State,
               agent: matchingAgent,
               agentType,
            };
         });

         // Filter based on showRunningOnly and searchTerm
         const filteredData = transformedData
            .filter(container => {
               const matchesSearch = container.name.toLowerCase().includes(searchTerm.toLowerCase());
               const matchesRunning = !showRunningOnly || container.state === 'running';
               return matchesSearch && matchesRunning && (container?.agent || container?.name === 'agent-router');
            })
            .sort((a, b) => {
               // Sort running containers first
               if (a.state === 'running' && b.state !== 'running') return -1;
               if (a.state !== 'running' && b.state === 'running') return 1;
               // If both have same state, sort by name
               return a.name.localeCompare(b.name);
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
      intervalRef.current = setInterval(onGetData, 5000);
      // Cleanup function
      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
         }
      };
   }, [isOpen, searchTerm, showRunningOnly, agents]); // Empty dependency array means this effect runs once on mount

   // Additional effect to handle popover open/close
   useEffect(() => {
      onGetCurrentModel();
      onGetDataAgents();
   }, [isOpen]);

   return (
      <Popover
         isOpen={isOpen}
         onClose={onClose}
         placement="bottom-end"
      >
         <PopoverTrigger>
            <Flex position="relative" cursor="pointer" onClick={onToggle} borderRadius={"100px"} w={'22px'} ml={'6px'} gap="4px">
               <Image src={'icons/ic-monitor.svg'} alt='monitor' />
            </Flex>
         </PopoverTrigger>
         <PopoverContent 
            width="900px"
            border="none" 
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            className={s.popoverContent}
         >
            <PopoverBody p="20px">
               <Box className={s.containerOverview}>
                  <Text fontSize="22px" fontWeight="600" mb="4" color="white">Overview</Text>
                  
                  <Flex gap="4" mb="6">
                     <Box className={s.statsCard}>
                        <Flex gap="12px">
                           <Image src="icons/cpu.svg" alt="CPU" boxSize="32px" />
                           <Box gap="6px">
                              <Text fontSize="18px" fontWeight="600" color="white">CPU usage</Text>
                              <Text fontSize="15px" fontWeight="500" color={"lightgray"}>
                                 <Text as={'span'} color="#4ADE80">{totalCPU.used}</Text> / {totalCPU.total}
                              </Text>
                           </Box>
                        </Flex>
                     </Box>
                     
                     <Box className={s.statsCard}>
                        <Flex gap="12px">
                           <Image src="icons/ram.svg" alt="Memory" boxSize="32px" />
                           <Box gap="6px">
                              <Text fontSize="18px" fontWeight="600" color="white">Memory usage</Text>
                              <Text fontSize="15px" fontWeight="500" color={"lightgray"}>
                                 <Text as={'span'} color="#4ADE80">{totalMemory.used}</Text> / {totalMemory.total}
                              </Text>
                           </Box>
                        </Flex>
                     </Box>
                  </Flex>

                  <Box className={s.statsCard} maxH="500px" overflowY="auto">
                     <Flex justify="space-between" align="center" mb="4">
                        <Input
                           placeholder="Search agent"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           width="200px"
                           size="sm"
                           borderRadius="8px"
                           bg="rgba(255, 255, 255, 0.10)"
                           border="none"
                           color="white"
                           _placeholder={{ color: 'whiteAlpha.600' }}
                        />
                        <Flex align="center" gap="2">
                           <Text fontSize="sm" color="white">Only show running agents</Text>
                           <Switch
                              isChecked={showRunningOnly}
                              onChange={(e) => setShowRunningOnly(e.target.checked)}
                              colorScheme="blue"
                           />
                        </Flex>
                     </Flex>

                     <Table variant="unstyled" className={s.containerTable}>
                        <Thead>
                           <Tr>
                              <Th color="whiteAlpha.600">Name</Th>
                              <Th color="whiteAlpha.600">Type</Th>
                              <Th color="whiteAlpha.600">Container ID</Th>
                              <Th color="whiteAlpha.600">CPU</Th>
                              <Th color="whiteAlpha.600">Memory</Th>
                              <Th color="whiteAlpha.600">Last started</Th>
                              <Th color="whiteAlpha.600">Actions</Th>
                           </Tr>
                        </Thead>
                        <Tbody>
                           {agents.length > 0 && containers.map((container, idx) => (
                              <Tr key={idx}>
                                 <Td>
                                    <Flex align="center" gap="2">
                                       <Box
                                          w="8px"
                                          h="8px"
                                          borderRadius="full"
                                          bg={container.state === 'running' ? '#4ADE80' : 'lightgray'}
                                       />
                                       <Text color="white">{container.agent?.agent_name || container.name}</Text>
                                    </Flex>
                                 </Td>
                                 <Td>
                                    {/* <Text color="#AFC7FF" textDecoration="underline" cursor="pointer"> */}
                                    <Text color="white">
                                       {container.agentType}
                                    </Text>
                                 </Td>
                                 <Td color="white">{container.containerId}</Td>
                                 <Td color="white">{container.cpu}</Td>
                                 <Td color="white">{container.memoryUsage || '-'}</Td>
                                 <Td color="white">{container.lastStarted}</Td>
                                 <Td>
                                    <Flex gap="2">
                                       {!!container.agent && 
                                       !(compareString(container.agent?.agent_name, currentActiveModel?.agent?.agent_name) || currentActiveModel?.dependAgents?.find((address) => compareString(address, container?.agent?.agent_contract_address))) 
                                       ? (
                                         <>
                                           <Tooltip 
                                              label={container.state === 'running' ? 'Stop' : 'Start'}
                                              hasArrow
                                              placement="top"
                                              bg="gray.700"
                                              color="white"
                                           >
                                              <IconButton
                                                 aria-label={container.state === 'running' ? 'Stop container' : 'Start container'}
                                                 icon={<Image src={container.state === 'running' ? "icons/stop.svg" : "icons/play.svg"} alt={container.state === 'running' ? "Stop" : "Start"} />}
                                                 size="sm"
                                                 variant="ghost"
                                                 color="white"
                                                 _hover={{ bg: 'whiteAlpha.200' }}
                                                 isLoading={(agentStates[container.agent?.id]?.isStarting || agentStates[container.agent?.id]?.isStopping) ?? false}
                                                 onClick={ () => {
                                                   if (container.state === 'running') {
                                                      stopAgent(container.agent);
                                                   } else {
                                                      startAgent(container.agent);
                                                   }
                                                 }}
                                              />
                                           </Tooltip>
                                           <Tooltip 
                                              label="Delete"
                                              hasArrow
                                              placement="top"
                                              bg="gray.700"
                                              color="white"
                                           >
                                              <IconButton
                                                 aria-label="Delete container"
                                                 icon={<Image src="icons/delete.svg" alt="Delete" />}
                                                 size="sm"
                                                 variant="ghost"
                                                 color="white"
                                                 _hover={{ bg: 'whiteAlpha.200' }}
                                                 isLoading={agentStates[container.agent?.id]?.isUnInstalling ?? false}
                                                 onClick={() => {
                                                   setDeleteAgent(container.agent);
                                                 }}
                                              />
                                           </Tooltip>
                                         </>
                                       )
                                       :
                                       (
                                          <Tooltip 
                                              label={'This agent is required for the system to work properly. You can’t remove it.'}
                                              hasArrow
                                              placement="top"
                                              bg="gray.700"
                                              color="white"
                                           >
                                             <IconButton
                                                aria-label={'container'}
                                                icon={<Image src={"icons/warning.svg"} w={'16px'} alt={"Warning"} />}
                                                size="sm"
                                                variant="ghost"
                                                color="white"
                                                _hover={{ bg: 'whiteAlpha.200' }}
                                             />
                                          </Tooltip>
                                       )}
                                    </Flex>
                                 </Td>
                              </Tr>
                           ))}
                        </Tbody>
                     </Table>
                  </Box>
               </Box>
            </PopoverBody>
         </PopoverContent>
         <DeleteAgentModal agentName={deleteAgent?.agent_name || ''} isOpen={!!deleteAgent} onClose={() => setDeleteAgent(undefined)} onDelete={() => {
            if (deleteAgent) {
               unInstallAgent(deleteAgent);
               setDeleteAgent(undefined);
            }
         }} />
      </Popover>
   );
};

export default AgentMonitor; 
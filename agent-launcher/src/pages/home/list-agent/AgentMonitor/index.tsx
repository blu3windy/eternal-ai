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
   MenuItem,
   Button,
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
import BaseModal from '@components/BaseModal';

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
}

interface ContainerActionState {
   isLoading: boolean;
   isDeleting: boolean;
}

type StateActions = Record<string, ContainerActionState>;

const AgentMonitor: React.FC = () => {
   const { isOpen, onToggle, onClose } = useDisclosure();
   const [searchTerm, setSearchTerm] = useState('');
   const [showRunningOnly, setShowRunningOnly] = useState(false);
   const [deleteAgent, setDeleteAgent] = useState<IAgentToken | undefined>();
   const [deleteContainer, setDeleteConntainer] = useState<ContainerData | undefined>();

   const [containers, setContainers] = useState<ContainerData[]>([]);
   const [totalMemory, setTotalMemory] = useState({ used: '0MB', total: '0GB' });
   const [totalCPU, setTotalCPU] = useState({ used: '0%', total: '800%' });
   const intervalRef = useRef<NodeJS.Timeout>();
   const cPumpAPI = new CAgentTokenAPI();
   const [agents, setAgents] = useState<any[]>([]);
   const { agentStates, startAgent, stopAgent, unInstallAgent, currentActiveModel } = useContext(AgentContext);

   const [stateActions, setStateActions] = useState<StateActions>({});


   const onGetDataAgents = async () => {
      try {
         const [{ agents }, { agents: agentsAll }] = await Promise.all([
            cPumpAPI.getAgentTokenList({ page: 1, limit: 100, installed: true, agent_types: '5,12,10,11,8' }),
            cPumpAPI.getAgentTokenList({ page: 1, limit: 100, agent_types: '5,12,10,11,8' }),
         ]);
         setAgents([...agents, ...agentsAll]);
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

   const handleStopContainer = async (container: ContainerData) => {
      try {
         setStateActions(prev => ({ ...prev, [container.name]: { ...prev[container.name], isLoading: true } }));
         if (container?.containerId) {
            await globalThis.electronAPI.dockerStopContainer(container?.containerId);
         }
      } catch (error) {
         console.error('Error stopping container:', error);
      } finally {
         setTimeout(() => {
            setStateActions(prev => ({ ...prev, [container.name]: { ...prev[container.name], isLoading: false } }));
         }, 5000);
      }
   };

   const handleStartContainer = async (container: ContainerData) => {
      try {
         setStateActions(prev => ({ ...prev, [container.name]: { ...prev[container.name], isLoading: true } }));
         if (container?.containerId) {
            await globalThis.electronAPI.dockerStartContainer(container?.containerId);
         }
      } catch (error) {
         console.error('Error stopping container:', error);
      } finally {
         setTimeout(() => {
            setStateActions(prev => ({ ...prev, [container.name]: { ...prev[container.name], isLoading: false } }));
         }, 5000);
      }
   };

   const handleDeleteContainer = async (container: ContainerData) => {
      try {
         setStateActions(prev => ({ ...prev, [container.name]: { ...prev[container.name], isDeleting: true } }));
          if (container?.containerId) {
            await globalThis.electronAPI.dockerDeleteContainer(container?.containerId);
         }
         
      } catch (error) {
         console.error('Error deleting container:', error);
      } finally {
         setTimeout(() => {
            setStateActions(prev => ({ ...prev, [container.name]: { ...prev[container.name], isDeleting: false } }));
         }, 5000);
      }
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
               return matchesSearch && matchesRunning;
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
      if (isOpen) {
         // Initial fetch
         onGetData();
         // Set up the interval
         intervalRef.current = setInterval(onGetData, 5000);
      }
      // Cleanup function
      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
         }
      };
   }, [isOpen, searchTerm, showRunningOnly, agents]); // Empty dependency array means this effect runs once on mount

   // Additional effect to handle popover open/close
   useEffect(() => {
      onGetDataAgents();
   }, [isOpen]);

   return (
      <>
         <Button
            width="100%"
            height="45px"
            display="flex"
            alignItems="center"
            padding="10px 20px"
            gap="10px"
            onClick={onToggle}
         >
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
               <g clip-path="url(#clip0_54260_9784)">
                  <path d="M17.7501 9.75L17.75 10.65C17.75 10.7052 17.7948 10.75 17.85 10.75H19.65C19.7052 10.75 19.75 10.7052 19.75 10.65L19.7501 9.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M10.25 16.75V20.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M5.25 20.75H10.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M10.25 16.75H3.25C2.14543 16.75 1.25 15.8546 1.25 14.75V5.75C1.25 4.64543 2.14543 3.75 3.25 3.75H17.25C18.3546 3.75 19.25 4.64543 19.25 5.75" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M21.25 9.75H16.25C15.1454 9.75 14.25 10.6454 14.25 11.75V20.75C14.25 21.8546 15.1454 22.75 16.25 22.75H21.25C22.3546 22.75 23.25 21.8546 23.25 20.75V11.75C23.25 10.6454 22.3546 9.75 21.25 9.75Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
               </g>
               <defs>
                  <clipPath id="clip0_54260_9784">
                     <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                  </clipPath>
               </defs>
            </svg>
            Monitor
         </Button>


         <BaseModal
            isShow={isOpen}
            onHide={() => {
               onClose();
            }}
            className={s.popoverContent}
            size="extra"
         >
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
                                    {!(compareString(container.agent?.agent_name, currentActiveModel?.agent?.agent_name) || 
                                    currentActiveModel?.dependAgents?.find((address) => compareString(address, container?.agent?.agent_contract_address)) ||
                                    compareString(container.name, 'agent-router')) 
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
                                                isLoading={container?.agent ? (agentStates[container?.agent?.id]?.isStarting || agentStates[container?.agent?.id]?.isStopping) : stateActions[container.name]?.isLoading ?? false}
                                                onClick={ () => {
                                                if (container.state === 'running') {
                                                   container.agent ? stopAgent(container.agent) : handleStopContainer(container);
                                                } else {
                                                   container.agent ? startAgent(container.agent) : handleStartContainer(container);
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
                                                isLoading={container?.agent ? agentStates[container.agent?.id]?.isUnInstalling : stateActions[container.name]?.isDeleting ?? false}
                                                onClick={() => {
                                                container.agent ? setDeleteAgent(container.agent) : setDeleteConntainer(container);
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
         </BaseModal>
         <DeleteAgentModal 
            agentName={deleteAgent?.agent_name || deleteContainer?.name || ''} 
            isOpen={!!deleteAgent || !!deleteContainer} 
            onClose={() => {
               setDeleteAgent(undefined);
               setDeleteConntainer(undefined);
            }} 
            onDelete={() => {
               if (deleteAgent) {
                  unInstallAgent(deleteAgent);
                  setDeleteAgent(undefined);
               }
               if (deleteContainer) {
                  handleDeleteContainer(deleteContainer);
                  setDeleteConntainer(undefined);
               }
            }}
         />
      </>

   )
   // return (
   //    <Popover
   //       isOpen={isOpen}
   //       onClose={onClose}
   //       placement="top-end"
   //    >
   //       <PopoverTrigger>
   //          <MenuItem onClick={onToggle} icon={<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
   //             <g clip-path="url(#clip0_54260_9784)">
   //                <path d="M17.7501 9.75L17.75 10.65C17.75 10.7052 17.7948 10.75 17.85 10.75H19.65C19.7052 10.75 19.75 10.7052 19.75 10.65L19.7501 9.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
   //                <path d="M10.25 16.75V20.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
   //                <path d="M5.25 20.75H10.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
   //                <path d="M10.25 16.75H3.25C2.14543 16.75 1.25 15.8546 1.25 14.75V5.75C1.25 4.64543 2.14543 3.75 3.25 3.75H17.25C18.3546 3.75 19.25 4.64543 19.25 5.75" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
   //                <path d="M21.25 9.75H16.25C15.1454 9.75 14.25 10.6454 14.25 11.75V20.75C14.25 21.8546 15.1454 22.75 16.25 22.75H21.25C22.3546 22.75 23.25 21.8546 23.25 20.75V11.75C23.25 10.6454 22.3546 9.75 21.25 9.75Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
   //             </g>
   //             <defs>
   //                <clipPath id="clip0_54260_9784">
   //                   <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
   //                </clipPath>
   //             </defs>
   //          </svg>}
   //          >
   //             Monitor
   //          </MenuItem>

   //       </PopoverTrigger>
   //       <PopoverContent
   //          width="900px"
   //          border="none"
   //          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
   //          className={s.popoverContent}
   //       >
   //          <PopoverBody p="20px">
   
   //          </PopoverBody>
   //       </PopoverContent>
   
   //    </Popover>
   // );
};

export default AgentMonitor; 
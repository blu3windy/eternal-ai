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
import React, { useState, useEffect, useRef } from 'react';
import s from './styles.module.scss';
import { compareString } from '@utils/string';
import CAgentTokenAPI from '@services/api/agents-token';
import { AgentType } from '../constants';

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
   agentName?: string;
   agentType?: string;
}

const AgentMonitor: React.FC = () => {
   const { isOpen, onToggle, onClose } = useDisclosure();
   const [searchTerm, setSearchTerm] = useState('');
   const [showRunningOnly, setShowRunningOnly] = useState(false);
   const [containers, setContainers] = useState<ContainerData[]>([]);
   const [totalMemory, setTotalMemory] = useState({ used: '0MB', total: '0GB' });
   const [totalCPU, setTotalCPU] = useState({ used: '0%', total: '800%' });
   const intervalRef = useRef<NodeJS.Timeout>();
   const cPumpAPI = new CAgentTokenAPI();

   const onGetData = async () => {
      try {
         // Fetch both container and memory data concurrently
         const [containerData, memoryData, cpuCores, { agents }] = await Promise.all([
            globalThis.electronAPI.dockerInfo("containers").then(data => JSON.parse(data)),
            globalThis.electronAPI.dockerInfo("memory").then(data => JSON.parse(data)),
            globalThis.electronAPI.dockerInfo("cpus").then(data => parseInt(data)),
            cPumpAPI.getAgentTokenList({ page: 1, limit: 100, installed: true, agent_types: '5,12,10,11,8' }),
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
                  memoryUsage: memInfo.MemUsage,
                  memoryPercentage: memInfo.MemPerc,
                  state: container.State,
                  agentName: matchingAgent?.agent_name,
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
               agentName: matchingAgent?.agent_name,
               agentType,
            };
         });

         // Filter based on showRunningOnly and searchTerm
         const filteredData = transformedData.filter(container => {
            const matchesSearch = container.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRunning = !showRunningOnly || container.state === 'running';
            return matchesSearch && matchesRunning;
         });

         // Update states
         setContainers(filteredData);
         setTotalMemory({
            used: `${totalMemUsed.toFixed(2)}MB`,
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
      intervalRef.current = setInterval(onGetData, 4000);
      // Cleanup function
      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
         }
      };
   }, [searchTerm, showRunningOnly]); // Empty dependency array means this effect runs once on mount

   // Additional effect to handle popover open/close
   useEffect(() => {
      if (isOpen) {
         // Fetch data immediately when popover opens
         onGetData();
      } else {
         // Clear interval when popover closes
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
         }
      }
   }, [isOpen]);

   return (
      <Popover
         isOpen={isOpen}
         onClose={onClose}
         placement="bottom-end"
      >
         <PopoverTrigger>
            <Flex position="relative" cursor="pointer" onClick={onToggle} borderRadius={"100px"} p="6px 10px" gap="4px">
               <Image src={'icons/ic-monitor.svg'} alt='monitor' />
            </Flex>
         </PopoverTrigger>
         <PopoverContent 
            width="950px"
            border="none" 
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            className={s.popoverContent}
         >
            <PopoverBody p="20px">
               <Box className={s.containerOverview}>
                  <Text fontSize="22px" fontWeight="600" mb="4" color="white">Container Overview</Text>
                  
                  <Flex gap="4" mb="6">
                     <Box className={s.statsCard}>
                        <Flex gap="2">
                           <Image src="icons/cpu.svg" alt="CPU" boxSize="32px" />
                           <Box gap="6px">
                              <Text fontSize="18px" fontWeight="600" color="white">Container CPU usage</Text>
                              <Text fontSize="15px" fontWeight="500" color={"lightgray"}>
                                 <Text as={'span'} color="#4ADE80">{totalCPU.used}</Text> / {totalCPU.total}
                              </Text>
                           </Box>
                        </Flex>
                     </Box>
                     
                     <Box className={s.statsCard}>
                        <Flex gap="2">
                           <Image src="icons/ram.svg" alt="Memory" boxSize="32px" />
                           <Box gap="6px">
                              <Text fontSize="18px" fontWeight="600" color="white">Container memory usage</Text>
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
                           <Text fontSize="sm" color="white">Only show running containers</Text>
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
                              <Th color="whiteAlpha.600">Agent type</Th>
                              <Th color="whiteAlpha.600">Container ID</Th>
                              <Th color="whiteAlpha.600">CPU</Th>
                              <Th color="whiteAlpha.600">Memory percentage</Th>
                              <Th color="whiteAlpha.600">Last started</Th>
                              <Th color="whiteAlpha.600">Actions</Th>
                           </Tr>
                        </Thead>
                        <Tbody>
                           {containers.map((container, idx) => (
                              <Tr key={idx}>
                                 <Td>
                                    <Flex align="center" gap="2">
                                       <Box
                                          w="8px"
                                          h="8px"
                                          borderRadius="full"
                                          bg={container.state === 'running' ? '#4ADE80' : 'lightgray'}
                                       />
                                       <Text color="white">{container.agentName || container.name}</Text>
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
                                 <Td color="white">{container.memoryPercentage || '-'}</Td>
                                 <Td color="white">{container.lastStarted}</Td>
                                 <Td>
                                    <Flex gap="2">
                                       {!compareString(container.name, 'agent-router') && (
                                         <>
                                           {container.state === 'running' ? <Tooltip 
                                              label={container.state === 'running' ? 'Stop' : 'Start Container'}
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
                                                 onClick={() => {
                                                   if (container.state === 'running') {
                                                      
                                                   }
                                                 }}
                                              />
                                           </Tooltip> : 
                                           <IconButton
                                              aria-label="Container action"
                                              disabled
                                              icon={<Image src="icons/stop.svg" alt="Stop" />}
                                              size="sm"
                                              variant="ghost"
                                              color="white"
                                              opacity="0.5"
                                              cursor="not-allowed"
                                              _hover={{ bg: 'transparent' }}
                                           />
                                           }
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
                                                 onClick={() => {
                                                   
                                                 }}
                                              />
                                           </Tooltip>
                                         </>
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
      </Popover>
   );
};

export default AgentMonitor; 
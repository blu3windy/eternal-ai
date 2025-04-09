import {
   Box,
   Button,
   Center,
   Flex,
   IconButton,
   Image,
   Input,
   Switch,
   Table,
   Tbody,
   Td,
   Text,
   Th,
   Thead,
   Tooltip,
   Tr,
   useDisclosure
} from '@chakra-ui/react';
import BaseModal from '@components/BaseModal';
import Loading from '@components/Loading';
import { AgentContext } from "@pages/home/provider/AgentContext";
import { ContainerData } from "@providers/Monitor/interface";
import { MonitorContext } from '@providers/Monitor/MonitorContext';
import { IAgentToken } from '@services/api/agents-token/interface';
import { compareString } from '@utils/string';
import React, { useContext, useEffect, useState } from 'react';
import DeleteAgentModal from './DeleteAgentModal';
import s from './styles.module.scss';
import { useDispatch } from 'react-redux';
import { requestReloadMonitor } from '@stores/states/common/reducer';

interface ContainerActionState {
   isLoading: boolean;
   isDeleting: boolean;
}

type StateActions = Record<string, ContainerActionState>;

const AgentMonitor: React.FC = () => {
   const dispatch = useDispatch();
   const { isOpen, onToggle, onClose } = useDisclosure();
   const [searchTerm, setSearchTerm] = useState('');
   const [showRunningOnly, setShowRunningOnly] = useState(false);
   const [deleteAgent, setDeleteAgent] = useState<IAgentToken | undefined>();
   const [deleteContainer, setDeleteConntainer] = useState<ContainerData | undefined>();
   const [filterContainers, setFilterContainers] = useState<ContainerData[]>([]);

   const { containers, totalCPU, totalMemory } = useContext(MonitorContext);
   const { agentStates, startAgent, stopAgent, unInstallAgent, currentActiveModel } = useContext(AgentContext);

   const [stateActions, setStateActions] = useState<StateActions>({});

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
         if (container.image) {
            await globalThis.electronAPI.dockerDeleteImageID(container.image);
         }
      } catch (error) {
         console.error('Error deleting container:', error);
      } finally {
         setTimeout(() => {
            setStateActions(prev => ({ ...prev, [container.name]: { ...prev[container.name], isDeleting: false } }));
         }, 5000);
      }
   };

   const onFilterData = async () => {
      // Filter based on showRunningOnly and searchTerm
      const filteredData = containers
         .filter(container => {
            const matchesSearch = container.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRunning = !showRunningOnly || (agentStates[container?.agent?.id || '']?.isRunning || container.state === 'running');
            return matchesSearch && matchesRunning && !!container.name;
         })
         .sort((a, b) => {

            // Sort running containers first
            if ((agentStates[a?.agent?.id || '']?.isRunning || a.state === 'running') && (!agentStates[b?.agent?.id || '']?.isRunning || b.state !== 'running')) return -1;
            if ((!agentStates[a?.agent?.id || '']?.isRunning || a.state !== 'running') && (agentStates[b?.agent?.id || '']?.isRunning || b.state === 'running')) return 1;
            // If both have same state, sort by name
            return a.name.localeCompare(b.name);
         });
      setFilterContainers(filteredData);
   };

   useEffect(() => {
      onFilterData();
   }, [searchTerm, showRunningOnly, containers, agentStates]); // Empty dependency array means this effect runs once on mount

   useEffect(() => {
      if (isOpen) {
         dispatch(requestReloadMonitor());
      }
   }, [isOpen]);

   return (
      <>
         <Button
            width="100%"
            height="45px"
            display="flex"
            alignItems="center"
            padding="10px 20px"
            gap="12px"
            onClick={onToggle}
            fontSize={'16px !important'}
            color={'#fff !important'}
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
                           <Flex gap={'6px'} alignItems={'center'}>
                              <Text fontSize="18px" fontWeight="600" color="white">CPU usage</Text>
                              <Tooltip 
                                 label="This shows the CPU usage available to Docker, not your actual device’s total CPU usage."
                                 hasArrow
                                 placement="top"
                                 bg="gray.700"
                                 color="white"
                              >
                                 <Image cursor={'pointer'} w={'18px'} src="icons/ic-tooltip-white.svg" alt="tooltip" />
                              </Tooltip>
                           </Flex>
                           
                           <Text fontSize="15px" fontWeight="500" color={"lightgray"}>
                              <Text as={'span'} color="#4ADE80">{totalCPU.used}</Text> / {totalCPU.total}
                              <Text as={'span'} fontSize="12px"> ({(Number(totalCPU.total.replaceAll('%', ''))/100).toFixed(0)} CPUs available)</Text>
                           </Text>
                        </Box>
                     </Flex>
                  </Box>

                  <Box className={s.statsCard}>
                     <Flex gap="12px">
                        <Image src="icons/ram.svg" alt="Memory" boxSize="32px" />
                        <Box gap="6px">
                           <Flex gap={'6px'} alignItems={'center'}>
                              <Text fontSize="18px" fontWeight="600" color="white">Memory usage</Text>
                              <Tooltip 
                                 label="This reflects the memory allocated to Docker, not your computer’s full memory. Your device may have more RAM available overall."
                                 hasArrow
                                 placement="top"
                                 bg="gray.700"
                                 color="white"
                              >
                                 <Image cursor={'pointer'} w={'18px'} src="icons/ic-tooltip-white.svg" alt="tooltip" />
                              </Tooltip>
                           </Flex>
                           <Text fontSize="15px" fontWeight="500" color={"lightgray"}>
                              <Text as={'span'} color="#4ADE80">{totalMemory.used}</Text> / {totalMemory.total}
                           </Text>
                        </Box>
                     </Flex>
                  </Box>
               </Flex>

               <Box className={s.statsCard} minH={'300px'} maxH="500px" overflowY="auto">
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
                           {/* <Th color="whiteAlpha.600">Container ID</Th> */}
                           <Th color="whiteAlpha.600">CPU</Th>
                           <Th color="whiteAlpha.600">Memory</Th>
                           <Th color="whiteAlpha.600">Size</Th>
                           <Th color="whiteAlpha.600">Last started</Th>
                           <Th color="whiteAlpha.600">Actions</Th>
                        </Tr>
                     </Thead>
                     
                     <Tbody>
                        {filterContainers.length > 0 && filterContainers.map((container, idx) => (
                           <Tr key={idx}>
                              <Td>
                                 <Flex align="center" gap="2">
                                    <Box
                                       w="8px"
                                       h="8px"
                                       borderRadius="full"
                                       bg={(agentStates[container?.agent?.id || '']?.isRunning || container.state === 'running') ? '#4ADE80' : 'lightgray'}
                                    />
                                    <Text color="white">{container.agent?.display_name || container.agent?.agent_name || container.name}</Text>
                                 </Flex>
                              </Td>
                              <Td>
                                 {/* <Text color="#AFC7FF" textDecoration="underline" cursor="pointer"> */}
                                 <Text color="white">
                                    {container.agentType}
                                 </Text>
                              </Td>
                              {/* <Td color="white">{container.containerId}</Td> */}
                              <Td color="white">{container.cpu}</Td>
                              <Td color="white">{container.memoryUsage || '-'}</Td>
                              <Td color="white">{container.imageSize || '-'}</Td>
                              <Td color="white">{container.lastStarted}</Td>
                              <Td>
                                 <Flex gap="2">
                                    {!(compareString(container.agent?.agent_name, currentActiveModel?.agent?.agent_name) || 
                                    currentActiveModel?.dependAgents?.find((address) => compareString(address, container?.agent?.agent_contract_address)) ||
                                    compareString(container.name, 'agent-router')) 
                                    ? (
                                       <>
                                          <Tooltip 
                                             label={(agentStates[container?.agent?.id || '']?.isRunning || container.state === 'running') ? 'Stop' : 'Start'}
                                             hasArrow
                                             placement="top"
                                             bg="gray.700"
                                             color="white"
                                          >
                                             <IconButton
                                                aria-label={(agentStates[container?.agent?.id || '']?.isRunning || container.state === 'running') ? 'Stop container' : 'Start container'}
                                                icon={<Image src={(agentStates[container?.agent?.id || '']?.isRunning || container.state === 'running') ? "icons/stop.svg" : "icons/play.svg"} alt={container.state === 'running' ? "Stop" : "Start"} />}
                                                size="sm"
                                                variant="ghost"
                                                color="white"
                                                _hover={{ bg: 'whiteAlpha.200' }}
                                                isLoading={container?.agent ? (agentStates[container?.agent?.id]?.isStarting || agentStates[container?.agent?.id]?.isStopping) : stateActions[container.name]?.isLoading ?? false}
                                                onClick={ () => {
                                                if ((agentStates[container?.agent?.id || '']?.isRunning || container.state === 'running')) {
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
                  {filterContainers.length === 0 && <Center h="300px"><Loading/></Center>}
               </Box>
            </Box>
         </BaseModal>
         <DeleteAgentModal 
            agentName={deleteAgent?.display_name || deleteAgent?.agent_name || deleteContainer?.name || ''} 
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
};

export default AgentMonitor; 
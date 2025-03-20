import React, { useState, useMemo, useContext } from 'react';
import { 
   Box,
   Badge,
   Icon,
   Popover,
   PopoverTrigger,
   PopoverContent,
   PopoverHeader,
   PopoverBody,
   VStack,
   Text,
   useDisclosure,
   Image,
   Flex,
   Grid,
   Divider
} from '@chakra-ui/react';
import { AgentContext } from "@pages/home/provider";
import { DefaultAvatar } from '@components/DefaultAvatar';

interface AgentStatus {
  id: string;
  name: string;
  status: 'installing' | 'starting';
}

const AgentNotification: React.FC = () => {
   const { agentStates } = useContext(AgentContext);
   const { isOpen, onToggle, onClose } = useDisclosure();

   console.log('agentStates', agentStates);
   console.log('Object.entries(agentStates)', Object.entries(agentStates));

   const pendingAgents = useMemo(() => {
      if (!agentStates) return [];
    
      return Object.entries(agentStates)
         // .filter(([_, state]) => state.isInstalling || state.isStarting)
         .map(([id, state]) => ({
            id,
            name: state?.data?.agent_name || id,
            icon: state?.data?.thumbnail
            || state?.data?.token_image_url
            || state?.data?.twitter_info?.twitter_avatar,
            status: state.isInstalling ? 'installing' : 'starting'
         })) as AgentStatus[];
   }, [agentStates]);

   if (pendingAgents?.length === 0) {
      return null;
   }

   return (
      <Popover
         isOpen={isOpen}
         onClose={onClose}
         placement="bottom-end"
      >
         <PopoverTrigger>
            <Flex position="relative" cursor="pointer" onClick={onToggle} bg={"#FFF"} borderRadius={"100px"} p="6px 10px" gap="4px">
               <Image src={'icons/ic-bell.svg'} alt='bell' />
               <Text fontSize="12px" fontWeight={600} color="#000">{pendingAgents?.length}</Text>
            </Flex>
         </PopoverTrigger>
         <PopoverContent width="300px">
            <PopoverHeader fontWeight="semibold">
          Agents in Progress
            </PopoverHeader>
            <PopoverBody maxH="600px" overflowY="auto">
               <VStack spacing={2} align="stretch">
                  {pendingAgents?.map((agent: any, index: number) => (
                     <>
                        <Grid
                           templateColumns={'40px 1fr'}
                           gap="12px"
                           w={'100%'}
                        >
                           <Flex position={"relative"}>
                              {agent.icon ? (
                                 <Image
                                    w={'40px'}
                                    objectFit={'cover'}
                                    src={agent.icon}
                                    maxHeight={'40px'}
                                    maxWidth={'40px'}
                                    borderRadius={'50%'}
                                 />
                              ) : (
                                 <DefaultAvatar
                                    width={'40px'}
                                    height={'40px'}
                                    name={agent?.name}
                                    fontSize={14}
                                 />
                              )}
                           </Flex>
                           <Flex flexDirection="column" w={'100%'}>
                              <Text fontWeight="medium">{agent.name}</Text>
                              <Text fontSize="sm" color="gray.600">
                              Status: {agent?.status}
                              </Text>
                           </Flex>
                        </Grid>
                        {index < pendingAgents.length && (
                           <Divider orientation={'horizontal'} my={'0px'} />
                        )}
                     </>
                  ))}
               </VStack>
            </PopoverBody>
         </PopoverContent>
      </Popover>
   );
};

export default AgentNotification; 
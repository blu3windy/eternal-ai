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
   Image
} from '@chakra-ui/react';
import { AgentContext } from "@pages/home/provider";

interface AgentStatus {
  id: string;
  name: string;
  status: 'installing' | 'starting';
}

const AgentNotification: React.FC = () => {
   const { agentStates } = useContext(AgentContext);
   const { isOpen, onToggle, onClose } = useDisclosure();

   console.log('agentStates', agentStates);

   const pendingAgents = useMemo(() => {
      if (!agentStates) return [];
    
      // return Object.entries(agentStates)
      //    .filter(([_, state]) => state.isInstalling || state.isStarting)
      //    .map(([id, state]) => ({
      //       id,
      //       name: state.name || id,
      //       status: state.isInstalling ? 'installing' : 'starting'
      //    })) as AgentStatus[];
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
            <Box position="relative" cursor="pointer" onClick={onToggle}>
               <Image src={'icons/ic-bell.svg'} alt='bell' />
               <Badge
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  colorScheme="red"
                  borderRadius="full"
                  minW="18px"
                  textAlign="center"
               >
                  {pendingAgents?.length}
               </Badge>
            </Box>
         </PopoverTrigger>
         <PopoverContent width="300px">
            <PopoverHeader fontWeight="semibold">
          Agents in Progress
            </PopoverHeader>
            <PopoverBody maxH="300px" overflowY="auto">
               <VStack spacing={2} align="stretch">
                  {pendingAgents?.map((agent: any) => (
                     <Box
                        key={agent?.id}
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: 'gray.50' }}
                     >
                        <Text fontWeight="medium">{agent.name}</Text>
                        <Text fontSize="sm" color="gray.600">
                  Status: {agent?.status}
                        </Text>
                     </Box>
                  ))}
               </VStack>
            </PopoverBody>
         </PopoverContent>
      </Popover>
   );
};

export default AgentNotification; 
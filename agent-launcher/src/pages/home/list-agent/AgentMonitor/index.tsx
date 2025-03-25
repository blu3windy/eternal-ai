import {
   Flex,
   Image,
   Popover,
   PopoverBody,
   PopoverContent,
   PopoverTrigger,
   useDisclosure
} from '@chakra-ui/react';
import React from 'react';
import s from './styles.module.scss';

const AgentMonitor: React.FC = () => {
   const { isOpen, onToggle, onClose } = useDisclosure();

   return (
      <Popover
         isOpen={isOpen}
         onClose={onClose}
         placement="bottom-end"
      >
         <PopoverTrigger>
            <Flex position="relative" cursor="pointer" onClick={onToggle} bg={"#FFF"} borderRadius={"100px"} p="6px 10px" gap="4px">
               <Image src={'icons/ic-bell.svg'} alt='bell' />
            </Flex>
         </PopoverTrigger>
         <PopoverContent>
            <PopoverBody maxH="600px" overflowY="auto">
               
            </PopoverBody>
         </PopoverContent>
      </Popover>
   );
};

export default AgentMonitor; 
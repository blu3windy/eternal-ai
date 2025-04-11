import {
   Box,
   Flex,
   Image,
   Tabs,
   TabList,
   TabPanels,
   Tab,
   TabPanel,
} from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import BottomBar from './BottomBar/index.tsx';
import SearchModal from './SearchModal/index.tsx';
import s from './styles.module.scss';
import YourSwarm from './YourSwarm/index.tsx';
import { requestReloadListAgent } from '@stores/states/common/reducer.ts';
import AgentStore from './AgentStore/index.tsx';

const AgentsList = () => {
   const refInput = useRef<HTMLInputElement | null>(null);
   const dispatch = useDispatch();
  
   const [isSearchMode, setIsSearchMode] = useState(false);
   const refAddAgentTestCA = useRef('')

   const renderSearch = () => {
      return (
         <Flex flex={1} gap={'24px'} alignItems={'center'}>
            <Flex
               flex={1}
               position="relative"
               className={s.searchInput}
               onClick={() => refInput?.current?.focus()}
            >
               <Image
                  ml={'16px'}
                  width="20px"
                  src="icons/ic-search.svg"
                  onClick={() => refInput?.current?.focus()}
               />
               <input
                  placeholder={'Search agents'}
                  ref={refInput as any}
                  autoFocus={false}
                  onFocus={() => {
                     if(!isSearchMode) {
                        setIsSearchMode(true);
                     }
                  }}
               />
            </Flex>
         </Flex>
      );
   };

   return (
      <AnimatePresence>
         <Box className={s.container} position={'relative'} display={'flex'} dir={'column'} pos={'relative'}>
            {!isSearchMode && (
               <Flex
                  direction={"column"}
                  w="100%"
                  p={"24px"}
               >
                  <Flex
                     flexDirection="column"
                     justifyContent="flex-start"
                     gap="16px"
                  >
                     {renderSearch()}
                  </Flex>
               </Flex>
            )}
            <Tabs variant="unstyled">
               <TabList
                  borderRadius="full"
                  justifyContent="center"
                  px={'20px'}
                  gap={'12px'}
                  >
                  <Tab
                     _selected={{
                        border: "1px solid black",
                        fontWeight: "600",
                        color: "black",
                     }}
                     borderRadius="full"
                     color="gray.500"
                     fontSize='13px'
                     w="100%"
                     bg="white"
                     border="1px solid transparent"
                  >
                     Your Swarm
                  </Tab>
                  <Tab
                     _selected={{
                        border: "1px solid black",
                        fontWeight: "600",
                        color: "black",
                     }}
                     borderRadius="full"
                     color="gray.500"
                     fontSize='13px'
                     w="100%"
                     bg="white"
                     border="1px solid transparent"
                  >
                     Agent Store
                  </Tab>
                  </TabList>
                  <TabPanels mt={'20px'}>
                     <TabPanel p={0}>
                        <YourSwarm refAddAgentTestCA={refAddAgentTestCA} />
                     </TabPanel>
                     <TabPanel p={0}>
                        <AgentStore />
                     </TabPanel>
                  </TabPanels>
            </Tabs>
            <SearchModal isOpen={isSearchMode} onClickClose={() => setIsSearchMode(false)} />

            <BottomBar onAddAgentSuccess={(address: string) => {
               refAddAgentTestCA.current = address;
               dispatch(requestReloadListAgent());
            }} />
         </Box>
      </AnimatePresence>
   );
};

export default AgentsList;

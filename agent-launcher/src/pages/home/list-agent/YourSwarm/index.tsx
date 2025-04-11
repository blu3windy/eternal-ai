import {
   Box,
   Grid,
   GridItem,
   Text,
   VStack
} from '@chakra-ui/react';
import installAgentStorage from '@storage/InstallAgentStorage.ts';
import { commonSelector } from '@stores/states/common/selector.ts';
import { compareString } from '@utils/string.ts';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import uniqBy from 'lodash.uniqby';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import AppLoading from "../../../../components/AppLoading";
import CAgentTokenAPI from "../../../../services/api/agents-token";
import { IAgentToken } from "../../../../services/api/agents-token/interface.ts";
import { AgentContext } from "../../provider/AgentContext.tsx";
import AgentItem from '../AgentItem';
import {
   AgentType,
   FilterOption,
   SortOption
} from '../constants';
import s from './styles.module.scss';

const YourSwarm = (props: any) => {
   const [filter, setFilter] = useState<FilterOption>(FilterOption.Installed);
   const [loaded, setLoaded] = useState(false);
   const refLoading = useRef(false);

   const [agents, setAgents] = useState<IAgentToken[]>([]);

   const { needReloadList, needReloadRecentAgents } = useSelector(commonSelector);

   const {
      setSelectedAgent,
      selectedAgent,
      installedAgentIds,
      installAgent,
   } = useContext(AgentContext);

   const refParams = useRef({
      page: 1,
      limit: 25,
      sort: SortOption.Installed,
      category: 0,
      filter,
      search: '',
   });

   const cPumpAPI = new CAgentTokenAPI();

   const [hasMore, setHasMore] = useState(true);

   const getTokens = async (isNew: boolean, isNoLoading?: boolean) => {
      if (refLoading.current) return;
      try {
         if (!isNoLoading) {
            setLoaded(false);
            if (isNew) {
               setAgents([]);
               setHasMore(true);
            }
            refLoading.current = true;
         }

         refParams.current = {
            ...refParams.current,
            page: isNew ? 1 : refParams.current.page + 1,
         };

         const params: any = {
            page: refParams.current.page,
            limit: refParams.current.limit,
            sort_col: refParams.current.sort,
            search: refParams.current.search,
            chain: '',
         };

         params.agent_types = [AgentType.Model, AgentType.ModelOnline, AgentType.CustomUI, AgentType.CustomPrompt].join(',');

         const installIds = await installAgentStorage.getAgentIds();
         const allInstalledIds = installIds;

         if (allInstalledIds.length > 0) {
            params.ids = allInstalledIds.join(',');
         }

         const { agents: newTokens } = await cPumpAPI.getAgentTokenList(params, (data) => {
            if (isNew) {
               setAgents(data.agents);
            } else {
               setAgents((prevTokens) =>
                  uniqBy([...prevTokens, ...data.agents], (token) => token.id),
               );
            }
            
            setHasMore(data.agents.length === refParams.current.limit);
            
            refLoading.current = false;
            setLoaded(true);
         });

         if (isNew) {
            setAgents(newTokens);
            if ((!selectedAgent && newTokens.length > 0) || props.refAddAgentTestCA.current) {
               const testAgent = newTokens.find((token) => compareString(props.refAddAgentTestCA.current, token.agent_contract_address));
               if (testAgent) {
                  props.refAddAgentTestCA.current = '';
                  setSelectedAgent(testAgent);
                  installAgent(testAgent, true);
               } else {
                  setSelectedAgent(newTokens[0]);
               }
            }
         } else {
            setAgents((prevTokens) =>
               uniqBy([...prevTokens, ...newTokens], (token) => token.id),
            );
         }

         setHasMore(newTokens.length === refParams.current.limit);

      } catch (error) {
         console.error('Error fetching tokens:', error);
         setHasMore(false);
      } finally {
         refLoading.current = false;
         setLoaded(true);
      }
   };

   const throttleGetTokens = useCallback(throttle(getTokens, 500), [installedAgentIds]);
   const debounceGetTokens = useCallback(debounce(getTokens, 500), [installedAgentIds]);

   useEffect(() => {
      throttleGetTokens(true, true);
   }, [needReloadList]);

   useEffect(() => {
      if (needReloadRecentAgents) {
         if (selectedAgent && agents.length > 0) {
            const selectedAgentIndex = agents.findIndex(agent => agent.id === selectedAgent.id);
            if (selectedAgentIndex > 0) {
               const reorderedAgents = [...agents];
               const [selectedAgentItem] = reorderedAgents.splice(selectedAgentIndex, 1);
               reorderedAgents.unshift(selectedAgentItem);
               setAgents(reorderedAgents);
            }
         }
      }
   }, [needReloadRecentAgents]);

   return (
      <Box id="agent-list-scroll-your" className={s.listContainer}>
         <InfiniteScroll
            key={agents?.length}
            dataLength={agents?.length}
            next={() => {
               console.log('next hasMore', hasMore);
               if (hasMore) {
                  debounceGetTokens(false);
               }
            }}
            hasMore={hasMore}
            loader={<AppLoading />}
            scrollableTarget="agent-list-scroll-your"
         >
            <Grid
               w="100%"
               templateColumns={"1fr"}
               gridRowGap={"8px"}
               overflow={'hidden !important'}
            >
               {!loaded && (
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.5 }}
                     style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: "fit-content",
                        height: "fit-content",
                        marginLeft: "auto",
                        marginRight: "auto",
                     }}
                  >
                     <AppLoading />
                  </motion.div>
               )}
               {agents?.map((item: IAgentToken, i) => (
                  <GridItem key={item.id}>
                     <AgentItem token={item} />
                  </GridItem>
               ))}
               {filter === FilterOption.Installed && loaded && agents.length === 0 && (
                  <VStack
                     height="full"
                     justify="center"
                     spacing={3}
                     p={4}
                     textAlign="center"
                  >
                     <Text fontSize="lg" fontWeight="bold">
                        No agents installed?
                     </Text>
                     <Text>
                        Browse <Text as="span" onClick={() => { setFilter(FilterOption.All) }} color="#5400FB" cursor="pointer">the agent store</Text>  to discover <br /> and install useful agents.
                     </Text>
                  </VStack>
               )}
            </Grid>
         </InfiniteScroll>
      </Box>
   );
};

export default YourSwarm;

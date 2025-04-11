import {
   Box,
   Button,
   Divider,
   Flex,
   Grid,
   GridItem,
   Image,
   Popover,
   PopoverContent,
   PopoverTrigger,
   Text,
   useDisclosure
} from '@chakra-ui/react';
import { AgentContext } from '@pages/home/provider/AgentContext.tsx';
import { IAgentToken } from '@services/api/agents-token/interface.ts';
import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import uniqBy from 'lodash.uniqby';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import AppLoading from "../../../../components/AppLoading";
import CAgentTokenAPI from "../../../../services/api/agents-token";
import AgentItem from '../AgentItem';
import {
   AgentType,
   SortBy,
   SortOption
} from '../constants';
import s from './styles.module.scss';

interface SearchModalProps {
   isOpen: boolean;
   onClickClose: () => void;
}

const SearchModal = (props: SearchModalProps) => {
   const refInput = useRef<HTMLInputElement | null>(null);

   const [sort, setSort] = useState<SortOption>(SortOption.Installed);
   const [loaded, setLoaded] = useState(false);
   const refLoading = useRef(false);

   const [agents, setAgents] = useState<IAgentToken[]>([]);

   const {
      installedAgentIds,
      agentCategories
   } = useContext(AgentContext);

   const refParams = useRef({
      page: 1,
      limit: 10,
      sort,
      category: 0,
      search: '',
   });

   const { isOpen: isOpenFilter, onClose: onCloseFilter, onToggle: onToggleFilter } = useDisclosure();
   const { isOpen: isOpenSort, onClose: onCloseSort, onToggle: onToggleSort } = useDisclosure();

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

         if (refParams.current.category === 0) {
            params.category_ids = '';
         } else {
            params.category_ids = refParams.current.category;
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

   const onSearch = (searchText: string) => {
      refParams.current = {
         ...refParams.current,
         search: searchText,
      };
      debounceGetTokens(true);
   };

   useEffect(() => {
      throttleGetTokens(true, true);
   }, []);

   const renderSearch = () => {
      return (
         <Flex flex={1} gap={'24px'} alignItems={'center'}>
            <Image
               src="icons/ic-arrow-left.svg"
               w="16px"
               h="16px"
               cursor={'pointer'}
               onClick={() => {
                  if (refInput?.current) {
                     refInput.current.value = '';
                     refParams.current = {
                        ...refParams.current,
                        search: '',
                     };
                     debounceGetTokens(true);
                  }
                  props.onClickClose();
               }}
            />
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
                  onChange={(event) => {
                     onSearch(event.target.value);
                  }}
               />

               {refInput?.current?.value && refInput.current.value.length > 0 && (
                  <Flex
                     cursor="pointer"
                     position="absolute"
                     top="0"
                     bottom="0"
                     right="16px"
                     marginTop="auto"
                     marginBottom="auto"
                     justifyContent="center"
                     alignItems="center"
                  >
                     <Image
                        width="20px"
                        src="icons/ic_search_close.svg"
                        onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           if (refInput?.current) {
                              refInput.current.value = '';
                              refParams.current = {
                                 ...refParams.current,
                                 search: '',
                              };
                              debounceGetTokens(true);
                           }
                        }}
                     />
                  </Flex>
               )}
            </Flex>
         </Flex>
      );
   };

   const renderCategoryMenu = () => {
      return (
         <Flex
            flex={1}
            flexDirection={'row'}
            className={s.select}
            alignItems={'center'}
         >
            <Text
               fontSize={'14px'}
               opacity={'0.7'}
               fontWeight={'400'}
               whiteSpace={"nowrap"}
            >
               Category
            </Text>
            <Popover styleConfig={{ width: "100%" }} placement="bottom-end" isOpen={isOpenFilter} onClose={onCloseFilter}>
               <PopoverTrigger>
                  <Box
                     className={s.btnTokenSetup}
                     as={Button}
                     onClick={onToggleFilter}
                  >
                     <Text fontSize={'14px'} fontWeight={500} maxW={"100px"} textOverflow={"ellipsis"} overflow={"hidden"} whiteSpace={"nowrap"}>
                        {agentCategories.find(s => s.id === refParams?.current?.category)?.name}
                     </Text>
                     <Image
                        src={'icons/ic-angle-down.svg'}
                        alt={'add'}
                     />
                  </Box>
               </PopoverTrigger>
               <PopoverContent
                  width={'100%'}
                  className={s.menuTokenSetup}
                  border={'1px solid #E5E7EB'}
                  boxShadow={'0px 0px 24px -6px #0000001F'}
                  borderRadius={'16px'}
                  background={'#fff'}
               >
                  {agentCategories.map((option, index) => (
                     <>
                        <Flex
                           direction={"column"}
                           gap={'4px'}
                           padding={'16px 16px'}
                           _hover={{
                              bg: '#5400FB0F',
                           }}
                           cursor="pointer"
                           onClick={(e) => {
                              const _category = option.id;
                              refParams.current.category = _category;
                              debounceGetTokens(true);
                              onCloseFilter();
                           }}
                        >
                           <Text fontSize={'13px'} fontWeight={500}>
                              {option.name}
                           </Text>
                        </Flex>
                        {index < SortBy.length && (
                           <Divider orientation={'horizontal'} my={'0px'} />
                        )}
                     </>
                  ))}
               </PopoverContent>
            </Popover>
         </Flex>
      )
   };

   const renderSortMenu = () => {
      return (
         <Flex
            flex={1}
            flexDirection={'row'}
            className={s.select}
            alignItems={'center'}
         >
            <Text
               fontSize={'14px'}
               opacity={'0.7'}
               fontWeight={'400'}
               whiteSpace={"nowrap"}
            >
               Sort by
            </Text>
            <Popover styleConfig={{ width: "100%" }} placement="bottom-end" isOpen={isOpenSort} onClose={onCloseSort}>
               <PopoverTrigger>
                  <Box
                     className={s.btnTokenSetup}
                     as={Button}
                     onClick={onToggleSort}
                  >
                     <Text fontSize={'14px'} fontWeight={500}>
                        {SortBy.find(s => s.value === sort)?.label}
                     </Text>
                     <Image
                        src={'icons/ic-angle-down.svg'}
                        alt={'add'}
                     />
                  </Box>
               </PopoverTrigger>
               <PopoverContent
                  width={'100%'}
                  className={s.menuTokenSetup}
                  border={'1px solid #E5E7EB'}
                  boxShadow={'0px 0px 24px -6px #0000001F'}
                  borderRadius={'16px'}
                  background={'#fff'}
               >
                  {SortBy.map((option, index) => (
                     <>
                        <Flex
                           gap={'12px'}
                           alignItems={'center'}
                           padding={'16px 16px'}
                           _hover={{
                              bg: '#5400FB0F',
                           }}
                           cursor="pointer"
                           onClick={(e) => {
                              const sort = option.value as SortOption;
                              setSort(sort);
                              refParams.current = {
                                 ...refParams.current,
                                 sort: sort,
                              };
                              throttleGetTokens(true);
                              onCloseSort();
                           }}
                        >
                           <Text fontSize={'13px'} fontWeight={500}>
                              {option.label}
                           </Text>
                        </Flex>
                        {index < SortBy.length - 1 && (
                           <Divider orientation={'horizontal'} my={'0px'} />
                        )}
                     </>
                  ))}
               </PopoverContent>
            </Popover>
         </Flex>
      )
   };

   const renderSearchResults = () => {
      return (
         <Box id="agent-list-scroll" className={s.listContainer}>
            <InfiniteScroll
               key={agents?.length}
               dataLength={agents?.length}
               next={() => {
                  if (hasMore) {
                     debounceGetTokens(false);
                  }
               }}
               hasMore={hasMore}
               loader={<AppLoading />}
               scrollableTarget="agent-list-scroll"
            >
               <Grid
                  w="100%"
                  templateColumns={"1fr"}
                  gridRowGap={"8px"}
                  overflow={'hidden !important'}
               >
                  <AnimatePresence>
                     {!loaded && (
                        <motion.div
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.3 }}
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
                  </AnimatePresence>
                  {agents?.map((item: IAgentToken) => (
                     <GridItem key={`${item.id}-search`}>
                        <AgentItem token={item} />
                     </GridItem>
                  ))}
               </Grid>
            </InfiniteScroll>
         </Box>
      );
   };

   return (
      <Flex bg={'#EDEDF2'} direction={"column"} pos={'absolute'} top={0} bottom={0} left={0} right={0} zIndex={props.isOpen ? 1 : -1}>
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
         <Box>
            <Flex p="0 24px 20px" gap="24px">
               {renderCategoryMenu()}
               <Box w="1px" h="20px" bg="#000" opacity="0.2" margin={"auto 0"} />
               {renderSortMenu()}
            </Flex>
            {renderSearchResults()}
         </Box>
      </Flex>
   );
};

export default SearchModal;

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
   SimpleGrid,
   Text,
   useDisclosure
} from '@chakra-ui/react';
import s from './styles.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import AgentItem from './AgentItem';
import AppLoading from "../../../components/AppLoading";
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import throttle from 'lodash.throttle';
import { IAgentToken } from "../../../services/api/agents-token/interface.ts";
import debounce from 'lodash.debounce';
import { AgentContext } from "../provider";
import uniqBy from 'lodash.uniqby';
import CAgentTokenAPI from "../../../services/api/agents-token";

export enum SortOption {
  MarketCap = 'meme_market_cap',
  Percent = 'meme_percent',
  LastReply = 'reply_latest_time',
  Price = 'meme_price',
  Volume24h = 'meme_volume_last24h',
  CreatedAt = 'created_at',
}

export const SortBy = [
   { value: SortOption.MarketCap, label: 'Market cap' },
   { value: SortOption.Percent, label: '24h%' },
   { value: SortOption.CreatedAt, label: 'Creation time' },
   { value: SortOption.Volume24h, label: '24h volume' },
];

export enum FilterOption {
  Poppular = 'poppular',
  Model = 'model',
  NonModel = 'non-model',
  Installed = 'Installed',
  NonInstalled = 'non-installed',
}

export const FilterBy = [
   { value: FilterOption.Poppular, label: 'Popular' },
   { value: FilterOption.Model, label: 'Model' },
   { value: FilterOption.NonModel, label: 'Non-model' },
   { value: FilterOption.Installed, label: 'Installed' },
   { value: FilterOption.NonInstalled, label: 'Non-installed' },
];

export enum AgentType {
  Normal = 0,
  Reasoning = 1,
  KnowledgeBase = 2,
  Eliza = 3,
  Zerepy = 4,
  Utility = 5,
  RealWorld = 6,
}

export const AgentTypeName = {
   [AgentType.Normal]: 'Normal',
   [AgentType.Reasoning]: 'Reasoning',
   [AgentType.KnowledgeBase]: 'Knowledge',
   [AgentType.Eliza]: 'Eliza',
   [AgentType.Zerepy]: 'Zerepy',
   [AgentType.Utility]: 'Utility',
   [AgentType.RealWorld]: 'Real-World',
}

const AgentsList = () => {
   const refInput = useRef<HTMLInputElement | null>(null);

   const [sort, setSort] = useState<SortOption>(SortOption.CreatedAt);
   const [filter, setFilter] = useState<FilterOption>(FilterOption.Poppular);
   const [loaded, setLoaded] = useState(false);
   const refLoading = useRef(false);

   const [agents, setAgents] = useState<IAgentToken[]>([]);

   const { setSelectedAgent } = useContext(AgentContext);

   const refParams = useRef({
      page: 1,
      limit: 30,
      sort,
      filter,
      // order: OrderOption.Desc,
      search: '',
   });

   const { isOpen: isOpenFilter, onClose: onCloseFilter, onToggle: onToggleFilter } = useDisclosure();
   const { isOpen: isOpenSort, onClose: onCloseSort, onToggle: onToggleSort } = useDisclosure();

   const cPumpAPI = new CAgentTokenAPI();

   const getTokens = async (isNew: boolean) => {
      if (refLoading.current) return;
      try {
         setLoaded(false);
         if (isNew) {
            setAgents([]);
         }

         refLoading.current = true;
         refParams.current = {
            ...refParams.current,
            page: isNew ? 1 : refParams.current.page + 1,
         };

         const { agents: newTokens } = await cPumpAPI.getAgentTokenList({
            page: refParams.current.page,
            limit: refParams.current.limit,
            sort_col: refParams.current.sort,
            search: refParams.current.search,
            filter_col: refParams.current.filter,
            chain: ''
         });

         if (isNew) {
            setAgents(newTokens);
            setSelectedAgent(newTokens[0]);
         } else {
            setAgents((prevTokens) =>
               uniqBy([...prevTokens, ...newTokens], (token) => token.id),
            );
         }
      } catch (error) {
      } finally {
         refLoading.current = false;
         setLoaded(true);
      }
   };

   const throttleGetTokens = useCallback(throttle(getTokens, 500), []);
   const debounceGetTokens = useCallback(debounce(getTokens, 500), []);

   const onSearch = (searchText: string) => {
      refParams.current = {
         ...refParams.current,
         search: searchText,
      };
      debounceGetTokens(true);
   };

   useEffect(() => {
      throttleGetTokens(true);
   }, []);

   const renderSearch = () => {
      return (
         <Flex
            flex={1}
            position="relative"
            className={s.searchInput}
            onClick={() => refInput?.current?.focus()}
         >
            <Image
               ml={'16px'}
               width="20px"
               src="/icons/ic-search.svg"
               onClick={() => refInput?.current?.focus()}
            />
            <input
               placeholder={'Search agents'}
               ref={refInput as any}
               autoFocus
               onChange={(event) => {
                  onSearch(event.target.value);
               }}
            />
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
               {!!refParams.current?.search && (
                  <Image
                     width="12px"
                     src="/icons/ic_search_close.svg"
                     onClick={() => {
                        if (refInput?.current?.value) {
                           refInput.current.value = '';
                           refParams.current = {
                              ...refParams.current,
                              search: '',
                           };
                           debounceGetTokens(true);
                           refInput?.current?.focus();
                        }
                     }}
                  />
               )}
            </Flex>
         </Flex>
      );
   };

   const renderFilterMenu = () => {
      return (
         <Flex
            mt={"24px"}
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
          Filter by
            </Text>
            <Popover w={"100%"} placement="bottom-end" isOpen={isOpenFilter} onClose={onCloseFilter}>
               <PopoverTrigger>
                  <Box
                     className={s.btnTokenSetup}
                     as={Button}
                     onClick={onToggleFilter}
                  >
                     <Text fontSize={'14px'} fontWeight={500}>
                        {FilterBy.find(s => s.value === filter)?.label}
                     </Text>
                     <Image
                        src={'/icons/ic-angle-down.svg'}
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
                  {FilterBy.map((option, index) => (
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
                              const filter = option.value as FilterOption;
                              setFilter(filter);
                              refParams.current = {
                                 ...refParams.current,
                                 filter: filter,
                              };
                              throttleGetTokens(true);
                              onCloseFilter();
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

   const renderSortMenu = () => {
      return (
         <Flex
            mt={"24px"}
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
            <Popover w={"100%"} placement="bottom-end" isOpen={isOpenSort} onClose={onCloseSort}>
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
                        src={'/icons/ic-angle-down.svg'}
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

   return (
      <Box className={s.container}>
         <Flex
            direction={"column"}
            w="100%"
         >
            <Flex
               flexDirection="column"
               justifyContent="flex-start"
               gap="16px"
               w={{ base: '50vw', lg: 'calc(100% - 16px)' }}
            >
               {renderSearch()}
            </Flex>
            <SimpleGrid columns={2} gap={"12px"}>
               {renderFilterMenu()}
               {renderSortMenu()}
            </SimpleGrid>
         </Flex>
         <Box h={'24px'} />

         <InfiniteScroll
            className={s.listContainer}
            key={agents?.length}
            dataLength={agents?.length}
            next={() => {
               debounceGetTokens(false);
            }}
            hasMore
            loader={<></>}
         >
            {!loaded && <AppLoading />}
            <Grid
               w="100%"
               templateColumns={"1fr"}
               gridRowGap={"8px"}
               overflow={'hidden !important'}
            >
               {agents.map((item: IAgentToken, i) => (
                  <GridItem key={item.id}>
                     <AgentItem token={item} />
                  </GridItem>
               ))}
            </Grid>
         </InfiniteScroll>
      </Box>
   );
};

export default AgentsList;

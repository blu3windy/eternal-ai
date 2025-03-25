import {
   Box,
   Button,
   Center,
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
   useDisclosure,
   VStack
} from '@chakra-ui/react';
import cx from 'clsx';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import uniqBy from 'lodash.uniqby';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import AppLoading from "../../../components/AppLoading";
import CAgentTokenAPI from "../../../services/api/agents-token";
import { IAgentToken } from "../../../services/api/agents-token/interface.ts";
import { AgentContext } from "../provider";
import AgentItem from './AgentItem';
import AgentNotification from './AgentNotification/index.tsx';
import BaseModal from '@components/BaseModal/index.tsx';
import AddTestAgent from './AddTestAgent/index.tsx';
import { compareString } from '@utils/string.ts';
import s from './styles.module.scss';

export enum SortOption {
  MarketCap = 'meme_market_cap',
  Percent = 'meme_percent',
  LastReply = 'reply_latest_time',
  Price = 'meme_price',
  Volume24h = 'meme_volume_last24h',
  CreatedAt = 'created_at',
  Popuplar = 'prompt_calls',
}

export const SortBy = [
   { value: SortOption.MarketCap, label: 'Market cap' },
   { value: SortOption.Percent, label: '24h%' },
   { value: SortOption.CreatedAt, label: 'Creation time' },
   { value: SortOption.Volume24h, label: '24h volume' },
   { value: SortOption.Popuplar, label: 'Popular' },
];

export enum CategoryOption {
   All = 'all',
  Model = 'model',
  Utility = 'non-model',
  Infra = 'infra',
  Character = 'character',
}

export enum FilterOption {
   All = 'all',
   Installed = 'installed',
}

export const Category = [
   { value: FilterOption.All, label: 'All', description: 'All available agents.' },
   { value: CategoryOption.Character, label: 'Character', description: 'Agents with unique personalities, offering engaging chat experiences and interactions.' },
   { value: CategoryOption.Model, label: 'Model', description: 'Agents providing direct access to specific AI models (LLaMA, DeepSeek, Hermes,…).' },
   { value: CategoryOption.Utility, label: 'Utility', description: 'Task-focused agents built with Python or JavaScript.' },
   { value: CategoryOption.Infra, label: 'Infra', description: 'Agents providing APIs or services to customize and manage other agents.' },
   // { value: FilterOption.Installed, label: 'Installed', description: 'Agents currently installed.' },
   // { value: FilterOption.NonInstalled, label: 'Available', description: 'Agents available for installation.' },
];

export const AgentOptions = [
   { value: FilterOption.Installed, label: 'Your Agent', description: 'Agents currently installed.', icon: undefined },
   { value: FilterOption.All, label: 'Store Agent', description: 'All available agents.', icon: 'icons/ic-store-agent.svg' },
   // { value: FilterOption.NonInstalled, label: 'Recommend', description: 'Recommend', icon: undefined },
]

export enum AgentType {
   All = -1,
  Normal = 0,
  Reasoning = 1,
  KnowledgeBase = 2,
  Eliza = 3,
  Zerepy = 4,
  UtilityJS = 6,
  UtilityPython = 7,
  Model = 5,
  Infra = 8,
  CustomUI = 10,
  CustomPrompt = 11,
  ModelOnline = 12,
}

export const AgentTypeName = {
   [AgentType.Normal]: 'Normal',
   [AgentType.Reasoning]: 'Reasoning',
   [AgentType.KnowledgeBase]: 'Knowledge',
   [AgentType.Eliza]: 'Eliza',
   [AgentType.Zerepy]: 'Zerepy',
   [AgentType.UtilityJS]: 'Utility JS',
   [AgentType.UtilityPython]: 'Utility Python',
   [AgentType.Infra]: 'Infra',
}

const CATEGORIES = [
   // {
   //    id: CategoryOption.Character,
   //    name: 'Character',
   //    description: 'Social and chat agents',
   //    gradient: 'linear-gradient(270deg, #F38F1A 0%, #8D530F 100%)',
   //    icon: 'icons/ic-category-character.svg'
   // },
   {
      id: CategoryOption.Model,
      name: 'Model',
      description: 'AI model agents',
      gradient: 'linear-gradient(270deg, #EF3B2F 0%, #89221B 100%)',
      icon: 'icons/ic-category-model.svg'
   },
   {
      id: CategoryOption.Utility,
      name: 'Utility',
      description: 'Tool and utility agents',
      gradient: 'linear-gradient(270deg, #A94FD4 0%, #58296E 100%)',
      icon: 'icons/ic-category-utility.svg'
   },
   {
      id: CategoryOption.Infra,
      name: 'Infra',
      description: 'Infrastructure agents',
      gradient: 'linear-gradient(270deg, #3FBF5A 0%, #1D592A 100%)',
      icon: 'icons/ic-category-infra.svg'
   }
];

const AgentsList = () => {
   const refInput = useRef<HTMLInputElement | null>(null);

   const {
      isOpen,
      onOpen,
      onClose
   } = useDisclosure();

   const [sort, setSort] = useState<SortOption>(SortOption.CreatedAt);
   const [filter, setFilter] = useState<FilterOption>(FilterOption.Installed);
   const [category, setCategory] = useState<CategoryOption>(CategoryOption.All);
   const [loaded, setLoaded] = useState(false);
   const refLoading = useRef(false);
   const [showCategoryList, setShowCategoryList] = useState(true);

   const [agents, setAgents] = useState<IAgentToken[]>([]);
   const [latestAgent, setLatestAgent] = useState<IAgentToken | null>(null);
   const refLatestInterval = useRef<any>(null);

   const { setSelectedAgent, selectedAgent, isSearchMode, setIsSearchMode } = useContext(AgentContext);

   const refParams = useRef({
      page: 1,
      limit: 50,
      sort,
      category,
      filter,
      // order: OrderOption.Desc,
      search: '',
   });
   const refAddAgentTestCA = useRef('')

   const { isOpen: isOpenFilter, onClose: onCloseFilter, onToggle: onToggleFilter } = useDisclosure();
   const { isOpen: isOpenSort, onClose: onCloseSort, onToggle: onToggleSort } = useDisclosure();

   const cPumpAPI = new CAgentTokenAPI();

   useEffect(() => {
      getLatestAgent();
      refLatestInterval.current = setInterval(() => {
         getLatestAgent();
      }, 30000);

      return () => {
         if (refLatestInterval.current) {
            clearInterval(refLatestInterval.current);
         }
      };
   }, []);

   const getLatestAgent = async () => {
      try {
         const params: any = {
            page: 1,
            limit: 1,
            sort_col: SortOption.CreatedAt,
            sort_type: 'desc',
            chain: '',
            agent_types: [
               AgentType.Model,
               AgentType.ModelOnline,
               AgentType.UtilityJS,
               AgentType.UtilityPython,
               AgentType.CustomUI,
               AgentType.CustomPrompt,
               AgentType.Infra
            ].join(','),
         };

         const { agents } = await cPumpAPI.getAgentTokenList(params);
         if (agents && agents.length > 0) {
            const agent = agents[0];
            if (!latestAgent || agent.id !== latestAgent.id) {
               setLatestAgent(agent);
            }
         }
      } catch (error) {
         console.error('Error fetching latest agent:', error);
      }
   };

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

         const params: any = {
            page: refParams.current.page,
            limit: refParams.current.limit,
            sort_col: refParams.current.sort,
            search: refParams.current.search,
            chain: '',
         };

         if (refParams.current.category === CategoryOption.Character) {
            params.agent_types = [AgentType.Normal, AgentType.Reasoning, AgentType.KnowledgeBase, AgentType.Eliza, AgentType.Zerepy].join(',');
         } else if (refParams.current.category === CategoryOption.Model) {
            params.agent_types = [AgentType.Model, AgentType.ModelOnline].join(',');
         } else if (refParams.current.category === CategoryOption.Utility) {
            params.agent_types = [AgentType.UtilityJS, AgentType.UtilityPython, AgentType.CustomUI, AgentType.CustomPrompt].join(',');
         } else if (refParams.current.category === CategoryOption.Infra) {
            params.agent_types = [AgentType.Infra].join(',');
         } else {
            params.agent_types = [AgentType.Model, AgentType.ModelOnline, AgentType.CustomUI, AgentType.CustomPrompt, AgentType.Infra].join(','); 
         }

         if (FilterOption.Installed === refParams.current.filter) {
            params.installed = true;
         }

         const { agents: newTokens } = await cPumpAPI.getAgentTokenList(params);

         if (isNew) {
            setAgents(newTokens);
            if ((!selectedAgent && newTokens.length > 0) || refAddAgentTestCA.current) {
               const testAgent = newTokens.find((token) => compareString(refAddAgentTestCA.current, token.agent_contract_address));
               if (testAgent) {
                  setSelectedAgent(testAgent);
                  refAddAgentTestCA.current = '';
               } else {
                  setSelectedAgent(newTokens[0]);
               }
            }
         } else {
            setAgents((prevTokens) =>
               uniqBy([...prevTokens, ...newTokens], (token) => token.id),
            );
         }
      } catch (error) {
         console.error('Error fetching tokens:', error);
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
      if (searchText) {
         setShowCategoryList(false);
      } else {
         setShowCategoryList(true);
      }
      debounceGetTokens(true);
   };

   useEffect(() => {
      throttleGetTokens(true);
   }, []);

   const handleCategorySelect = (categoryOption: CategoryOption) => {
      setShowCategoryList(false);
      refParams.current = {
         ...refParams.current,
         category: categoryOption,
      };
      throttleGetTokens(true);
   };

   const handleBackToCategories = () => {
      setShowCategoryList(true);
      refParams.current = {
         ...refParams.current,
         category: CategoryOption.All,
      };
      // if (!refParams.current.search) {
      //    setIsSearchMode(false);
      // }
   };

   const renderSearchMode = () => {
      if (!isSearchMode) return null;

      if (!showCategoryList) {
         return renderSearchResults();
      }

      return (
         <Box p="24px">
            {latestAgent && (
               <Box mb="32px">
                  <Text fontSize="24px" fontWeight="600" mb="16px">New & Updates</Text>
                  <Box bg={'white'}  borderRadius={"8px"} overflow={"hidden"}>
                     <AgentItem token={latestAgent} isLatest={true} />
                  </Box>
               </Box>
            )}

            <Box>
               <Text fontSize="24px" fontWeight="600" mb="16px">Categories</Text>
               <SimpleGrid columns={1} spacing="16px">
                  {CATEGORIES.map((category) => (
                     <Flex
                        key={category.id}
                        className={s.categoryItem}
                        bg={category.gradient}
                        onClick={() => {
                           refParams.current.category = category.id;
                           setShowCategoryList(false);
                           debounceGetTokens(true);
                        }}
                     >
                        <Text fontSize="20px" fontWeight="500" color="#fff">
                           {category.name}
                        </Text>
                        <Image
                           src={category.icon}
                           className={s.categoryImage}
                        />
                     </Flex>
                  ))}
               </SimpleGrid>
            </Box>
         </Box>
      );
   };

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
               src="icons/ic-search.svg"
               onClick={() => refInput?.current?.focus()}
            />
            <input
               placeholder={'Search agents'}
               ref={refInput as any}
               autoFocus={false}
               // autoFocus
               onFocus={() => setIsSearchMode(true)}
               // onBlur={() => {
               //    // Delay hiding search mode to allow clicking category
               //    setTimeout(() => {
               //       if (!refParams.current.search) {
               //          setIsSearchMode(false);
               //       }
               //    }, 200);
               // }}
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
               {isSearchMode && (
                  <Image
                     width="20px"
                     src="icons/ic_search_close.svg"
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (refInput?.current) {
                           refInput.current.value = '';
                           refInput.current.blur();
                           refParams.current = {
                              ...refParams.current,
                              search: '',
                              category: CategoryOption.All,
                           };
                           setShowCategoryList(true);
                           setIsSearchMode(false);
                           debounceGetTokens(true);
                        }
                     }}
                  />
               )}
            </Flex>
         </Flex>
      );
   };

   const renderFilterOptions = () => {
      return (
         <Flex gap={'12px'} className={s.options} w={"100%"} alignItems={"center"}>
            {AgentOptions.map(option => {
               return (
                  <Flex
                     flex={1}
                     justifyContent={"center"}
                     alignItems={"center"}
                     gap={"4px"}
                     p={"2px 10px"}
                     h={"32px"}
                     key={option.value}
                     className={cx(s.option, filter === option.value ? s.isSelected : '')}
                     onClick={() => {
                        const _filter = option.value as FilterOption;
                        setFilter(_filter);
                        refParams.current = {
                           ...refParams.current,
                           filter: _filter,
                        };
                        throttleGetTokens(true);
                     }}>
                     {
                        option.icon && (
                           <Image
                              minW={"16px"}
                              width="16px"
                              src={option.icon}
                              alt={option.label}
                           />
                        )
                     }
                     <Text>{option.label}</Text>
                  </Flex>
               );
            })}
            <AgentNotification />
         </Flex>
      )
   }

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
                     <Text fontSize={'14px'} fontWeight={500}>
                        {Category.find(s => s.value === category)?.label}
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
                  {Category.map((option, index) => (
                     <>
                        <Flex
                           direction={"column"}
                           gap={'4px'}
                           // alignItems={'center'}
                           padding={'16px 16px'}
                           _hover={{
                              bg: '#5400FB0F',
                           }}
                           cursor="pointer"
                           onClick={(e) => {
                              const _category = option.value as CategoryOption;
                              handleCategorySelect(_category);
                              onCloseFilter();
                           }}
                        >
                           <Text fontSize={'13px'} fontWeight={500}>
                              {option.label}
                           </Text>
                           {
                              option.description && (
                                 <Text fontSize={'12px'} fontWeight={400} opacity={0.7}>
                                    {option.description}
                                 </Text>
                              )
                           }
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
         <Box>
            <Flex align="center" mb="20px" px="24px">
               <Button 
                  leftIcon={<Image src="icons/ic-arrow-left.svg" w="16px" h="16px" />}
                  variant="ghost"
                  onClick={handleBackToCategories}
                  fontSize={'20px'}
                  fontWeight={'500'}
                  p="0"
                  _hover={{
                     bg: 'transparent',
                  }}
               >
                  {refParams.current.category !== CategoryOption.All ? (
                     <>{Category.find(c => c.value === refParams.current.category)?.label}</>
                  ) : 'Back'}
               </Button>
            </Flex>

            <Grid
               w="100%"
               templateColumns={"1fr"}
               gridRowGap={"8px"}
               overflow={'hidden !important'}
            >
               {!loaded && <AppLoading />}
               {agents?.map((item: IAgentToken) => (
                  <GridItem key={item.id}>
                     <AgentItem token={item} />
                  </GridItem>
               ))}
               {loaded && agents.length === 0 && (
                  <Text textAlign="center" color="gray.500" mt="40px">
                     No agents found
                  </Text>
               )}
            </Grid>
         </Box>
      );
   };

   return (
      <Box className={s.container} position={'relative'}>
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
            {!isSearchMode && (
               <>
                  <Flex gap={"16px"} mt={"20px"} justifyContent={"space-between"}>
                     {renderFilterOptions()}
                  </Flex>
               </>
            )}
         </Flex>

         {isSearchMode ? (
            renderSearchMode()
         ) : (
            <>
               <Box h={'8px'} />
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
                  {loaded && agents.length === 0 ? (
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
                           Browse <Text as="span" onClick={() => {setFilter(FilterOption.All)}} color="#5400FB" cursor="pointer">the agent store</Text>  to discover <br /> and install useful agents.
                        </Text>
                     </VStack>
                  ) : (
                     <Grid
                        w="100%"
                        templateColumns={"1fr"}
                        gridRowGap={"8px"}
                        overflow={'hidden !important'}
                     >
                        {agents?.map((item: IAgentToken, i) => (
                           <GridItem key={item.id}>
                              <AgentItem token={item} />
                           </GridItem>
                        ))}
                     </Grid>
                  )}
               </InfiniteScroll>
            </>
         )}

         <Flex className={s.addTestBtn} onClick={onOpen}>
            <Center w={'100%'}>
               <Text textAlign={'center'}>+ Add agent</Text>
            </Center>
         </Flex>

         <BaseModal
            isShow={isOpen}
            onHide={() => {
               onClose();
               setIsSearchMode(false);
            }}
            size="small"
         >
            <AddTestAgent onAddAgentSuccess={(address: string) => {
               refAddAgentTestCA.current = address;
               onClose();
               setFilter(FilterOption.Installed);
               refParams.current = {
                  ...refParams.current,
                  filter: FilterOption.Installed,
               };
               throttleGetTokens(true);
               setIsSearchMode(false);
            }} />
         </BaseModal>
      </Box>
   );
};

export default AgentsList;

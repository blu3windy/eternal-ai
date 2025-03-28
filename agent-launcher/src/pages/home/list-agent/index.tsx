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
   Tab,
   TabList,
   Tabs,
   Text,
   useDisclosure,
   VStack
} from '@chakra-ui/react';
import BaseModal from '@components/BaseModal/index.tsx';
import IcHelp from '@components/InfoTooltip/IcHelp.tsx';
import { compareString } from '@utils/string.ts';
import cx from 'clsx';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import uniqBy from 'lodash.uniqby';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import AppLoading from "../../../components/AppLoading";
import CAgentTokenAPI from "../../../services/api/agents-token";
import { IAgentToken } from "../../../services/api/agents-token/interface.ts";
import { AgentContext } from "../provider/AgentContext.tsx";
import AddTestAgent from './AddTestAgent/index.tsx';
import AgentItem from './AgentItem';
import AgentMonitor from './AgentMonitor/index.tsx';
import {
   AgentOptions,
   AgentType,
   CATEGORIES,
   Category,
   CategoryOption,
   FilterOption,
   SortBy,
   SortOption
} from './constants';
import s from './styles.module.scss';
import BottomBar from './BottomBar/index.tsx';
import installAgentStorage from '@storage/InstallAgentStorage.ts';
import { commonSelector } from '@stores/states/common/selector.ts';
import { useSelector } from 'react-redux';


const AgentsList = () => {
   const refInput = useRef<HTMLInputElement | null>(null);

   const {
      isOpen,
      onOpen,
      onClose
   } = useDisclosure();

   const [sort, setSort] = useState<SortOption>(SortOption.CreatedAt);
   const [filter, setFilter] = useState<FilterOption>(FilterOption.Installed);
   const [loaded, setLoaded] = useState(false);
   const refLoading = useRef(false);

   const [agents, setAgents] = useState<IAgentToken[]>([]);
   const [latestAgent, setLatestAgent] = useState<IAgentToken | null>(null);
   const refLatestInterval = useRef<any>(null);

   const { needReloadList } = useSelector(commonSelector);

   const { 
      setSelectedAgent, 
      selectedAgent, 
      isSearchMode, 
      setIsSearchMode, 
      category, 
      setCategory,
      installedAgentIds,
      startAgent,
      installAgent
   } = useContext(AgentContext);

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

   useEffect(() => {
      refParams.current.category = category;
      debounceGetTokens(true);
   }, [category]);

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

         if (!isSearchMode) {
            const installIds = await installAgentStorage.getAgentIds();

            const allInstalledIds = [
               // ...installedAgentIds.utility,
               // ...installedAgentIds.model,
               // ...installedAgentIds.social,
               ...installIds
            ];

            if (FilterOption.Installed === refParams.current.filter) {
               // params.installed = true;
               if (allInstalledIds.length > 0) {
                  params.ids = allInstalledIds.join(',');
               }
            } else {
               if (allInstalledIds.length > 0) {
                  params.exlude_ids = allInstalledIds.join(',');
               }
            }
         }

         const { agents: newTokens } = await cPumpAPI.getAgentTokenList(params);

         if (isNew) {
            setAgents(newTokens);
            if ((!selectedAgent && newTokens.length > 0) || refAddAgentTestCA.current) {
               const testAgent = newTokens.find((token) => compareString(refAddAgentTestCA.current, token.agent_contract_address));
               if (testAgent) {
                  refAddAgentTestCA.current = '';
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
      } catch (error) {
         console.error('Error fetching tokens:', error);
      } finally {
         refLoading.current = false;
         setLoaded(true);
      }
   };

   const throttleGetTokens = useCallback(throttle(getTokens, 500), [isSearchMode, installedAgentIds]);
   const debounceGetTokens = useCallback(debounce(getTokens, 500), [isSearchMode, installedAgentIds]);

   const onSearch = (searchText: string) => {
      refParams.current = {
         ...refParams.current,
         search: searchText,
      };
      debounceGetTokens(true);
   };

   useEffect(() => {
      throttleGetTokens(true);
   }, [needReloadList]);

   const handleCategorySelect = (categoryOption: CategoryOption) => {
      refParams.current = {
         ...refParams.current,
         category: categoryOption,
      };
      throttleGetTokens(true);
   };

   const renderSearchMode = () => {
      if (!isSearchMode) return null;

      return (
         <Box>
            {/* {latestAgent && (
               <Box mb="32px">
                  <Text fontSize="24px" fontWeight="600" mb="16px">New & Updates</Text>
                  <Box bg={'white'}  borderRadius={"8px"} overflow={"hidden"}>
                     <AgentItem token={latestAgent} isLatest={true} />
                  </Box>
               </Box>
            )} */}

            <Tabs 
               className={s.tabContainer} 
               isFitted
               index={CATEGORIES.findIndex(c => c.id === category)}
               onChange={(index) => {
                  const selectedCategory = CATEGORIES[index];
                  setCategory(selectedCategory.id);
                  // refParams.current.category = selectedCategory.id;
                  // debounceGetTokens(true);
               }}
            >
               <TabList>
                  {CATEGORIES.map((cat) => (
                     <Tab 
                        key={cat.id}
                     >
                        <Text>{cat.name}</Text>
                        <Popover trigger="hover" placement="bottom">
                           <PopoverTrigger>
                              <Box 
                                 onClick={(e) => e.stopPropagation()}
                                 onMouseDown={(e) => e.stopPropagation()}
                              >
                                 <IcHelp color={'black'}/>
                              </Box>
                           </PopoverTrigger>
                           <PopoverContent 
                              width="300px" 
                              bg="white" 
                              border="1px solid #E5E7EB"
                              boxShadow="0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)"
                              borderRadius="8px"
                           >
                              <Box p="12px">
                                 <Text fontSize="14px" color="#1F2937">
                                    {cat.description}
                                 </Text>
                              </Box>
                           </PopoverContent>
                        </Popover>
                     </Tab>
                  ))}
               </TabList>
            </Tabs>
            {renderSearchResults()}
            {/* <Box>
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
            </Box> */}
         </Box>
      );
   };

   const renderSearch = () => {
      return (
         <Flex flex={1} gap={'24px'} alignItems={'center'}>
            {
               isSearchMode && (
                  <Image 
                     src="icons/ic-arrow-left.svg" 
                     w="16px" 
                     h="16px" 
                     cursor={'pointer'}
                     onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (refInput?.current) {
                           refInput.current.value = '';
                           refInput.current.blur();
                           refParams.current = {
                              ...refParams.current,
                              search: '',
                           };
                           setCategory(CategoryOption.All);
               
                           setIsSearchMode(false);
                        }
                     }}
                  />
               )
            }
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
                  onFocus={() => {
                     if (category === CategoryOption.All) {
                        setCategory(CategoryOption.Utility);
                     // refParams.current.category = category;
                     }
                  
                     setIsSearchMode(true);
                  // debounceGetTokens(true);
                  }}
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
                              // refInput.current.blur();
                              refParams.current = {
                                 ...refParams.current,
                                 search: '',
                              // category: CategoryOption.All,
                              };
                              // setCategory(CategoryOption.All);
                  
                              // setIsSearchMode(false);
                              debounceGetTokens(true);
                           }
                        }}
                     />
                  )}
               </Flex>
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
            {/* <AgentMonitor /> */}
            {/* <AgentNotification /> */}
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
         <>
            {/* <Flex align="center" mb="20px" px="24px">
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
            </Flex> */}
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
               </Grid>
            </InfiniteScroll>
         </>
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
                  <Grid
                     w="100%"
                     templateColumns={"1fr"}
                     gridRowGap={"8px"}
                     overflow={'hidden !important'}
                  >
                     {!loaded && <AppLoading />}
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
                     Browse <Text as="span" onClick={() => {setFilter(FilterOption.All)}} color="#5400FB" cursor="pointer">the agent store</Text>  to discover <br /> and install useful agents.
                           </Text>
                        </VStack>
                     )}
                  </Grid>
               </InfiniteScroll>
            </>
         )}

         <BottomBar  onAddAgentSuccess={(address: string) => {
            refAddAgentTestCA.current = address;
            onClose();
            setFilter(FilterOption.Installed);
            refParams.current = {
               ...refParams.current,
               filter: FilterOption.Installed,
            };
            throttleGetTokens(true);
            setIsSearchMode(false);
         }}  />

         {/* <Flex className={s.addTestBtn} onClick={onOpen}>
            <Center w={'100%'}>
               <Text textAlign={'center'}>+ Add test agent</Text>
            </Center>
         </Flex> */}
      </Box>
   );
};

export default AgentsList;

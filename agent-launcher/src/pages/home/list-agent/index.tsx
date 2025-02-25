import {Box, Flex, Grid, GridItem, Select, Text, Image} from '@chakra-ui/react';
import s from './styles.module.scss';
import InfiniteScroll from 'react-infinite-scroll-component';
import AgentItem from './AgentItem';
import AppLoading from "../../../components/AppLoading";
import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import throttle from 'lodash.throttle';
import {IAgentToken} from "../../../services/api/agents-token/interface.ts";
import debounce from 'lodash.debounce';
import {AgentContext} from "../provider";
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
  const [loaded, setLoaded] = useState(false);
  const refLoading = useRef(false);

  const [agents, setAgents] = useState<IAgentToken[]>([]);

  const { setSelectedAgent } = useContext(AgentContext);

  const refParams = useRef({
    page: 1,
    limit: 30,
    sort,
    // order: OrderOption.Desc,
    search: '',
  });

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
          <Box w={"100%"}>
            <Select
              w={'100%'}
              value={sort}
              cursor="pointer"
              onChange={(event) => {
                const sort = event.target.value as SortOption;
                setSort(sort);
                refParams.current = {
                  ...refParams.current,
                  sort: sort,
                };
                throttleGetTokens(true);
              }}
            >
              <option value={SortOption.MarketCap}>Market cap</option>
              {/* <option value={SortOption.Price}>Price</option> */}
              <option value={SortOption.Percent}>24h%</option>
              <option value={SortOption.CreatedAt}>Creation time</option>
              <option value={SortOption.Volume24h}>24h volume</option>
            </Select>
          </Box>
        </Flex>
      </Flex>
      <Box h={'24px'} />

      <InfiniteScroll
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
              <AgentItem
                token={item}
                isAllChain
              />
            </GridItem>
          ))}
        </Grid>
      </InfiniteScroll>
    </Box>
  );
};

export default AgentsList;

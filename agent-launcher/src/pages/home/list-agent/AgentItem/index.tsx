import {Button, Flex, Grid, Image, SimpleGrid, Text} from '@chakra-ui/react';
import React, {useContext, useMemo} from 'react';
import s from './styles.module.scss';
import {IAgentToken} from "../../../../services/api/agents-token/interface.ts";
import {AgentContext} from "../../provider";
import {DefaultAvatar} from "../../../../components/DefaultAvatar";
import {compareString} from "../../../../utils/string.ts";
import {FilterChains} from "../constants.ts";
import {formatCurrency} from "../../../../utils/format.ts";
import cs from "clsx";

const MAX_LENGTH_TEXT = 150;

interface IProps {
  token: IAgentToken;
}

const AgentItem = ({ token }: IProps) => {
  const { selectedAgent, setSelectedAgent } = useContext(AgentContext);

  const [showFullText, setShowFullText] = React.useState(false);

  const toggleText = (e: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowFullText(!showFullText);
  };

  const handleGoToChat = (e: any, token_address?: any) => {
    if (token_address) {
      e?.preventDefault();
      e?.stopPropagation();

      setSelectedAgent(token);
    }
  };

  const handleClickCreator = (e: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!!token?.tmp_twitter_info?.twitter_username)
      window.open(`https://x.com/${token?.tmp_twitter_info?.twitter_username}`);
  };

  const handleClickX = (e: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!!token?.twitter_info?.twitter_username)
      window.open(
        `https://x.com/${token?.twitter_info?.twitter_username}`,
        '_blank',
      );
  };

  const handleClickDexscaner = (e: any, dex_url?: string) => {
    if (dex_url) {
      e?.preventDefault();
      e?.stopPropagation();
      window.open(dex_url, '_blank');
    }
  };

  const description = token?.token_desc || token?.twitter_info?.description;

  const renderReadmore = () => {
    if ((description || '')?.length <= MAX_LENGTH_TEXT) return <></>;
    return (
      <Text
        as="span"
        onClick={toggleText}
        cursor="pointer"
        fontSize="14px"
        color="#fff"
        fontWeight="500"
      >
        {showFullText ? 'Read less' : 'Read more'}
      </Text>
    );
  };

  const handleInstall = () => {

  }

  const avatarUrl =
    token?.thumbnail ||
    token?.token_image_url ||
    token?.twitter_info?.twitter_avatar;

  const chain = FilterChains.find(
    (chain) =>
      compareString(chain.chainId, token?.network_id) ||
      compareString(chain.name, token?.network_name),
  );

  const isInstalled = useMemo(() => {
    return Number(token.id) % 2 === 0;
  }, [token]);

  return (
    <Flex
      key={token.id}
      className={cs(s.container, token?.id === selectedAgent?.id ? s.isSelected : '')}
      flexDirection="column"
      position={'relative'}
      onClick={(e) =>
        handleGoToChat(e, token?.id || token?.token_address || token?.agent_id)
      }
    >
      <Grid
        className={s.content}
        templateColumns={'40px 1fr'}
        gap="12px"
        w={'100%'}
      >
        <Flex>
          {avatarUrl ? (
            <Image
              w={'40px'}
              objectFit={'cover'}
              src={avatarUrl}
              maxHeight={'40px'}
              maxWidth={'40px'}
              borderRadius={'50%'}
            />
          ) : (
            <DefaultAvatar
              width={'40px'}
              height={'40px'}
              name={token?.agent_name}
              fontSize={14}
            />
          )}
        </Flex>
        <Flex flexDirection="column" w={'100%'} gap={"8px"}>
          <Flex gap={"6px"} alignItems={"center"} justifyContent={"space-between"}>
            <Text
              fontSize="14px"
              fontWeight="500"
              color="inherit"
            >
              {token?.agent_name}{' '}
            </Text>
            {/*<Text className={s.agentTypeTag}>{AgentTypeName[token?.agent_type]}</Text>*/}
            {!isInstalled && <Button className={s.btnInstall} onClick={handleInstall}>Install</Button>}
          </Flex>
          <SimpleGrid columns={3}>
            <Text className={s.infoText}>{token?.token_symbol ? `$${token?.token_symbol}` : ''}</Text>
            <Text className={s.infoText}>
              {token?.meme?.market_cap && (
                <>
                  <Text as={'span'}>
                    {Number(token?.meme?.market_cap) > 0
                      ? `$${formatCurrency(
                        token?.meme?.market_cap,
                        0,
                        3,
                        'BTC',
                        false,
                        true,
                      )}`
                      : '$0'}
                  </Text>
                  {' '}<Text as={'span'} color={"#657786"}>MC</Text>
                </>
              )}
            </Text>
            <Flex>
              <Text className={s.infoText}>{formatCurrency(12345)}</Text>
              <Image src={'/icons/ic-chat.svg'} w={'16px'}/>
            </Flex>
          </SimpleGrid>
        </Flex>
      </Grid>
    </Flex>
  );
};

export default AgentItem;

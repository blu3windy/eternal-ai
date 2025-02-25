import Avatar from '@/components/Avatar';
import { RoutePathManager } from '@/constants/route-path';
import { IAgentToken } from '@/services/api/agents-token/interface';
import { formatCurrency } from '@/utils/format';
import { addressFormater, compareString } from '@/utils/string';
import { Box, Center, Flex, Grid, Image, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import s from './styles.module.scss';
import { DefaultAvatar } from '@/components/DefaultAvatar';
import { FilterChains } from '@/modules/AgentsHome/AgentsList/constants';
import { PumpTradeContext } from '@/modules/Pump/Trade/Provider';

const MAX_LENGTH_TEXT = 150;

interface IProps {
  token: IAgentToken;
  isAllChain: boolean;
}

const AgentItem = ({ token, isAllChain }: IProps) => {
  const router = useRouter();
  const { pumpToken } = useContext(PumpTradeContext);

  console.log('STEPHEN: token', token)
  console.log('STEPHEN: pumpToken', pumpToken)

  const [showFullText, setShowFullText] = React.useState(false);

  const toggleText = (e: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowFullText(!showFullText);
  };

  const handleGoToBrain = (e: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    router.push(
      `${RoutePathManager.AGENT}/${token?.agent_contract_address}/${token?.agent_contract_id}`,
    );
  };

  const handleGoToChat = (e: any, token_address?: any) => {
    if (token_address) {
      e?.preventDefault();
      e?.stopPropagation();
      router.push(`/${token_address}`);
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

  const avatarUrl =
    token?.thumbnail ||
    token?.token_image_url ||
    token?.twitter_info?.twitter_avatar;

  const chain = FilterChains.find(
    (chain) =>
      compareString(chain.chainId, token?.network_id) ||
      compareString(chain.name, token?.network_name),
  );

  return (
    <Flex
      key={token.id}
      className={s.container}
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
        <Flex flexDirection="column" w={'100%'}>
          <Flex justifyContent={'space-between'} w={'100%'}>
            <Flex gap="12px" flex={1}>
              <Flex flexDirection="column" gap="8px">
                {token?.meme?.market_cap && (
                  <Text color="#8AC3FC" fontSize="15px" fontWeight="600">
                    MC{' '}
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
                  </Text>
                )}
                <Text
                  fontSize="14px"
                  fontWeight="500"
                  color="inherit"
                >
                  {token?.agent_name}{' '}
                  {token.token_symbol && token?.meme?.market_cap && (
                    <Text as={'span'} color={'#FFFFFF99'}>
                      {token?.meme?.market_cap ? '$' : ''}
                      {token.token_symbol}
                    </Text>
                  )}
                </Text>
                <Flex
                  alignItems="center"
                  gap="4px"
                  onClick={handleClickCreator}
                >
                  <Text color="#657786" fontSize="14px" fontWeight="400">
                    by
                  </Text>
                  {token?.tmp_twitter_info?.twitter_avatar ? (
                    <Avatar
                      url={token?.tmp_twitter_info?.twitter_avatar}
                      width={16}
                    />
                  ) : (
                    <Jazzicon
                      diameter={16}
                      seed={jsNumberForAddress(token?.creator || '')}
                    />
                  )}
                  <Text color="#fff" fontSize="14px" fontWeight="400">
                    {token?.tmp_twitter_info?.twitter_username
                      ? `@${token?.tmp_twitter_info?.twitter_username}`
                      : addressFormater(token?.creator)}
                  </Text>
                  {chain && isAllChain && (
                    <>
                      <Text
                        mx={'4px'}
                        color="#657786"
                        fontSize="14px"
                        fontWeight="400"
                      >
                        ·
                      </Text>
                      <Image w={'14px'} h={'14px'} src={chain?.icon} />
                      <Text color="#fff" fontSize="14px" fontWeight="400">
                        {chain?.name}
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>
            </Flex>
            {token?.meme?.market_cap ? (
              <Flex flexDirection="column" gap="4px"></Flex>
            ) : (
              <Flex flexDirection="column" gap="8px">
                <Flex
                  alignItems={'center'}
                  justifyContent={'flex-end'}
                  alignSelf={'flex-end'}
                  gap={'4px'}
                >
                  <Center className={s.noToken}>No token</Center>
                </Flex>
              </Flex>
            )}
          </Flex>

          {description && (
            <Flex className={s.body}>
              <Box maxW={{ base: '54vw', md: '308px' }}>
                {description?.length <= MAX_LENGTH_TEXT || showFullText ? (
                  <Text
                    className={s.paragraph}
                    fontSize="14px"
                    fontWeight={'400'}
                    color="rgb(255, 255, 255, 0.7)"
                  >
                    {description} {renderReadmore()}
                  </Text>
                ) : (
                  <Text
                    className={s.paragraph}
                    fontSize="14px"
                    fontWeight={'400'}
                    color="rgb(255, 255, 255, 0.7)"
                  >
                    {`${description
                      ?.replaceAll(/([#]\w+)/g, '')
                      .slice(0, MAX_LENGTH_TEXT)}...`}{' '}
                    {renderReadmore()}
                  </Text>
                )}
              </Box>
            </Flex>
          )}

          {/* <Flex mt="12px" flexDirection="column" gap="8px">
            <Flex alignItems={'center'} gap={'8px'}>
              <Center
                className={styles.brain}
                bg={!!token?.twitter_info?.twitter_name ? '#5400fb' : '#000'}
                onClick={handleGoToBrain}
                opacity={!!token?.twitter_info?.twitter_name ? 1 : 0.3}
              >
                <Image src={`/icons/pump/ic_brain.svg`} />
              </Center>

              <Tooltip
                label={
                  <Text fontSize="12px" fontWeight="400" color="black">
                    {!!token?.twitter_info?.twitter_name
                      ? `This ${AI_AGENT_NAME}'s X account is @${token?.twitter_info?.twitter_name}.`
                      : `This ${AI_AGENT_NAME} has not linked to any X account yet.`}
                  </Text>
                }
                bg="#fff"
                padding="8px 12px"
                borderRadius="6px"
              >
                <Center
                  className={styles.message}
                  opacity={!!token?.twitter_info?.twitter_name ? 1 : 0.3}
                  onClick={handleClickX}
                >
                  <Image src={`/icons/pump/ic_x.svg`} />
                </Center>
              </Tooltip>

              <Center
                className={styles.message}
                onClick={(e: any) => {
                  handleGoToChat(
                    e,
                    token?.id || token?.token_address || token?.agent_id,
                  );
                }}
                bg={'#000'}
              >
                <Image src={`/icons/pump/ic_message.svg`} />
              </Center>

              <Center
                className={styles.message}
                onClick={(e: any) => {
                  handleClickDexscaner(e, token?.dex_url);
                }}
                bg={!!token?.dex_url ? '#000' : '#BFBFBF'}
              >
                <Image w={'16px'} src={`/icons/pump/ic_dex.svg`} />
              </Center>
            </Flex>
          </Flex> */}
        </Flex>
      </Grid>
    </Flex>
  );
};

export default AgentItem;

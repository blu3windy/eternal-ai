import { Flex, Grid, Image, Text } from '@chakra-ui/react';
import CustomMarkdown from "@components/CustomMarkdown";
import { DefaultAvatar } from "@components/DefaultAvatar";
import { AgentType } from "@pages/home/list-agent/constants";
import { AgentContext } from "@pages/home/provider";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import { formatCurrency, labelAmountOrNumberAdds } from "@utils/format.ts";
import cs from "clsx";
import { useContext, useMemo } from 'react';
import s from './styles.module.scss';

interface IProps {
  token: IAgentToken;
  isLatest?: boolean;
}

const AgentItem = ({ token, isLatest }: IProps) => {
   const { selectedAgent, setSelectedAgent, installedUtilityAgents } = useContext(AgentContext);

   const description = useMemo(() => {
      if ([AgentType.Infra, AgentType.Model, AgentType.CustomPrompt].includes(token.agent_type)) {
         return token?.personality;
      } else {
         return token?.token_desc || token?.twitter_info?.description;
      }
   }, [token]);

   const avatarUrl
    = token?.thumbnail
    || token?.token_image_url
    || token?.twitter_info?.twitter_avatar;

   // const isUtilityAgent = useMemo(() => {
   //   return token?.agent_type === AgentType.UtilityJS;
   // }, [token]);

   const isInstalled = useMemo(() => {
      if (token && installedUtilityAgents?.length) {
         return installedUtilityAgents?.some(key => key === `${token.network_id}-${token.agent_name}`.toLowerCase());
      }

      return false;
   }, [token, installedUtilityAgents]);

   const handleGoToChat = (e: any, token_address?: any) => {
      if (token_address) {
         e?.preventDefault();
         e?.stopPropagation();

         setSelectedAgent(token);
      }
   };

   const iconSize = isLatest ? '68px' : '40px';

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
         {!token.is_public && 
            <Flex position={"absolute"} top={"8px"} right={"24px"} className={s.testingStatus}>
               <Text>Testing</Text>
            </Flex>
         }
         <Grid
            className={s.content}
            templateColumns={`${iconSize} 1fr`}
            gap="12px"
            w={'100%'}
         >
            <Flex position={"relative"}>
               {avatarUrl ? (
                  <Image
                     w={iconSize}
                     objectFit={'cover'}
                     src={avatarUrl}
                     maxHeight={iconSize}
                     maxWidth={iconSize}
                     borderRadius={'50%'}
                  />
               ) : (
                  <DefaultAvatar
                     width={iconSize}
                     height={iconSize}
                     name={token?.agent_name}
                     fontSize={14}
                  />
               )}
               {/*          {
            isUtilityAgent && (
              <Image src={'icons/ic-utility-agent.svg'} w={"16px"} h={"16px"} position={"absolute"} top={"24px"} right={"0px"}/>
            )
          }*/}
            </Flex>
            <Flex flexDirection="column" w={'100%'} gap={"12px"}>
               <Flex gap={"6px"} alignItems={"center"} justifyContent={"space-between"}>
                  <Flex gap={"6px"}>
                     <Text className={s.nameText}>
                        {token?.agent_name}{' '}
                     </Text>
                     <Text className={s.nameText} opacity={0.5}>{token?.token_symbol ? `$${token?.token_symbol}` : ''}</Text>
                  </Flex>
{/*                  {
                     isInstalled && <Text className={s.agentTypeTag}>Installed</Text>
                  }*/}

                  {/*{
              isUtilityAgent && (
                <Button
                  className={s.btnInstall}
                  onClick={handleInstall}
                  isLoading={isStarting || isStopping}
                  isDisabled={isStarting || isStopping}
                  loadingText={isStarting ? 'Starting...' : 'Stopping...'}
                >{isRunning ? 'Stop' : 'Start'}</Button>
              )
            }*/}
               </Flex>
               {
                  description && (
                     <div className={cs(s.descriptionText, "markdown")}>
                        <CustomMarkdown
                           content={description}
                           isLight={false}
                           removeThink={false}
                        />
                     </div>
                  )
               }
               <Flex gap={"8px"}>
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
                  <Text className={s.infoText}>{formatCurrency(token.prompt_calls, 0, 0)}{' '}<Text as={'span'} color={"#657786"}>prompt{labelAmountOrNumberAdds(token.prompt_calls)}</Text></Text>
                  <Text className={s.infoText}>{formatCurrency(token.likes, 0, 0)}{' '}<Text as={'span'} color={"#657786"}>like{labelAmountOrNumberAdds(token.prompt_calls)}</Text></Text>
               </Flex>
            </Flex>
         </Grid>
      </Flex>
   );
};

export default AgentItem;

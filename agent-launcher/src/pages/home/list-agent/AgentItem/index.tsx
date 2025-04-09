import { Button, Flex, Grid, Image, Text } from '@chakra-ui/react';
import CustomMarkdown from "@components/CustomMarkdown";
import { DefaultAvatar } from "@components/DefaultAvatar";
import { BASE_CHAIN_ID } from '@constants/chains';
import CAgentContract from '@contract/agent';
import { AgentType } from "@pages/home/list-agent/constants";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import localStorageService from '@storage/LocalStorageService';
import { formatCurrency, formatLongAddress } from "@utils/format.ts";
import cs from "clsx";
import { useContext, useEffect, useMemo, useState } from 'react';
import s from './styles.module.scss';
import { MonitorContext } from '@providers/Monitor/MonitorContext';
import { ContainerData } from '@providers/Monitor/interface';
import { compareString } from '@utils/string';
import { motion } from 'framer-motion';

interface IProps {
   token: IAgentToken;
   isLatest?: boolean;
}

const AgentItem = ({ token, isLatest }: IProps) => {
   const {
      selectedAgent,
      stopAgent,
      isInstalled,
      unInstallAgent,
      installAgent,
      setSelectedAgent,
      agentStates,
      handleUpdateCode
   } = useContext(AgentContext);
   const { containers } = useContext(MonitorContext);

   const [hasNewVersionCode, setHaveNewVersionCode] = useState(false);

   const isStarting = useMemo(() => {
      if (token) {
         return agentStates[token.id]?.isStarting || false;
      }

      return false;
   }, [token, agentStates]);

   const isStopping = useMemo(() => {
      if (token) {
         return agentStates[token.id]?.isStopping || false;
      }

      return false;
   }, [token, agentStates]);

   const isRunning = useMemo(() => {
      if (token) {
         const matchingContainer = containers?.find((container: ContainerData) => compareString(container.agent?.agent_name, token?.agent_name));
         if (matchingContainer?.agent && [AgentType.Model, AgentType.ModelOnline, AgentType.CustomUI].includes(matchingContainer?.agent?.agent_type)) {
            return matchingContainer ? matchingContainer?.state === 'running' || false : agentStates[token.id]?.isRunning;
         } else {
            return matchingContainer?.state === 'running' || agentStates[token.id]?.isRunning || false;
         }
      }

      return false;
   }, [token, agentStates, containers]);

   const isUpdating = useMemo(() => {
      if (token) {
         return agentStates[token.id]?.isUpdating || false;
      }

      return false;
   }, [token, agentStates]);

   useEffect(() => {
      setHaveNewVersionCode(false);
      if (token || !isRunning) {
         checkVersionCode();
      }
   }, [token, isRunning, isInstalled]);

   const checkVersionCode = async () => {
      if (
         token?.agent_type
         && [
            AgentType.Infra,
            AgentType.CustomUI,
            AgentType.CustomPrompt,
            AgentType.ModelOnline,
         ].includes(token.agent_type)
      ) {
         const codeVersion = token?.code_version ? Number(token?.code_version) : 0;
         const values = await localStorageService.getItem(token.agent_contract_address);
         const oldCodeVersion = values ? Number(values) : -1;
         if (oldCodeVersion > 0 && codeVersion > 1 && codeVersion > oldCodeVersion) {
            setHaveNewVersionCode(true);
         } else {
            setHaveNewVersionCode(false);
         }
      }
   };

   const description = useMemo(() => {
      if ([AgentType.Infra, AgentType.Model, AgentType.CustomPrompt].includes(token.agent_type)) {
         return token?.short_description || token?.personality;
      } else {
         return token?.short_description || token?.token_desc || token?.twitter_info?.description;
      }
   }, [token]);

   const avatarUrl
      = token?.thumbnail
      || token?.token_image_url
      || token?.twitter_info?.twitter_avatar;

   const handleGoToChat = (e: any, token_address?: any) => {
      if (token_address) {
         e?.preventDefault();
         e?.stopPropagation();

         setSelectedAgent(token);
      }
   };

   const iconSize = '60px';

   return (
      <Flex
         as={motion.div}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: "0.5s" }}
         key={token.id}
         className={cs(s.container, token?.id === selectedAgent?.id ? s.isSelected : '')}
         flexDirection="column"
         position={'relative'}
         onClick={(e) =>
            handleGoToChat(e, token?.id || token?.token_address || token?.agent_id)
         }
         w={'100%'}
      >
         <Flex position={"absolute"} top={"14px"} right={"24px"}>
            <Flex gap={"8px"}>
               <Flex gap="4px" alignItems={'center'}>
                  <Image src="icons/ic-mc.png" w="15px" h="15px" />
                  <Text as={'span'} color="#657786" fontSize="12px" fontWeight="400">
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
               </Flex>
               <Flex gap="4px" alignItems={'center'}>
                  <Image src="icons/ic-downloaded.png" w="15px" h="15px" />
                  <Text color="#657786" fontSize="12px" fontWeight="400">{formatCurrency(token.installed_count, 0, 0)}</Text>
               </Flex>
            </Flex>
         </Flex>
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
                     name={token?.display_name || token?.agent_name}
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
                        {token?.display_name || token?.agent_name}{' '}
                     </Text>
                     {/* <Text className={s.nameText} opacity={0.5}>{token?.token_symbol ? `$${token?.token_symbol}` : ''}</Text> */}
                  </Flex>
                  {/* { isInstalled && <Text className={s.agentTypeTag}>Installed</Text> } */}

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
               <Flex gap={"6px"} alignItems={"center"} justifyContent={"space-between"}>
                  <Flex gap={"6px"}>
                     <Image src="icons/ic-creator.svg" w="14px" h="14px" />
                     <Text fontSize={"12px"} fontWeight={"500"} color={"#000"} opacity={0.7}>
                        {formatLongAddress(token?.creator)}
                     </Text>
                  </Flex>
                  {hasNewVersionCode && (
                     <Button
                        className={s.btnUpdate}
                        onClick={() => handleUpdateCode(token)}
                        isLoading={isUpdating}
                        isDisabled={isUpdating}
                        loadingText={isStarting ? 'Starting...' : 'Updating...'}
                     >
                        Update
                     </Button>
                  )}
               </Flex>
            </Flex>
         </Grid >
      </Flex >
   );
};

export default AgentItem;

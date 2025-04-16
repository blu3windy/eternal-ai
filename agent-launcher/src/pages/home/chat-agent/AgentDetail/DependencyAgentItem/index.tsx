import { Button, Flex, Grid, Image, Text } from '@chakra-ui/react';
import CustomMarkdown from "@components/CustomMarkdown";
import { DefaultAvatar } from "@components/DefaultAvatar";
import { BASE_CHAIN_ID } from '@constants/chains';
import CAgentContract from '@contract/agent';
import { AgentStatus, AgentStatusLabel, AgentType, AgentTypeName } from "@pages/home/list-agent/constants";
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
   addActiveAgent?: (agent: IAgentToken) => void;
}

const DependencyAgentItem = ({ token, isLatest, addActiveAgent }: IProps) => {
   const {
      selectedAgent,
      stopAgent,
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

   const isInstalled = useMemo(() => {
      if (token) {
         return agentStates[token.id]?.isInstalled || false;
      }

      return false;
   }, [token, agentStates]);

   const runStatus = useMemo(() => {
      if (token) {
         return AgentStatusLabel[token.run_status as AgentStatus];
      }

      return '';
   }, [token]);

   const agentTypeAdditional = useMemo(() => {
      if (token) {
         if (token.agent_type === AgentType.ModelOnline) {
            return 'Online';
         }
      }

      return '';
   }, [token]);

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
         if (oldCodeVersion > 0 && codeVersion >= 1 && codeVersion !== oldCodeVersion) {
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
         addActiveAgent && addActiveAgent(token);
      }
   };

   const iconSize = '40px';

   // if (!token.is_public && token.agent_name === 'Proxy') {
   //    return <></>;
   // }

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
         // onClick={(e) =>
         //    handleGoToChat(e, token?.id || token?.token_address || token?.agent_id)
         // }
         w={'100%'}
      >
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
            <Flex flexDirection="column" w={'100%'} gap={"8px"}>
               <Flex gap={"6px"} alignItems={"center"} justifyContent={"space-between"}>
                  <Flex gap={"4px"} direction={'column'}>
                     <Text className={s.nameText}>
                        {token?.display_name || token?.agent_name}{' '}
                     </Text>
                     {token?.author && <Text fontSize={"12px"} color={"#000"} opacity={0.5}><Text as={'span'} fontWeight={400}>by</Text> <Text as='span' fontWeight={600}>{token?.author}</Text></Text>}
                  </Flex>
               </Flex>
               {
                  description && (
                     <div className={cs(s.descriptionText, "markdown")}>
                        <CustomMarkdown
                           content={description}
                        />
                     </div>
                  )
               }
               <Flex>
                  <Flex gap={"8px"}>
                     <Flex gap="4px" alignItems={'center'}>
                        <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <rect width="15" height="13" rx="4" fill="white" />
                           <path fill-rule="evenodd" clip-rule="evenodd" d="M12.552 5.89842H11.4304L11.3851 5.67797C11.358 5.54628 11.3122 5.43757 11.251 5.34742L11.2497 5.34548C11.1858 5.24969 11.1089 5.17074 11.0184 5.10687L11.0151 5.10454C10.9237 5.03811 10.8218 4.98773 10.7075 4.95369C10.5907 4.91891 10.4679 4.90113 10.338 4.90113C10.1036 4.90113 9.89772 4.95956 9.71338 5.07422C9.535 5.1861 9.38541 5.35466 9.26897 5.59387C9.15756 5.82582 9.09521 6.12449 9.09521 6.50072C9.09521 6.87695 9.15756 7.17562 9.26897 7.40758C9.38542 7.64679 9.535 7.81534 9.71338 7.92722C9.89772 8.04188 10.1036 8.10031 10.338 8.10031C10.4679 8.10031 10.5907 8.08253 10.7075 8.04775C10.8226 8.01347 10.9251 7.96343 11.0167 7.89804C11.1082 7.83233 11.1856 7.75214 11.2497 7.65597C11.3119 7.56326 11.3582 7.45309 11.3852 7.32297L11.4309 7.10302H12.5524L12.4945 7.42754C12.4466 7.69637 12.3581 7.94271 12.2265 8.16328C12.097 8.38031 11.9347 8.56687 11.7398 8.72097L11.7386 8.72193C11.5449 8.87339 11.328 8.98811 11.0897 9.06636C10.8523 9.14484 10.6012 9.18308 10.338 9.18308C9.89128 9.18308 9.48423 9.07327 9.12534 8.84808C8.7671 8.6233 8.48934 8.30536 8.29049 7.90426C8.08933 7.49851 7.99414 7.02773 7.99414 6.50072C7.99414 5.97371 8.08933 5.50293 8.29049 5.09718C8.48934 4.69608 8.7671 4.37814 9.12534 4.15336C9.48423 3.92817 9.89128 3.81836 10.338 3.81836C10.6013 3.81836 10.8525 3.85663 11.09 3.93517C11.3285 4.01355 11.5455 4.12921 11.7392 4.28228C11.9343 4.43493 12.0967 4.62081 12.2262 4.83773C12.3583 5.05736 12.4467 5.30407 12.4946 5.5742L12.552 5.89842Z" fill="black" />
                           <path fill-rule="evenodd" clip-rule="evenodd" d="M2.44727 3.88281H3.58565L5.01983 7.38584L6.45401 3.88281H7.5924V9.11944H6.50963V6.56988L5.46097 9.11944H4.5787L3.53004 6.56988V9.11944H2.44727V3.88281Z" fill="black" />
                        </svg>
                        <Text as={'span'} color="rgba(255, 255, 255, 0.7)" fontSize="12px" fontWeight="400">
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
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path fill-rule="evenodd" clip-rule="evenodd" d="M7.27084 1.875C4.55125 1.875 2.31204 3.922 2.15749 6.5245C1.07857 6.97631 0.3125 8.01244 0.3125 9.23297C0.3125 10.8765 1.69541 12.1875 3.375 12.1875H11.8542C13.4073 12.1875 14.6875 10.9752 14.6875 9.45312C14.6875 8.11234 13.6929 7.01334 12.3957 6.77047C12.373 4.05156 10.0754 1.875 7.27084 1.875ZM7.03125 4.375H7.96875V7.1875H10.625L7.5 10.7829L4.375 7.1875H7.03125V4.375Z" fill="white" />
                           <path d="M7.96875 4.375H7.03125V7.1875H4.375L7.5 10.7829L10.625 7.1875H7.96875V4.375Z" fill="black" />
                        </svg>

                        <Text color="rgba(255, 255, 255, 0.7)" fontSize="12px" fontWeight="400">{formatCurrency(token.installed_count, 0, 0)}</Text>
                     </Flex>
                     {/* <Flex gap="4px" alignItems={'center'}>
                        <Image src="icons/ic-yellow-star.svg" w="15px" h="15px" />
                        <Text color="rgba(255, 255, 255, 0.7)" fontSize="12px" fontWeight="400">{formatCurrency(token.rating, 0, 0)}</Text>
                     </Flex> */}
                  </Flex>
               </Flex>
               <Flex gap={"6px"} alignItems={"center"} justifyContent={"space-between"} mt={"4px"}>
                  <Flex gap={"8px"}>
                     {token?.run_status && <Text className={token?.run_status === AgentStatus.Local ? s.onChainTag : s.agentTypeTag}>{runStatus}</Text>}
                     {/* {agentTypeAdditional && <Text className={s.agentTypeTag}>{agentTypeAdditional}</Text>} */}
                     {/* <Image src="icons/ic-creator.svg" w="14px" h="14px" />
                     <Text fontSize={"12px"} fontWeight={"500"} color={"#000"} opacity={0.7}>
                        {formatLongAddress(token?.creator)}
                     </Text> */}
                  </Flex>
                  {hasNewVersionCode && isInstalled && (
                     <Button
                        className={s.btnUpdate}
                        onClick={() => handleUpdateCode(token)}
                        isLoading={isUpdating}
                        isDisabled={isUpdating}
                        loadingText={'Updating...'}
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

export default DependencyAgentItem;

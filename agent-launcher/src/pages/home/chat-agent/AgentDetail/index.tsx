import { Button, Divider, Flex, Image, Text } from "@chakra-ui/react";
import CustomMarkdown from "@components/CustomMarkdown";
import useParseLogs from "@hooks/useParseLogs.ts";
import { AgentType, AgentTypeName } from "@pages/home/list-agent/constants";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { formatCurrency } from "@utils/format.ts";
import cs from "classnames";
import { useContext, useEffect, useMemo, useState } from "react";
import s from "./styles.module.scss";
import SetupEnvModel from "../SetupEnvironment";
import BaseModal from "@components/BaseModal";
import storageModel from "@storage/StorageModel";
import localStorageService from "@storage/LocalStorageService";
import RatingForm from "../Rating/RatingForm";
import RatingList from "../Rating/List";
import { IAgentToken } from "@services/api/agents-token/interface";
import DependencyAgentItem from "./DependencyAgentItem";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const AgentDetail = () => {
   const {
      selectedAgent,
      installAgent,
      isInstalling,
      isInstalled,
      isRunning,
      isStarting,
      startAgent,
      isUpdating,
      handleUpdateCode,
      getDependAgents,
      agentStates
   } = useContext(AgentContext);

   const [isShowSetupEnvModel, setIsShowSetupEnvModel] = useState(false);
   const [hasNewVersionCode, setHaveNewVersionCode] = useState(false);
   const [dependAgents, setDependAgents] = useState<IAgentToken[]>([]);

   const [hours, setHours] = useState<number | null>(0);
   const [minutes, setMinutes] = useState<number | null>(0);
   const [seconds, setSeconds] = useState<number | null>(0);

   // const [isShowRatingForm, setIsShowRatingForm] = useState(false);

   const calcTime = () => {
      const diff = dayjs.duration(dayjs().diff(dayjs(agentStates[selectedAgent?.id]?.startAt)));
      if (diff.milliseconds() <= 0) {
         setHours(null);
         setMinutes(null);
         setSeconds(null);
         return;
      }
      setHours(diff.hours());
      setMinutes(diff.minutes());
      setSeconds(diff.seconds());
   };

   useEffect(() => {
      if (isStarting && agentStates[selectedAgent?.id]?.startAt) {
         calcTime();
      }
   }, [isStarting, agentStates, selectedAgent]);

   const startingTime = useMemo(() => {
      return minutes > 0 || seconds > 0 ? ` (${minutes && minutes > 0 ? `${minutes}m ` : ""}${seconds && seconds > 0 ? `${seconds}s` : ""})` : '';
   }, [minutes, seconds]);

   console.log('minutes', minutes);
   console.log('seconds', seconds);
   console.log('startingTime', startingTime);

   useEffect(() => {
      setHaveNewVersionCode(false);
      if (selectedAgent || !isRunning) {
         checkVersionCode();
      }
   }, [selectedAgent, isRunning, isInstalled]);

   const checkVersionCode = async () => {
      if (
         selectedAgent?.agent_type
         && [
            AgentType.Infra,
            AgentType.CustomUI,
            AgentType.CustomPrompt,
            AgentType.ModelOnline,
         ].includes(selectedAgent.agent_type)
         && isInstalled
      ) {
         const codeVersion = selectedAgent?.code_version ? Number(selectedAgent?.code_version) : 0;
         const values = await localStorageService.getItem(selectedAgent.agent_contract_address);
         const oldCodeVersion = values ? Number(values) : 1;
         if (codeVersion > 1 && codeVersion > oldCodeVersion) {
            setHaveNewVersionCode(true);
         } else {
            setHaveNewVersionCode(false);
         }
      }
   };

   const {
      parsedLog,
   } = useParseLogs({
      functionNames: ["MODEL_INSTALL"],
      keys: ["step", "hash"]
   });

   const { currentStep, totalStep } = useMemo(() => {
      if (parsedLog?.values['step']) {
         const steps = parsedLog?.values['step'].split('-');

         return {
            currentStep: parseInt(steps[0]),
            totalStep: parseInt(steps[1])
         }
      }
      return {
         currentStep: 0,
         totalStep: 0
      }
   }, [parsedLog?.values]);

   const avatarUrl
      = selectedAgent?.thumbnail
      || selectedAgent?.token_image_url
      || selectedAgent?.twitter_info?.twitter_avatar;

   const description = useMemo(() => {
      if (!selectedAgent) return '';
      if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.Model, AgentType.CustomPrompt, AgentType.CustomUI].includes(selectedAgent?.agent_type)) {
         return selectedAgent?.personality;
      } else {
         return selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;
      }
   }, [selectedAgent]);

   const shortDescription = useMemo(() => {
      if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.Model, AgentType.CustomPrompt, AgentType.CustomUI].includes(selectedAgent?.agent_type)) {
         return selectedAgent?.short_description || selectedAgent?.personality;
      } else {
         return selectedAgent?.short_description || selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;
      }
   }, [selectedAgent]);

   const requirements = selectedAgent?.required_info;

   useEffect(() => {
      const fetchDependAgents = async () => {
         if (selectedAgent) {
            const dependAgents = await getDependAgents(selectedAgent);
            console.log('dependAgents aaaaaa', dependAgents);
            setDependAgents(dependAgents);
         }
      }

      fetchDependAgents();
   }, [selectedAgent]);

   const handleInstall = async () => {
      if (isInstalled) return;
      if (!selectedAgent) return;

      if (selectedAgent?.env_example) {
         const environment = await storageModel.getEnvironment({ contractAddress: selectedAgent?.agent_contract_address, chainId: selectedAgent?.network_id });
         console.log('environment', environment);

         if (!environment) {
            setIsShowSetupEnvModel(true);
            return;
         }
      }

      installAgent(selectedAgent);
   };

   const handleStartAgent = () => {
      if (!selectedAgent) return;
      startAgent(selectedAgent);
   };

   return (
      <>
         <Flex
            className={s.container}
            direction={"column"}
            // justifyContent={"center"}
            w={"100%"}
         >
            <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"} mb={'40px'}>
               <Flex gap={"16px"} alignItems={"center"}>
                  <Image w="100px" h="100px" src={avatarUrl} borderRadius={"50%"} objectFit={'cover'} />
                  <Flex direction={"column"} gap={"4px"}>
                     <Flex gap={"6px"}>
                        <Text className={s.nameText}>
                           {selectedAgent?.display_name || selectedAgent?.agent_name}{' '}
                        </Text>
                        <Text className={s.nameText} opacity={0.5}>{selectedAgent?.token_symbol ? `$${selectedAgent?.token_symbol}` : ''}</Text>
                     </Flex>
                     <Text className={s.shortDescription}>{shortDescription}</Text>
                     <Flex gap={"24px"} mt={"12px"}>
                        {
                           isInstalled ? (
                              <>
                                 {!isRunning && (
                                    <Button
                                       className={s.btnInstall}
                                       onClick={handleStartAgent}
                                       isLoading={isStarting || isUpdating}
                                       isDisabled={isStarting || isUpdating}
                                       loadingText={isUpdating && !agentStates[selectedAgent?.id]?.startAt ? "Updating..." : `Starting...` + startingTime}
                                    >
                                       <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M15.5507 11.989L7.15397 17.1274C5.48314 18.1499 3.33398 16.9506 3.33398 14.9956V5.00479C3.33398 3.04979 5.48314 1.85074 7.15397 2.87324L15.5507 8.01158C17.0382 8.92242 17.0382 11.079 15.5507 11.989Z" fill="black" />
                                       </svg>

                                       Start
                                    </Button>
                                 )}
                              </>
                           ) : (
                              <Button
                                 className={s.btnInstall}
                                 onClick={handleInstall}
                                 isLoading={isInstalling}
                                 isDisabled={isInstalling}
                                 loadingText={totalStep > 0 ? `${formatCurrency(currentStep / (totalStep + 3) * 100, 0, 0)}%` : 'Installing...'}
                              >
                                 Get
                              </Button>
                           )
                        }
                        {hasNewVersionCode && isInstalled && !isUpdating && (
                           <Button
                              className={s.btnUpdate}
                              onClick={() => handleUpdateCode(selectedAgent)}
                              isLoading={isUpdating}
                              isDisabled={isUpdating}
                              loadingText={'Updating...'}
                           >
                              Update
                           </Button>
                        )}
                     </Flex>

                  </Flex>
               </Flex>
            </Flex>

            <Flex w={'100%'} direction="column" overflowY={'auto'} className={s.descriptionWrapper}>
               <Divider color={'rgba(255, 255, 255, 0.15)'} mb={'40px'} />
               <Flex gap={"20px"} justifyContent={'space-between'}>
                  {/* <Flex className={s.infoBox}>
                     <Text className={s.infoText}>
                        123 Ratings
                     </Text>
                     <Text className={s.infoValue}>
                        4.5
                     </Text>
                  </Flex> */}

                  <Flex className={s.infoBox}>
                     <Text className={s.infoText}>
                        Type
                     </Text>
                     <Text className={s.infoValue}>
                        {AgentTypeName[selectedAgent?.agent_type]}
                     </Text>
                  </Flex>
                  {
                     requirements?.disk && (
                        <Flex className={s.infoBox}>
                           <Text className={s.infoText}>
                              Storage
                           </Text>
                           <Text className={s.infoValue}>
                              {requirements?.disk} GB
                           </Text>
                        </Flex>
                     )
                  }

                  {
                     requirements?.ram && (
                        <Flex className={s.infoBox}>
                           <Text className={s.infoText}>
                              RAM
                           </Text>
                           <Text className={s.infoValue}>
                              {requirements?.ram} GB
                           </Text>
                        </Flex>
                     )
                  }

                  {
                     selectedAgent?.meme?.market_cap && (
                        <Flex className={s.infoBox}>
                           <Text className={s.infoText}>
                              Market cap
                           </Text>
                           <Text className={s.infoValue}>
                              {Number(selectedAgent?.meme?.market_cap) > 0
                                 ? `$${formatCurrency(
                                    selectedAgent?.meme?.market_cap,
                                    0,
                                    3,
                                    'BTC',
                                    false,
                                    true,
                                 )}`
                                 : '$0'}
                           </Text>
                        </Flex>
                     )
                  }

                  <Flex className={s.infoBox}>
                     <Text className={s.infoText}>
                        installed
                     </Text>
                     <Text className={s.infoValue}>
                        {formatCurrency(selectedAgent?.installed_count, 0, 0)}
                     </Text>
                  </Flex>

                  <Flex className={s.infoBox}>
                     <Text className={s.infoText}>
                        likes
                     </Text>
                     <Text className={s.infoValue}>
                        {formatCurrency(selectedAgent?.likes, 0, 0)}
                     </Text>
                  </Flex>
               </Flex>
               <Divider color={'rgba(255, 255, 255, 0.15)'} my={'40px'} />
               {
                  dependAgents.length > 0 && (
                     <>
                        <Flex direction={'column'} gap={'12px'}>
                           <Text fontSize={'20px'} fontWeight={'500'} color={'white'}>Dependency Agent</Text>
                           <Flex overflowX={'auto'} gap={'12px'}>
                              {
                                 dependAgents.map((agent) => (
                                    <DependencyAgentItem token={agent} />
                                 ))
                              }
                           </Flex>
                        </Flex>
                        <Divider color={'rgba(255, 255, 255, 0.15)'} my={'40px'} />
                     </>
                  )
               }
               <Flex marginLeft={'8px'} marginBottom={'20px'} className={s.wDescription}>
                  {description && (
                     <div className={cs(s.descriptionText, "markdown")}>
                        <CustomMarkdown
                           content={description}
                        />
                     </div>
                  )}
               </Flex>
               {/* <Divider color={'rgba(255, 255, 255, 0.15)'} my={'40px'} />
               <RatingList
                  averageRating={4.9}
                  totalRatings={208}
                  theme="dark"
               /> */}
            </Flex>
         </Flex >
         {isShowSetupEnvModel && (
            <BaseModal
               isShow={isShowSetupEnvModel}
               onHide={() => setIsShowSetupEnvModel(false)}
               size="small"
               title="Setup Environment"
            >
               <SetupEnvModel
                  environments={selectedAgent?.env_example}
                  agent={selectedAgent}
                  onSubmit={async () => {
                     setIsShowSetupEnvModel(false);
                     handleInstall();
                  }}
               />
            </BaseModal>
         )}

         {/* <BaseModal
            isShow={isShowRatingForm}
            onHide={() => setIsShowRatingForm(false)}
            size="small"
            title="Rating"
         >
            <RatingForm onClose={() => setIsShowRatingForm(false)} />
         </BaseModal> */}
      </>
   )
}

export default AgentDetail;
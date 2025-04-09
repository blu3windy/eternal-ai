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
      handleUpdateCode
   } = useContext(AgentContext);

   const [isShowSetupEnvModel, setIsShowSetupEnvModel] = useState(false);
   const [hasNewVersionCode, setHaveNewVersionCode] = useState(false);

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

   console.log('LEON selectedAgent', selectedAgent?.env_example);


   return (
      <>
         <Flex
            className={s.container}
            direction={"column"}
            justifyContent={"center"}
            w={"100%"}
         >
            <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
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
                              <Button
                                 className={s.btnInstall}
                                 onClick={handleStartAgent}
                                 isLoading={isStarting && !isUpdating}
                                 isDisabled={isStarting}
                                 loadingText={"Starting..."}
                              >
                                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5507 11.989L7.15397 17.1274C5.48314 18.1499 3.33398 16.9506 3.33398 14.9956V5.00479C3.33398 3.04979 5.48314 1.85074 7.15397 2.87324L15.5507 8.01158C17.0382 8.92242 17.0382 11.079 15.5507 11.989Z" fill="black" />
                                 </svg>

                                 Start
                              </Button>
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
                        {hasNewVersionCode && isInstalled && (
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
            <Divider color={'rgba(255, 255, 255, 0.15)'} my={'40px'} />
            <Flex gap={"20px"} justifyContent={'space-between'}>
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
            <Flex h={'100%'} overflow={'auto'} marginLeft={'8px'} marginBottom={'28px'} className={s.wDescription}>
               {description && (
                  <div className={cs(s.descriptionText, "markdown")}>
                     <CustomMarkdown
                        content={description}
                        isLight={false}
                        removeThink={false}
                     />
                  </div>
               )}
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
      </>
   )
}

export default AgentDetail;
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import CustomMarkdown from "@components/CustomMarkdown";
import { LLM_MODELS } from "@constants/models.ts";
import useParseLogs from "@hooks/useParseLogs.ts";
import { AgentType } from "@pages/home/list-agent/constants";
import { AgentContext } from "@pages/home/provider";
import { formatCurrency, labelAmountOrNumberAdds } from "@utils/format.ts";
import { compareString } from "@utils/string.ts";
import cs from "classnames";
import { useContext, useMemo } from "react";
import s from "./styles.module.scss";

const AgentDetail = () => {
   const {
      selectedAgent,
      installAgent,
      isInstalling,
      availableModelAgents,
      isInstalled,
   } = useContext(AgentContext);

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

   const modelInfo = useMemo(() => {
      const modelAgent = availableModelAgents?.find(agent => agent.id === selectedAgent?.id);

      if (modelAgent) {
         return LLM_MODELS.find(model => compareString(model.hash, modelAgent.ipfsHash));
      }

      return undefined;
   }, [selectedAgent, availableModelAgents]);

   const handleInstall = () => {
      if (isInstalled) return;

      installAgent(selectedAgent);
   };

   return (
      <Flex
         className={s.container}
         direction={"column"}
         // alignItems={"center"}
         justifyContent={"center"}
         w={"100%"}
      >
         <Flex  w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
            <Flex gap={"16px"} alignItems={"center"}>
               <Image w="80px" h="80px" src={avatarUrl} borderRadius={"50%"} objectFit={'cover'}/>
               <Flex direction={"column"} gap={"16px"}>
                  <Flex gap={"6px"}>
                     <Text className={s.nameText}>
                        {selectedAgent?.agent_name}{' '}
                     </Text>
                     <Text className={s.nameText} opacity={0.5}>{selectedAgent?.token_symbol ? `$${selectedAgent?.token_symbol}` : ''}</Text>
                  </Flex>
                  <Flex gap={"8px"}>
                     <Text className={s.infoText}>
                        {selectedAgent?.meme?.market_cap && (
                           <>
                              <Text as={'span'}>
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
                              {' '}<Text as={'span'} color={"#FFF"}>MC</Text>
                           </>
                        )}
                     </Text>
                     <Text className={s.infoText}>{formatCurrency(selectedAgent?.prompt_calls, 0, 0)}{' '}<Text as={'span'} color={"#FFF"}>prompt{labelAmountOrNumberAdds(selectedAgent?.prompt_calls || 0)}</Text></Text>
                     {
                        modelInfo && (
                           <>
                              <Text className={s.infoText}>
                                 Storage required: {modelInfo.size * 2} GB
                              </Text>
                              <Text className={s.infoText}>
                                 RAM required: {modelInfo.ram} GB
                              </Text>
                           </>
                        )
                     }
                  </Flex>
               </Flex>
            </Flex>

            <Button
               className={s.btnInstall}
               onClick={handleInstall}
               isLoading={isInstalling}
               isDisabled={isInstalling || isInstalled}
               loadingText={totalStep > 0 ? `${formatCurrency(currentStep / (totalStep + 3) * 100, 0, 0)}%` : 'Installing...'}
               cursor={isInstalled ? 'not-allowed' : 'pointer'}
            >
               {isInstalled ? 'Downloaded' : 'Get'}
            </Button>
         </Flex>
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
      </Flex>
   )
}

export default AgentDetail;
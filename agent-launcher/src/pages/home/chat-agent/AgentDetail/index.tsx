import s from "./styles.module.scss";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { formatCurrency, labelAmountOrNumberAdds } from "@utils/format.ts";
import cs from "classnames";
import CustomMarkdown from "@components/CustomMarkdown";
import React, { useContext, useMemo } from "react";
import { AgentType } from "@pages/home/list-agent";
import { AgentContext } from "@pages/home/provider";
import useParseLogs from "@hooks/useParseLogs.ts";

const AgentDetail = () => {
   const {
      selectedAgent,
      installAgent,
      isInstalling,
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

   console.log('parsedLog', parsedLog);

   const avatarUrl
      = selectedAgent?.thumbnail
      || selectedAgent?.token_image_url
      || selectedAgent?.twitter_info?.twitter_avatar;

   const description = useMemo(() => {
      if (!selectedAgent) return '';
      if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.Model].includes(selectedAgent?.agent_type)) {
         return selectedAgent?.personality;
      } else {
         return selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;
      }
   }, [selectedAgent]);

   const handleInstall = () => {
      installAgent(selectedAgent);
   };

   return (
      <Flex
         className={s.container}
         direction={"column"}
         // alignItems={"center"}
         justifyContent={"center"}
         w={"100%"}
         gap={"32px"}
      >
         <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
            <Flex gap={"16px"} alignItems={"center"}>
               <Image w="80px" h="80px" src={avatarUrl} borderRadius={"50%"} />
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
                  </Flex>
               </Flex>
            </Flex>

            <Button
               className={s.btnInstall}
               onClick={handleInstall}
               isLoading={isInstalling}
               isDisabled={isInstalling}
               loadingText={totalStep > 0 ? `${formatCurrency(currentStep / (totalStep + 3) * 100, 0, 0)}%` : '0%'}
            >
               Get
            </Button>
         </Flex>
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
   )
}

export default AgentDetail;
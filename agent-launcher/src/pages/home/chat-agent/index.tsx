import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import ChatBox from "@pages/home/chat-agent/ChatAgent/components/ChatBox";
import { ChatAgentProvider } from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import s from "./styles.module.scss";
import React, { useContext, useMemo } from "react";
import { AgentContext } from "@pages/home/provider";
import BackupPrivateKey from "@pages/home/chat-agent/BackupPrivateKey";
import useParseLogs from "@hooks/useParseLogs.ts";
import { formatCurrency, labelAmountOrNumberAdds } from "@utils/format.ts";
import { AgentType } from "@pages/home/list-agent";
import cs from "classnames";
import CustomMarkdown from "@components/CustomMarkdown";

function ChatAgent() {
  const {
    selectedAgent,
    installAgent,
    isInstalling,
    agentWallet,
    createAgentWallet,
    isInstalled,
    isCanChat,
    isBackupedPrvKey
  } = useContext(AgentContext);

  const {
    parsedLog,
  } = useParseLogs({
    functionNames: ["MODEL_INSTALL"],
    keys: ["step", "hash"]
  });

  const {currentStep, totalStep} = useMemo(() => {
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

  const avatarUrl =
    selectedAgent?.thumbnail ||
    selectedAgent?.token_image_url ||
    selectedAgent?.twitter_info?.twitter_avatar;

  const description = useMemo(() => {
    if ([AgentType.UtilityJS, AgentType.UtilityPython, AgentType.Infra, AgentType.Model].includes(selectedAgent?.agent_type)) {
      return selectedAgent?.personality;
    } else {
      return selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;
    }
  }, [selectedAgent]);

  const showBackupPrvKey = selectedAgent?.required_wallet && !!agentWallet && !isBackupedPrvKey;

  const handleInstall = () => {
    installAgent(selectedAgent);
  };

  const handleCreateWallet = () => {
    createAgentWallet();
  }

  return (
    <Box className={s.container}>
      {/* <AgentInfo /> */}
      {isCanChat ? (
        <ChatAgentProvider>
          <ChatBox />
        </ChatAgentProvider>
      ) : (
        <>
          {
            showBackupPrvKey ? (
              <BackupPrivateKey />
            ) : (
               <>
                 {
                    isInstalled && selectedAgent?.required_wallet && !agentWallet ? (
                       <Flex
                          className={s.installContainer}
                          direction={"column"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          w={"100%"}
                          gap={"12px"}
                       >
                         <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M14.5 16.499C15.0304 16.499 15.5391 16.7097 15.9142 17.0848C16.2893 17.4599 16.5 17.9686 16.5 18.499C16.5 19.5599 16.9214 20.5773 17.6716 21.3274C18.4217 22.0776 19.4391 22.499 20.5 22.499C21.5609 22.499 22.5783 22.0776 23.3284 21.3274C24.0786 20.5773 24.5 19.5599 24.5 18.499C24.5 17.9686 24.7107 17.4599 25.0858 17.0848C25.4609 16.7097 25.9696 16.499 26.5 16.499H34C34.5909 16.499 35.1761 16.6154 35.7221 16.8416C36.268 17.0677 36.7641 17.3992 37.182 17.817C37.5998 18.2349 37.9313 18.731 38.1575 19.2769C38.3836 19.8229 38.5 20.4081 38.5 20.999V31.999C38.5 32.59 38.3836 33.1751 38.1575 33.7211C37.9313 34.2671 37.5998 34.7631 37.182 35.181C36.7641 35.5989 36.268 35.9303 35.7221 36.1565C35.1761 36.3826 34.5909 36.499 34 36.499H7C5.80653 36.499 4.66193 36.0249 3.81802 35.181C2.97411 34.3371 2.5 33.1925 2.5 31.999V20.999C2.5 19.8055 2.97411 18.661 3.81802 17.817C4.66193 16.9731 5.80653 16.499 7 16.499H14.5Z" fill="white"/>
                           <path opacity="0.7" d="M2.5 15C3.79686 14.0237 5.37675 13.4971 7 13.5H34C35.688 13.5 37.246 14.058 38.5 15C38.5 14.4091 38.3836 13.8239 38.1575 13.2779C37.9313 12.732 37.5998 12.2359 37.182 11.818C36.7641 11.4002 36.268 11.0687 35.7221 10.8425C35.1761 10.6164 34.5909 10.5 34 10.5H7C5.80653 10.5 4.66193 10.9741 3.81802 11.818C2.97411 12.6619 2.5 13.8065 2.5 15Z" fill="white"/>
                           <path opacity="0.3" d="M2.5 9.00098C3.79686 8.02471 5.37675 7.49807 7 7.50098H34C35.688 7.50098 37.246 8.05898 38.5 9.00098C38.5 8.41003 38.3836 7.82487 38.1575 7.2789C37.9313 6.73294 37.5998 6.23686 37.182 5.819C36.7641 5.40113 36.268 5.06966 35.7221 4.84352C35.1761 4.61737 34.5909 4.50098 34 4.50098H7C5.80653 4.50098 4.66193 4.97508 3.81802 5.819C2.97411 6.66291 2.5 7.8075 2.5 9.00098Z" fill="white"/>
                         </svg>
                         <Text fontSize={"24px"} fontWeight={500} color={"#FFF"}>Create {selectedAgent?.agent_name} wallet</Text>
                         <Text className={s.walletText}>
                           A separate wallet is needed to use this agent. You'll have full control by exporting the private key to MetaMask, ensuring your assets remain secure and fully under your management.
                         </Text>
                         <Button
                            className={s.btnCreateWallet}
                            onClick={handleCreateWallet}
                         >
                           Create
                         </Button>
                       </Flex>
                    ) : (
                       <Flex
                          className={s.installContainer}
                          direction={"column"}
                          // alignItems={"center"}
                          // justifyContent={"center"}
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
                              loadingText={totalStep > 0 ? `${formatCurrency(currentStep / totalStep * 100, 0, 0)}%` : '0%'}
                           >
                             Install
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
               </>
            )
          }
        </>
      )}
    </Box>
  );
}

export default ChatAgent;

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
                {/*<Text className={s.nameText}>{selectedAgent?.agent_name}</Text>*/}
                {
                  isInstalled && selectedAgent?.required_wallet && !agentWallet && (
                    <>
                      <Text className={s.descriptionText}>
                        A separate wallet is needed to use this agent. You'll have full control by exporting the private key to MetaMask, ensuring your assets remain secure and fully under your management.
                      </Text>
                      <Button
                        className={s.btnInstall}
                        onClick={handleCreateWallet}
                      >
                        Create wallet
                      </Button>
                    </>
                  )
                }
              </Flex>
            )
          }
        </>
      )}
    </Box>
  );
}

export default ChatAgent;

import {Box, Button, Flex, Image, Text} from "@chakra-ui/react";
import ChatBox from "@pages/home/chat-agent/ChatAgent/components/ChatBox";
import {ChatAgentProvider} from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import s from "./styles.module.scss";
import React, {useContext, useMemo} from "react";
import {AgentContext} from "@pages/home/provider";
import {AgentType} from "@pages/home/list-agent";
import AgentWalletInfo from "@pages/home/chat-agent/AgentWalletInfo";

function ChatAgent() {
  const {
    selectedAgent,
    startAgent,
    stopAgent,
    isStarting,
    isStopping,
    agentWallet,
    isRunning,
    createAgentWallet
  } = useContext(AgentContext);

  const avatarUrl =
    selectedAgent?.thumbnail ||
    selectedAgent?.token_image_url ||
    selectedAgent?.twitter_info?.twitter_avatar;

  const description =
    selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;

  const isUtilityAgent = useMemo(() => {
    return selectedAgent?.agent_type === AgentType.Utility;
  }, [selectedAgent]);

  const handleInstall = () => {
    if (isRunning) {
      stopAgent(selectedAgent);
    } else {
      startAgent(selectedAgent);
    }
  };

  const handleCreateWallet = () => {
    createAgentWallet();
  }

  return (
    <Box className={s.container}>
      {/* <AgentInfo /> */}
      {!isUtilityAgent || (isUtilityAgent && isRunning && (!selectedAgent?.required_wallet || (selectedAgent?.required_wallet && agentWallet))) ? (
        <ChatAgentProvider>
          <ChatBox />
        </ChatAgentProvider>
      ) : (
        <Flex
          className={s.installContainer}
          direction={"column"}
          w={"100%"}
          alignItems={"center"}
          gap={"20px"}
        >
          <Flex
            direction={"column"}
            alignItems={"center"}
            position={"relative"}
          >
            <Image src="/images/bg-agent-chat.png" w={"80%"} />
            <Flex
              position="absolute"
              height="70px"
              w="70px"
              top={"50%"}
              left={"50%"}
              transform={"translate(-50%, -50%)"}
            >
              <Flex className={s?.["glow-on-hover"]}>
                <Image w="70px" h="70px" src={avatarUrl} borderRadius={"50%"} />
              </Flex>
            </Flex>
            <Text className={s.nameText}>{selectedAgent?.agent_name}</Text>
          </Flex>
          {
            isRunning && selectedAgent?.required_wallet && !agentWallet ? (
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
            ) : (
              <>
                {description && (
                  <Text className={s.descriptionText}>{description}</Text>
                )}
                <Button
                  className={s.btnInstall}
                  onClick={handleInstall}
                  isLoading={isStarting || isStopping}
                  isDisabled={isStarting || isStopping}
                  loadingText={isStarting ? "Starting..." : "Stopping..."}
                >
                  {isRunning ? "Stop" : "Start"}
                </Button>
              </>
            )
          }
        </Flex>
      )}
    </Box>
  );
}

export default ChatAgent;

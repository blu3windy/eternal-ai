import {Box, Button, Flex, Image, Text} from "@chakra-ui/react";
import ChatBox from "@pages/home/chat-agent/ChatAgent/components/ChatBox";
import {ChatAgentProvider} from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import s from "./styles.module.scss";
import React, {useContext} from "react";
import {AgentContext} from "@pages/home/provider";
import {Wallet} from "ethers";
import {JsonRpcProvider} from "@ethersproject/providers";

function ChatAgent() {
  const {
    selectedAgent,
    startAgent,
    stopAgent,
    isStarting,
    isStopping,
    agentWallet,
    isRunning,
    setAgentWallet,
  } = useContext(AgentContext);

  const avatarUrl =
    selectedAgent?.thumbnail ||
    selectedAgent?.token_image_url ||
    selectedAgent?.twitter_info?.twitter_avatar;

  const description =
    selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;

  const handleInstall = () => {
    if (isRunning) {
      stopAgent(selectedAgent);
    } else {
      startAgent(selectedAgent);
    }
  };

  const handleCreateWallet = () => {
    const wallet = new Wallet("0x5776efc21d0e98afd566d3cb46e2eb1ccd7406f4feaee9c28b0fcffc851cc8b3", new JsonRpcProvider("https://eth.llamarpc.com"));
    setAgentWallet(wallet);
  }

  return (
    <Box className={s.container}>
      {/* <AgentInfo /> */}
      {isRunning && (!selectedAgent?.required_wallet || (selectedAgent?.required_wallet && agentWallet)) ? (
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
          {description && (
            <Text className={s.descriptionText}>{description}</Text>
          )}
          {
            isRunning && selectedAgent?.required_wallet && !agentWallet ? (
              <Button
                className={s.btnInstall}
                onClick={handleCreateWallet}
              >
                Create wallet
              </Button>
            ) : (
              <Button
                className={s.btnInstall}
                onClick={handleInstall}
                isLoading={isStarting || isStopping}
                isDisabled={isStarting || isStopping}
                loadingText={isStarting ? "Starting..." : "Stopping..."}
              >
                {isRunning ? "Stop" : "Start"}
              </Button>
            )
          }
        </Flex>
      )}
    </Box>
  );
}

export default ChatAgent;

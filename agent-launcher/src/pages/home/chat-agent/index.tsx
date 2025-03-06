import {Box, Button, Flex, Image, Text} from "@chakra-ui/react";
import ChatBox from "@pages/home/chat-agent/ChatAgent/components/ChatBox";
import {ChatAgentProvider} from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import s from "./styles.module.scss";
import React, {useContext} from "react";
import {AgentContext} from "@pages/home/provider";
import BackupPrivateKey from "@pages/home/chat-agent/BackupPrivateKey";

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

  const avatarUrl =
    selectedAgent?.thumbnail ||
    selectedAgent?.token_image_url ||
    selectedAgent?.twitter_info?.twitter_avatar;

  const description =
    selectedAgent?.token_desc || selectedAgent?.twitter_info?.description;

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
                alignItems={"center"}
                justifyContent={"center"}
                w={"100%"}
                gap={"32px"}
              >
                <Image w="280px" h="280px" src={avatarUrl} borderRadius={"50%"} />
                <Text className={s.nameText}>{selectedAgent?.agent_name}</Text>
                {
                  isInstalled && selectedAgent?.required_wallet && !agentWallet ? (
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
                        isLoading={isInstalling}
                        isDisabled={isInstalling}
                        loadingText={"Installing..."}
                      >
                        Install
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

import {motion} from "framer-motion";
import React, {useContext, useMemo} from "react";
import s from "./styles.module.scss";
import {useChatAgentProvider} from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import ChatList from "@pages/home/chat-agent/ChatAgent/components/ChatList";
import InputText from "@pages/home/chat-agent/ChatAgent/components/InputText";
import {AgentContext} from "@pages/home/provider";

const ChatBox = () => {
  const { loading, onRetryErrorMessage } = useChatAgentProvider();

  const {
    isRunning,
    requireInstall,
  } = useContext(AgentContext);

  const containerMaxHeight = useMemo(() => {
    const element = document.getElementById('detailContainer');
    if (element) {
      const weight = requireInstall ? isRunning ? 0.91 : 0.96 : 0.96;
      const base = Math.floor(element.clientHeight * weight);
      return `calc(${base}px - env(safe-area-inset-bottom) - env(safe-area-inset-top))`;
    }
    return `calc(70vh - env(safe-area-inset-bottom) - env(safe-area-inset-top))`;
  }, [requireInstall, isRunning]);

  const innerMaxHeight = useMemo(() => {
    const element = document.getElementById('detailContainer');
    if (element) {
      const weight = requireInstall ? isRunning ? 0.91 : 0.96 : 0.96;
      const base = Math.floor(element.clientHeight * weight);
      return `calc(${base}px - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 60px - 32px)`;
    }
    return `calc(70vh - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 60px - 32px)`;
  }, [requireInstall, isRunning]);

  return (
    <motion.div
      className={s.container}
      style={{
        maxHeight: containerMaxHeight,
      }}
    >
      <div
        className={s.chatList}
        style={{
          maxHeight: innerMaxHeight,
          minHeight: innerMaxHeight,
        }}
      >
        <div
          className={s.chatList}
          style={{
            maxHeight: innerMaxHeight,
            minHeight: innerMaxHeight,
          }}
        >
          <ChatList
            onRetryErrorMessage={onRetryErrorMessage}
            isSending={loading}
          />
        </div>
        <InputText isSending={loading} />
      </div>
    </motion.div>
  );
};

export default ChatBox;

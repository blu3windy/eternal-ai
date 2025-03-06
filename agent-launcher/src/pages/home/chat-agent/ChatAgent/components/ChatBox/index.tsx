import { motion } from "framer-motion";
import React, {useContext, useEffect, useMemo} from "react";
import s from "./styles.module.scss";
import { useChatAgentProvider } from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import ChatList from "@pages/home/chat-agent/ChatAgent/components/ChatList";
import InputText from "@pages/home/chat-agent/ChatAgent/components/InputText";
import AgentWalletInfo from "@pages/home/chat-agent/AgentWalletInfo";
import {AgentContext} from "@pages/home/provider";

const ChatBox = () => {
  const { loading, onRetryErrorMessage } = useChatAgentProvider();
  const {
    agentWallet,
  } = useContext(AgentContext);

  const containerMaxHeight = useMemo(() => {
    if (window.innerHeight) {
      const base = Math.floor(window.innerHeight * 0.9);
      return `calc(${base}px - env(safe-area-inset-bottom) - env(safe-area-inset-top))`;
    }
    return `calc(70vh - env(safe-area-inset-bottom) - env(safe-area-inset-top))`;
  }, []);

  const innerMaxHeight = useMemo(() => {
    if (window.innerHeight) {
      const base = Math.floor(window.innerHeight * 0.9);
      return `calc(${base}px - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 60px - 32px)`;
    }
    return `calc(70vh - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 60px - 32px)`;
  }, []);

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

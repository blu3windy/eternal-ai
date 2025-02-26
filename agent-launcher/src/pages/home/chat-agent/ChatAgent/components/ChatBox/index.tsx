import {motion} from 'framer-motion';
import React, {useMemo} from 'react';
import styles from './styles.module.scss';
import {useChatAgentProvider} from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import ChatList from "@pages/home/chat-agent/ChatAgent/components/ChatList";
import InputText from "@pages/home/chat-agent/ChatAgent/components/InputText";

const ChatBox = () => {
  const { loading, onRetryErrorMessage } = useChatAgentProvider();

  const containerMaxHeight = useMemo(() => {
    if (window.innerHeight) {
      const base = Math.floor(window.innerHeight * 0.8);
      return `calc(${base}px - env(safe-area-inset-bottom) - env(safe-area-inset-top))`;
    }
    return `calc(70vh - env(safe-area-inset-bottom) - env(safe-area-inset-top))`;
  }, []);

  const innerMaxHeight = useMemo(() => {
    if (window.innerHeight) {
      const base = Math.floor(window.innerHeight * 0.8);
      return `calc(${base}px - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 60px)`;
    }
    return `calc(70vh - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 60px)`;
  }, []);

  return (
    <motion.div
      className={styles.container}
      style={{
        maxHeight: containerMaxHeight,
      }}
    >
      <div
        className={styles.chatList}
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
    </motion.div>
  );
};

export default ChatBox;

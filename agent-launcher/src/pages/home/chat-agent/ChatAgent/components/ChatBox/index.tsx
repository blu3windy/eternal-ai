import {motion} from 'framer-motion';
import React, {useEffect, useMemo} from 'react';
import s from './styles.module.scss';
import {useChatAgentProvider} from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import ChatList from "@pages/home/chat-agent/ChatAgent/components/ChatList";
import InputText from "@pages/home/chat-agent/ChatAgent/components/InputText";
// import { BASE_SEPOLIA_CHAIN_ID } from '@constants/chains';
// import { checkFileExistsOnLocal, readFileOnLocal, readFileOnChain, writeFileToLocal } from '@contract/file';

const ChatBox = () => {
  const { loading, onRetryErrorMessage } = useChatAgentProvider();

  const containerMaxHeight = useMemo(() => {
    if (window.innerHeight) {
      const base = Math.floor(window.innerHeight * 0.93);
      return `calc(${base}px - env(safe-area-inset-bottom) - env(safe-area-inset-top))`;
    }
    return `calc(70vh - env(safe-area-inset-bottom) - env(safe-area-inset-top))`;
  }, []);

  const innerMaxHeight = useMemo(() => {
    if (window.innerHeight) {
      const base = Math.floor(window.innerHeight * 0.93);
      return `calc(${base}px - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 60px)`;
    }
    return `calc(70vh - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 60px)`;
  }, []);

  // useEffect(() => {
  //   readFile('abi-ts.js', BASE_SEPOLIA_CHAIN_ID)
  // }, []);

  // const readFile = async (filename: string, chainId: number) => {
  //   try {
  //     const isExisted = await checkFileExistsOnLocal(filename);
  //     if (isExisted) {
  //       const data = await readFileOnLocal(filename);
  //       console.log('====dataFromLocal', data);
  //     } else {
  //       const data = await readFileOnChain(chainId, filename);
  //       const filePath = await writeFileToLocal(filename, data);
  //       console.log('====dataFromOnChain', data);
  //       alert(filePath);
  //     }
  //   } catch (error: any) {
  //     alert(error?.message ||'Something went wrong');
  //   }
  // }

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

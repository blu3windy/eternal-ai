import create from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IChatMessage } from '@/modules/AgentStore/components/PreviewAgent/types';
import { IPumpToken } from '@services/api/pump/interface';

interface IChatInfo {
  name: string;
  personality: string;
  hideModal?: boolean;
  pumpToken?: IPumpToken;
}

interface IProps {
  chatInfo?: IChatInfo;
  setChatInfo: (_?: IChatInfo) => void;

  messages: IChatMessage[];
  addMessage: (_: IChatMessage) => void;
  resetMessages: () => void;
  setMessages: (_: IChatMessage[]) => void;

  animatedId: string[];
  addAnimatedId: (_: string) => void;
}

const useChatAgent = create<IProps, any>(
  persist(
    (set, get) => ({
      chatInfo: undefined,
      setChatInfo: (chatInfo) => {
        // if (!chatInfo) {
        //   set({ messages: [] });
        // }
        set({ messages: [] });
        set({ chatInfo });
      },

      messages: [],
      setMessages: (messages) => {
        set({ messages });
      },
      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      },

      resetMessages: () => {
        set({ messages: [] });
      },
      animatedId: [],
      addAnimatedId: (id) => {
        set((state) => ({
          animatedId: [...state.animatedId, id],
        }));
      },
    }),
    {
      name: 'chat-agent', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        // messages: state.messages,
        animatedId: state.animatedId,
      }),
    },
  ),
);

export default useChatAgent;

import { AgentType } from '@pages/home/list-agent/constants';
import AgentAPI from '@services/api/agent';
import { IChatMessage } from '@services/api/agent/types';
import { useContext, useEffect, useMemo } from 'react';
import { useChatAgentProvider } from './provider';
import { AgentContext } from '@pages/home/provider';
import { IAgentToken } from '@services/api/agents-token/interface';

function HandleProcessingMessage({
   data,
   updateMessage,
   agent,
}: {
   data: IChatMessage;
   updateMessage: (id: string, data: Partial<IChatMessage>) => void;
   agent: IAgentToken | undefined;
}) {
   useEffect(() => {
      const checkProcessingTask = async () => {
         if (data.id) {
            if ([AgentType.Infra, AgentType.CustomPrompt].includes(agent?.agent_type as any)) {
               try {
                  const res = await AgentAPI.chatAgentUtility({
                     id: data.id,
                     agent: agent,
                  } as any);

                  if (res?.status !== 102) {
                     updateMessage(data.id, {
                        status: 'received',
                        msg: res.data || res,
                        updatedAt: new Date().toISOString(),
                     });
                  } else {
                     setTimeout(() => {
                        checkProcessingTask();
                     }, 30000);
                  }
               } catch (e) {
                  const errorMessage = (e as any)?.response?.data?.error || 'Something went wrong!';
                  updateMessage(data.id, {
                     status: 'failed',
                     msg: errorMessage,
                     updatedAt: new Date().toISOString(),
                  });
               }
            }
         }
      };
      setTimeout(() => {
         checkProcessingTask();
      }, 10000);
   }, []);

   return <></>;
}

function HandleMessageProcessing({
   updateMessage,
}: {
   updateMessage: (id: string, data: Partial<IChatMessage>) => void;
}) {
   const { selectedAgent } = useContext(AgentContext);
   const { messages } = useChatAgentProvider();

   const processingMessages = useMemo(() => {
      return messages.filter((item) => item.status === 'waiting' || item.status === 'receiving');
   }, [messages]);

   const renderTasks = () => {
      if (selectedAgent) {
         return processingMessages.map((message) => (
            <HandleProcessingMessage
               key={`task_${message.id}`}
               data={message}
               updateMessage={updateMessage}
               agent={selectedAgent}
            />
         ));
      }
      return <></>;
   };

   return <>{renderTasks()}</>;
}

export default HandleMessageProcessing;
